// map_ui.js - Sidebar, Bottom Bar, Visual Boost, and UI Logic

window.updateSidebarForSelection = updateSidebarForSelection;
window.initBottomBar = initBottomBar;
window.toggleGlobeDesign = toggleGlobeDesign;
window.activateMapMode = activateMapMode;
window.checkGlobalSearchVisibility = checkGlobalSearchVisibility;
window.initNavCollapsing = initNavCollapsing;
window.applyVisualBoostState = applyVisualBoostState;
window.initCardCollapsibility = initCardCollapsibility;

function updateSidebarForSelection() {
    const nodeId = window.selectedNodeId;
    const globalData = window.DEFAULT_GLOBAL_METRICS;
    if (!globalData) return;

    const selectedNode = (window.NODE_DATA || []).find(n => n.id === nodeId);
    const data = (nodeId && selectedNode) ? selectedNode : null;
    const baseData = data || globalData;

    const overviewHeader = document.querySelector('.widget-overview .sidebar-toggle-label');
    const scanHeader = document.querySelector('.widget-network-scan .sidebar-toggle-label');
    if (overviewHeader) overviewHeader.textContent = data ? `NODE ${nodeId} INTEL` : 'AUDIT OVERVIEW';
    if (scanHeader) scanHeader.textContent = data ? `NODE ${nodeId} FEED` : 'NETWORK SCAN';

    if (typeof setText === 'function') {
        setText('stat-active-audits', data ? data.audits : globalData.activeAudits);
        setText('stat-net-integrity', data ? data.integrity : globalData.netIntegrity);
        setText('stat-active-threats', (data ? data.threats : globalData.activeThreats) + ' ');
        setText('stat-sector-status', data ? data.status : globalData.sectorStatus);
        setText('stat-latency', data ? data.latency : globalData.latency);
        setText('stat-data-flow', data ? data.flow : globalData.dataFlow);
    }

    const analysis = baseData.analysis;
    if (analysis) {
        const banner = document.getElementById('sel-alert-banner');
        const alertText = document.getElementById('sel-alert-text');
        if (banner) banner.className = 'alert-banner ' + analysis.alertClass;
        if (alertText) alertText.textContent = analysis.alert;

        const nodeName = document.getElementById('sel-node-name');
        if (nodeName) nodeName.textContent = data ? `Node ${nodeId}` : 'Sector G';

        const breachType = document.getElementById('sel-breach-type');
        if (breachType) breachType.textContent = analysis.breach;

        const nodeStatus = document.getElementById('sel-node-status');
        if (nodeStatus) {
            nodeStatus.textContent = analysis.status;
            nodeStatus.className = analysis.statusClass;
        }
    }

    const threat = baseData.threatProfile;
    if (threat && typeof setText === 'function') {
        setText('threat-title', threat.title);
        setText('threat-type', threat.type);
        setText('threat-source', threat.source);
    }

    const metrics = data ? data.metrics : { activeNodes: globalData.activeNodes, systemLoad: globalData.systemLoad };
    if (metrics && typeof setText === 'function') {
        setText('metric-active-nodes', metrics.activeNodes);
        setText('metric-system-load', metrics.systemLoad);
    }
}

