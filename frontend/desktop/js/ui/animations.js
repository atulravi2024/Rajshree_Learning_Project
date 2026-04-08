/**
 * UI Animations Utility
 * Enhanced Confetti celebration with multiple shapes, density, and dynamic effects.
 */

let confettiInterval = null;

/**
 * Triggers an enhanced confetti celebration animation.
 */
function triggerConfetti() {
    if (confettiInterval) return;

    const colors = ['#FF4081', '#7C4DFF', '#00E676', '#FFD600', '#00B0FF', '#FF6E40', '#E040FB', '#FF5252'];
    const shapes = ['square', 'circle', 'triangle', 'star'];
    
    const container = document.createElement('div');
    container.id = 'confetti-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    const createPiece = () => {
        const piece = document.createElement('div');
        const size = Math.random() * 12 + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        piece.style.position = 'absolute';
        piece.style.top = '-20px';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.width = size + 'px';
        piece.style.height = size + 'px';
        piece.style.backgroundColor = color;
        piece.style.opacity = Math.random() * 0.5 + 0.5;
        
        // Apply Shape
        if (shape === 'circle') {
            piece.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
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

        // Animation params
        const duration = Math.random() * 2.5 + 2.5;
        const drift = (Math.random() - 0.5) * 300;
        const scale = Math.random() * 0.5 + 0.75;
        const rotationStart = Math.random() * 360;
        const rotationEnd = rotationStart + (Math.random() * 1080);
        
        // Twinkle and Movement
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

    // Rich Initial Burst
    for(let i=0; i<120; i++) {
        setTimeout(createPiece, Math.random() * 300);
    }

    // High-Density Continuous Generation
    confettiInterval = setInterval(createPiece, 25);
}

/**
 * Stops the confetti animation and performs a graceful fade-out.
 */
function stopConfetti() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
    
    const container = document.getElementById('confetti-container');
    if (container) {
        container.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 800,
            fill: 'forwards'
        }).onfinish = () => {
            if (container.parentNode) container.remove();
        };
    }
}
