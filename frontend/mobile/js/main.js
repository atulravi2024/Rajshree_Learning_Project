/**
 * Rajshree Learning - Mobile Logic (Fully Working Production Ready)
 * ==============================================================
 */

// Basic State
const state = {
    currentIndex: parseInt(localStorage.getItem('mobile_currentIndex')) || 0,
    currentCategoryName: localStorage.getItem('mobile_currentCategory') || 'swar',
    data: [],
    isAutoplay: localStorage.getItem('mobile_autoplay') === 'true',
    isSFX: localStorage.getItem('mobile_sfx') !== 'false',
    isBGMusic: localStorage.getItem('mobile_bg_music') !== 'false',
    autoplayDelay: parseInt(localStorage.getItem('mobile_autoplay_delay')) || 3,
    playbackSpeed: parseFloat(localStorage.getItem('mobile_playback_speed')) || 1.0,
    vMaster: (parseFloat(localStorage.getItem('mobile_vol_master')) || 80) / 100,
    vMusic: (parseFloat(localStorage.getItem('mobile_vol_music')) || 5) / 100,
    vSFX: (parseFloat(localStorage.getItem('mobile_vol_sfx')) || 50) / 100,
    vContent: (parseFloat(localStorage.getItem('mobile_vol_content')) || 100) / 100,
    autoplayTimeout: null,
    isPlayingAutoplay: false,
    viewMode: localStorage.getItem('mobile_view_mode') || 'flashcard',
    flashcardNavDir: localStorage.getItem('mobile_flashcard_nav_dir') || 'horizontal',
    gridNavDir: localStorage.getItem('mobile_grid_nav_dir') || 'horizontal',
    lastInteraction: Date.now()
};

// Initialize app when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("📱 Rajshree Learning Mobile Initialized!");
    loadData();

    // Initialize UI language
    const uiLang = localStorage.getItem('mobile_ui_language') || 'hi';
    if (window.RAJSHREE_I18N) window.RAJSHREE_I18N.applyUI(uiLang);
    
    applyNavSettings();
    applyLayoutSettings();
    setupAutoHideNav();

    const isStarted = localStorage.getItem('mobile_session_active') === 'true';
    if (isStarted) {
        startApp(true); // Silent start (restore)
    } else {
        const nav = document.querySelector('.mobile-nav');
        if (nav) nav.classList.add('hidden');
    }
});

// App Start logic
const startApp = (silent = false) => {
    stopCurrentAudio();
    localStorage.setItem('mobile_session_active', 'true');
    const welcome = document.getElementById('welcome-screen');
    const master = document.getElementById('master-mobile');
    const nav = document.querySelector('.mobile-nav');

    if (welcome) welcome.classList.add('hidden');
    if (master) master.classList.remove('hidden');
    if (nav) nav.classList.remove('hidden');

    applyNavSettings();
    applyLayoutSettings();

    state.isPlayingAutoplay = state.isAutoplay;
    updatePlaybackUI();
    renderContent();
    setupSwipeGestures();
    
    // Play welcome sound and track it (only if not a silent restore)
    if (!silent) {
        const profile = localStorage.getItem('rajshree_active_profile') || 'rajshree';
        const welcomePath = `system/welcome/welcome_${profile}.mp3`;
        
        // Multi-level fallback: Profile -> Generic -> Default
        playSound(welcomePath).catch(() => {
            console.warn(`Profile audio missing: ${welcomePath}, trying generic.`);
            playSound('system/welcome/welcome_generic.mp3').catch(() => {
                console.warn(`Generic audio missing, falling back to default.`);
                playSound('system/welcome_short.mp3');
            });
        });
    }
    updateBGM();
};

// Home Navigation logic
const goHome = () => {
    playInteractionSFX();
    localStorage.removeItem('mobile_session_active');
    localStorage.removeItem('mobile_currentIndex');
    localStorage.removeItem('mobile_currentCategory');

    const welcome = document.getElementById('welcome-screen');
    const master = document.getElementById('master-mobile');
    const nav = document.querySelector('.mobile-nav');

    if (welcome) welcome.classList.remove('hidden');
    if (master) master.classList.add('hidden');
    if (nav) nav.classList.add('hidden');
    
    // Reset state if needed
    state.currentIndex = 0;
};

