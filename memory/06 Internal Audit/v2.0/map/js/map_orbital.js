// map_orbital.js - Satellite and Orbital Settings System

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
    const mult = typeof window._satSpeedMultiplier === 'number' ? window._satSpeedMultiplier : 1.0;
    const orbitalGroup = window._mapOrbitalGroup;
    if (!orbitalGroup) return;

    const rings = orbitalGroup.children.filter(c => c.type === 'Mesh');
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
