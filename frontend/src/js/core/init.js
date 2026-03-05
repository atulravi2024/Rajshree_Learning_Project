/**
 * Initialization Logic
 * Sets up background icons, volume control, and dropdown behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
    const icons = ['🧸', '🍫', '🦁', '🐘', '🍦', '🎈', '🍬', '🐼', '🎨', '🎁', '🐶', '🍭', '🌈', '🚲', '🍪'];
    const bg = document.getElementById('bg-icons');
    if (bg) {
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
});

function initializeAppElements() {
    const vol = document.getElementById('volume-control');
    const volIcon = document.querySelector('#nav-volume .hi');

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
    currentAudio.volume = globalVolume;
    currentAudio.play();
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