// Load initial data (using global window data)
const loadData = () => {
    const savedCat = state.currentCategoryName;
    if (window.RAJSHREE_DATA && Object.keys(window.RAJSHREE_DATA).length > 0) {
        if (window.RAJSHREE_DATA[savedCat]) {
            state.data = window.RAJSHREE_DATA[savedCat];
        } else {
            const firstKey = Object.keys(window.RAJSHREE_DATA)[0];
            state.data = window.RAJSHREE_DATA[firstKey];
            state.currentCategoryName = firstKey;
        }
    } else {
        // Fallback demo data if scripts haven't loaded
        state.data = [
            { letter: 'अ', word: 'अनार', emoji: '🍎', audio: 'varnamala/swar/v_a_anar.mp3' },
            { letter: 'आ', word: 'आम', emoji: '🥭', audio: 'varnamala/swar/v_aa_aam.mp3' }
        ];
    }
};

const getEffectiveNavDirection = () => {
    return state.viewMode === 'grid' ? state.gridNavDir : state.flashcardNavDir;
};

// Render Content wrapper (Flashcard or Grid)
const renderContent = (direction = 'next') => {
    if (state.viewMode === 'grid') {
        renderGridView();
    } else {
        renderCard(direction);
    }
};

// Render the current card
const renderCard = (direction = 'next') => {
    if (state.autoplayTimeout) {
        clearTimeout(state.autoplayTimeout);
        state.autoplayTimeout = null;
    }

    const container = document.getElementById('master-mobile');
    if (!container || !state.data || state.data.length === 0) {
        if(container) container.innerHTML = '<div class="loading-state">डेटा नहीं मिला! (Data not found)</div>';
        return;
    }

    const item = state.data[state.currentIndex];
    
    // Slide animation class (applied to container)
    let animClass = '';
    const dir = getEffectiveNavDirection();
    if (dir === 'vertical') {
        animClass = direction === 'next' ? 'slide-in-bottom' : 'slide-in-top';
    } else {
        animClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
    }

    // Build Back Content
    let backContent = '';
    let backVars = '';
    let backClass = '';
    if (item.image) backContent = `<img class="flash-image" src="${item.image}" alt="${item.word || item.name_hi || ''}">`;
    else if (item.content) backContent = `<div class="display-content-medium">${item.content}</div>`;
    else if (item.color) {
        backContent = '';
        backVars = `--dynamic-bg:${item.color};`;
        backClass = 'card-back-solid';
    }
    else if (item.value) backContent = `<div class="display-content-large">${item.value}</div>`;
    else if (item.type === 'circle') backContent = `<div class="shape-container shape-circle" style="--dynamic-color:${item.color}"></div>`;
    else if (item.type === 'square') backContent = `<div class="shape-container" style="--dynamic-color:${item.color}"></div>`;
    else if (item.type === 'triangle') backContent = `<div class="shape-triangle" style="--dynamic-color:${item.color}"></div>`;
    else if (item.type === 'star') backContent = `<span class="emoji-star" style="--dynamic-color:${item.color}">⭐</span>`;
    else backContent = `<div class="display-content-large">${item.letter || ''}</div>`;

    container.innerHTML = `
        <div class="mobile-card-container ${animClass}">
            <div class="mobile-card" id="current-card" onclick="flipCard(this, '${item.audio}')">
                <div class="card-front">
                    <h1 class="card-letter">${item.letter || ''}</h1>
                    <p class="card-word">${item.word || item.name_hi || ''}</p>
                    <div class="card-emoji">${item.emoji || '✨'}</div>
                </div>
                <div class="card-back ${backClass}" style="${backVars}">
                    ${backContent}
                </div>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
            </div>
        </div>
    `;

    if (state.isPlayingAutoplay) {
        state.autoplayTimeout = setTimeout(() => { 
            const card = document.getElementById('current-card');
            if (card) flipCard(card, item.audio);
        }, 500);
    }

    updateNavigationUI();
};

