/**
 * Slideshow Playback Engine
 * Controls automatic card transitions and state locking.
 */

function toggleSlideshow() {
    const btn = document.getElementById('nav-slideshow');
    const iconSpan = btn.querySelector('.hi');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const mainNavIcons = document.querySelectorAll('.nav-menu .nav-link:not(#nav-slideshow):not(#nav-layout):not(#nav-volume)');
    const layoutBtn = document.getElementById('nav-layout');
    
    if (window.isSlideshowActive) { 
        window.isSlideshowActive = false; 
        btn.classList.remove('active'); 
        if (iconSpan) iconSpan.innerText = '🎬';
        if (prevBtn) prevBtn.classList.remove('disabled');
        if (nextBtn) nextBtn.classList.remove('disabled');
        mainNavIcons.forEach(icon => icon.classList.remove('disabled-nav'));
        if (layoutBtn) layoutBtn.classList.remove('disabled-nav');
        stopCurrentAudio();
    }
    else {
        if (window.currentLayout === 'all' || window.currentLayout === 'fit') { 
            alert('Please select 1x1 or 3-Card layout for slideshow!'); 
            return; 
        }
        window.isSlideshowActive = true; 
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
            stopCurrentAudio();
            window.currentAudio = new Audio('../assets/audio/system/effects/reward_excellent.mp3');
            window.currentAudio.volume = window.globalVolume;
            window.currentAudio.play();
            window.isSlideshowActive = false;
            alert('Category Complete! Great job!');
        }
    }
}
