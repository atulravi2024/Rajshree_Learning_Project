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
    autoplayTimeout: null
};

// Initialize app when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("📱 Rajshree Learning Mobile Initialized!");
    loadData();
    
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

    renderCard();
    setupSwipeGestures();
    
    // Play welcome sound and track it (only if not a silent restore)
    if (!silent) {
        playSound('system/welcome_short.mp3');
    }
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
    const animClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';

    // Build Back Content (similar to desktop display.js)
    let backContent = '';
    let backStyle = '';
    if (item.image) backContent = `<img class="flash-image" src="${item.image}" alt="${item.word || item.name_hi}">`;
    else if (item.content) backContent = `<div class="display-content-medium">${item.content}</div>`;
    else if (item.color) {
        backContent = '';
        backStyle = `style="background:${item.color} !important;"`;
    }
    else if (item.value) backContent = `<div class="display-content-large">${item.value}</div>`;
    else if (item.type === 'circle') backContent = `<div class="shape-container shape-circle" style="background:${item.color}"></div>`;
    else if (item.type === 'square') backContent = `<div class="shape-container" style="background:${item.color}"></div>`;
    else if (item.type === 'triangle') backContent = `<div class="shape-triangle" style="border-bottom-color:${item.color}"></div>`;
    else if (item.type === 'star') backContent = `<span class="emoji-star" style="color:${item.color}">⭐</span>`;
    else backContent = `<div class="display-content-large">${item.letter || ''}</div>`;

    container.innerHTML = `
        <div class="mobile-card-container ${animClass}">
            <div class="mobile-card" id="current-card" onclick="flipCard(this, '${item.audio}')">
                <div class="card-front">
                    <h1 class="card-letter">${item.letter || ''}</h1>
                    <p class="card-word">${item.word || item.name_hi || ''}</p>
                    <div class="card-emoji">${item.emoji || '✨'}</div>
                </div>
                <div class="card-back" ${backStyle}>
                    ${backContent}
                </div>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
            </div>
        </div>
    `;

    if (state.isAutoplay) {
        state.autoplayTimeout = setTimeout(() => { 
            const card = document.getElementById('current-card');
            if (card) flipCard(card, item.audio);
        }, 500);
    }

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
        renderCard('next');
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
        renderCard('prev');
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
};

const playSound = (audioPath, card) => {
    if (!audioPath) return;
    stopCurrentAudio();

    console.log("🔊 Playing audio: " + audioPath);
    const fullPath = (window.AUDIO_BASE_PATH || '../assets/audio/') + audioPath;
    const audio = new Audio(fullPath);
    currentAudio = audio;
    
    if (card) {
        card.classList.add('playing');
        const bar = card.querySelector('.progress-bar');
        
        audio.addEventListener('timeupdate', () => {
            if (bar && currentAudio === audio) {
                const percent = (audio.currentTime / audio.duration) * 100;
                bar.style.width = percent + '%';
            }
        });

        audio.addEventListener('ended', () => {
            if (currentAudio === audio) {
                card.classList.remove('playing');
                if (bar) bar.style.width = '0%';
                currentAudio = null;

                // Autoplay: Move to next card after delay OR Trigger Celebration if end reached
                if (state.isAutoplay) {
                    if (state.currentIndex < state.data.length - 1) {
                        state.autoplayTimeout = setTimeout(() => {
                            next(false); // Trigger auto transition without manual SFX
                        }, 1000);
                    } else {
                        // Reached the end during autoplay!
                        state.autoplayTimeout = setTimeout(() => {
                            triggerCelebration();
                        }, 1000);
                    }
                }
            }
        });
    }

    audio.play().catch(e => {
        console.warn("Failed to play audio:", e.message);
        if (card) card.classList.remove('playing');
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
    sfx.volume = 0.5; // Natural volume
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
    }, {passive: true});

    master.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const diff = touchendX - touchstartX;
        const threshold = 50; // Minimum screen drag distance 

        if (diff < -threshold) { // Drag left
            next();
        }
        if (diff > threshold) { // Drag right
            prev();
        }
    }
};

// UI: Navigation State Helper
const updateNavigationUI = () => {
    const prevBtn = document.getElementById('mobile-prev');
    const nextBtn = document.getElementById('mobile-next');

    if (!prevBtn || !nextBtn || !state.data) return;

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
    
    // Disable autoplay state and sync settings button for next load
    state.isAutoplay = false;
    localStorage.setItem('mobile_autoplay', 'false');
    console.log("✅ Autoplay disabled on completion");

    // Play reward sound
    const rewardPath = (window.AUDIO_BASE_PATH || '../assets/audio/') + 'system/effects/reward_excellent.mp3';
    const rewardAudio = new Audio(rewardPath);
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
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '9999',
        overflow: 'hidden'
    });
    document.body.appendChild(container);

    const createPiece = () => {
        const piece = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        Object.assign(piece.style, {
            position: 'absolute',
            top: '-20px',
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
        }

        const duration = Math.random() * 2 + 2;
        const drift = (Math.random() - 0.5) * 200;
        
        piece.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${drift}px, 110vh) rotate(${360 + Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.1, 0, 0.3, 1)',
            fill: 'forwards'
        });

        container.appendChild(piece);
        setTimeout(() => piece.remove(), duration * 1000);
    };

    for(let i=0; i<80; i++) setTimeout(createPiece, Math.random() * 500);
    confettiInterval = setInterval(createPiece, 100);
};

const stopConfetti = () => {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
    const container = document.getElementById('confetti-container');
    if (container) {
        container.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, fill: 'forwards' })
                 .onfinish = () => container.remove();
    }
};

// Global expose
window.next = next;
window.prev = prev;
window.playSound = playSound;
window.startApp = startApp;
window.goHome = goHome;
window.triggerCelebration = triggerCelebration;

// Re-evaluate settings on visibility or focus return
window.addEventListener('focus', () => {
    state.isAutoplay = localStorage.getItem('mobile_autoplay') === 'true';
    state.isSFX = localStorage.getItem('mobile_sfx') !== 'false';
});
