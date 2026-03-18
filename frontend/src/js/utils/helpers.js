/**
 * Utility Helpers
 * Small reusable functions for DOM, Math, and Audio.
 */

function playSound(file, card) {
    if (window.ChildSafetyLock) window.ChildSafetyLock.lock();
    if (card && card.classList) {
        card.classList.add('playing');
        card.classList.add('selected');
        setTimeout(() => card.classList.remove('selected'), 400);
    }
    stopCurrentAudio();
    document.body.classList.add('audio-active');
    
    const finalAudioPath = file.startsWith('assets') ? file : window.AUDIO_BASE_PATH + file;
    window.currentAudio = new Audio(finalAudioPath);
    const targetVolume = window.globalVolume;
    window.currentAudio.volume = 0; // Start at 0 for fading
    
    const bar = card.querySelector('.progress-bar');
    if (bar) {
        window.currentAudio.addEventListener('timeupdate', () => {
            const percent = (window.currentAudio.currentTime / window.currentAudio.duration) * 100;
            bar.style.width = percent + '%';
        });
        window.currentAudio.addEventListener('ended', () => {
            if (window.ChildSafetyLock) window.ChildSafetyLock.unlock();
            card.classList.remove('playing');
            document.body.classList.remove('audio-active');
            bar.style.width = '0%';
            if (window.isSlideshowActive) handleSlideshowTransition();
        });
        window.currentAudio.addEventListener('error', () => {
            if (window.ChildSafetyLock) window.ChildSafetyLock.unlock();
            card.classList.remove('playing');
            document.body.classList.remove('audio-active');
        });
    }
    
    window.currentAudio.play();
    
    // Smooth Volume Fade-in (0 to target over 300ms)
    const fadeSteps = 15;
    const fadeIntervalMs = 20; // 300ms total
    const volIncrement = targetVolume / fadeSteps;
    
    let currentStep = 0;
    let fadeInterval = setInterval(() => {
        if (!window.currentAudio || window.currentAudio.paused) {
            clearInterval(fadeInterval);
            return;
        }
        
        currentStep++;
        window.currentAudio.volume = Math.min(targetVolume, currentStep * volIncrement);
        
        if (currentStep >= fadeSteps) {
            clearInterval(fadeInterval);
        }
    }, fadeIntervalMs);
}

function handleSlideshowTransition() {
    window.slideshowCardIndex++;
    setTimeout(startSlideshowPlayback, 1000);
}

function flipCard(card, audioFile) {
    if (window.ChildSafetyLock && !window.ChildSafetyLock.canInteract()) return;
    if (window.isSlideshowActive && !card.classList.contains('auto-flipping')) return;
    card.classList.toggle('is-flipped');
    if (audioFile && card.classList.contains('is-flipped')) playSound(audioFile, card);
}