// Render Grid/Menu View
const renderGridView = () => {
    const container = document.getElementById('master-mobile');
    if (!container || !state.data) return;

    // Reset scroll and content
    const dir = getEffectiveNavDirection();
    container.innerHTML = `<div class="grid-view-container ${dir === 'vertical' ? 'grid-vertical' : 'grid-horizontal'}"></div>`;
    const grid = container.querySelector('.grid-view-container');

    state.data.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.innerHTML = `
            <div class="grid-icon">${item.emoji || '✨'}</div>
            <div class="grid-label">${item.letter || item.word || ''}</div>
        `;
        div.onclick = () => {
            state.viewMode = 'flashcard';
            localStorage.setItem('mobile_view_mode', 'flashcard');
            state.currentIndex = index;
            localStorage.setItem('mobile_currentIndex', index);
            applyLayoutSettings();
            renderContent();
        };
        grid.appendChild(div);
    });

    // Handle horizontal vs vertical scrolling/swiping for grid if needed
    updateNavigationUI();
};

// Next card logic
const next = (isManual = true) => {
    if (isManual) playInteractionSFX();
    if (state.autoplayTimeout) clearTimeout(state.autoplayTimeout);
    
    if (state.currentIndex < state.data.length - 1) {
        state.currentIndex++;
        localStorage.setItem('mobile_currentIndex', state.currentIndex);
        localStorage.setItem('mobile_currentCategory', state.currentCategoryName);
        renderContent('next');
    } else {
        console.log("🏁 Reached end of category");
    }
};

// Previous card logic
const prev = () => {
    if (state.currentIndex > 0) {
        playInteractionSFX();
        if (state.autoplayTimeout) clearTimeout(state.autoplayTimeout);
        state.currentIndex--;
        localStorage.setItem('mobile_currentIndex', state.currentIndex);
        localStorage.setItem('mobile_currentCategory', state.currentCategoryName);
        renderContent('prev');
    }
};

// Flip logic
const flipCard = (card, audioPath) => {
    // Apply pop animation to container to avoid transform conflicts with the flip
    playInteractionSFX(card.parentElement);
    card.classList.toggle('is-flipped');
    // We only play audio when flipping TO the back, matching desktop behavior logic 
    if (audioPath && card.classList.contains('is-flipped')) {
        playSound(audioPath, card);
    }
};

// Audio logic 
let currentAudio = null;
let currentSFX = null;
let bgmAudio = null;

const getEffectiveVolume = (type) => {
    const v = state.vMaster || 0.8;
    if (type === 'music') return v * (state.vMusic || 0.6);
    if (type === 'sfx') return v * (state.vSFX || 0.9);
    if (type === 'content') return v * (state.vContent || 1.0);
    return v;
};

const updateBGM = () => {
    if (!state.isBGMusic) {
        if (bgmAudio) {
            bgmAudio.pause();
            bgmAudio = null;
        }
        return;
    }

    if (!bgmAudio) {
        const bgmPath = (window.AUDIO_BASE_PATH || '../assets/audio/') + 'system/bg_music/welcome_loop.mp3';
        bgmAudio = new Audio(bgmPath);
        bgmAudio.loop = true;
    }

    bgmAudio.volume = getEffectiveVolume('music');
    
    // Only play if session is active (to avoid background noise on welcome screen unless desired)
    if (bgmAudio.paused && localStorage.getItem('mobile_session_active') === 'true') {
        bgmAudio.play().catch(() => console.warn("BGM autoplay blocked"));
    }
};

const stopCurrentAudio = () => {
    if (state.autoplayTimeout) {
        clearTimeout(state.autoplayTimeout);
        state.autoplayTimeout = null;
    }
    
    // Stop interaction SFX if playing
    if (currentSFX) {
        currentSFX.pause();
        currentSFX.currentTime = 0;
        currentSFX = null;
    }

    if (currentAudio) {
        console.log("🛑 Stopping current audio");
        currentAudio.pause();
        currentAudio.currentTime = 0;
        const card = document.getElementById('current-card');
        if (card) {
            card.classList.remove('playing');
            const bar = card.querySelector('.progress-bar');
            if (bar) bar.style.width = '0%';
        }
        currentAudio = null;
    }
    updatePlaybackUI();
};

