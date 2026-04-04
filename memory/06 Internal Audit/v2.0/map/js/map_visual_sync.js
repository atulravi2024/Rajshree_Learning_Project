/**
 * map_visual_sync.js - Centralized Visual Settings Synchronization Engine
 *
 * This module bridges the shared `window.CONFIG` settings object with the live
 * Three.js scene objects and CSS overlay layers. Call `window.updateVisualSettings()`
 * from anywhere after changing CONFIG to apply changes globally.
 *
 * Affected systems:
 *   - Globe: emissive intensity, globe glow sprite
 *   - Atmosphere: opacity of both atmosphere shells
 *   - Wireframe/Grid: opacity of grid material
 *   - CSS Layers: --neural-glow-opacity, --scanline-opacity, --glare-opacity, --grid-opacity
 *   - Satellite rings: material opacity scaling
 */

window.updateVisualSettings = function () {
    const cfg = window.CONFIG;
    if (!cfg) return;

    const root = document.documentElement;
    const glowFactor = cfg.glowIntensity / 100; // 0.0 – 1.0

    // ── 1. CSS OVERLAY LAYERS ──────────────────────────────────────
    // Map slider 0–100 → CSS intensity 0.0–1.5 (1.0 = default, max is 50% brighter)
    const glowIntensityCss = (glowFactor * 1.5).toFixed(3);
    root.style.setProperty('--glow-intensity', glowIntensityCss);
    root.style.setProperty('--neural-glow-opacity', glowFactor);
    root.style.setProperty('--scanline-opacity', (cfg.scanlineIntensity / 100) * 1.5);
    root.style.setProperty('--glare-opacity', cfg.glareIntensity / 100);
    root.style.setProperty('--grid-opacity', cfg.gridOpacity / 100);
    root.style.setProperty('--glass-blur', `${cfg.glassBlur}px`);
    root.style.setProperty('--chroma-shift', `${cfg.chromaShift / 5}px`);
    document.body.classList.toggle('chroma-distort', cfg.chromaShift > 0);

    // ── 2. GLOBE: EMISSIVE GLOW ────────────────────────────────────
    if (window._mapGlobeMat) {
        const isHF = window._mapGlobeDesign !== 'wireframe';
        const isDark = window._mapThemeMode === 'dark';
        const isBoosted = window._isVisualBoostActive;
        const atmActive = document.getElementById('btn-atmosphere')?.classList.contains('active') ?? true;

        if (atmActive) {
            // Base emissive from mode, then scale by glow slider
            const baseEmissive = isDark ? 0.7 : 0.1;
            const boostedEmissive = isDark ? 1.0 : 0.3;
            const targetBase = isBoosted ? boostedEmissive : baseEmissive;
            window._mapGlobeMat.emissiveIntensity = targetBase * glowFactor;
        }
        window._mapGlobeMat.needsUpdate = true;
    }

    // ── 3. GLOBE GLOW SPRITE ───────────────────────────────────────
    if (window._mapGlobeGlow) {
        const isHF = window._mapGlobeDesign !== 'wireframe';
        const isBoosted = window._isVisualBoostActive;
        const baseOpacity = isHF ? (isBoosted ? 0.25 : 0.12) : (isBoosted ? 0.45 : 0.25);
        window._mapGlobeGlow.material.opacity = baseOpacity * glowFactor;
        window._mapGlobeGlow.material.needsUpdate = true;
    }

    // ── 4. ATMOSPHERE SHELLS ───────────────────────────────────────
    if (window._mapAtmosphere) {
        const [atmo1, atmo2] = window._mapAtmosphere;
        if (atmo1 && atmo1.material) {
            atmo1.material.opacity = 0.25 * glowFactor;
            atmo1.material.needsUpdate = true;
        }
        if (atmo2 && atmo2.material) {
            atmo2.material.opacity = 0.10 * glowFactor;
            atmo2.material.needsUpdate = true;
        }
    }

    // ── 5. WIREFRAME GRID ─────────────────────────────────────────
    if (window._mapGridMat && window._mapGlobeDesign === 'wireframe') {
        const isBoosted = window._isVisualBoostActive;
        window._mapGridMat.opacity = (isBoosted ? 0.65 : 0.45) * glowFactor;
        window._mapGridMat.needsUpdate = true;
    }

    // ── 6. GEO-BORDERS LINES ──────────────────────────────────────
    if (window._mapBorderMat) {
        const isBoosted = window._isVisualBoostActive;
        window._mapBorderMat.opacity = (isBoosted ? 0.75 : 0.35) * glowFactor;
        window._mapBorderMat.needsUpdate = true;
    }

    // ── 7. ORBITAL SATELLITE RINGS ────────────────────────────────
    if (window._mapOrbitalGroup) {
        window._mapOrbitalGroup.children.forEach((child, idx) => {
            if (child.isMesh && child.material) {
                const baseOpacities = [0.6, 0.4, 0.2];
                const base = baseOpacities[idx] ?? 0.3;
                child.material.opacity = base * glowFactor;
                child.material.needsUpdate = true;
            }
        });
    }

    // ── 8. THEME APPLICATION ──────────────────────────────────────
    if (cfg.theme) {
        const themeClasses = [
            'theme-frontier', 'theme-obsidian', 'theme-ghost', 'theme-nordic',
            'theme-synth', 'theme-royal', 'theme-emerald', 'theme-crimson',
            'theme-solar', 'theme-stealth'
        ];
        document.body.classList.remove(...themeClasses);
        document.body.classList.add(`theme-${cfg.theme}`);
    }
};

/**
 * Syncs the orbital panel UI controls to the current CONFIG state.
 * Call this after opening a panel to ensure sliders/toggles reflect live state.
 */
window.syncOrbitalPanelUI = function () {
    const cfg = window.CONFIG;
    if (!cfg) return;

    const setSlider = (id, val, displayId, suffix = '') => {
        const el = document.getElementById(id);
        if (el) el.value = val;
        const disp = document.getElementById(displayId);
        if (disp) disp.textContent = val + suffix;
    };

    const setToggle = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = val;
    };

    const setInput = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    // System Ops panel
    setSlider('sl-refresh-map', cfg.refreshRate, 'val-refresh-map', 's');
    setToggle('tg-sync-map', cfg.autoSync);

    // Visual Protocol panel
    setSlider('sl-glow-map', cfg.glowIntensity, 'val-glow-map', '%');
    setSlider('sl-scan-map', cfg.scanlineIntensity, 'val-scan-map', '%');
    setSlider('sl-glare-map', cfg.glareIntensity, 'val-glare-map', '%');
    setToggle('tg-grid-map', cfg.gridOpacity > 0);
    setToggle('tg-cloud-map', window._mapCloudMesh ? window._mapCloudMesh.visible : true);

    // User Gateway
    setInput('in-auditor-map', cfg.auditorName || 'ATUL VERMA');

    // Neural Audio
    setSlider('sl-vol-map', cfg.masterVolume, 'val-vol-map', '%');
    setToggle('tg-bleeps-map', cfg.feedbackBleeps);

    // Security Guardrails
    setToggle('tg-mask-map', cfg.dataMasking);
    setToggle('tg-lock-map', cfg.protocolLock);
};
