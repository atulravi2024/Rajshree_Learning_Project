// map_ui.js - Sidebar, Bottom Bar, Modals, and UI Logic

function updateSidebarForSelection() {
    const nodeId = window.selectedNodeId;
    const globalData = window.DEFAULT_GLOBAL_METRICS;
    const selectedNode = (window.NODE_DATA || []).find(n => n.id === nodeId);
    const data = (nodeId && selectedNode) ? selectedNode : null;
    const baseData = data || globalData;

    const overviewHeader = document.querySelector('.widget-overview .sidebar-toggle-label');
    const scanHeader = document.querySelector('.widget-network-scan .sidebar-toggle-label');
    if (overviewHeader) overviewHeader.textContent = data ? `NODE ${nodeId} INTEL` : 'AUDIT OVERVIEW';
    if (scanHeader) scanHeader.textContent = data ? `NODE ${nodeId} FEED` : 'NETWORK SCAN';

    setText('stat-active-audits', data ? data.audits : globalData.activeAudits);
    setText('stat-net-integrity', data ? data.integrity : globalData.netIntegrity);
    setText('stat-active-threats', (data ? data.threats : globalData.activeThreats) + ' ');
    setText('stat-sector-status', data ? data.status : globalData.sectorStatus);
    setText('stat-latency', data ? data.latency : globalData.latency);
    setText('stat-data-flow', data ? data.flow : globalData.dataFlow);

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
    if (threat) {
        setText('threat-title', threat.title);
        setText('threat-type', threat.type);
        setText('threat-source', threat.source);
    }

    const metrics = data ? data.metrics : { activeNodes: globalData.activeNodes, systemLoad: globalData.systemLoad };
    if (metrics) {
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
            activateMapMode(tab.dataset.tab);
        });
    }

    // Atmosphere Toggle
    const btnAtmosphere = document.getElementById('btn-atmosphere');
    if (btnAtmosphere) {
        btnAtmosphere.addEventListener('click', () => {
            const isActive = btnAtmosphere.classList.toggle('active');
            if (window._mapGlobeMat) {
                window._mapGlobeMat.emissiveIntensity = isActive ? 0.6 : 0.0;
            }
            if (window._mapAtmosphere) {
                window._mapAtmosphere[0].visible = isActive;
                window._mapAtmosphere[1].visible = isActive;
            }
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
        });
    }

    // Satellite Speed
    const satSpeedSlider = document.getElementById('sat-speed-slider');
    if (satSpeedSlider) {
        satSpeedSlider.addEventListener('input', (e) => {
            window._satSpeedMultiplier = parseFloat(e.target.value);
        });
    }

    // Zoom Slider
    const zoomSlider = document.getElementById('globe-zoom-slider');
    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            window._mapTargetCameraZ = mapSliderToZ(parseFloat(e.target.value));
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
                lucide.createIcons();
            }
            const zSlider = document.getElementById('globe-zoom-slider');
            const targetZ = isMinimized ? 150 : 250;
            window._mapTargetCameraZ = targetZ;
            if (zSlider) zSlider.value = mapZToSlider(targetZ);
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
        });
    }

    // Design Toggle
    document.getElementById('btn-globe-design')?.addEventListener('click', toggleGlobeDesign);
    document.getElementById('btn-view-logs')?.addEventListener('click', () => {
        populateLogsModal();
        document.getElementById('modal-audit-logs')?.classList.add('open');
        lucide.createIcons();
    });
    document.getElementById('btn-view-info')?.addEventListener('click', () => {
        populateInfoModal();
        document.getElementById('modal-system-info')?.classList.add('open');
        lucide.createIcons();
        window._infoModalInterval = setInterval(populateInfoModal, 1500);
    });
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
        if (cloudMesh) cloudMesh.visible = true;
        if (globeGlow) {
            globeGlow.visible = true;
            globeGlow.material.color.setHex(0xffffff);
            globeGlow.material.opacity = 0.15;
        }
        if (window._mapSunLight) window._mapSunLight.visible = true;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = 0.25;
    }
}

// ── ORBITAL SETTINGS SYSTEM ──

