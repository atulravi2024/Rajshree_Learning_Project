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
            if (window._isLockedDown) return;
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
        // Remove any existing listener to be safe (though we already cleaned nav_front.js)
        uiToggleBtn.onclick = null; 
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
            if (zSlider && typeof window.mapZToSlider === 'function') zSlider.value = window.mapZToSlider(targetZ);
            setTimeout(() => window.dispatchEvent(new Event('resize')), 520);
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
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
        if (window._isLockedDown) return;
        
        // CHECK MODE: Only allow export in Audit Mode (Front Side)
        if (window._manualSearchToggle) {
            console.warn('EXPORT_ABORTED: System is in Search Mode.');
            if (window.showNotification) {
                window.showNotification('SYSTEM_MODE_CONFLICT', 'Export is only available in Audit Mode.', 'warning');
            } else {
                alert('Export is only available in Audit Mode.');
            }
            return;
        }

        // AGGREGATE COMPREHENSIVE DATA
        const reportData = {
            metadata: {
                reportType: 'FRONT_AUDIT_INTEL',
                timestamp: new Date().toISOString(),
                auditor: window.CONFIG ? window.CONFIG.auditorName : 'ATUL VERMA',
                credentialLevel: window.CREDENTIAL_LEVEL || 'LEAD AUDITOR',
                mode: window._mapTabState || 'default'
            },
            globalMetrics: window.DEFAULT_GLOBAL_METRICS || {},
            systemMetrics: (window.SYSTEM_METRICS || []).map(m => ({
                label: m.label,
                value: typeof m.value === 'function' ? m.value() : m.value,
                status: (typeof m.status === 'function') ? m.status() : (typeof m.status === 'string' ? m.status : 'nominal')
            })),
            nodeStates: (window.NODE_DATA || []).map(n => ({...n})),
            compliance: window.COMPLIANCE_DATA || [],
            resources: window.RESOURCE_DATA || [],
            auditTrail: window.AUDIT_LOG_HISTORY || [],
            adminActivity: window.ADMIN_ACTIVITY || [],
            userSessions: window.SESSION_DATA || [],
            hardware: (window.HARDWARE_METRICS || []).map(m => {
                const val = Math.min(100, Math.max(10, m.base + Math.floor(Math.random() * m.variance * 2) - m.variance));
                return { label: m.label, currentTemp: val + '°C' };
            }),
            latencyNodes: window.LATENCY_MATRIX_DATA || [],
            integritySeals: window.INTEGRITY_SEAL_DATA || [],
            incidents: window.INCIDENT_DATA || [],
            backups: window.BACKUP_DATA || [],
            threatVectors: window.THREAT_VECTOR_DATA || [],
            quarantine: window.QUARANTINE_DATA || [],
            uptime: window.UPTIME_DATA || [],
            memoryMatrix: window.MEMORY_MATRIX_DATA || []
        };

        const jsonStr = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ts = new Date().toISOString().slice(0, 19).replace(/T/g, '_').replace(/:/g, '-');
        a.download = `audit_report_frontier_${ts}.json`;
        a.click();
        
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
        console.log('AUDIT_REPORT_EXPORTED: Successfully compiled all real-time datasets.');
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
            globeGlow.material.opacity = 0.25; // "Good enough" default
            globeGlow.scale.set(245, 245, 1);
            globeGlow.material.needsUpdate = true;
        }
        if (window._mapGridMat) {
            window._mapGridMat.opacity = 0.35; // Sharp but thin
            window._mapGridMat.needsUpdate = true;
        }
        if (window._mapSunLight) window._mapSunLight.visible = false;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = 0.35; // Lower default light
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
            globeGlow.material.opacity = 0.12; // Very subtle HF glow
            globeGlow.scale.set(240, 240, 1);
            globeGlow.material.needsUpdate = true;
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
    // Defer to the more robust nav_master.js logic if available
    if (typeof window.updateNavModeVisibility === 'function') {
        window.updateNavModeVisibility();
    } else {
        // Fallback (minimal version)
        const searchContainer = document.getElementById('global-search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('active', !!window._manualSearchToggle);
        }
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
    // REMOVED redundant btn-nav-toggle-all onclick assignment. 
    // It is now handled exclusively in nav_master.js to avoid overwriting robust logic.
    categories.forEach(cat => {
        cat.addEventListener('click', (e) => {
            if (e.target.closest('.icon-btn, .nav-tab, input, button, a')) return;
            window.toggleSectionCollapse(cat.getAttribute('data-cat'));
        });
    });
    checkGlobalSearchVisibility();
}

