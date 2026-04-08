/**
 * Slideshow Playback Engine
 * Controls automatic card transitions and state locking.
 */

function toggleSlideshow() {
    if (window.isSlideshowActive) {
        // Stop slideshow manually
        window.isSlideshowActive = false;
        stopCurrentAudio();
        stopConfetti(); // Ensure confetti stops if manually stopped
        disableSlideshowUI();
        if (window.ChildSafetyLock) window.ChildSafetyLock.unlock();
    }
    else {
        // Start slideshow
        if (window.currentLayout === 'all' || window.currentLayout === 'fit') {
            alert('Please select 1x1 or 3-Card layout for slideshow!');
            return;
        }
        window.isSlideshowActive = true;
        const btn = document.getElementById('nav-slideshow');
        const iconSpan = btn.querySelector('.hi');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const mainNavIcons = document.querySelectorAll('.nav-menu .nav-link:not(#nav-slideshow):not(#nav-layout):not(#nav-volume)');
        const layoutBtn = document.getElementById('nav-layout');

        btn.classList.add('active');
        if (iconSpan) iconSpan.innerText = '⏹️';
        if (prevBtn) prevBtn.classList.add('disabled');
        if (nextBtn) nextBtn.classList.add('disabled');
        mainNavIcons.forEach(icon => icon.classList.add('disabled-nav'));
        if (layoutBtn) layoutBtn.classList.add('disabled-nav');
        
        window.slideshowCardIndex = 0;
        setTimeout(startSlideshowPlayback, 1000);
    }
}

/**
 * Resets the UI elements to their non-slideshow state.
 */
function disableSlideshowUI() {
    const btn = document.getElementById('nav-slideshow');
    const iconSpan = btn.querySelector('.hi');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const mainNavIcons = document.querySelectorAll('.nav-menu .nav-link:not(#nav-slideshow):not(#nav-layout):not(#nav-volume)');
    const layoutBtn = document.getElementById('nav-layout');

    btn.classList.remove('active');
    if (iconSpan) iconSpan.innerText = '🎬';
    if (prevBtn) prevBtn.classList.remove('disabled');
    if (nextBtn) nextBtn.classList.remove('disabled');
    mainNavIcons.forEach(icon => icon.classList.remove('disabled-nav'));
    if (layoutBtn) layoutBtn.classList.remove('disabled-nav');
}

function startSlideshowPlayback() {
    if (!window.isSlideshowActive) return;
    const master = document.getElementById('master-container');
    const cards = Array.from(master.children).filter(c => !c.classList.contains('hidden'));

    if (window.slideshowCardIndex < cards.length) {
        const card = cards[window.slideshowCardIndex];
        card.classList.remove('is-flipped');
        setTimeout(() => {
            if (!window.isSlideshowActive) return;
            card.classList.add('auto-flipping');
            card.click();
            card.classList.remove('auto-flipping');
        }, 1000);
    } else {
        let step = (window.currentLayout === '3') ? 3 : 1;
        if (window.currentIndex + step < window.activeCardsData.length) {
            next(true);
            window.slideshowCardIndex = 0;
            setTimeout(startSlideshowPlayback, 1000);
        } else {
            // Slideshow Complete
            stopCurrentAudio();
            
            // Wait 1 second before playing success sound
            setTimeout(() => {
                if (!window.isSlideshowActive) return; // In case user stopped during delay
                
                window.currentAudio = new Audio(window.AUDIO_BASE_PATH + 'system/effects/reward_excellent.mp3');
                window.currentAudio.volume = window.globalVolume;
                
                // Sync animation with audio
                window.currentAudio.onplay = () => triggerConfetti();
                window.currentAudio.onended = () => {
                    stopConfetti();
                    window.isSlideshowActive = false;
                    disableSlideshowUI();
                    if (window.ChildSafetyLock) window.ChildSafetyLock.unlock();
                };
                
                window.currentAudio.play().catch(e => {
                    console.error("Audio playback failed:", e);
                    // Fallback to disable if audio fails
                    window.isSlideshowActive = false;
                    disableSlideshowUI();
                });
            }, 1000);
        }
    }
}
