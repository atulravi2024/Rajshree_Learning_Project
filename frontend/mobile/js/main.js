/**
 * Rajshree Learning - Mobile Logic (Fully Working Production Ready)
 * ==============================================================
 */

// Basic State
const state = {
    currentIndex: 0,
    currentCategoryName: 'swar', // corresponds to window.RAJSHREE_DATA.swar
    data: [],
    isAutoplay: localStorage.getItem('mobile_autoplay') === 'true',
    isSFX: localStorage.getItem('mobile_sfx') !== 'false'
};

// Initialize app when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("📱 Rajshree Learning Mobile Initialized!");
    loadData();
    renderCard();
    setupSwipeGestures();
});

// Load initial data (using global window data)
const loadData = () => {
    if (window.RAJSHREE_DATA && Object.keys(window.RAJSHREE_DATA).length > 0) {
        // Fallback to whichever category exists first if swar is missing
        if (window.RAJSHREE_DATA['swar']) {
            state.data = window.RAJSHREE_DATA['swar'];
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
    const container = document.getElementById('master-mobile');
    if (!container || !state.data || state.data.length === 0) {
        if(container) container.innerHTML = '<div class="loading-state">डेटा नहीं मिला! (Data not found)</div>';
        return;
    }

    const item = state.data[state.currentIndex];
    
    // Slide animation class logic
    const animClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';

    container.innerHTML = `
        <div class="mobile-card ${animClass}" id="current-card" onclick="playSound('${item.audio}')">
            <h1 class="card-letter">${item.letter || ''}</h1>
            <p class="card-word">${item.word || item.name_hi || ''}</p>
            <div class="card-emoji">${item.emoji || '✨'}</div>
        </div>
    `;

    if (state.isAutoplay) {
        // brief delay ensures card renders visually before play triggers
        setTimeout(() => { playSound(item.audio); }, 300);
    }
};

// Next card logic
const next = () => {
    state.currentIndex = (state.currentIndex + 1) % state.data.length;
    renderCard('next');
};

// Previous card logic
const prev = () => {
    state.currentIndex = (state.currentIndex - 1 + state.data.length) % state.data.length;
    renderCard('prev');
};

// Audio logic 
const playSound = (audioPath) => {
    if (!audioPath) return;

    console.log("🔊 Playing audio: " + audioPath);
    const fullPath = (window.AUDIO_BASE_PATH || '../assets/audio/') + audioPath;
    const audio = new Audio(fullPath);
    
    audio.play().catch(e => {
        console.warn("Failed to play audio:", e.message);
        // Note: standard browser policies block autoplay without prior UI interaction.
    });

    // Optional SFX Bounce
    if (state.isSFX) {
        const card = document.getElementById('current-card');
        if (card) {
            card.style.transform = 'scale(0.92)';
            setTimeout(() => card.style.transform = 'scale(1)', 150);
        }
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

// Global expose for inline HTML handlers
window.next = next;
window.prev = prev;
window.playSound = playSound;

// Re-evaluate settings on visibility or focus return
window.addEventListener('focus', () => {
    state.isAutoplay = localStorage.getItem('mobile_autoplay') === 'true';
    state.isSFX = localStorage.getItem('mobile_sfx') !== 'false';
});
