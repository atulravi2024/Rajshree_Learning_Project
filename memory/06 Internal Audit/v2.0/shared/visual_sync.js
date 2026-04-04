/**
 * shared/visual_sync.js — Global Visual Settings Synchronization Engine
 *
 * RESPONSIBILITIES:
 *   1. Load `window.CONFIG` from localStorage on startup (persists across refreshes).
 *   2. Apply all visual settings to CSS custom properties on the root element.
 *   3. Save CONFIG to localStorage whenever it changes.
 *   4. Listen for cross-tab storage events to sync changes in real-time.
 *
 * USAGE:
 *   Include this script BEFORE any other shared scripts on every page.
 *   Call `window.saveAndSyncVisuals()` after modifying window.CONFIG.
 *   On Map page, `map_visual_sync.js` handles the Three.js 3D objects;
 *   this engine handles the CSS layer for ALL pages.
 */

(function () {
    const STORAGE_KEY = 'frontier_config_v2';

    // ── DEFAULT CONFIG ────────────────────────────────────────────────────────
    const DEFAULT_CONFIG = {
        theme:             'frontier',
        glowIntensity:     85,
        scanlineIntensity: 40,
        glareIntensity:    40,
        gridOpacity:       100,
        glassBlur:         10,
        chromaShift:       0,
        refreshRate:       2.5,
        autoSync:          true,
        masterVolume:      75,
        feedbackBleeps:    true,
        dataMasking:       false,
        protocolLock:      false,
        auditorName:       'ATUL VERMA'
    };

    // ── LOAD FROM STORAGE ─────────────────────────────────────────────────────
    function loadConfig() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle newly added keys gracefully
                window.CONFIG = Object.assign({}, DEFAULT_CONFIG, parsed);
            } else {
                window.CONFIG = Object.assign({}, DEFAULT_CONFIG);
            }
        } catch (e) {
            window.CONFIG = Object.assign({}, DEFAULT_CONFIG);
        }
    }

    // ── SAVE TO STORAGE ───────────────────────────────────────────────────────
    window.saveConfig = function () {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(window.CONFIG));
        } catch (e) {
            // localStorage unavailable (e.g. file:// with strict settings) — silent fail
        }
    };

    // ── APPLY CSS VARIABLES ───────────────────────────────────────────────────
    window.applyGlobalVisuals = function () {
        const cfg = window.CONFIG;
        if (!cfg) return;

        const root = document.documentElement;
        const glowFactor    = cfg.glowIntensity / 100;     // 0.0 – 1.0
        const glowIntensity = (glowFactor * 1.5).toFixed(3); // 0.0 – 1.5 for CSS calc()

        // ── Glow Intensity (master knob for all calc()-based glows) ──
        root.style.setProperty('--glow-intensity',     glowIntensity);
        root.style.setProperty('--neural-glow-opacity', glowFactor.toFixed(3));

        // ── Scanlines, Glare, Grid ──
        root.style.setProperty('--scanline-opacity', ((cfg.scanlineIntensity / 100) * 0.6).toFixed(3));
        root.style.setProperty('--glare-opacity',    (cfg.glareIntensity / 100).toFixed(3));
        root.style.setProperty('--grid-opacity',     (cfg.gridOpacity / 100).toFixed(3));

        // ── Glass Blur & Chroma ──
        root.style.setProperty('--glass-blur',   `${cfg.glassBlur}px`);
        root.style.setProperty('--chroma-shift', `${(cfg.chromaShift / 5).toFixed(1)}px`);

        // ── Dynamic accent glow tokens (used by navbar.css, settings.css, background.css) ──
        // These scale proportionally with glow intensity so ALL shared components react.
        root.style.setProperty('--accent-glow-subtle',  `rgba(var(--accent-rgb), ${(0.08 * glowFactor).toFixed(3)})`);
        root.style.setProperty('--accent-glow-soft',    `rgba(var(--accent-rgb), ${(0.20 * glowFactor).toFixed(3)})`);
        root.style.setProperty('--accent-glow-mid',     `rgba(var(--accent-rgb), ${(0.40 * glowFactor).toFixed(3)})`);
        root.style.setProperty('--accent-glow-strong',  `rgba(var(--accent-rgb), ${(0.70 * glowFactor).toFixed(3)})`);
        root.style.setProperty('--border-glow',         `rgba(var(--accent-rgb), ${(0.35 * glowFactor).toFixed(3)})`);

        // ── Scanline color token (used by background.css) ──
        root.style.setProperty('--scanline-color', `rgba(0, 0, 0, ${(0.15 * (cfg.scanlineIntensity / 100)).toFixed(3)})`);

        // ── Theme class application ──
        const themeClasses = [
            'theme-frontier', 'theme-obsidian', 'theme-ghost', 'theme-nordic',
            'theme-synth',    'theme-royal',    'theme-emerald','theme-crimson',
            'theme-solar',    'theme-stealth'
        ];
        document.body.classList.remove(...themeClasses);
        document.body.classList.add(`theme-${cfg.theme || 'frontier'}`);

        // ── Chroma distortion body class ──
        document.body.classList.toggle('chroma-distort', cfg.chromaShift > 0);

        // ── Delegate to Map-specific 3D sync engine if available ──
        if (typeof window.updateVisualSettings === 'function') {
            window.updateVisualSettings();
        }
    };

    // ── SAVE + SYNC (single call after any CONFIG change) ─────────────────────
    window.saveAndSyncVisuals = function () {
        window.saveConfig();
        window.applyGlobalVisuals();
    };

    // ── CROSS-TAB SYNC ────────────────────────────────────────────────────────
    window.addEventListener('storage', function (e) {
        if (e.key === STORAGE_KEY && e.newValue) {
            try {
                window.CONFIG = Object.assign({}, DEFAULT_CONFIG, JSON.parse(e.newValue));
                window.applyGlobalVisuals();
            } catch (_) {}
        }
    });

    // ── BOOT ──────────────────────────────────────────────────────────────────
    loadConfig();

    // Apply immediately (before DOMContentLoaded) to prevent flash of unstyled glow
    window.applyGlobalVisuals();

    // Re-apply after DOM is ready to ensure body classes are set correctly
    document.addEventListener('DOMContentLoaded', function () {
        window.applyGlobalVisuals();
    });

})();