function initBottomBar() {
    const tabGroup = document.getElementById('bottom-tab-group');
    if (tabGroup) {
        tabGroup.addEventListener('click', (e) => {
            const tab = e.target.closest('.nav-tab');
            if (!tab) return;
            tabGroup.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (typeof activateMapMode === 'function') activateMapMode(tab.dataset.tab);
        });
    }

    // Atmosphere Toggle
    const btnAtmosphere = document.getElementById('btn-atmosphere');
    if (btnAtmosphere) {
        btnAtmosphere.addEventListener('click', () => {
            const isActive = btnAtmosphere.classList.toggle('active');
            if (window._mapGlobeMat) {
                const isBoosted = window._isVisualBoostActive;
                window._mapGlobeMat.emissiveIntensity = isActive ? (isBoosted ? 0.9 : 0.6) : 0.0;
            }
            if (window._mapAtmosphere) {
                window._mapAtmosphere[0].visible = isActive;
                window._mapAtmosphere[1].visible = isActive;
            }
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        });
    }

    // Sunlight Toggle
    const btnSpotlight = document.getElementById('btn-spotlight');
    if (btnSpotlight) {
        btnSpotlight.addEventListener('click', () => {
            const isActive = btnSpotlight.classList.toggle('active');
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
    }

    // Satellite Speed
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
            if (typeof mapSliderToZ === 'function') {
                window._mapTargetCameraZ = mapSliderToZ(parseFloat(e.target.value));
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

    // UI Minimize
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
            if (zSlider && typeof mapZToSlider === 'function') zSlider.value = mapZToSlider(targetZ);
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

    // Design Toggle
    document.getElementById('btn-globe-design')?.addEventListener('click', () => {
        if (typeof toggleGlobeDesign === 'function') toggleGlobeDesign();
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
    });

    // Map Mode Toggle (Satellite / Map)
    document.getElementById('btn-map-mode-toggle')?.addEventListener('click', () => {
        if (typeof window.toggleGlobeMapView === 'function') {
            window.toggleGlobeMapView();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        }
    });

    // Theme Toggle (Light / Dark)
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
        if (typeof window.toggleGlobeTheme === 'function') {
            window.toggleGlobeTheme();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        }
    });

    document.getElementById('btn-view-logs')?.addEventListener('click', () => {
        if (typeof populateLogsModal === 'function') populateLogsModal();
        document.getElementById('modal-audit-logs')?.classList.add('open');
        if (window.lucide) lucide.createIcons();
    });
    document.getElementById('btn-view-info')?.addEventListener('click', () => {
        if (typeof populateInfoModal === 'function') populateInfoModal();
        document.getElementById('modal-system-info')?.classList.add('open');
        if (window.lucide) lucide.createIcons();
        window._infoModalInterval = setInterval(() => {
            if (typeof populateInfoModal === 'function') populateInfoModal();
        }, 1500);
    });

    // Subscribed Actions for New Operations (Moved to map_ops.js/map_modals.js)
    document.getElementById('btn-deep-scan')?.addEventListener('click', () => {
        if (typeof runDeepScan === 'function') runDeepScan();
    });

    document.getElementById('btn-history')?.addEventListener('click', () => {
        if (typeof populateAuditLogHistoryList === 'function') populateAuditLogHistoryList();
        document.getElementById('modal-audit-logs')?.classList.add('open');
        if (window.lucide) lucide.createIcons();
        if (window.playSound) window.playSound('UI_CLICK');
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
        if (typeof triggerLockdown === 'function') triggerLockdown();
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

    // Distance Metrics Popup Toggle
    const metricTrigger = document.getElementById('trigger-actual-metrics');
    const metricPopup = document.getElementById('metrics-popup');
    if (metricTrigger && metricPopup) {
        metricTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = metricPopup.classList.toggle('active');
            metricTrigger.classList.toggle('active', isActive);
            if (isActive && window.lucide) {
                window.lucide.createIcons({ scope: metricPopup });
            }
        });

        document.addEventListener('click', (e) => {
            if (metricPopup.classList.contains('active') && !metricPopup.contains(e.target) && !metricTrigger.contains(e.target)) {
                metricPopup.classList.remove('active');
                metricTrigger.classList.remove('active');
            }
        });
    }

    // Holographic Info Panel Toggle
    const intelTrigger = document.getElementById('trigger-intel-panel');
    const intelDropUp = document.getElementById('intel-drop-up');
    if (intelTrigger && intelDropUp) {
        intelTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = intelDropUp.classList.toggle('active');
            intelTrigger.classList.toggle('active', isActive);
            if (isActive && window.lucide) {
                window.lucide.createIcons({ scope: intelDropUp });
            }
        });
        document.addEventListener('click', (e) => {
            if (intelDropUp.classList.contains('active') && !intelDropUp.contains(e.target) && !intelTrigger.contains(e.target)) {
                intelDropUp.classList.remove('active');
                intelTrigger.classList.remove('active');
            }
        });
    }
}