function initOrbitalSystem(scene, camera, renderer) {
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);
    orbitalGroup.visible = false;
    window._mapOrbitalGroup = orbitalGroup;

    function createRingMesh(radius, tube, color, opacity) {
        const geo = new THREE.TorusGeometry(radius, tube, 2, 120);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending });
        return new THREE.Mesh(geo, mat);
    }

    const ring1 = createRingMesh(118, 0.5, 0x00f0ff, 0.6);
    orbitalGroup.add(ring1);
    const ring2 = createRingMesh(130, 0.4, 0xfacc15, 0.4);
    ring2.rotation.x = Math.PI / 6;
    ring2.rotation.z = Math.PI / 10;
    orbitalGroup.add(ring2);
    const ring3 = createRingMesh(143, 0.3, 0x00f0ff, 0.2);
    ring3.rotation.x = Math.PI / 3;
    ring3.rotation.y = Math.PI / 8;
    orbitalGroup.add(ring3);

    const SATELLITE_DEFS = [
        { id: 'system-ops',        label: 'SYSTEM OPS',        color: 0x00f0ff, icon: '⚙', angle: 0,               ring: ring1, radius: 118 },
        { id: 'visual-protocol',   label: 'VISUAL PROTOCOL',   color: 0xa78bfa, icon: '🖥', angle: Math.PI * 2/5,   ring: ring1, radius: 118 },
        { id: 'user-gateway',      label: 'USER GATEWAY',      color: 0x22c55e, icon: '👤', angle: Math.PI * 4/5,   ring: ring2, radius: 130 },
        { id: 'neural-audio',      label: 'NEURAL AUDIO',      color: 0xfacc15, icon: '🔊', angle: Math.PI * 6/5,   ring: ring2, radius: 130 },
        { id: 'security-guardrails',label: 'SECURITY GUARDRAILS',color: 0xff3e3e, icon: '🛡', angle: Math.PI * 8/5,   ring: ring3, radius: 143 },
    ];

    const satellites = [];
    const mapViewport = document.getElementById('threejs-container');

    SATELLITE_DEFS.forEach(def => {
        const sGeo = new THREE.SphereGeometry(3.5, 12, 12);
        const sMat = new THREE.MeshBasicMaterial({ color: def.color });
        const sMesh = new THREE.Mesh(sGeo, sMat);
        sMesh.userData = { satelliteId: def.id, def };
        const sSprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: createGlowTexture(def.color),
            color: def.color,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        }));
        sSprite.scale.set(30, 30, 1);
        sMesh.add(sSprite);
        orbitalGroup.add(sMesh);
        satellites.push({ mesh: sMesh, def, angle: def.angle });

        const el = document.createElement('div');
        el.className = 'sat-label';
        el.dataset.satId = def.id;
        el.innerHTML = `<span class="sat-icon">${def.icon}</span><span class="sat-text">${def.label}</span>`;
        el.style.display = 'none';
        mapViewport.appendChild(el);
        el.addEventListener('click', (e) => { e.stopPropagation(); openOrbitalPanel(def.id); });
    });

    window._mapSatellites = satellites;
    initOrbitalPanelListeners();

    setTimeout(() => {
        window.showSettingsMenu = function () { toggleOrbitalSettings(); };
    }, 0);
}

function updateOrbitalAnimation(now) {
    const mult = window._satSpeedMultiplier || 1.0;
    const rings = window._mapOrbitalGroup.children.filter(c => c.type === 'Mesh');
    if (rings.length >= 3) {
        rings[0].rotation.z += 0.002 * mult;
        rings[1].rotation.y -= 0.0015 * mult;
        rings[2].rotation.x += 0.001 * mult;
    }

    const camera = window._mapGlobe.camera;
    const renderer = window._mapGlobe.renderer;

    window._mapSatellites.forEach((sat, idx) => {
        sat.angle += (idx < 2 ? 0.005 : idx < 4 ? -0.004 : 0.003) * mult;
        const r = sat.def.radius;
        const localPos = new THREE.Vector3(r * Math.cos(sat.angle), r * Math.sin(sat.angle), 0);
        const ringWorld = new THREE.Quaternion();
        sat.def.ring.getWorldQuaternion(ringWorld);
        localPos.applyQuaternion(ringWorld);
        sat.mesh.position.copy(localPos);

        const pulse = 1 + 0.25 * Math.sin(now * 0.003 + idx);
        sat.mesh.scale.set(pulse, pulse, pulse);

        const label = document.querySelector(`.sat-label[data-sat-id="${sat.def.id}"]`);
        if (label && label.style.display !== 'none') {
            const worldPos = new THREE.Vector3();
            sat.mesh.getWorldPosition(worldPos);
            const screenPos = worldPos.project(camera);
            const rect = renderer.domElement.getBoundingClientRect();
            const sx = (screenPos.x * 0.5 + 0.5) * rect.width + rect.left;
            const sy = (-(screenPos.y * 0.5) + 0.5) * rect.height + rect.top;
            label.style.left = sx + 'px';
            label.style.top = sy + 'px';
        }
    });
}

function toggleOrbitalSettings() {
    const orbitalGroup = window._mapOrbitalGroup;
    const isActive = orbitalGroup && orbitalGroup.visible;
    if (isActive) closeOrbitalSettings();
    else openOrbitalSettings();
}

