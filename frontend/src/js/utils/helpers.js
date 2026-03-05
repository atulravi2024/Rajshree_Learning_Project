/**
 * Utility Helpers
 * Small reusable functions for DOM, Math, and Audio.
 */

function playSound(file, card) {
    if (card && card.classList) {
        card.classList.add('playing');
        card.classList.add('selected');
        setTimeout(() => card.classList.remove('selected'), 400);
    }
    stopCurrentAudio();
    const finalAudioPath = file.startsWith('assets') ? file : window.AUDIO_BASE_PATH + file;
    window.currentAudio = new Audio(finalAudioPath);
    window.currentAudio.volume = window.globalVolume;
    const bar = card.querySelector('.progress-bar');
    if (bar) {
        window.currentAudio.addEventListener('timeupdate', () => {
            const percent = (window.currentAudio.currentTime / window.currentAudio.duration) * 100;
            bar.style.width = percent + '%';
        });
        window.currentAudio.addEventListener('ended', () => {
            card.classList.remove('playing');
            bar.style.width = '0%';
            if (window.isSlideshowActive) handleSlideshowTransition();
        });
    }
    window.currentAudio.play();
}

function handleSlideshowTransition() {
    window.slideshowCardIndex++;
    setTimeout(startSlideshowPlayback, 1000);
}

function flipCard(card, audioFile) {
    if (window.isSlideshowActive && !card.classList.contains('auto-flipping')) return;
    card.classList.toggle('is-flipped');
    if (audioFile && card.classList.contains('is-flipped')) playSound(audioFile, card);
}