const playSound = (audioPath, card) => {
    if (!audioPath) return;
    stopCurrentAudio();

    console.log("🔊 Playing audio: " + audioPath);
    const fullPath = (window.AUDIO_BASE_PATH || '../assets/audio/') + audioPath;
    const audio = new Audio(fullPath);
    audio.playbackRate = state.playbackSpeed || 1.0;
    audio.volume = getEffectiveVolume('content');
    currentAudio = audio;
    updatePlaybackUI();
    
    if (card) {
        card.classList.add('playing');
        const bar = card.querySelector('.progress-bar');
        
        audio.addEventListener('timeupdate', () => {
            if (bar && currentAudio === audio) {
                const percent = (audio.currentTime / audio.duration) * 100;
                bar.style.width = percent + '%';
            }
        });
    }

    audio.addEventListener('ended', () => {
        if (currentAudio === audio) {
            if (card) {
                card.classList.remove('playing');
                const bar = card.querySelector('.progress-bar');
                if (bar) bar.style.width = '0%';
            }
            
            currentAudio = null;
            updatePlaybackUI();

            // Autoplay/Celebration logic (only applicable if a card was active)
            if (card && state.isPlayingAutoplay) {
                if (state.currentIndex < state.data.length - 1) {
                    state.autoplayTimeout = setTimeout(() => {
                        next(false); 
                    }, state.autoplayDelay * 1000);
                } else {
                    state.autoplayTimeout = setTimeout(() => {
                        triggerCelebration();
                    }, 1000);
                }
            }
        }
    });

    return audio.play().catch(e => {
        console.warn("Failed to play audio:", e.message);
        if (card) card.classList.remove('playing');
        throw e; // Rethrow to allow fallback handling
    });
};

// New Premium Interaction SFX
const playInteractionSFX = (element) => {
    if (!state.isSFX) return;

    // Stop all previous audio before starting interaction sound
    stopCurrentAudio();

    // Auditory Feedback (Using a natural wind flow sound effect)
    const sfxPath = (window.AUDIO_BASE_PATH || '../assets/audio/') + 'system/effects/storm-wind.mp3';
    const sfx = new Audio(sfxPath);
    currentSFX = sfx;
    sfx.volume = getEffectiveVolume('sfx'); // Dynamic volume
    sfx.play().catch(() => {});

    // Visual Feedback (Pop Animation)
    if (element) {
        element.classList.remove('sfx-pop');
        void element.offsetWidth; // Trigger reflow
        element.classList.add('sfx-pop');
    }
};

// Swipe Gestures
const setupSwipeGestures = () => {
    let touchstartX = 0;
    let touchendX = 0;

    const master = document.getElementById('master-mobile');
    if (!master) return;

    master.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, {passive: true});

    master.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const diffX = touchendX - touchstartX;
        const diffY = touchendY - touchstartY;
        const threshold = 50; 
        const dir = getEffectiveNavDirection();

        if (dir === 'vertical') {
            if (diffY < -threshold) next(); // Swipe up -> Next
            if (diffY > threshold) prev();  // Swipe down -> Prev
        } else {
            if (diffX < -threshold) next(); // Swipe left -> Next
            if (diffX > threshold) prev();  // Swipe right -> Prev
        }
    }
};

// UI: Playback State Helper for Navigation Locking
const updatePlaybackUI = () => {
    const prevBtn = document.getElementById('mobile-prev');
    const nextBtn = document.getElementById('mobile-next');
    const homeBtn = document.getElementById('mobile-home');
    const autoplayNavBtn = document.getElementById('mobile-autoplay-nav');
    
    if (!prevBtn || !nextBtn || !homeBtn) return;

    // Lock navigation if autoplay is running OR audio is currently playing
    if (state.isPlayingAutoplay || currentAudio) {
        prevBtn.classList.add('disabled-nav');
        nextBtn.classList.add('disabled-nav');
        homeBtn.classList.add('disabled-nav');
        if (autoplayNavBtn) autoplayNavBtn.classList.add('active-glow');
    } else {
        prevBtn.classList.remove('disabled-nav');
        nextBtn.classList.remove('disabled-nav');
        homeBtn.classList.remove('disabled-nav');
        if (autoplayNavBtn) autoplayNavBtn.classList.remove('active-glow');
        updateNavigationUI(); // Re-evaluate actual boundaries (start/end of deck)
    }
};

/**
 * UI: Navigation Control (Demo)
 * Applies visibility of specific nav buttons based on Admin settings.
 */
