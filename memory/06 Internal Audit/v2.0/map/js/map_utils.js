// map_utils.js - Math and Helper Functions for the Holographic Map

/**
 * Lightweight Y-axis rotation helper (no external dep).
 */
function gsap_like_rotate(obj, targetY, durationMs) {
    const startY = obj.rotation.y;
    const diff = targetY - startY;
    const startTime = Date.now();
    function step() {
        const t = Math.min(1, (Date.now() - startTime) / durationMs);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        obj.rotation.y = startY + diff * ease;
        if (t < 1) requestAnimationFrame(step);
    }
    step();
}

/**
 * Text formatting and DOM element text updating.
 */
function setText(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    // If element has a non-text first child (like an icon), only update text nodes
    const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3);
    if (textNode) {
        textNode.textContent = val;
    } else if (el.childNodes.length === 0 || (el.childNodes.length === 1 && el.firstChild.nodeType === 3)) {
        el.textContent = val;
    } else {
        // Fallback: try to update the first text-like child element
        const span = el.querySelector('span') || el.firstElementChild;
        if (span) span.textContent = val;
        else el.textContent = val;
    }
}

/**
 * Helper: radial glow texture creator.
 */
function createGlowTexture(colorHex) {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    let hexStr = colorHex.toString(16).padStart(6, '0');
    const r = parseInt(hexStr.substring(0, 2), 16);
    const g = parseInt(hexStr.substring(2, 4), 16);
    const b = parseInt(hexStr.substring(4, 6), 16);
    gradient.addColorStop(0, `rgba(${r},${g},${b}, 1)`);
    gradient.addColorStop(0.2, `rgba(${r},${g},${b}, 0.8)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
}

/**
 * Text Sprite creation for LOD labels.
 */
function createTextSprite(message, color, sizeMultiplier = 1) {
    const fontface = "Fira Code";
    const fontsize = 32;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128; // wider for longer labels
    context.font = "bold " + fontsize + "px " + fontface;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = color;
    context.shadowBlur = 12;
    context.fillStyle = color;
    context.fillText(message, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(sizeMultiplier * 48, sizeMultiplier * 12, 1);
    return sprite;
}

/**
 * Utility for lat/lon to sphere vector conversion.
 */
function calculateRotationForCoords(lat, lon) {
    const targetY = -(lon + 90) * (Math.PI / 180);
    const targetX = (lat) * (Math.PI / 180);
    return { x: targetX, y: targetY };
}
