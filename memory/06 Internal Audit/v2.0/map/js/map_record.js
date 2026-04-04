/**
 * map_record.js - Video Recording Logic for Globe Animations
 * Captures the Three.js canvas and saves as MP4/WebM.
 */

(function() {
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;
    let proxyCanvas = null, proxyCtx = null, animationId = null;
    
    // MP4 Muxing State
    let muxer = null, encoder = null, encodedFrameCount = 0;
    const FRAME_RATE = 30;

    window.initMapRecording = function() {
        const recordBtn = document.getElementById('btn-record-video');
        if (!recordBtn) return;
        recordBtn.addEventListener('click', toggleRecording);
    };

    function toggleRecording() {
        const recordBtn = document.getElementById('btn-record-video');
        if (!isRecording) {
            isRecording = true;
            recordBtn.classList.add('recording');
            recordBtn.innerHTML = '<i data-lucide="square"></i>';
            if (window.lucide) lucide.createIcons({ scope: recordBtn });
            if (window.showNotification) window.showNotification('RECORDING STARTED', 'Capturing screen...', 'info');
            
            try {
                startRecording();
            } catch (err) {
                alert("Start Error: " + err.message);
                forceStopUI();
            }
        } else {
            isRecording = false;
            recordBtn.classList.remove('recording');
            recordBtn.innerHTML = '<i data-lucide="video"></i>';
            if (window.lucide) lucide.createIcons({ scope: recordBtn });
            
            try {
                stopRecording();
            } catch (err) {
                alert("Stop Error: " + err.message);
            }
        }
    }

    function forceStopUI() {
        isRecording = false;
        const recordBtn = document.getElementById('btn-record-video');
        if (recordBtn) {
            recordBtn.classList.remove('recording');
            recordBtn.innerHTML = '<i data-lucide="video"></i>';
            if (window.lucide) lucide.createIcons({ scope: recordBtn });
        }
    }

    async function startRecording() {
        const baseCanvas = document.querySelector('#threejs-container canvas');
        if (!baseCanvas) {
            throw new Error('Canvas not found');
        }

        recordedChunks = [];
        encodedFrameCount = 0;
        mediaRecorder = null;
        encoder = null;
        muxer = null;

        proxyCanvas = document.createElement('canvas');
        const w = (baseCanvas.width || 1280);
        const h = (baseCanvas.height || 720);
        proxyCanvas.width = Math.floor(w / 2) * 2;
        proxyCanvas.height = Math.floor(h / 2) * 2;
        
        proxyCtx = proxyCanvas.getContext('2d', { willReadFrequently: true });
        proxyCtx.fillStyle = '#000000';
        proxyCtx.fillRect(0, 0, proxyCanvas.width, proxyCanvas.height);
        proxyCtx.drawImage(baseCanvas, 0, 0, baseCanvas.width, baseCanvas.height, 0, 0, proxyCanvas.width, proxyCanvas.height);

        // Check if our specific Mp4Muxer CDN script loaded correctly
        const hasMp4Muxer = typeof Mp4Muxer !== 'undefined';
        const hasEncoder = typeof VideoEncoder !== 'undefined';
        
        if (hasMp4Muxer && hasEncoder) {
            try {
                console.log("Holographic Record: Using true MP4 WebCodecs via Mp4Muxer");
                setupMp4Recording(proxyCanvas, baseCanvas);
                return;
            } catch (err) {
                console.error("MP4 setup failed, falling back to WebM", err);
                encoder = null;
                muxer = null;
            }
        } else {
            console.warn("Holographic Record: WebCodecs/Mp4Muxer missing. Falling back to MediaRecorder");
        }
        
        // Fallback to WebM
        setupMediaRecorder(proxyCanvas, baseCanvas);
    }

    function setupMediaRecorder(canvas, source) {
        const drawFrame = () => {
            if (!isRecording && !mediaRecorder) return;
            const isWireframe = window._mapGlobeDesign === 'wireframe';
            if (isWireframe) {
                proxyCtx.fillStyle = '#000000';
                proxyCtx.fillRect(0, 0, proxyCanvas.width, proxyCanvas.height);
            } else {
                proxyCtx.clearRect(0, 0, proxyCanvas.width, proxyCanvas.height);
            }
            proxyCtx.drawImage(source, 0, 0, source.width, source.height, 0, 0, proxyCanvas.width, proxyCanvas.height);
            animationId = requestAnimationFrame(drawFrame);
        };
        drawFrame();

        const stream = canvas.captureStream(FRAME_RATE);
        try {
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        } catch(e) {
            mediaRecorder = new MediaRecorder(stream); // Let browser decide
        }

        mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
        mediaRecorder.onstop = () => {
            if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            saveAsFile(blob, 'webm');
        };
        mediaRecorder.start();
    }

    function setupMp4Recording(canvas, source) {
        muxer = new window.Mp4Muxer.Muxer({
            target: new window.Mp4Muxer.ArrayBufferTarget(),
            video: { codec: 'avc', width: canvas.width, height: canvas.height },
            fastStart: 'in-memory'
        });

        encoder = new VideoEncoder({
            output: (chunk, meta) => {
                if (muxer) muxer.addVideoChunk(chunk, meta);
            },
            error: e => {
                console.error('VideoEncoder error:', e);
                forceStopUI();
            }
        });

        encoder.configure({
            codec: 'avc1.42E01E',
            width: canvas.width,
            height: canvas.height,
            bitrate: 4_000_000, 
            framerate: FRAME_RATE
        });

        const drawFrame = async () => {
            if (!isRecording || !encoder) return;
            const isWireframe = window._mapGlobeDesign === 'wireframe';
            if (isWireframe) {
                proxyCtx.fillStyle = '#000000';
                proxyCtx.fillRect(0, 0, proxyCanvas.width, proxyCanvas.height);
            } else {
                proxyCtx.clearRect(0, 0, proxyCanvas.width, proxyCanvas.height);
            }
            proxyCtx.drawImage(source, 0, 0, source.width, source.height, 0, 0, proxyCanvas.width, proxyCanvas.height);

            try {
                const timestamp = (encodedFrameCount * 1000000) / FRAME_RATE;
                const frame = new VideoFrame(canvas, { timestamp });
                encoder.encode(frame, { keyFrame: encodedFrameCount % 60 === 0 });
                frame.close();
                encodedFrameCount++;
            } catch (err) {
                console.warn("Frame Error: ", err);
            }
            animationId = requestAnimationFrame(drawFrame);
        };
        drawFrame();
    }

    async function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder = null;
        } else if (encoder) {
            const finalEncoder = encoder;
            const finalMuxer = muxer;
            encoder = null;
            muxer = null;

            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            try {
                await finalEncoder.flush();
                finalEncoder.close();
                finalMuxer.finalize();
                const buffer = finalMuxer.target.buffer;
                if (buffer.byteLength > 0) {
                    saveAsFile(new Blob([buffer], { type: 'video/mp4' }), 'mp4');
                } else {
                    throw new Error("Target API produced an empty file buffer.");
                }
            } catch (err) {
                alert("MP4 Encoding Error: " + err.message);
                if (window.showNotification) window.showNotification("ERROR", "Failed to finalize MP4 file", "error");
            }
        }
    }

    function saveAsFile(blob, ext) {
        if (!blob || blob.size === 0) {
            alert("No video data was recorded. Please try again.");
            return;
        }
        
        try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `frontier-globe-recording-${timestamp}.${ext}`;
            a.click();
            
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                if (document.body.contains(a)) document.body.removeChild(a);
            }, 500);
            
            if (window.showNotification) window.showNotification('DOWNLOAD COMPLETE', 'Recording saved successfully', 'success');
        } catch (e) {
            alert("Download failed: " + e.message);
        }
    }
})();
