/**
 * map_record.js - Video Recording Logic for Globe Animations
 * Captures the Three.js canvas and saves as MP4/WebM.
 */

(function() {
    let mediaRecorder;
    let recordedChunks = [];
    let isRecording = false;

    window.initMapRecording = function() {
        const recordBtn = document.getElementById('btn-record-video');
        if (!recordBtn) return;

        recordBtn.addEventListener('click', toggleRecording);
    };

    function toggleRecording() {
        const recordBtn = document.getElementById('btn-record-video');
        if (!isRecording) {
            startRecording();
            recordBtn.classList.add('recording');
            recordBtn.innerHTML = '<i data-lucide="square"></i>';
            if (window.lucide) lucide.createIcons({ scope: recordBtn });
            if (window.showNotification) window.showNotification('RECORDING STARTED', 'Capturing globe animation...', 'info');
        } else {
            stopRecording();
            recordBtn.classList.remove('recording');
            recordBtn.innerHTML = '<i data-lucide="video"></i>';
            if (window.lucide) lucide.createIcons({ scope: recordBtn });
            if (window.showNotification) window.showNotification('RECORDING STOPPED', 'Saving video file...', 'success');
        }
        isRecording = !isRecording;
    }

    function startRecording() {
        const canvas = document.querySelector('#threejs-container canvas');
        if (!canvas) {
            console.error('Canvas not found for recording');
            return;
        }

        recordedChunks = [];
        const stream = canvas.captureStream(30); // 30 FPS
        
        // Try mp4 first, fallback to webm
        let options = { mimeType: 'video/mp4; codecs=avc1.42E01E' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'video/webm; codecs=vp9' };
        }

        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            console.warn('MediaRecorder with options failed, trying default', e);
            mediaRecorder = new MediaRecorder(stream);
        }

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = saveRecording;
        mediaRecorder.start();
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    }

    function saveRecording() {
        const blob = new Blob(recordedChunks, {
            type: mediaRecorder.mimeType
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        
        // Use .mp4 as requested, even if content is webm (browsers handle this fine usually)
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `frontier-globe-recording-${timestamp}.mp4`;
        a.click();
        
        window.URL.revokeObjectURL(url);
        setTimeout(() => document.body.removeChild(a), 100);
    }
})();
