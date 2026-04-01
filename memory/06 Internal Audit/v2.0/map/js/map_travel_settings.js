// ── POINTER & TRAVEL MODE SELECTION ──────────────────
window.ICON_ALTITUDE_MODE = 'auto'; // 'auto' | 'manual'
window.ICON_ALTITUDE_LEVEL = 0;    // 0, 4, 8, 20 (offsets)
window.ICON_SPEED_MODE = 'auto';    // 'auto' | 'manual'
window.ICON_SPEED_MULTIPLIER = 1.0; // 0.25, 0.5, 1, 2, 4

window.SELECTED_POINTER_ICON = 'circle';
window.TRAVEL_MODES = [
    { id: 'circle', label: 'Default Dot', icon: 'circle', angleOffset: 0 },
    { id: 'plane', label: 'Airplane', icon: 'plane', angleOffset: Math.PI / 4, flipCorrection: false },
    { id: 'jet', label: 'Quantum Jet', icon: 'plane-takeoff', angleOffset: Math.PI / 4, flipCorrection: false },
    { id: 'rocket', label: 'Falcon Rocket', icon: 'rocket', angleOffset: Math.PI / 4, flipCorrection: false },
    { id: 'helicopter', label: 'Helicopter', icon: 'helicopter', angleOffset: 0, flipCorrection: true },
    { id: 'drone', label: 'Surveillance Drone', icon: 'eye', angleOffset: 0, flipCorrection: false },
    { id: 'satellite', label: 'Orbital Sat', icon: 'satellite', angleOffset: Math.PI / 4, flipCorrection: false },
    { id: 'train', label: 'Maglev Train', icon: 'train', angleOffset: 0, flipCorrection: true },
    { id: 'bus', label: 'Auto Bus', icon: 'bus', angleOffset: 0, flipCorrection: true },
    { id: 'car', label: 'Tactical Car', icon: 'car', angleOffset: 0, flipCorrection: true },
    { id: 'motorcycle', label: 'Quantum Bike', icon: 'bike', angleOffset: 0, flipCorrection: true },
    { id: 'bicycle', label: 'Eco Cycle', icon: 'bike', angleOffset: 0, flipCorrection: true },
    { id: 'walking', label: 'Human Trace', icon: 'footprints', angleOffset: Math.PI / 2, flipCorrection: false },
    { id: 'ship', label: 'Cargo Ship', icon: 'ship', angleOffset: 0, flipCorrection: true },
    { id: 'submarine', label: 'Deep Sub', icon: 'anchor', angleOffset: 0, flipCorrection: false }
];