function openOrbitalSettings() {
    window._mapTargetGlobeScale = 0.65;
    if (window._mapOrbitalGroup) window._mapOrbitalGroup.visible = true;
    document.querySelectorAll('.sat-label').forEach(el => {
        el.style.display = 'flex';
        setTimeout(() => el.classList.add('visible'), 50);
    });
    const overlay = document.getElementById('orbital-settings-overlay');
    if (overlay) overlay.classList.add('active');
    const legacyOverlay = document.querySelector('.settings-global-overlay');
    if (legacyOverlay) legacyOverlay.removeAttribute('data-mode');
}

function closeOrbitalSettings() {
    window._mapTargetGlobeScale = 1.0;
    if (window._mapOrbitalGroup) window._mapOrbitalGroup.visible = false;
    document.querySelectorAll('.sat-label').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.style.display = 'none', 300);
    });
    document.querySelectorAll('.orbital-panel').forEach(p => p.classList.remove('active'));
    const overlay = document.getElementById('orbital-settings-overlay');
    if (overlay) overlay.classList.remove('active');
}

function openOrbitalPanel(satelliteId) {
    document.querySelectorAll('.orbital-panel').forEach(p => p.classList.remove('active'));
    const panelId = `orbital-panel-${satelliteId}`;
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.add('active');
        if (window.lucide) lucide.createIcons({ scope: panel });
    }
}

function initOrbitalPanelListeners() {
    const root = document.documentElement;
    const bindOrbitalSlider = (id, effectId, valId, suffix = '') => {
        const slider = document.getElementById(id);
        const display = document.getElementById(valId);
        if (!slider) return;
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (display) display.textContent = val + suffix;
            if (window.applySettingEffect) window.applySettingEffect(effectId, val);
            if (effectId === 'glow' && window._mapAtmosphere) {
                window._mapAtmosphere[0].material.opacity = 0.25 * (val / 100);
                window._mapAtmosphere[1].material.opacity = 0.1 * (val / 100);
            }
            if (effectId === 'scanline') root.style.setProperty('--scanline-opacity', (val / 100) * 0.15);
            if (effectId === 'glare') root.style.setProperty('--glare-opacity', (val / 100) * 0.8);
        });
    };

    const bindOrbitalToggle = (id, effectId) => {
        const tg = document.getElementById(id);
        if (!tg) return;
        tg.addEventListener('change', (e) => {
            if (window.applySettingEffect) window.applySettingEffect(effectId, e.target.checked);
            if (effectId === 'grid') {
                const gridOverlay = document.querySelector('.map-grid-overlay');
                if (gridOverlay) gridOverlay.style.opacity = e.target.checked ? '1' : '0';
            }
            if (id === 'tg-cloud-map') {
                if (window._mapCloudMesh) window._mapCloudMesh.visible = e.target.checked;
            }
        });
    };

    bindOrbitalSlider('sl-refresh-map', 'refresh', 'val-refresh-map', 's');
    bindOrbitalToggle('tg-sync-map', 'sync');
    bindOrbitalSlider('sl-glow-map', 'glow', 'val-glow-map', '%');
    bindOrbitalSlider('sl-scan-map', 'scanline', 'val-scan-map', '%');
    bindOrbitalSlider('sl-glare-map', 'glare', 'val-glare-map', '%');
    bindOrbitalToggle('tg-grid-map', 'grid');
    bindOrbitalToggle('tg-cloud-map', 'cloud-layer');

    const auditorInput = document.getElementById('in-auditor-map');
    if (auditorInput) {
        auditorInput.addEventListener('input', (e) => {
            if (window.applySettingEffect) window.applySettingEffect('auditor-name', e.target.value);
        });
    }
    document.getElementById('btn-activity-logs-map')?.addEventListener('click', () => {
        document.getElementById('btn-view-logs')?.click();
    });
    bindOrbitalSlider('sl-vol-map', 'volume', 'val-vol-map', '%');
    bindOrbitalToggle('tg-bleeps-map', 'bleeps');
    bindOrbitalToggle('tg-mask-map', 'masking');
    bindOrbitalToggle('tg-lock-map', 'lock');

    setInterval(() => {
        const lat = document.getElementById('conn-latency');
        if (lat) lat.textContent = (24 + Math.floor(Math.random() * 12)) + ' ms';
        const ses = document.getElementById('profile-session-time');
        if (ses && window.startTime) {
            const diff = Math.floor((Date.now() - window.startTime) / 1000);
            const m = Math.floor(diff / 60).toString().padStart(2, '0');
            const s = (diff % 60).toString().padStart(2, '0');
            ses.textContent = `00:${m}:${s}`;
        }
    }, 1000);
}