const applyNavSettings = () => {
    const isMasterOn = localStorage.getItem('mobile_master_nav') !== 'false';
    const showHome = isMasterOn && localStorage.getItem('mobile_show_home') !== 'false';
    const showNav = isMasterOn && localStorage.getItem('mobile_show_nav') !== 'false';
    const showSettings = isMasterOn && localStorage.getItem('mobile_show_settings') !== 'false';
    const showAutoplayNav = isMasterOn && localStorage.getItem('mobile_show_autoplay_nav') !== 'false';

    const homeBtn = document.getElementById('mobile-home');
    const prevBtn = document.getElementById('mobile-prev');
    const nextBtn = document.getElementById('mobile-next');
    const settingsBtn = document.getElementById('mobile-settings');
    const autoplayNavBtn = document.getElementById('mobile-autoplay-nav');

    if (homeBtn) homeBtn.classList.toggle('hidden', !showHome);
    if (prevBtn) prevBtn.classList.toggle('hidden', !showNav);
    if (nextBtn) nextBtn.classList.toggle('hidden', !showNav);
    if (settingsBtn) settingsBtn.classList.toggle('hidden', !showSettings);
    if (autoplayNavBtn) autoplayNavBtn.classList.toggle('hidden', !showAutoplayNav);
};

/**
 * UI: Advanced Layout Settings
 */
const applyLayoutSettings = () => {
    state.viewMode = localStorage.getItem('mobile_view_mode') || 'flashcard';
    state.flashcardNavDir = localStorage.getItem('mobile_flashcard_nav_dir') || 'horizontal';
    state.gridNavDir = localStorage.getItem('mobile_grid_nav_dir') || 'horizontal';
    const showBottomNav = localStorage.getItem('mobile_show_bottom_nav') !== 'false';
    const activeDir = getEffectiveNavDirection();
    
    // Bottom Nav Visibility
    const nav = document.querySelector('.mobile-nav');
    if (nav) {
        nav.classList.toggle('layout-hidden', !showBottomNav);
    }

    // Direction Classes
    const container = document.getElementById('master-mobile');
    if (container) {
        container.classList.toggle('layout-vertical', activeDir === 'vertical');
    }
};

/**
 * UI: Auto-hide Navigation logic
 */
const setupAutoHideNav = () => {
    const nav = document.querySelector('.mobile-nav');
    if (!nav) return;

    // Detect interaction near bottom
    document.addEventListener('touchstart', (e) => {
        const autoHide = localStorage.getItem('mobile_autohide_nav') === 'true';
        if (!autoHide) return;

        const y = e.touches[0].clientY;
        const vh = window.innerHeight;
        
        if (y > vh * 0.85) {
            nav.classList.remove('autohide-hidden');
            state.lastInteraction = Date.now();
        } else {
            // Hide if clicked away after a delay
            setTimeout(() => {
                if (Date.now() - state.lastInteraction > 3000) {
                    nav.classList.add('autohide-hidden');
                }
            }, 3000);
        }
    });

    // Periodic check
    setInterval(() => {
        const autoHide = localStorage.getItem('mobile_autohide_nav') === 'true';
        if (autoHide && Date.now() - state.lastInteraction > 5000) {
            nav.classList.add('autohide-hidden');
        }
    }, 1000);
};

// UI: Navigation State Helper (Boundaries)
const updateNavigationUI = () => {
    const prevBtn = document.getElementById('mobile-prev');
    const nextBtn = document.getElementById('mobile-next');

    if (!prevBtn || !nextBtn || !state.data || state.isPlayingAutoplay) return;

    // Boundary check for Previous button
    if (state.currentIndex === 0) {
        prevBtn.classList.add('disabled-nav');
    } else {
        prevBtn.classList.remove('disabled-nav');
    }

    // Boundary check for Next button
    if (state.currentIndex === state.data.length - 1) {
        nextBtn.classList.add('disabled-nav');
    } else {
        nextBtn.classList.remove('disabled-nav');
    }
};

// Celebration Logic (Ported from Desktop)
let confettiInterval = null;

const triggerCelebration = () => {
    stopCurrentAudio();
    
    // Stop autoplay session logic and sync to settings
    state.isPlayingAutoplay = false;
    localStorage.setItem('mobile_autoplay', 'false'); // FULL SYNC: Reset setting on completion
    updatePlaybackUI();
    console.log("✅ Autoplay session completed and synced");

    // Play reward sound
    const rewardPath = (window.AUDIO_BASE_PATH || '../assets/audio/') + 'system/effects/reward_excellent.mp3';
    const rewardAudio = new Audio(rewardPath);
    rewardAudio.volume = getEffectiveVolume('content');
    currentAudio = rewardAudio;

    rewardAudio.onplay = () => triggerConfetti();
    rewardAudio.onended = () => {
        stopConfetti();
        currentAudio = null;
    };

    rewardAudio.play().catch(e => {
        console.warn("Celebration audio failed:", e);
        // Ensure confetti still triggers as fallback
        triggerConfetti();
        setTimeout(stopConfetti, 4000);
    });
};

