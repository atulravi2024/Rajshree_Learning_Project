/**
 * Rajshree Learning - Mobile Settings Logic
 * =========================================
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("⚙️ Mobile Settings Initialized!");
    loadSettings();
    attachEvents();
});

// Load settings from localStorage
const loadSettings = () => {
    const autoplay = localStorage.getItem('mobile_autoplay') === 'true';
    const sfx = localStorage.getItem('mobile_sfx') !== 'false'; // Default to true

    const autoplayCheck = document.getElementById('mobile-autoplay');
    const sfxCheck = document.getElementById('mobile-sfx');

    if (autoplayCheck) autoplayCheck.checked = autoplay;
    if (sfxCheck) sfxCheck.checked = sfx;
};

// Event handlers
const attachEvents = () => {
    const autoplayCheck = document.getElementById('mobile-autoplay');
    const sfxCheck = document.getElementById('mobile-sfx');

    if (autoplayCheck) {
        autoplayCheck.addEventListener('change', (e) => {
            localStorage.setItem('mobile_autoplay', e.target.checked);
            console.log("Settings updated: Autoplay =", e.target.checked);
        });
    }

    if (sfxCheck) {
        sfxCheck.addEventListener('change', (e) => {
            localStorage.setItem('mobile_sfx', e.target.checked);
            console.log("Settings updated: SFX =", e.target.checked);
        });
    }
};