function applyVisualBoostState() {
    const isBoosted = window._isVisualBoostActive;
    const isHF = window._mapGlobeDesign === 'high-fidelity';
    const isDark = window._mapThemeMode === 'dark';
    const atmActive = document.getElementById('btn-atmosphere')?.classList.contains('active') ?? true;
    
    // Update body classes for CSS filters (map_effects.css)
    document.body.classList.toggle('visual-boost-hf', isBoosted && isHF);
    document.body.classList.toggle('visual-boost-wire', isBoosted && !isHF);

    if (!isBoosted) {
        // RESET TO DEFAULTS (The "Good Enough" default state)
        if (window._mapSunLight) window._mapSunLight.intensity = 0.8;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = (!isHF) ? 0.35 : 0.25;
        if (window._mapGlobeMat) {
            window._mapGlobeMat.emissiveIntensity = atmActive ? (isDark ? 0.7 : 0.1) : 0.0;
            window._mapGlobeMat.shininess = isHF ? 25 : 5;
            window._mapGlobeMat.bumpScale = isHF ? 0.4 : 0.0;
            window._mapGlobeMat.needsUpdate = true;
        }
        if (window._mapGridMat) {
            window._mapGridMat.opacity = 0.35;
            window._mapGridMat.needsUpdate = true;
        }
        if (window._mapBorderMat) {
            window._mapBorderMat.opacity = 0.35;
            window._mapBorderMat.needsUpdate = true;
        }
        if (window._mapGlobeGlow) {
            window._mapGlobeGlow.material.opacity = (!isHF) ? 0.25 : 0.12;
            window._mapGlobeGlow.material.color.setHex(isHF ? 0xffffff : 0x00f0ff);
            window._mapGlobeGlow.scale.set((!isHF) ? 245 : 240, (!isHF) ? 245 : 240, 1);
            window._mapGlobeGlow.material.needsUpdate = true;
        }
        return;
    }

    // APPLY DYNAMIC BOOST
    if (isHF) {
        // High-Fidelity Boost (Satellite/Map)
        if (window._mapSunLight) window._mapSunLight.intensity = 1.45; 
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = 0.15; 
        
        if (window._mapGlobeMat) {
            window._mapGlobeMat.emissiveIntensity = atmActive ? (isDark ? 1.0 : 0.3) : 0.0;
            window._mapGlobeMat.shininess = 50; 
            window._mapGlobeMat.bumpScale = 0.75;
            window._mapGlobeMat.needsUpdate = true;
        }
        if (window._mapGlobeGlow) {
            window._mapGlobeGlow.material.opacity = 0.25;
            window._mapGlobeGlow.material.color.setHex(0xffffff);
            window._mapGlobeGlow.material.needsUpdate = true;
        }
    } else {
        // Wireframe Boost (The "Fine" Holographic Glow)
        // Ensure "finer" clarity rather than "too much light"
        if (window._mapSunLight) window._mapSunLight.intensity = 0.0; 
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = 0.25; // Lower ambient for deeper contrast
        
        if (window._mapGridMat) {
            window._mapGridMat.opacity = 0.65; // "Finer" boost, not overwhelming
            window._mapGridMat.color.setHex(0x00f0ff);
            window._mapGridMat.needsUpdate = true;
        }
        if (window._mapBorderMat) {
            window._mapBorderMat.opacity = 0.75;
            window._mapBorderMat.needsUpdate = true;
        }
        
        if (window._mapGlobeGlow) {
            window._mapGlobeGlow.material.opacity = 0.45; // Subtle aura
            window._mapGlobeGlow.material.color.setHex(0x00f0ff);
            window._mapGlobeGlow.scale.set(255, 255, 1); // Expand the aura for "fine depth"
            window._mapGlobeGlow.material.needsUpdate = true;
        }
    }
}


function initCardCollapsibility() {
    // Shared between sidebar widgets
    document.querySelectorAll('.widget-header').forEach(header => {
        header.addEventListener('click', () => {
            const widget = header.closest('.holo-widget');
            if (widget) widget.classList.toggle('collapsed');
        });
    });
}