function toggleGlobeDesign() {
    const isHF = window._mapGlobeDesign === 'high-fidelity';
    window._mapGlobeDesign = isHF ? 'wireframe' : 'high-fidelity';

    const btn = document.getElementById('btn-globe-design');
    if (btn) {
        btn.classList.toggle('active', !isHF);
        const icon = btn.querySelector('i') || btn.querySelector('svg');
        if (icon) {
            icon.setAttribute('data-lucide', isHF ? 'monitor' : 'globe');
            if (window.lucide) lucide.createIcons();
        }
    }

    const hfGlobe = window._mapGlobeHF;
    const wireframeGlobe = window._mapGlobeWireframe;
    const cloudMesh = window._mapCloudMesh;
    const atmosphere = window._mapAtmosphere;
    const globeGlow = window._mapGlobeGlow;

    if (window._mapGlobeDesign === 'wireframe') {
        if (hfGlobe) hfGlobe.visible = false;
        if (wireframeGlobe) wireframeGlobe.visible = true;
        if (cloudMesh) cloudMesh.visible = false;
        if (atmosphere) atmosphere.forEach(m => m.visible = false);
        if (globeGlow) {
            globeGlow.visible = true;
            globeGlow.material.color.setHex(0x00f0ff);
            globeGlow.material.opacity = 0.4;
        }
        if (window._mapSunLight) window._mapSunLight.visible = false;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = 0.8;
    } else {
        if (hfGlobe) hfGlobe.visible = true;
        if (wireframeGlobe) wireframeGlobe.visible = false;
        const cloudToggle = document.getElementById('tg-cloud-map');
        if (cloudMesh) cloudMesh.visible = cloudToggle ? cloudToggle.checked : true;
        const atmToggle = document.getElementById('btn-atmosphere');
        const atmActive = atmToggle ? atmToggle.classList.contains('active') : true;
        if (atmosphere) atmosphere.forEach(m => m.visible = atmActive);
        
        if (globeGlow) {
            globeGlow.visible = true;
            globeGlow.material.color.setHex(0xffffff);
            globeGlow.material.opacity = 0.15;
        }
        const spotlightToggle = document.getElementById('btn-spotlight');
        const spotlightActive = spotlightToggle ? spotlightToggle.classList.contains('active') : true;
        if (window._mapSunLight) window._mapSunLight.visible = spotlightActive;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = spotlightActive ? 0.25 : 1.25;
    }
}

function activateMapMode(mode) {
    const globe = window._mapGlobe;
    const breachCallout = document.getElementById('breach-callout');
    if (window._mapScanInterval) { clearInterval(window._mapScanInterval); window._mapScanInterval = null; }
    window._mapTabState = mode;
    if (mode !== 'threat') document.getElementById('panel-threat-action')?.classList.add('hidden');

    switch (mode) {
        case 'monitoring':
            if (globe && typeof gsap_like_rotate === 'function') gsap_like_rotate(globe.globeGroup, 1.6, 900);
            if (breachCallout && !window._threatQuarantined) breachCallout.classList.add('hidden');
            break;
        case 'sector-g':
            if (globe && typeof gsap_like_rotate === 'function') gsap_like_rotate(globe.globeGroup, 1.8, 1000);
            if (breachCallout && !window._threatQuarantined) breachCallout.classList.remove('hidden');
            break;
        case 'scan':
            if (globe) {
                const start = Date.now();
                window._mapScanInterval = setInterval(() => {
                    const elapsed = Date.now() - start;
                    globe.globeGroup.rotation.y -= 0.018;
                    if (elapsed > 4000) {
                        clearInterval(window._mapScanInterval);
                        window._mapScanInterval = null;
                        if (typeof gsap_like_rotate === 'function') gsap_like_rotate(globe.globeGroup, globe.globeGroup.rotation.y % (2 * Math.PI), 600);
                    }
                }, 16);
            }
            break;
        case 'threat':
            if (globe && typeof gsap_like_rotate === 'function') gsap_like_rotate(globe.globeGroup, 1.0, 800);
            if (breachCallout && !window._threatQuarantined) breachCallout.classList.remove('hidden');
            const panel = document.getElementById('panel-threat-action');
            if (panel && !window._threatQuarantined) panel.classList.remove('hidden');
            break;
    }
}

