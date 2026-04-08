/**
 * Initialization Logic
 * Sets up background icons, volume control, and dropdown behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.ChildSafetyLock) window.ChildSafetyLock.init();
    
    // ─── Settings Persistence ───
    const savedTheme = localStorage.getItem('rajshree_theme') || 'pink';
    const savedAvatar = localStorage.getItem('rajshree_avatar') || 'lion';
    const savedMusic = localStorage.getItem('rajshree_bg_music') || 'none';
    const isMagicBg = localStorage.getItem('rajshree_bg-magic-check') !== 'false';

    if (window.applyTheme) window.applyTheme(savedTheme);
    if (window.updateAvatarUI) window.updateAvatarUI(savedAvatar);
    if (window.playBackgroundMusic && savedMusic !== 'none') window.playBackgroundMusic(savedMusic);

    const icons = ['🧸', '🍫', '🦁', '🐘', '🍦', '🎈', '🍬', '🐼', '🎨', '🎁', '🐶', '🍭', '🌈', '🚲', '🍪'];
    const bg = document.getElementById('bg-icons');
    if (bg) {
        bg.style.display = isMagicBg ? 'block' : 'none';
        for (let i = 0; i < 40; i++) {
            const span = document.createElement('span');
            span.className = 'float-icon';
            span.innerText = icons[Math.floor(Math.random() * icons.length)];
            span.style.left = Math.random() * 100 + '%';
            span.style.top = Math.random() * 100 + '%';
            span.style.animationDuration = (4 + Math.random() * 4) + 's';
            span.style.animationDelay = Math.random() * 5 + 's';
            bg.appendChild(span);
        }
    }
    initializeAppElements();
    
    // Support Deep-linking and Hash-based SEO
    if (window.handleHashRouting) window.handleHashRouting();
});

function initializeAppElements() {
    const vol = document.getElementById('volume-control');
    const volIcon = document.querySelector('#nav-volume .hi');
    const homeBtn = document.getElementById('nav-home');

    // Parental Gate for ALL Navbar items
    const navItems = [
        { id: 'nav-varnamala', action: () => showMainCategory('varnamala') },
        { id: 'nav-sankhya', action: () => showMainCategory('sankhya') },
        { id: 'nav-names', action: () => showMainCategory('names') },
        { id: 'nav-home', action: () => goHome() },
        { id: 'nav-slideshow', action: (btn) => {
            // One-click to START, but 3s hold to STOP
            if (!window.isSlideshowActive) {
                toggleSlideshow();
            } else {
                // If already active, the Parental Gate (3s hold) will call this
                toggleSlideshow();
            }
        } },
        { id: 'nav-layout', action: (btn) => {
            const dropdown = btn.closest('.dropdown');
            const content = dropdown.querySelector('.dropdown-content');
            content.classList.add('show');
            content.style.display = 'block';
        } },
        { id: 'nav-volume', action: (btn) => {
            const dropdown = btn.closest('.dropdown');
            const content = dropdown.querySelector('.dropdown-content');
            content.classList.add('show');
            content.style.display = 'block';
        } }
    ];

    navItems.forEach(item => {
        const btn = document.getElementById(item.id);
        if (window.ChildSafetyLock && btn) {
            btn.removeAttribute('onclick');
            window.ChildSafetyLock.setupParentalGate(btn, () => {
                if (item.action) item.action(btn);
            });
        }
    });

    // Parental Gate for Step Back Buttons
    ['back-step-3', 'back-step-4', 'back-step-5'].forEach(id => {
        const btn = document.getElementById(id);
        if (window.ChildSafetyLock && btn) {
            const step = id.split('-')[2];
            const targetStep = parseInt(step) - 1;
            btn.removeAttribute('onclick');
            window.ChildSafetyLock.setupParentalGate(btn, () => {
                goBackTo(targetStep);
            });
        }
    });

    if (vol) {
        vol.value = globalVolume;
        vol.addEventListener('input', (e) => {
            globalVolume = e.target.value;
            if (volIcon) {
                if (globalVolume == 0) volIcon.innerText = '🔇';
                else if (globalVolume < 0.5) volIcon.innerText = '🔉';
                else volIcon.innerText = '🔊';
            }
        });
    }

    let dropdownTimeouts = {};
    document.querySelectorAll('.dropdown').forEach((dropdown, index) => {
        const content = dropdown.querySelector('.dropdown-content');
        if (content) {
            dropdown.addEventListener('mouseenter', () => {
                if (window.ChildSafetyLock && window.ChildSafetyLock.isSafetyEnabled) return;
                if (window.isSlideshowActive && dropdown.querySelector('#nav-layout')) return;
                clearTimeout(dropdownTimeouts[index]);
                content.classList.add('show');
                content.style.display = 'block';
            });
            dropdown.addEventListener('mouseleave', () => {
                dropdownTimeouts[index] = setTimeout(() => {
                    content.classList.remove('show');
                    content.style.display = 'none';
                }, 1000);
            });
        }
    });
}

function goToStep2() {
    const step1 = document.getElementById('step-1'); if (step1) step1.classList.add('hidden');
    const step2 = document.getElementById('step-2'); if (step2) step2.classList.remove('hidden');
    stopCurrentAudio();
    currentAudio = new Audio(window.AUDIO_BASE_PATH + 'system/welcome_short.mp3');
    // First audio (Welcome) is 75% as per user request
    currentAudio.volume = window.ChildSafetyLock && window.ChildSafetyLock.isSafetyEnabled ? 0.75 : globalVolume;
    currentAudio.play();
    
    // Mark first audio as played to bump volume for next audios
    if (window.ChildSafetyLock) {
        window.ChildSafetyLock.hasPlayedFirstAudio = true;
        window.ChildSafetyLock.applyGlobalStyles();
    }
}

function goHome() {
    if (window.isSlideshowActive) return;
    location.reload();
}

function goBackTo(step) {
    if (window.isSlideshowActive) return;
    ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'].forEach(s => { const el = document.getElementById(s); if (el) el.classList.add('hidden'); });
    const target = document.getElementById('step-' + step);
    if (target) target.classList.remove('hidden');
}
