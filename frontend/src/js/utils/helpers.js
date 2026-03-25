window.bgAudio = null;
window.bgMusicEnabled = localStorage.getItem('rajshree_bg-magic-check') !== 'false';
window.sfxEnabled = localStorage.getItem('rajshree_sfx-check') !== 'false';
window.confettiEnabled = localStorage.getItem('rajshree_confetti-check') !== 'false';
window.bounceEnabled = localStorage.getItem('rajshree_bounce-check') !== 'false';
window.starsEnabled = localStorage.getItem('rajshree_stars-check') !== 'false';

function playBackgroundMusic(track) {
    if (window.bgAudio) {
        window.bgAudio.pause();
        window.bgAudio = null;
    }
    if (!track || track === 'none') return;

    const musicMap = {
        playful: 'system/music/playful.mp3',
        calm: 'system/music/calm.mp3',
        lullaby: 'system/music/lullaby.mp3'
    };
    const file = musicMap[track];
    if (file) {
        window.bgAudio = new Audio(window.AUDIO_BASE_PATH + file);
        window.bgAudio.loop = true;
        window.bgAudio.volume = window.globalVolume * 0.3; // BG music is quieter
        window.bgAudio.play().catch(e => console.warn('Autoplay blocked:', e));
    }
}

function playSound(file, card) {
    if (!window.sfxEnabled && !file.includes('varnamala') && !file.includes('num_')) return; 
    if (window.ChildSafetyLock) window.ChildSafetyLock.lock();
    if (card && card.classList) {
        card.classList.add('playing');
        if (window.bounceEnabled) card.classList.add('selected');
        setTimeout(() => card.classList.remove('selected'), 400);
    }
    stopCurrentAudio();
    document.body.classList.add('audio-active');
    
    const finalAudioPath = file.startsWith('assets') ? file : window.AUDIO_BASE_PATH + file;
    window.currentAudio = new Audio(finalAudioPath);
    const targetVolume = window.globalVolume;
    window.currentAudio.volume = 0; // Start at 0 for fading
    
    const bar = card ? card.querySelector('.progress-bar') : null;
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
    } else {
        // Fallback for non-card audio (like intros)
        window.currentAudio.addEventListener('ended', () => {
            document.body.classList.remove('audio-active');
        });
    }
    
    window.currentAudio.play();
    
    // Smooth Volume Fade-in
    let currentStep = 0;
    const fadeSteps = 15;
    const volIncrement = targetVolume / fadeSteps;
    let fadeInterval = setInterval(() => {
        if (!window.currentAudio || window.currentAudio.paused) { clearInterval(fadeInterval); return; }
        currentStep++;
        window.currentAudio.volume = Math.min(targetVolume, currentStep * volIncrement);
        if (currentStep >= fadeSteps) clearInterval(fadeInterval);
    }, 20);
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