function checkGlobalSearchVisibility() {
    const searchContainer = document.getElementById('global-search-container');
    const allCategories = document.querySelectorAll('.navbar-category');
    const allSeparators = document.querySelectorAll('.nav-separator');

    if (searchContainer) {
        if (window._manualSearchToggle) {
            searchContainer.classList.add('active');
            allCategories.forEach(cat => {
                const catId = cat.getAttribute('data-cat');
                if (catId !== 'sys-ui' && catId !== 'search-settings') cat.classList.add('hidden');
                else cat.classList.remove('hidden');
            });
            allSeparators.forEach(sep => {
                if (sep.id === 'search-cfg-separator') sep.classList.remove('hidden');
                else sep.classList.add('hidden');
            });
            document.getElementById('btn-ui-toggle')?.classList.add('hidden');
        } else {
            searchContainer.classList.remove('active');
            allCategories.forEach(cat => {
                if (cat.getAttribute('data-cat') !== 'search-settings') cat.classList.remove('hidden');
                else cat.classList.add('hidden');
            });
            allSeparators.forEach(sep => {
                if (sep.id === 'search-cfg-separator') sep.classList.add('hidden');
                else sep.classList.remove('hidden');
            });
            document.getElementById('btn-ui-toggle')?.classList.remove('hidden');
        }

        // Always sync the info panel to match the search visibility
        if (window.updateInfoPanel) window.updateInfoPanel(null, null, null);
    }
}

window.toggleSectionCollapse = function(catId) {
    const section = document.querySelector(`.navbar-category[data-cat="${catId}"]`);
    if (!section) return;
    section.classList.toggle('section-collapsed');
    const isClosing = section.classList.contains('section-collapsed');
    if (catId === 'sys-ui') {
        document.querySelectorAll('.navbar-category').forEach(cat => {
            const thisCatId = cat.getAttribute('data-cat');
            if (thisCatId !== 'sys-ui') {
                if (isClosing) cat.classList.add('section-collapsed');
                else if (thisCatId !== 'map-modes') cat.classList.remove('section-collapsed');
            }
        });
    }
    checkGlobalSearchVisibility();
    if (window.playSound) window.playSound('UI_GENERIC_TAP');
};

function initNavCollapsing() {
    const categories = document.querySelectorAll('.navbar-category');
    const masterBtn = document.getElementById('btn-nav-toggle-all');
    if (masterBtn) masterBtn.onclick = (e) => { e.stopPropagation(); window._manualSearchToggle = !window._manualSearchToggle; checkGlobalSearchVisibility(); };
    categories.forEach(cat => {
        cat.addEventListener('click', (e) => {
            if (e.target.closest('.icon-btn, .nav-tab, input, button, a')) return;
            window.toggleSectionCollapse(cat.getAttribute('data-cat'));
        });
    });
    checkGlobalSearchVisibility();
}

window.applyVisualBoostState = function() {
    const atmActive = document.getElementById('btn-atmosphere')?.classList.contains('active') ?? true;
    
    if (!window._isVisualBoostActive) {
        document.body.classList.remove('visual-boost-hf', 'visual-boost-wire');
        if (window._mapSunLight) window._mapSunLight.intensity = 0.8;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = window._mapGlobeDesign === 'wireframe' ? 0.8 : 0.25;
        if (window._mapGlobeMat) window._mapGlobeMat.emissiveIntensity = atmActive ? 0.6 : 0.0;
        if (window._mapGlobeWireframe) window._mapGlobeWireframe.material.opacity = 0.35;
        if (window._mapGlobeGlow) window._mapGlobeGlow.material.opacity = window._mapGlobeDesign === 'wireframe' ? 0.4 : 0.15;
        return;
    }
    const isHF = window._mapGlobeDesign === 'high-fidelity';
    document.body.classList.toggle('visual-boost-hf', isHF);
    document.body.classList.toggle('visual-boost-wire', !isHF);
    if (isHF) {
        if (window._mapSunLight) window._mapSunLight.intensity = 1.35;
        if (window._mapGlobeMat) window._mapGlobeMat.emissiveIntensity = atmActive ? 0.9 : 0.0;
    } else {
        if (window._mapGlobeWireframe) window._mapGlobeWireframe.material.opacity = 0.8;
        if (window._mapGlobeGlow) window._mapGlobeGlow.material.opacity = 0.7;
    }
};

function initCardCollapsibility() {
    // Shared between sidebar widgets
    document.querySelectorAll('.widget-header').forEach(header => {
        header.addEventListener('click', () => {
            const widget = header.closest('.holo-widget');
            if (widget) widget.classList.toggle('collapsed');
        });
    });
}
