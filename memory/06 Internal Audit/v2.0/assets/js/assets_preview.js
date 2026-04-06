// Helper to generate preview HTML based on file type
function getPreviewElement(path, type, name, sizeBytes = 0) {
    const ext = name.split('.').pop().toLowerCase();
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.position = 'relative';

    // 0. Proactive Heavy Asset Loading
    if (sizeBytes > HEAVY_FILE_THRESHOLD && ['js', 'json', 'md', 'txt', 'css', 'html'].includes(ext)) {
        return createAutomatedLoadingState(path, type, ext, name, sizeBytes);
    }

    // 1. Image Preview
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) {
        const img = document.createElement('img');
        img.src = path;
        img.alt = name;
        img.onerror = () => {
            img.style.display = 'none';
            container.appendChild(getFallbackIcon(type, ext));
        };
        return img;
    }

    // 2. Audio Preview
    if (['mp3', 'wav', 'ogg'].includes(ext)) {
        const audio = document.createElement('audio');
        audio.src = path;
        audio.controls = true;
        return audio;
    }

    // 3. Text/Code Preview (Hybrid)
    if (['js', 'json', 'md', 'txt', 'css', 'html'].includes(ext)) {
        if (window.location.protocol === 'file:') {
            // Local fallback: use iframe
            const iframe = document.createElement('iframe');
            iframe.src = path;
            iframe.className = 'code-preview-iframe';
            return iframe;
        } else {
            // Server mode: use fetch for better styling
            const codeContainer = document.createElement('div');
            codeContainer.className = 'code-preview-container';
            codeContainer.innerHTML = '<div class="loading-text">DECRYPTING...</div>';
            
            fetch(path)
                .then(res => res.text())
                .then(text => {
                    codeContainer.innerHTML = '';
                    const isTruncated = text.length > MAX_PREVIEW_CHARS;
                    const displayContent = isTruncated ? text.substring(0, MAX_PREVIEW_CHARS) : text;

                    const pre = document.createElement('pre');
                    const code = document.createElement('code');
                    code.textContent = displayContent;
                    pre.appendChild(code);
                    codeContainer.appendChild(pre);

                })
                .catch(err => {
                    codeContainer.innerHTML = '<div class="error-text">ACCESS DENIED</div>';
                    console.error('Fetch error:', err);
                });
            return codeContainer;
        }
    }

    // Video Preview
    if (['mp4', 'webm', 'mov'].includes(ext)) {
        const video = document.createElement('video');
        video.src = path;
        video.controls = true;
        video.autoplay = false;
        return video;
    }

    // Fallback for document, data, log, etc.
    return getFallbackIcon(type, ext);
}

function getFallbackIcon(type, ext) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '15px';

    let iconName = 'file-text';
    if (type === 'voice') iconName = 'mic';
    if (type === 'audio') iconName = 'volume-2';
    if (type === 'visual') iconName = 'image';
    if (type === 'icon') iconName = 'box';
    if (type === 'doc') iconName = 'file-text';
    if (type === 'data') iconName = 'database';
    if (type === 'log') iconName = 'shield-check';
    if (type === 'animation') iconName = 'sparkles';
    if (type === 'video') iconName = 'play-circle';

    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', iconName);
    
    const label = document.createElement('span');
    label.className = 'preview-extension-label';
    label.textContent = ext.toUpperCase();

    wrapper.appendChild(icon);
    wrapper.appendChild(label);
    return wrapper;
}