function initPointerSelection() {
    const selectorBtn = document.getElementById('btn-pointer-selector');
    const menu = document.getElementById('map-pointer-menu');
    if (!selectorBtn || !menu) return;

    // Populate menu
    menu.innerHTML = '';
    window.TRAVEL_MODES.forEach(mode => {
        const opt = document.createElement('div');
        opt.className = `pointer-option ${window.SELECTED_POINTER_ICON === mode.id ? 'selected' : ''}`;
        opt.innerHTML = `
            <i data-lucide="${mode.icon}"></i>
            <span class="label">${mode.label}</span>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            window.SELECTED_POINTER_ICON = mode.id;
            
            // Sync Auto-Altitude & Speed
            updateAutoAltitudeAndSpeed();
            
            updatePointerSelectionUI();
            menu.classList.remove('active');
            
            // Sync current path immediately
            if (window.updateCurrentPathPointer) window.updateCurrentPathPointer();
            
            if (window.playSound) window.playSound('UI_CLICK');
        };
        menu.appendChild(opt);
    });

    initAltitudeControl();
    initSpeedControl();

    selectorBtn.onclick = (e) => {
        e.stopPropagation();

        // Close other menus if open
        const allMenus = [
            'map-line-style-menu', 'map-path-type-menu', 
            'map-path-color-menu', 'map-pointer-color-menu'
        ];
        allMenus.forEach(id => document.getElementById(id)?.classList.remove('active'));

        menu.classList.toggle('active');
        if (menu.classList.contains('active') && window.lucide) {
            lucide.createIcons({ scope: menu });
        }
    };

    document.addEventListener('click', () => {
        if (menu) menu.classList.remove('active');
    });
}

function initAltitudeControl() {
    const btn = document.getElementById('btn-altitude-control');
    const menu = document.getElementById('map-altitude-menu');
    if (!btn || !menu) return;

    const levels = [
        { id: 'auto', label: 'AUTO (Sync Mode)', offset: 0, badge: 'A', icon: 'refresh-cw' },
        { id: 'l1', label: 'Level 1 (Surface)', offset: 0, badge: '1', icon: 'map' },
        { id: 'l2', label: 'Level 2 (Low Air)', offset: 4, badge: '2', icon: 'cloud' },
        { id: 'l3', label: 'Level 3 (Mid Air)', offset: 8, badge: '3', icon: 'wind' },
        { id: 'l4', label: 'Level 4 (Orbital)', offset: 18, badge: '4', icon: 'orbit' }
    ];

    // Populate menu
    menu.innerHTML = '';
    levels.forEach(l => {
        const opt = document.createElement('div');
        opt.className = 'pointer-option';
        opt.innerHTML = `
            <i data-lucide="${l.icon}"></i>
            <span class="label">${l.label}</span>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            if (l.id === 'auto') {
                window.ICON_ALTITUDE_MODE = 'auto';
                updateAutoAltitudeAndSpeed();
            } else {
                window.ICON_ALTITUDE_MODE = 'manual';
                window.ICON_ALTITUDE_LEVEL = l.offset;
                updateAltitudeUI(l.badge, l.label);
            }
            menu.classList.remove('active');
            if (window.updateCurrentPathPointer) window.updateCurrentPathPointer();
            if (window.playSound) window.playSound('UI_CLICK');

            // Re-run search to update path curve
            const runBtn = document.getElementById('btn-run-search');
            if (runBtn) runBtn.click();
        };
        menu.appendChild(opt);
    });

    btn.onclick = (e) => {
        e.stopPropagation();
        const allMenus = [
            'map-pointer-menu', 'map-line-style-menu', 
            'map-path-type-menu', 'map-path-color-menu', 
            'map-pointer-color-menu', 'map-speed-menu', 'map-search-mode-menu'
        ];
        allMenus.forEach(id => document.getElementById(id)?.classList.remove('active'));
        
        menu.classList.toggle('active');
        if (menu.classList.contains('active') && window.lucide) {
            lucide.createIcons({ scope: menu });
            updateAltitudeUI(); // Sync highlights
        }
    };

    document.addEventListener('click', () => menu.classList.remove('active'));
    updateAltitudeUI();
}

function updateAltitudeUI(badge, label) {
    const btn = document.getElementById('btn-altitude-control');
    const menu = document.getElementById('map-altitude-menu');
    if (!btn) return;
    
    const badgeEl = btn.querySelector('.btn-badge');
    
    // If not provided, find from current state
    if (!badge || !label) {
        const levels = [
            { id: 'auto', label: 'AUTO', offset: 0, badge: 'A' },
            { id: 'l1', label: 'L1', offset: 0, badge: '1' },
            { id: 'l2', label: 'L2', offset: 4, badge: '2' },
            { id: 'l3', label: 'L3', offset: 8, badge: '3' },
            { id: 'l4', label: 'L4', offset: 18, badge: '4' }
        ];
        const current = levels.find(l => (window.ICON_ALTITUDE_MODE === 'manual' && window.ICON_ALTITUDE_LEVEL === l.offset && l.id !== 'auto') || (window.ICON_ALTITUDE_MODE === 'auto' && l.id === 'auto'));
        if (current) {
            badge = current.badge;
            label = current.label;
        }
    }

    if (badgeEl) badgeEl.textContent = badge;
    btn.title = `Icon Altitude: ${label}`;
    btn.classList.toggle('active', window.ICON_ALTITUDE_MODE === 'manual');

    // Update menu highlights
    if (menu) {
        const opts = menu.querySelectorAll('.pointer-option');
        opts.forEach(opt => {
            const labelSpan = opt.querySelector('.label');
            const optLabel = labelSpan ? labelSpan.textContent : '';
            const isSelected = label && optLabel.includes(label.split(' ')[0]); // Relaxed match
            opt.classList.toggle('selected', isSelected);
        });
    }
}