function runQuarantineSequence() {
    const btn = document.getElementById('btn-quarantine');
    const log = document.getElementById('threat-action-log');
    if (!btn || !log || window._threatQuarantined) return;
    btn.disabled = true;
    const steps = [
        { delay: 0, cls: 'warn', text: '> Initiating Quarantine Protocol…' },
        { delay: 600, cls: 'ok', text: '  [OK] Isolating Node G-14 from Sector G mesh…' },
        { delay: 1300, cls: 'ok', text: '  [OK] Neural pathway override: CMDR-77X applied.' },
        { delay: 2100, cls: 'warn', text: '  [~]  Scrubbing exfil packet queue…' },
        { delay: 3000, cls: 'ok', text: '  [OK] 847 anomalous packets discarded.' },
        { delay: 3800, cls: 'ok', text: '  [OK] Node G-14 sealed in sandbox layer.' },
        { delay: 4600, cls: 'done', text: '  ✓ QUARANTINE COMPLETE — Sector G integrity restored.' },
    ];
    log.innerHTML = '';
    steps.forEach(s => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = `threat-log-line ${s.cls}`;
            line.textContent = s.text;
            log.appendChild(line);
            log.scrollTop = log.scrollHeight;
        }, s.delay);
    });

    setTimeout(() => {
        window._threatQuarantined = true;
        btn.textContent = '✓ QUARANTINE SEALED';
        const callout = document.getElementById('breach-callout');
        if (callout) {
            callout.style.transition = 'opacity 1s';
            callout.style.opacity = '0';
            setTimeout(() => callout.classList.add('hidden'), 1000);
        }
        if (window._mapGlobe && window._mapGlobe.nodes) {
            window._mapGlobe.nodes.forEach(n => {
                if (n.userData.status === 'critical') {
                    n.userData.status = 'resolved';
                    n.material.color.setHex(0x22c55e);
                    n.scale.set(1, 1, 1);
                }
            });
        }
        const alertBanner = document.querySelector('.red-alert');
        if (alertBanner) {
            alertBanner.style.background = 'rgba(34, 197, 94, 0.15)';
            alertBanner.style.borderColor = 'rgba(34, 197, 94, 0.4)';
            alertBanner.style.color = '#22c55e';
            alertBanner.innerHTML = '<i data-lucide="shield-check"></i> Quarantine Sealed';
            lucide.createIcons();
        }
    }, steps[steps.length - 1].delay + 800);
}

function activateMapMode(mode) {
    const globe = window._mapGlobe;
    const breachCallout = document.getElementById('breach-callout');
    if (window._mapScanInterval) { clearInterval(window._mapScanInterval); window._mapScanInterval = null; }
    window._mapTabState = mode;
    if (mode !== 'threat') document.getElementById('panel-threat-action')?.classList.add('hidden');

    switch (mode) {
        case 'monitoring':
            if (globe) gsap_like_rotate(globe.globeGroup, 1.6, 900);
            if (breachCallout && !window._threatQuarantined) breachCallout.classList.add('hidden');
            break;
        case 'sector-g':
            if (globe) gsap_like_rotate(globe.globeGroup, 1.8, 1000);
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
                        gsap_like_rotate(globe.globeGroup, globe.globeGroup.rotation.y % (2 * Math.PI), 600);
                    }
                }, 16);
            }
            break;
        case 'threat':
            if (globe) gsap_like_rotate(globe.globeGroup, 1.0, 800);
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
    const cfgSection = document.getElementById('search-settings-section');
    const cfgSeparator = document.getElementById('search-cfg-separator');

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
    if (!window._isVisualBoostActive) {
        document.body.classList.remove('visual-boost-hf', 'visual-boost-wire');
        if (window._mapSunLight) window._mapSunLight.intensity = 0.8;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = window._mapGlobeDesign === 'wireframe' ? 0.8 : 0.25;
        if (window._mapGlobeMat) window._mapGlobeMat.emissiveIntensity = 0.6;
        if (window._mapGlobeWireframe) window._mapGlobeWireframe.material.opacity = 0.35;
        if (window._mapGlobeGlow) window._mapGlobeGlow.material.opacity = window._mapGlobeDesign === 'wireframe' ? 0.4 : 0.15;
        return;
    }
    const isHF = window._mapGlobeDesign === 'high-fidelity';
    document.body.classList.toggle('visual-boost-hf', isHF);
    document.body.classList.toggle('visual-boost-wire', !isHF);
    if (isHF) {
        if (window._mapSunLight) window._mapSunLight.intensity = 1.35;
        if (window._mapGlobeMat) window._mapGlobeMat.emissiveIntensity = 0.9;
    } else {
        if (window._mapGlobeWireframe) window._mapGlobeWireframe.material.opacity = 0.8;
        if (window._mapGlobeGlow) window._mapGlobeGlow.material.opacity = 0.7;
    }
};
