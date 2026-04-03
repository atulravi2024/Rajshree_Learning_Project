/**
 * nav_front.js - Logic for Front Side (Project Analysis, Reports, Critical info).
 * Handles: Sys UI, Visual Protocol, Data Feed, Nav Control, Sys Ops.
 */

function initNavFront() {
    const tabGroup = document.getElementById('bottom-tab-group');
    if (tabGroup) {
        tabGroup.addEventListener('click', (e) => {
            const tab = e.target.closest('.nav-tab');
            if (!tab) return;
            tabGroup.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Map modes (Front side info states)
            if (window.activateMapMode) window.activateMapMode(tab.dataset.tab);
        });
    }

    // --- BUTTON EVENT LISTENERS (FRONT SIDE) ---
    // Atmosphere
    document.getElementById('btn-atmosphere')?.addEventListener('click', (e) => {
        const isActive = e.currentTarget.classList.toggle('active');
        if (window._mapGlobeMat) {
            const isBoosted = window._isVisualBoostActive;
            window._mapGlobeMat.emissiveIntensity = isActive ? (isBoosted ? 0.9 : 0.6) : 0.0;
        }
        if (window._mapAtmosphere) {
            window._mapAtmosphere.forEach(m => m.visible = isActive);
        }
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
    });

    // Sunlight
    document.getElementById('btn-spotlight')?.addEventListener('click', (e) => {
        const isActive = e.currentTarget.classList.toggle('active');
        if (window._mapSunLight) window._mapSunLight.visible = isActive;
        if (window._mapAmbientLight) {
            if (isActive) {
                window._mapAmbientLight.color.setHex(0x223344);
                window._mapAmbientLight.intensity = 0.5;
            } else {
                window._mapAmbientLight.color.setHex(0xffffff);
                window._mapAmbientLight.intensity = 1.25;
            }
        }
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
    });

    // Satellite Speed Slider
    const satSpeedSlider = document.getElementById('sat-speed-slider');
    if (satSpeedSlider) {
        satSpeedSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            window._satSpeedMultiplier = val;
            
            if (window.controls) {
                window.controls.autoRotate = val > 0;
                window.controls.autoRotateSpeed = 0.5 * val;
            }
        });
    }

    // Zoom Slider
    const zoomSlider = document.getElementById('globe-zoom-slider');
    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            if (window.mapSliderToZ) {
                window._mapTargetCameraZ = window.mapSliderToZ(parseFloat(e.target.value));
            }
        });

        const zoomSliderWrapper = document.querySelector('.zoom-control-wrap');
        if (zoomSliderWrapper) {
            zoomSliderWrapper.addEventListener('click', (e) => {
                if (e.target.closest('#btn-zoom-in-icon')) {
                    let val = parseFloat(zoomSlider.value);
                    val = Math.min(100, val + 15);
                    zoomSlider.value = val;
                    zoomSlider.dispatchEvent(new Event('input'));
                } else if (e.target.closest('#btn-zoom-out-icon')) {
                    let val = parseFloat(zoomSlider.value);
                    val = Math.max(0, val - 15);
                    zoomSlider.value = val;
                    zoomSlider.dispatchEvent(new Event('input'));
                }
            });
        }
    }

    // UI View Toggle (Manual Toggle is in Master)
    const uiToggleBtn = document.getElementById('btn-ui-toggle');
    if (uiToggleBtn) {
        uiToggleBtn.addEventListener('click', () => {
            const isMinimized = document.body.classList.toggle('ui-minimized');
            const icon = uiToggleBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', isMinimized ? 'eye-off' : 'eye');
                if (window.lucide) lucide.createIcons();
            }
            const zSlider = document.getElementById('globe-zoom-slider');
            const targetZ = isMinimized ? 150 : 250;
            window._mapTargetCameraZ = targetZ;
            if (zSlider && window.mapZToSlider) zSlider.value = window.mapZToSlider(targetZ);
            setTimeout(() => window.dispatchEvent(new Event('resize')), 520);
        });
    }

    // Visual Boost
    const visualBoostBtn = document.getElementById('btn-visual-boost');
    if (visualBoostBtn) {
        visualBoostBtn.addEventListener('click', () => {
            window._isVisualBoostActive = !window._isVisualBoostActive;
            visualBoostBtn.classList.toggle('active', window._isVisualBoostActive);
            if (typeof window.applyVisualBoostState === 'function') window.applyVisualBoostState();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        });
    }

    // Globe Design Toggle
    document.getElementById('btn-globe-design')?.addEventListener('click', () => {
        if (window.toggleGlobeDesign) window.toggleGlobeDesign();
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
    });

    // Map Mode Toggle (Satellite / Map)
    document.getElementById('btn-map-mode-toggle')?.addEventListener('click', () => {
        if (typeof window.toggleGlobeMapView === 'function') {
            window.toggleGlobeMapView();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        }
    });

    // Theme (Light/Dark)
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
        if (window.toggleGlobeTheme) window.toggleGlobeTheme();
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
    });

    // Logs & Info
    document.getElementById('btn-view-logs')?.addEventListener('click', () => {
        if (window.populateLogsModal) {
            window.populateLogsModal();
            document.getElementById('modal-audit-logs')?.classList.add('open');
            if (window.lucide) lucide.createIcons();
        }
    });

    document.getElementById('btn-view-info')?.addEventListener('click', () => {
        if (window.populateInfoModal) {
            window.populateInfoModal();
            document.getElementById('modal-system-info')?.classList.add('open');
            if (window.lucide) lucide.createIcons();
            window._infoModalInterval = setInterval(window.populateInfoModal, 1500);
        }
    });

    // --- DEAD BUTTONS IMPLEMENTATION ---
    document.getElementById('btn-deep-scan')?.addEventListener('click', () => {
        if (window.runDeepScan) window.runDeepScan();
    });


    document.getElementById('btn-export')?.addEventListener('click', () => {
        const data = JSON.stringify(window.DEFAULT_GLOBAL_METRICS || {}, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audit_report_' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
        a.click();
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
    });

    document.getElementById('btn-lockdown')?.addEventListener('click', () => {
        if (window.triggerLockdown) window.triggerLockdown();
    });

    // Category Collapsing (Sub-logic of UI Toggle)
    document.querySelectorAll('.navbar-category').forEach(cat => {
        cat.addEventListener('click', (e) => {
            if (!e.target.closest('.icon-btn, .nav-tab, input, button, a')) {
                if (window.toggleSectionCollapse) window.toggleSectionCollapse(cat.getAttribute('data-cat'));
            }
        });
    });

    // Modal Close Logic
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.hud-modal-close')) {
            const modal = e.target.closest('.hud-modal');
            if (modal) modal.classList.remove('open');
            if (e.target.id === 'close-info-modal' && window._infoModalInterval) {
                clearInterval(window._infoModalInterval);
                window._infoModalInterval = null;
            }
        }
    });
}

// Ensure global functions are available
window.initNavFront = initNavFront;
