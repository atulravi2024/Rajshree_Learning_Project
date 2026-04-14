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

// Render Content wrapper (Flashcard, Grid, or 3-in-1)
const renderContent = (direction = 'next') => {
    if (state.viewMode === 'grid') {
        renderGridView();
    } else if (state.viewMode === 'three') {
        renderThreeInOneView(direction);
    } else {
        renderCard(direction);
    }
};

// Helper: Build HTML for a single card
const buildCardHTML = (item, index, isThreeView = false) => {
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

    const cardId = isThreeView ? `card-${index}` : `current-card`;
    const containerClass = isThreeView ? 'three-in-one-card' : 'mobile-card-container';

    return `
        <div class="${containerClass}">
            <div class="mobile-card" id="${cardId}" onclick="flipCard(this, '${item.audio}')">
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
    
    // Slide animation class
    const dir = getEffectiveNavDirection();
    const animClass = (dir === 'vertical') 
        ? (direction === 'next' ? 'slide-in-bottom' : 'slide-in-top')
        : (direction === 'next' ? 'slide-in-right' : 'slide-in-left');

    container.innerHTML = buildCardHTML(item, state.currentIndex);
    
    // Add animation to the created container
    const cardContainer = container.querySelector('.mobile-card-container');
    if (cardContainer) cardContainer.classList.add(animClass);

    if (state.isPlayingAutoplay) {
        state.autoplayTimeout = setTimeout(() => { 
            const card = document.getElementById('current-card');
            if (card) flipCard(card, item.audio);
        }, 500);
    }

    updateNavigationUI();
};

// Render 3-in-1 View
const renderThreeInOneView = (direction = 'next') => {
    if (state.autoplayTimeout) {
        clearTimeout(state.autoplayTimeout);
        state.autoplayTimeout = null;
    }

    const container = document.getElementById('master-mobile');
    if (!container || !state.data || state.data.length === 0) return;

    // Determine the group of 3 (0-2, 3-5, 6-8, etc.)
    const groupStart = Math.floor(state.currentIndex / 3) * 3;
    const indices = [];
    for (let i = 0; i < 3; i++) {
        if (groupStart + i < state.data.length) {
            indices.push(groupStart + i);
        }
    }

    // Animation & Layout logic
    const threeDir = localStorage.getItem('mobile_three_nav_dir') || 'horizontal';
    const dir = getEffectiveNavDirection();
    const animClass = (dir === 'vertical') 
        ? (direction === 'next' ? 'slide-in-bottom' : 'slide-in-top')
        : (direction === 'next' ? 'slide-in-right' : 'slide-in-left');

    let html = `<div class="three-in-one-container ${threeDir === 'vertical' ? 'three-vertical' : ''} ${animClass}">`;
    indices.forEach(idx => {
        html += buildCardHTML(state.data[idx], idx, true);
    });
    html += `</div>`;

    container.innerHTML = html;

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
    
    const jump = state.viewMode === 'three' ? 3 : 1;
    if (state.currentIndex < state.data.length - jump) {
        state.currentIndex += jump;
        // Group logic adjustment for 'three' mode to ensure we don't skip items if jump is 3
        if (state.viewMode === 'three') {
            state.currentIndex = Math.floor(state.currentIndex / 3) * 3;
        }
        localStorage.setItem('mobile_currentIndex', state.currentIndex);
        localStorage.setItem('mobile_currentCategory', state.currentCategoryName);
        renderContent('next');
    } else {
        console.log("🏁 Reached end of category");
    }
};

// Previous card logic
const prev = () => {
    const jump = state.viewMode === 'three' ? 3 : 1;
    if (state.currentIndex >= jump) {
        playInteractionSFX();
        if (state.autoplayTimeout) clearTimeout(state.autoplayTimeout);
        state.currentIndex -= jump;
        if (state.viewMode === 'three') {
            state.currentIndex = Math.floor(state.currentIndex / 3) * 3;
        }
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
            if (bar) bar.style.setProperty('--progress', '0%');
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
                bar.style.setProperty('--progress', percent + '%');
            }
        });
    }

    audio.addEventListener('ended', () => {
        if (currentAudio === audio) {
            if (card) {
                card.classList.remove('playing');
                const bar = card.querySelector('.progress-bar');
                if (bar) bar.style.setProperty('--progress', '0%');
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

    const jump = state.viewMode === 'three' ? 3 : 1;

    // Boundary check for Previous button
    if (state.currentIndex < jump) {
        prevBtn.classList.add('disabled-nav');
    } else {
        prevBtn.classList.remove('disabled-nav');
    }

    // Boundary check for Next button
    if (state.currentIndex >= state.data.length - jump) {
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
        piece.style.setProperty('--left', Math.random() * 100 + 'vw');
        piece.style.setProperty('--size', size + 'px');
        piece.style.setProperty('--color', color);
        piece.style.setProperty('--opacity', Math.random() * 0.5 + 0.5);
        
        if (shape === 'circle') piece.classList.add('is-circle');
        else if (shape === 'triangle') piece.classList.add('is-triangle');
        else if (shape === 'star') piece.classList.add('is-star');
        else if (shape === 'square') piece.classList.add('is-square');

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

/* =====================================================
   Mobile Menu System Logic
   ===================================================== */

const menuState = {
    currentStep: 1,
    history: []
};

window.openMenu = () => {
    playInteractionSFX();
    const menu = document.getElementById('menu-overlay');
    const welcome = document.getElementById('welcome-screen');
    
    if (menu) menu.classList.remove('hidden');
    if (welcome) welcome.classList.add('hidden');
    
    // Reset to step 1
    menuState.currentStep = 1;
    menuState.history = [];
    updateMenuUI();

    // Play profile-specific welcome sound matching the user's request
    const profile = localStorage.getItem('rajshree_active_profile') || 'rajshree';
    const welcomePath = `system/welcome/welcome_${profile}.mp3`;
    
    playSound(welcomePath).catch(() => {
        console.warn(`Profile audio missing: ${welcomePath}, trying generic.`);
        playSound('system/welcome/welcome_generic.mp3').catch(() => {
            playSound('system/welcome_short.mp3');
        });
    });
};

window.closeMenu = () => {
    playInteractionSFX();
    const menu = document.getElementById('menu-overlay');
    if (menu) menu.classList.add('hidden');
    // Always return to home if menu is closed (since it's a mandatory step now)
    goHome();
};

window.backMenu = () => {
    if (menuState.history.length > 0) {
        playInteractionSFX();
        const prevStep = menuState.history.pop();
        menuState.currentStep = prevStep.step;
        updateMenuUI();
    } else {
        // If at step 1 and back clicked, go home
        closeMenu();
    }
};

const updateMenuUI = () => {
    const steps = ['menu-step-1', 'menu-step-2', 'menu-step-3'];
    steps.forEach((s, i) => {
        const el = document.getElementById(s);
        if (el) el.classList.toggle('hidden', (i + 1) !== menuState.currentStep);
    });

    const backBtn = document.getElementById('menu-back');
    // Show back button always, but step 1 will just go back to welcome
    if (backBtn) backBtn.classList.remove('hidden');

    const title = document.getElementById('menu-title');
    if (title) {
        if (menuState.currentStep === 1) title.innerText = 'विषय चुनें';
    }
};

window.showMobileCategory = (titleCat) => {
    playInteractionSFX();
    menuState.history.push({ step: 1 });
    menuState.currentStep = 2;
    updateMenuUI();

    const title = document.getElementById('menu-title');
    const container = document.getElementById('menu-step2-container');
    if (!container) return;
    container.innerHTML = '';

    // Play intro audio matching desktop IDs
    const introFiles = {
        'varnamala': 'system/intros/intro_varnamala.mp3',
        'sankhya': 'system/intros/intro_ganit.mp3',
        'names': 'system/intros/intro_names.mp3',
        'games': 'system/intros/intro_games.mp3'
    };
    if (introFiles[titleCat]) playSound(introFiles[titleCat]);

    if (titleCat === 'varnamala') {
        if (title) title.innerText = 'वर्णमाला के भाग';
        container.innerHTML = 
            createMenuCard('अ', 'स्वर (Swar)', "showMobileSubCategory('swar')", 'vyanjan') +
            createMenuCard('क', 'व्यंजन (Vyanjan)', "showMobileSubCategory('vyanjan')", 'swar') +
            createMenuCard('🔗', 'संयुक्त अक्षर', "showMobileSubCategory('samyukt')", 'samyukt') +
            createMenuCard('✍️', 'मात्रा ज्ञान', "showMobileSubCategory('matra')", 'magic');
    } else if (titleCat === 'sankhya') {
        if (title) title.innerText = 'गणित (Math)';
        container.innerHTML = 
            createMenuCard('🧮', 'गिनती (Ginti)', "showMobileSubCategory('numbers_main')", 'swar') +
            createMenuCard('📚', 'पहाड़े (Pahade)', "showMobileSubCategory('tables_main')", 'vyanjan') +
            createMenuCard('📐', 'आकार-तुलना', "showMobileSubCategory('shapes_fun')", 'samyukt');
    } else if (titleCat === 'names') {
        if (title) title.innerText = 'मेरा संसार';
        container.innerHTML = 
            createMenuCard('👨‍👩‍👧‍👦', 'हम और शरीर', "showMobileSubCategory('family_body')", 'swar') + 
            createMenuCard('🦁', 'पशु और पक्षी', "showMobileSubCategory('animals_birds')", 'vyanjan') + 
            createMenuCard('🍎', 'खान-पान', "showMobileSubCategory('food_drinks')", 'samyukt') + 
            createMenuCard('🏡', 'आस-पास', "showMobileSubCategory('around_us')", 'magic') + 
            createMenuCard('🌍', 'प्रकृति-समय', "showMobileSubCategory('nature_time')", 'swar') + 
            createMenuCard('🎨', 'रंग और मज़ा', "showMobileSubCategory('colors_fun')", 'vyanjan');
    } else if (titleCat === 'games') {
        if (title) title.innerText = 'खेल-कूद (Games)';
        container.innerHTML = 
            createMenuCard('🕵️', 'पहचानो कौन', "selectMobileCategory('games_identify')", 'vyanjan') + 
            createMenuCard('🧩', 'सही मिलान', "selectMobileCategory('games_match')", 'swar') + 
            createMenuCard('❓', 'पहेलियाँ', "selectMobileCategory('games_quiz')", 'magic') + 
            createMenuCard('🃏', 'मेमोरी गेम', "selectMobileCategory('games_memory')", 'samyukt');
    }
};

window.showMobileSubCategory = (mainCat) => {
    // Check if it's a direct category
    const directCats = ['swar', 'vyanjan', 'samyukt', 'matra', 'nature_final', 'directions_main', 'space_main', 'festivals_main'];
    if (directCats.includes(mainCat)) {
        selectMobileCategory(mainCat);
        return;
    }

    playInteractionSFX();
    menuState.history.push({ step: 2 });
    menuState.currentStep = 3;
    updateMenuUI();

    const title = document.getElementById('menu-title');
    const container = document.getElementById('menu-step3-container');
    if (!container) return;
    container.innerHTML = '';

    if (mainCat === 'numbers_main') {
        if (title) title.innerText = 'गिनती (Numbers)';
        container.innerHTML = 
            createMenuCard('🧮', '१ - १०', "selectMobileCategory('numbers_10')", 'swar') + 
            createMenuCard('💯', '१ - १००', "selectMobileCategory('numbers_100')", 'vyanjan');
    } else if (mainCat === 'tables_main') {
        if (title) title.innerText = 'पहाड़े (Tables)';
        container.innerHTML = 
            createMenuCard('📝', 'पद्धति १', "selectMobileCategory('tables_10_m1')", 'samyukt') + 
            createMenuCard('🎵', 'पद्धति २', "selectMobileCategory('tables_10_m2')", 'magic');
    } else if (mainCat === 'shapes_fun') {
        if (title) title.innerText = 'आकार और तुलना';
        container.innerHTML = 
            createMenuCard('📐', 'आकार (Shapes)', "selectMobileCategory('shapes')", 'magic') + 
            createMenuCard('⚖️', 'तुलना', "selectMobileCategory('comparisons')", 'vyanjan');
    } else if (mainCat === 'family_body') {
        if (title) title.innerText = 'हम और शरीर';
        container.innerHTML = 
            createMenuCard('👨‍👩‍👧', 'रिश्ते', "selectMobileCategory('family')", 'swar') + 
            createMenuCard('👃', 'शरीर के अंग', "selectMobileCategory('body_parts')", 'magic') + 
            createMenuCard('🌟', 'अच्छी आदतें', "selectMobileCategory('habits')", 'vyanjan') + 
            createMenuCard('🤩', 'भावनाएं', "selectMobileCategory('emotions')", 'samyukt') + 
            createMenuCard('🤸', 'क्रियाएँ', "selectMobileCategory('actions')", 'swar');
    } else if (mainCat === 'animals_birds') {
        if (title) title.innerText = 'पशु और पक्षी';
        container.innerHTML = 
            createMenuCard('🐄', 'पालतू', "selectMobileCategory('animals_domestic')", 'samyukt') + 
            createMenuCard('🦁', 'जंगली', "selectMobileCategory('animals_wild')", 'vyanjan') + 
            createMenuCard('🦎', 'छोटे जीव', "selectMobileCategory('animals_smaller')", 'magic') + 
            createMenuCard('🦜', 'पक्षी', "selectMobileCategory('birds')", 'swar') + 
            createMenuCard('🦋', 'कीड़े-मकोड़े', "selectMobileCategory('insects')", 'magic');
    } else if (mainCat === 'food_drinks') {
        if (title) title.innerText = 'खान-पान';
        container.innerHTML = 
            createMenuCard('🍎', 'फल (Fruits)', "selectMobileCategory('fruits')", 'swar') + 
            createMenuCard('🥦', 'सब्जियाँ', "selectMobileCategory('vegetables')", 'samyukt') + 
            createMenuCard('😋', 'खाना-पीना', "selectMobileCategory('food')", 'magic');
    } else if (mainCat === 'around_us') {
        if (title) title.innerText = 'हमारा आस-पास';
        container.innerHTML = 
            createMenuCard('🏠', 'घर का सामान', "selectMobileCategory('objects')", 'swar') + 
            createMenuCard('👗', 'कपड़े', "selectMobileCategory('clothes')", 'vyanjan') + 
            createMenuCard('🧸', 'खिलौने', "selectMobileCategory('toys')", 'magic') + 
            createMenuCard('🚌', 'यातायात', "selectMobileCategory('vehicles')", 'samyukt') + 
            createMenuCard('🏫', 'जगहें', "selectMobileCategory('places')", 'swar') + 
            createMenuCard('👨‍🚒', 'सहायक', "selectMobileCategory('helpers')", 'vyanjan');
    } else if (mainCat === 'nature_time') {
        if (title) title.innerText = 'प्रकृति और समय';
        container.innerHTML = 
            createMenuCard('⛅', 'मौसम', "selectMobileCategory('nature')", 'swar') + 
            createMenuCard('🚀', 'अंतरिक्ष', "selectMobileCategory('space')", 'vyanjan') + 
            createMenuCard('📅', 'दिन', "selectMobileCategory('days_week')", 'magic') + 
            createMenuCard('🗓️', 'महीने', "selectMobileCategory('months_year')", 'samyukt') + 
            createMenuCard('🧭', 'दिशाएं', "selectMobileCategory('directions')", 'swar') + 
            createMenuCard('🌿', 'प्राकृतिक रंग', "selectMobileCategory('colors_natural')", 'vyanjan');
    } else if (mainCat === 'colors_fun') {
        if (title) title.innerText = 'रंग और मज़ा';
        container.innerHTML = 
            createMenuCard('🌈', 'रंगों का संसार', "showMobileSubCategory('colors_main')", 'magic') + 
            createMenuCard('⚽', 'खेल', "selectMobileCategory('games')", 'swar') + 
            createMenuCard('🥁', 'वाद्य यंत्र', "selectMobileCategory('instruments')", 'vyanjan') + 
            createMenuCard('🔔', 'आवाज़ें', "selectMobileCategory('sounds')", 'magic') + 
            createMenuCard('🪔', 'त्योहार', "selectMobileCategory('festivals')", 'samyukt') + 
            createMenuCard('🧚‍♀️', 'जादुई दुनिया', "selectMobileCategory('magic')", 'swar') + 
            createMenuCard('💭', 'कल्पना', "selectMobileCategory('imagination')", 'vyanjan');
    } else if (mainCat === 'colors_main') {
        if (title) title.innerText = 'रंगों का संसार';
        container.innerHTML = 
            createMenuCard('❤️', 'प्राथमिक (Primary)', "selectMobileCategory('colors_primary')", 'swar') + 
            createMenuCard('💚', 'द्वितीयक (Secondary)', "selectMobileCategory('colors_secondary')", 'vyanjan') + 
            createMenuCard('🌿', 'प्राकृतिक (Natural)', "selectMobileCategory('colors_natural')", 'samyukt') + 
            createMenuCard('🌈', 'रंगों का सागर', "showMobileSubCategory('colors_world_main')", 'magic');
    } else if (mainCat === 'colors_world_main') {
        if (title) title.innerText = 'रंगों का सागर';
        container.innerHTML = 
            createMenuCard('🌸', 'गुलाबी और लाल', "selectMobileCategory('colors_pink_red')", 'swar') + 
            createMenuCard('🌊', 'नीले और हरे', "selectMobileCategory('colors_blue_green')", 'vyanjan') + 
            createMenuCard('🟫', 'भूरे और बादामी', "selectMobileCategory('colors_brown_beige')", 'samyukt') + 
            createMenuCard('✨', 'चमकीले और धातु', "selectMobileCategory('colors_metallic')", 'vyanjan') + 
            createMenuCard('🔮', 'अन्य विशेष रंग', "selectMobileCategory('colors_special')", 'swar');
    }
};

window.selectMobileCategory = (category) => {
    stopCurrentAudio();
    playInteractionSFX();
    
    // Close menu
    const menu = document.getElementById('menu-overlay');
    if (menu) menu.classList.add('hidden');

    // Update state and load
    state.currentCategoryName = category;
    state.currentIndex = 0;
    localStorage.setItem('mobile_currentCategory', category);
    localStorage.setItem('mobile_currentIndex', 0);
    
    loadData();
    startApp(true); // Silent start (to avoid double welcome sound)

    // Play final intro sound matching desktop
    const finalIntroFiles = {
        'swar': 'system/intros/final_swar.mp3', 'vyanjan': 'system/intros/final_vyanjan.mp3', 'samyukt': 'system/intros/final_samyukt.mp3', 'matra': 'system/intros/final_matra.mp3',
        'numbers_10': 'system/intros/final_numbers_10.mp3', 'numbers_100': 'system/intros/final_numbers_100.mp3',
        'tables_10_m1': 'system/intros/final_tables_m1.mp3', 'tables_10_m2': 'system/intros/final_tables_m2.mp3',
        'shapes': 'system/intros/final_shapes.mp3', 'comparisons': 'system/intros/final_comparisons.mp3',
        'family': 'system/intros/final_family.mp3', 'body_parts': 'system/intros/final_body_parts.mp3',
        'animals_domestic': 'system/intros/final_animals_domestic.mp3', 'animals_wild': 'system/intros/final_animals_wild.mp3',
        'fruits': 'system/intros/final_fruits.mp3', 'vegetables': 'system/intros/final_vegetables.mp3',
        'habits': 'system/intros/final_habits.mp3', 'days_week': 'system/intros/final_days_week.mp3', 'months_year': 'system/intros/final_months_year.mp3',
        'nature': 'system/intros/final_nature.mp3', 'directions': 'system/intros/final_directions.mp3', 'space': 'system/intros/final_nature.mp3', 'festivals': 'system/intros/final_nature.mp3',
        'colors_primary': 'system/intros/final_colors_primary.mp3', 'colors_secondary': 'system/intros/final_colors_secondary.mp3', 'colors_natural': 'system/intros/final_colors_natural.mp3',
        'colors_pink_red': 'system/intros/sub_pink_red.mp3', 'colors_blue_green': 'system/intros/sub_blue_green.mp3', 'colors_brown_beige': 'system/intros/sub_brown_beige.mp3', 'colors_metallic': 'system/intros/sub_metallic.mp3', 'colors_special': 'system/intros/sub_special.mp3'
    };

    if (finalIntroFiles[category]) {
        setTimeout(() => playSound(finalIntroFiles[category]), 300);
    }
};

const createMenuCard = (icon, label, onClick, colorClass = '') => {
    return `<div class="menu-card ${colorClass}" onclick="${onClick}">
                <div class="menu-card-icon">${icon}</div>
                <div class="menu-card-label">${label}</div>
            </div>`;
};

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