function initSpeedControl() {
    const btn = document.getElementById('btn-speed-control');
    const menu = document.getElementById('map-speed-menu');
    if (!btn || !menu) return;

    const speeds = [
        { id: 'auto', label: 'AUTO (Sync Mode)', mult: 1, badge: 'A', icon: 'refresh-cw' },
        { id: 's4', label: '4x Slower', mult: 0.25, badge: '¼', icon: 'minus-circle' },
        { id: 's2', label: '2x Slower', mult: 0.5, badge: '½', icon: 'chevron-left' },
        { id: 'n1', label: 'Normal Speed', mult: 1, badge: '1', icon: 'play' },
        { id: 'f2', label: '2x Faster', mult: 2.0, badge: '2', icon: 'chevron-right' },
        { id: 'f4', label: '4x Faster', mult: 4.0, badge: '4', icon: 'zap' }
    ];

    // Populate menu
    menu.innerHTML = '';
    speeds.forEach(s => {
        const opt = document.createElement('div');
        opt.className = 'pointer-option';
        opt.innerHTML = `
            <i data-lucide="${s.icon}"></i>
            <span class="label">${s.label}</span>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            if (s.id === 'auto') {
                window.ICON_SPEED_MODE = 'auto';
                updateAutoAltitudeAndSpeed();
            } else {
                window.ICON_SPEED_MODE = 'manual';
                window.ICON_SPEED_MULTIPLIER = s.mult;
                updateSpeedUI(s.badge, s.label);
            }
            menu.classList.remove('active');
            if (window.playSound) window.playSound('UI_CLICK');
        };
        menu.appendChild(opt);
    });

    btn.onclick = (e) => {
        e.stopPropagation();
        const allMenus = [
            'map-pointer-menu', 'map-line-style-menu', 
            'map-path-type-menu', 'map-path-color-menu', 
            'map-pointer-color-menu', 'map-altitude-menu', 'map-search-mode-menu'
        ];
        allMenus.forEach(id => document.getElementById(id)?.classList.remove('active'));
        
        menu.classList.toggle('active');
        if (menu.classList.contains('active') && window.lucide) {
            lucide.createIcons({ scope: menu });
            updateSpeedUI(); // Sync highlights
        }
    };

    document.addEventListener('click', () => menu.classList.remove('active'));
    updateSpeedUI();
}

function updateSpeedUI(badge, label) {
    const btn = document.getElementById('btn-speed-control');
    const menu = document.getElementById('map-speed-menu');
    if (!btn) return;
    
    const badgeEl = btn.querySelector('.btn-badge');
    
    if (!badge || !label) {
        const speeds = [
            { id: 'auto', label: 'AUTO', mult: 1, badge: 'A' },
            { id: 's4', label: '4x Slower', mult: 0.25, badge: '¼' },
            { id: 's2', label: '2x Slower', mult: 0.5, badge: '½' },
            { id: 'n1', label: 'Normal', mult: 1, badge: '1' },
            { id: 'f2', label: '2x Faster', mult: 2.0, badge: '2' },
            { id: 'f4', label: '4x Faster', mult: 4.0, badge: '4' }
        ];
        const current = speeds.find(s => (window.ICON_SPEED_MODE === 'manual' && window.ICON_SPEED_MULTIPLIER === s.mult && s.id !== 'auto') || (window.ICON_SPEED_MODE === 'auto' && s.id === 'auto'));
        if (current) {
            badge = current.badge;
            label = current.label;
        }
    }

    if (badgeEl) badgeEl.textContent = badge;
    btn.title = `Icon Speed: ${label}`;
    btn.classList.toggle('active', window.ICON_SPEED_MODE === 'manual');

    // Update menu highlights
    if (menu) {
        const opts = menu.querySelectorAll('.pointer-option');
        opts.forEach(opt => {
            const labelSpan = opt.querySelector('.label');
            const optLabel = labelSpan ? labelSpan.textContent : '';
            const isSelected = label && optLabel.includes(label.split(' ')[0]);
            opt.classList.toggle('selected', isSelected);
        });
    }
}

function updateAutoAltitudeAndSpeed() {
    if (window.ICON_ALTITUDE_MODE !== 'auto' && window.ICON_SPEED_MODE !== 'auto') return;

    const modeId = window.SELECTED_POINTER_ICON || 'circle';
    
    // Auto Altitude Mapping
    if (window.ICON_ALTITUDE_MODE === 'auto') {
        const altMap = {
            'walking': 0, 'footprints': 0, 'car': 0, 'bus': 0, 'train': 0, 'bike': 0, 'ship': 0, 'submarine': 0, 'circle': 0,
            'helicopter': 4, 'drone': 4, 'eye': 4,
            'plane': 8, 'plane-takeoff': 12,
            'satellite': 18, 'rocket': 22
        };
        window.ICON_ALTITUDE_LEVEL = altMap[modeId] !== undefined ? altMap[modeId] : 0;
        updateAltitudeUI('A', `AUTO (${window.ICON_ALTITUDE_LEVEL} offset)`);
    }

    // Auto Speed Mapping
    if (window.ICON_SPEED_MODE === 'auto') {
        const speedMap = {
            'walking': 0.25, 'footprints': 0.25,
            'bike': 0.5,
            'car': 1.0, 'bus': 0.8, 'train': 1.5,
            'ship': 0.5, 'submarine': 0.6,
            'helicopter': 1.2, 'drone': 1.5,
            'plane': 2.5,
            'jet': 4.0, 'rocket': 6.0, 'satellite': 8.0,
            'circle': 1.0
        };
        window.ICON_SPEED_MULTIPLIER = speedMap[modeId] !== undefined ? speedMap[modeId] : 1.0;
        let badgeValue = 'A';
        if (window.ICON_SPEED_MULTIPLIER === 0.25) badgeValue = 'A¼';
        else if (window.ICON_SPEED_MULTIPLIER === 4.0) badgeValue = 'A4';
        updateSpeedUI(badgeValue, `AUTO (${window.ICON_SPEED_MULTIPLIER}x)`);
    }
}

function updatePointerSelectionUI() {
    const menu = document.getElementById('map-pointer-menu');
    const selectorBtn = document.getElementById('btn-pointer-selector');
    if (!menu) return;
    
    const opts = menu.querySelectorAll('.pointer-option');
    opts.forEach(opt => {
        const labelSpan = opt.querySelector('.label');
        const label = labelSpan ? labelSpan.textContent : '';
        const mode = window.TRAVEL_MODES.find(m => m.label === label);
        const isSelected = window.SELECTED_POINTER_ICON === (mode ? mode.id : '');
        opt.classList.toggle('selected', isSelected);
        
        // SYNC MAIN BUTTON ICON
        if (isSelected && selectorBtn && mode) {
            selectorBtn.innerHTML = `<i data-lucide="${mode.icon}"></i>`;
            if (window.lucide) lucide.createIcons({ scope: selectorBtn });
            selectorBtn.title = `Travel Mode: ${mode.label}`;
        }
    });
}
