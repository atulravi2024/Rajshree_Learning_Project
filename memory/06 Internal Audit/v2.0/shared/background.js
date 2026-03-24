/**
 * SHARED BACKGROUND ENGINE
 * Handles dynamic background elements injection and animations.
 */

function initBackground() {
    if (document.querySelector('.background-grid')) return; // Already exists

    const bgElements = `
        <div class="bg-scene"></div>
        <div class="background-grid"></div>
        <div class="holographic-glare"></div>
        <div class="bg-scanlines"></div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', bgElements);
}

/**
 * Pulse effect for haptic feedback simulation.
 */
function hapticPulse() {
    if (window.CONFIG && !window.CONFIG.feedbackBleeps) return;
    
    const nav = document.querySelector('.frontier-nav');
    if (nav) {
        nav.classList.remove('haptic-pulse');
        void nav.offsetWidth;
        nav.classList.add('haptic-pulse');
    }

    const glare = document.querySelector('.holographic-glare');
    if (glare) {
        glare.classList.remove('glare-pulse');
        void glare.offsetWidth;
        glare.classList.add('glare-pulse');
    }
}

// Automatically Initialize
document.addEventListener('DOMContentLoaded', initBackground);