const triggerConfetti = () => {
    if (confettiInterval) return;

    const colors = ['#FF4081', '#7C4DFF', '#00E676', '#FFD600', '#00B0FF', '#FF6E40', '#E040FB', '#FF5252'];
    const shapes = ['square', 'circle', 'triangle', 'star'];
    
    const container = document.createElement('div');
    container.id = 'confetti-container';
    document.body.appendChild(container);

    const createPiece = () => {
        const piece = document.createElement('div');
        const size = Math.random() * 12 + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        piece.className = 'confetti-piece';
        Object.assign(piece.style, {
            left: Math.random() * 100 + 'vw',
            width: size + 'px',
            height: size + 'px',
            backgroundColor: color,
            opacity: Math.random() * 0.5 + 0.5
        });
        
        if (shape === 'circle') piece.style.borderRadius = '50%';
        else if (shape === 'triangle') {
            piece.style.backgroundColor = 'transparent';
            piece.style.width = '0';
            piece.style.height = '0';
            piece.style.borderLeft = (size/2) + 'px solid transparent';
            piece.style.borderRight = (size/2) + 'px solid transparent';
            piece.style.borderBottom = size + 'px solid ' + color;
        } else if (shape === 'star') {
            piece.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        } else {
            piece.style.borderRadius = '2px';
        }

        const duration = Math.random() * 2.5 + 2.5;
        const drift = (Math.random() - 0.5) * 300;
        const scale = Math.random() * 0.5 + 0.75;
        const rotationStart = Math.random() * 360;
        const rotationEnd = rotationStart + (Math.random() * 1080);
        
        piece.animate([
            { transform: `translate(0, 0) rotate(${rotationStart}deg) scale(${scale})`, opacity: 0.8 },
            { opacity: 1, offset: 0.3 },
            { opacity: 0.6, offset: 0.6 },
            { transform: `translate(${drift}px, 110vh) rotate(${rotationEnd}deg) scale(${scale * 0.5})`, opacity: 0.3 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.1, 0, 0.3, 1)',
            fill: 'forwards'
        });

        container.appendChild(piece);
        setTimeout(() => piece.remove(), duration * 1000);
    };

    // Desktop Parity High-Density Initialization
    for(let i=0; i<120; i++) setTimeout(createPiece, Math.random() * 400);
    confettiInterval = setInterval(createPiece, 25);
};

const stopConfetti = () => {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
    const container = document.getElementById('confetti-container');
    if (container) {
        container.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, fill: 'forwards' })
                 .onfinish = () => { if (container.parentNode) container.remove(); };
    }
};

const toggleAutoplay = () => {
    playInteractionSFX();
    state.isPlayingAutoplay = !state.isPlayingAutoplay;
    state.isAutoplay = state.isPlayingAutoplay;
    localStorage.setItem('mobile_autoplay', state.isPlayingAutoplay);
    
    if (state.isPlayingAutoplay) {
        // If flipped, stay, if not, wait for card logic
        const card = document.getElementById('current-card');
        if (card && !card.classList.contains('playing')) {
            const item = state.data[state.currentIndex];
            if (item) flipCard(card, item.audio);
        }
    } else {
        stopCurrentAudio();
    }
    updatePlaybackUI();
};

// Global expose
window.next = next;
window.prev = prev;
window.playSound = playSound;
window.startApp = startApp;
window.goHome = goHome;
window.triggerCelebration = triggerCelebration;
window.toggleAutoplay = toggleAutoplay;

// Re-evaluate settings on visibility or focus return
window.addEventListener('focus', () => {
    state.isAutoplay = localStorage.getItem('mobile_autoplay') === 'true';
    state.isSFX = localStorage.getItem('mobile_sfx') !== 'false';
    state.isBGMusic = localStorage.getItem('mobile_bg_music') !== 'false';
    state.autoplayDelay = parseInt(localStorage.getItem('mobile_autoplay_delay')) || 3;
    state.playbackSpeed = parseFloat(localStorage.getItem('mobile_playback_speed')) || 1.0;
    
    applyNavSettings();
    applyLayoutSettings();
    updateBGM();
});
