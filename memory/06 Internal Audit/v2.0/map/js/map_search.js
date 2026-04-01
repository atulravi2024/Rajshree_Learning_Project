// Search Aliases for common variations
window.MAP_SEARCH_ALIASES = {
    "bangalore": "bengaluru",
    "bombay": "mumbai",
    "madras": "chennai",
    "calcutta": "kolkata",
    "banaras": "varanasi",
    "pondy": "puducherry",
    "trichy": "tiruchirappalli",
    "baroda": "vadodara",
    "cochin": "kochi"
};

/**
 * Searches through all available datasets for location coordinates.
 * Robust implementation as per "Anyway from Anyway" directive.
 */
function searchDeepLocation(name) {
    if (!name) return null;
    let q = name.toLowerCase().trim();

    // 1. Alias/Synonym redirection
    if (window.MAP_SEARCH_ALIASES[q]) {
        console.log(`[Search] Redirecting Alias: ${q} -> ${window.MAP_SEARCH_ALIASES[q]}`);
        q = window.MAP_SEARCH_ALIASES[q];
    }

    // 2. Check flat master list
    if (window.LOCATION_COORDS && window.LOCATION_COORDS[q]) return window.LOCATION_COORDS[q];

    // 3. Search in deep country data
    if (window.LOCATION_DATA) {
        // Collect potential fuzzy matches
        let fuzzyResults = [];

        for (const country in window.LOCATION_DATA) {
            const cData = window.LOCATION_DATA[country];
            
            // Country match
            if (country.toLowerCase() === q) return findNestedCoords(cData);

            for (const state in cData) {
                const sData = cData[state];
                
                // State match (Check for city with same name inside state first)
                if (state.toLowerCase() === q) {
                    if (sData[q]) return sData[q]; 
                    return findNestedCoords(sData);
                }

                if (typeof sData === 'object') {
                    for (const city in sData) {
                        const lowCity = city.toLowerCase();
                        
                        // Exact city match
                        if (lowCity === q) return sData[city];
                        
                        // Collect for fuzzy if exact fail
                        if (lowCity.includes(q) || q.includes(lowCity)) {
                            fuzzyResults.push(sData[city]);
                        }
                    }
                }
            }
        }

        // 4. Return first fuzzy match if no exact match found
        if (fuzzyResults.length > 0) {
            console.log(`[Search] No exact match for "${name}". Returning best fuzzy match.`);
            return fuzzyResults[0];
        }
    }
    
    console.warn(`[Search] Location NOT found: ${name}`);
    return null;
}

function findNestedCoords(obj) {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.lat && obj.lon) return obj;
    for (const key in obj) {
        const res = findNestedCoords(obj[key]);
        if (res) return res;
    }
    return null;
}

// ── SEARCH MODE GLOBAL STATE ──
window.SEARCH_MODE = 'route'; // 'poi' | 'route' | 'via'
window.VIA_MODE_ACTIVE = false; // Legacy fallback for some components


function initGlobalSearch() {
    const fromInput = document.getElementById('map-search-from');
    const viaInput = document.getElementById('map-search-via');
    const toInput = document.getElementById('map-search-to');
    const runBtn = document.getElementById('btn-run-search');
    const container = document.getElementById('global-search-container');

    if (!fromInput || !toInput || !runBtn) return;

    if (window.lucide) window.lucide.createIcons();

    async function executeSearch() {
        const from = fromInput.value.trim();
        const via = (viaInput && window.SEARCH_MODE === 'via') ? viaInput.value.trim() : '';
        const to = toInput.value.trim();
        
        console.log(`Search Request [${window.SEARCH_MODE}]: ${from} ${via ? 'via ' + via : ''} ${window.SEARCH_MODE !== 'poi' ? '-> ' + to : ''}`);

        const fromCoords = searchDeepLocation(from);
        const viaCoords = (window.SEARCH_MODE === 'via' && via) ? searchDeepLocation(via) : null;
        const toCoords = (window.SEARCH_MODE !== 'poi' && to) ? searchDeepLocation(to) : null;

        if (window.SEARCH_MODE === 'poi') {
            if (fromCoords) {
                if (window.rotateGlobeToCoords) window.rotateGlobeToCoords(fromCoords.lat, fromCoords.lon);
                if (window.playSound) window.playSound('UI_QUANTUM_LOCK');
                // Clear any existing path
                if (window.drawQuantumPath) window.drawQuantumPath([]);
                
                // Show in metrics?
                if (window.updateNavbarMetrics) window.updateNavbarMetrics(fromCoords, null, null);
                
                window._mapTargetCameraZ = 150;
            } else {
                showErrorShake();
            }
        } else {
            // Route or Via Mode
            if (fromCoords && toCoords) {
                const coordinateArray = viaCoords ? [fromCoords, viaCoords, toCoords] : [fromCoords, toCoords];
                
                if (window.drawQuantumPath) window.drawQuantumPath(coordinateArray);
                if (window.playSound) window.playSound('UI_CONFIRM');
                
                window.rotateGlobeToCoords(toCoords.lat, toCoords.lon);
                if (window.updateNavbarMetrics) window.updateNavbarMetrics(fromCoords, toCoords, viaCoords);

                window._mapTargetCameraZ = 150;
            } else {
                showErrorShake();
            }
        }
        
        runBtn.style.transform = 'scale(0.9)';
        setTimeout(() => runBtn.style.transform = '', 100);
    }

    function showErrorShake() {
        container.classList.add('error-shake');
        setTimeout(() => container.classList.remove('error-shake'), 400);
        if (window.playSound) window.playSound('UI_ERROR');
    }


    fromInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeSearch(); });
    if (viaInput) viaInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeSearch(); });
    toInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeSearch(); });
    runBtn.addEventListener('click', executeSearch);

    initAutocomplete(fromInput, viaInput, toInput);
    initClearButtons(fromInput, viaInput, toInput);
    initSwapHandlers(fromInput, viaInput, toInput);
    initSearchModeSelection(fromInput, viaInput, toInput);

    initPointerSelection();
    initLineStyleSelection();
    initPathTypeSelection();
    initPathColorSelection();
    initPointerColorSelectionColor();

    setTimeout(() => {
        if (fromInput.value && toInput.value) executeSearch();
    }, 2000);
}

/**
 * Initializes 'Clear' buttons for search fields.
 */
function initClearButtons(from, via, to) {
    const fields = [
        { input: from, btn: document.querySelector('.from-field .clear-input-btn') },
        { input: via,  btn: document.querySelector('.via-field .clear-input-btn') },
        { input: to,   btn: document.querySelector('.to-field .clear-input-btn') }
    ];

    fields.forEach(f => {
        if (!f.input || !f.btn) return;

        const updateVisibility = () => {
            f.btn.classList.toggle('visible', f.input.value.length > 0);
        };

        f.input.addEventListener('input', updateVisibility);
        
        f.btn.onclick = (e) => {
            e.stopPropagation();
            f.input.value = '';
            f.input.focus();
            updateVisibility();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        };

        updateVisibility();
    });
}

/**
 * Initializes 'Swap' functionality between search inputs.
 */
function initSwapHandlers(from, via, to) {
    const btnFromVia = document.getElementById('btn-swap-from-via');
    const btnViaTo = document.getElementById('btn-swap-via-to');

    if (btnFromVia) {
        btnFromVia.onclick = (e) => {
            e.stopPropagation();

            if (!window.VIA_MODE_ACTIVE) {
                // Swapping START and DESTINATION when VIA is disabled
                const temp = from.value;
                from.value = to.value;
                to.value = temp;
                animateSwap(from, to);
            } else {
                // Normal START & VIA swap
                const temp = from.value;
                from.value = via.value;
                via.value = temp;
                animateSwap(from, via);
            }

            if (window.playSound) window.playSound('UI_CLICK');

            // Re-run search
            const runBtn = document.getElementById('btn-run-search');
            if (runBtn) runBtn.click();
        };
    }

    if (btnViaTo) {
        btnViaTo.onclick = (e) => {
            e.stopPropagation();
            if (window.SEARCH_MODE !== 'via') return;

            const temp = via.value;
            via.value = to.value;
            to.value = temp;

            animateSwap(via, to);
            if (window.playSound) window.playSound('UI_CLICK');

            const runBtn = document.getElementById('btn-run-search');
            if (runBtn) runBtn.click();
        };
    }
}

/**
 * Initializes the Search Mode Drop-up selection.
 */
function initSearchModeSelection(from, via, to) {
    const selectorBtn = document.getElementById('btn-search-mode-selector');
    const menu = document.getElementById('map-search-mode-menu');
    const container = document.getElementById('global-search-container');
    const swapFromVia = document.getElementById('btn-swap-from-via');

    if (!selectorBtn || !menu || !container) return;

    const modes = [
        { id: 'poi',    label: 'Point Interest', icon: 'map-pin', badge: 'P', desc: 'Single location search' },
        { id: 'route',  label: 'Direct Route',   icon: 'move-right', badge: 'R', desc: 'Start to Destination' },
        { id: 'via',    label: 'Navigation Via', icon: 'map-pinned', badge: 'V', desc: 'Start, Via, and Destination' }
    ];

    // Populate menu
    menu.innerHTML = '';
    modes.forEach(m => {
        const opt = document.createElement('div');
        opt.className = `pointer-option ${window.SEARCH_MODE === m.id ? 'selected' : ''}`;
        opt.innerHTML = `
            <i data-lucide="${m.icon}"></i>
            <div class="opt-content">
                <span class="label">${m.label}</span>
                <span class="desc">${m.desc}</span>
            </div>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            window.SEARCH_MODE = m.id;
            window.VIA_MODE_ACTIVE = (m.id === 'via'); // Legacy sync
            
            updateSearchModeUI();
            menu.classList.remove('active');
            
            if (window.playSound) window.playSound('UI_CLICK');
            
            // Re-run search if we have data
            const runBtn = document.getElementById('btn-run-search');
            if (runBtn && from.value) runBtn.click();
        };
        menu.appendChild(opt);
    });

    selectorBtn.onclick = (e) => {
        e.stopPropagation();
        const allMenus = [
            'map-pointer-menu', 'map-line-style-menu', 
            'map-path-type-menu', 'map-path-color-menu', 
            'map-pointer-color-menu', 'map-altitude-menu', 'map-speed-menu'
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

    updateSearchModeUI();
}

function updateSearchModeUI() {
    const selectorBtn = document.getElementById('btn-search-mode-selector');
    const container = document.getElementById('global-search-container');
    const menu = document.getElementById('map-search-mode-menu');
    const fromInput = document.getElementById('map-search-from');
    
    if (!selectorBtn || !container) return;

    const m = {
        'poi':    { icon: 'map-pin', badge: 'P', placeholder: 'SEARCH CITY/NODE...' },
        'route':  { icon: 'move-right', badge: 'R', placeholder: 'START...' },
        'via':    { icon: 'map-pinned', badge: 'V', placeholder: 'START...' }
    }[window.SEARCH_MODE];

    selectorBtn.innerHTML = `<i data-lucide="${m.icon}"></i><span class="btn-badge">${m.badge}</span>`;
    if (window.lucide) lucide.createIcons({ scope: selectorBtn });
    
    if (fromInput) fromInput.placeholder = m.placeholder;

    // Update Container Classes
    container.classList.toggle('mode-poi', window.SEARCH_MODE === 'poi');
    container.classList.toggle('mode-route', window.SEARCH_MODE === 'route');
    container.classList.toggle('mode-via', window.SEARCH_MODE === 'via');
    
    // Legacy support for CSS that uses .via-mode-disabled
    container.classList.toggle('via-mode-disabled', window.SEARCH_MODE !== 'via');

    // Update menu highlights
    if (menu) {
        menu.querySelectorAll('.pointer-option').forEach(opt => {
            const label = opt.querySelector('.label').textContent;
            const isSelected = label.toLowerCase().includes(window.SEARCH_MODE);
            opt.classList.toggle('selected', isSelected);
        });
    }

    // Sync Clear Buttons
    const fromBtn = document.querySelector('.from-field .clear-input-btn');
    const viaBtn = document.querySelector('.via-field .clear-input-btn');
    const toBtn = document.querySelector('.to-field .clear-input-btn');
    if (fromBtn) fromBtn.classList.toggle('visible', !!fromInput?.value);
    if (viaBtn) viaBtn.classList.toggle('visible', !!document.getElementById('map-search-via')?.value);
    if (toBtn) toBtn.classList.toggle('visible', !!document.getElementById('map-search-to')?.value);
}

// initViaModeToggle function REMOVED since it's replaced by Search Mode Selection


function animateSwap(el1, el2) {
    [el1, el2].forEach(el => {
        el.style.transition = 'none';
        el.style.opacity = '0.3';
        el.style.transform = 'translateY(5px)';
        setTimeout(() => {
            el.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 10);
    });

    // Sync clear button visibility manually since 'input' event won't fire on value change
    const fromBtn = document.querySelector('.from-field .clear-input-btn');
    const viaBtn = document.querySelector('.via-field .clear-input-btn');
    const toBtn = document.querySelector('.to-field .clear-input-btn');
    
    if (fromBtn) fromBtn.classList.toggle('visible', document.getElementById('map-search-from').value.length > 0);
    if (viaBtn) viaBtn.classList.toggle('visible', document.getElementById('map-search-via').value.length > 0);
    if (toBtn) toBtn.classList.toggle('visible', document.getElementById('map-search-to').value.length > 0);
}

// Route Selection UI Functions Removed


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

    initAltitudeControl();
    initSpeedControl();
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
            'map-pointer-color-menu', 'map-speed-menu'
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
            const optLabel = opt.querySelector('.label').textContent;
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
            'map-pointer-color-menu', 'map-altitude-menu'
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
            const optLabel = opt.querySelector('.label').textContent;
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
        const label = opt.querySelector('.label').textContent;
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

// ── PATH LINE STYLE SELECTION ──────────────────

window.SELECTED_LINE_STYLE = 'pulsed';
window.LINE_STYLES = [
    { id: 'pulsed', label: 'Quantum Pulse', icon: 'git-commit' },
    { id: 'solid', label: 'Neon Solid', icon: 'minus' },
    { id: 'dotted', label: 'Data Trace', icon: 'more-horizontal' },
    { id: 'hyper', label: 'Hyper Stream', icon: 'zap' },
    { id: 'ghost', label: 'Ghost Trace', icon: 'wind' },
    { id: 'spike', label: 'Energy Spike', icon: 'activity' },
    { id: 'field', label: 'Force Field', icon: 'shield' }
];

function initLineStyleSelection() {
    const selectorBtn = document.getElementById('btn-line-style-selector');
    const menu = document.getElementById('map-line-style-menu');
    if (!selectorBtn || !menu) return;

    // Populate menu
    menu.innerHTML = '';
    window.LINE_STYLES.forEach(style => {
        const opt = document.createElement('div');
        opt.className = `pointer-option ${window.SELECTED_LINE_STYLE === style.id ? 'selected' : ''}`;
        opt.innerHTML = `
            <i data-lucide="${style.icon}"></i>
            <span class="label">${style.label}</span>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            window.SELECTED_LINE_STYLE = style.id;
            updateLineStyleUI();
            menu.classList.remove('active');
            
            // Sync current path immediately if it exists
            const fromField = document.getElementById('map-search-from');
            const toField = document.getElementById('map-search-to');
            if (fromField && toField && fromField.value && toField.value) {
                const runBtn = document.getElementById('btn-run-search');
                if (runBtn) runBtn.click();
            }
            
            if (window.playSound) window.playSound('UI_CLICK');
        };
        menu.appendChild(opt);
    });

    selectorBtn.onclick = (e) => {
        e.stopPropagation();

        // Close other menus if open
        const allMenus = [
            'map-pointer-menu', 'map-path-type-menu', 
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

    updateLineStyleUI();
}

function updateLineStyleUI() {
    const menu = document.getElementById('map-line-style-menu');
    const selectorBtn = document.getElementById('btn-line-style-selector');
    if (!menu) return;
    
    const opts = menu.querySelectorAll('.pointer-option');
    opts.forEach(opt => {
        const label = opt.querySelector('.label').textContent;
        const style = window.LINE_STYLES.find(s => s.label === label);
        const isSelected = window.SELECTED_LINE_STYLE === (style ? style.id : '');
        opt.classList.toggle('selected', isSelected);
        
        // SYNC MAIN BUTTON ICON
        if (isSelected && selectorBtn && style) {
            selectorBtn.innerHTML = `<i data-lucide="${style.icon}"></i>`;
            if (window.lucide) lucide.createIcons({ scope: selectorBtn });
            selectorBtn.title = `Path Style: ${style.label}`;
        }
    });
}

// ── ROUTE ALIGNMENT TYPE SELECTION ──────────────────

window.SELECTED_PATH_TYPE = 'curve';
window.PATH_TYPES = [
    { id: 'curve',   label: 'Arched Curve', icon: 'route' },
    { id: 'straight',label: 'Direct Link',  icon: 'move-right' },
    { id: 'circle',  label: 'Orbital Arc',  icon: 'circle-dot' }
];

function initPathTypeSelection() {
    const selectorBtn = document.getElementById('btn-path-type-selector');
    const menu = document.getElementById('map-path-type-menu');
    if (!selectorBtn || !menu) return;

    // Populate menu
    menu.innerHTML = '';
    window.PATH_TYPES.forEach(type => {
        const opt = document.createElement('div');
        opt.className = `pointer-option ${window.SELECTED_PATH_TYPE === type.id ? 'selected' : ''}`;
        opt.innerHTML = `
            <i data-lucide="${type.icon}"></i>
            <span class="label">${type.label}</span>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            window.SELECTED_PATH_TYPE = type.id;
            updatePathTypeUI();
            menu.classList.remove('active');
            
            // Re-run search to update path if coordinates exist
            const fromField = document.getElementById('map-search-from');
            const toField = document.getElementById('map-search-to');
            if (fromField && toField && fromField.value && toField.value) {
                const runBtn = document.getElementById('btn-run-search');
                if (runBtn) runBtn.click();
            }
            
            if (window.playSound) window.playSound('UI_CLICK');
        };
        menu.appendChild(opt);
    });

    selectorBtn.onclick = (e) => {
        e.stopPropagation();

        // Close other menus if open
        const allMenus = [
            'map-pointer-menu', 'map-line-style-menu', 
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

    updatePathTypeUI();
}

function updatePathTypeUI() {
    const menu = document.getElementById('map-path-type-menu');
    const selectorBtn = document.getElementById('btn-path-type-selector');
    if (!menu) return;
    
    const opts = menu.querySelectorAll('.pointer-option');
    opts.forEach(opt => {
        const label = opt.querySelector('.label').textContent;
        const type = window.PATH_TYPES.find(t => t.label === label);
        const isSelected = window.SELECTED_PATH_TYPE === (type ? type.id : '');
        opt.classList.toggle('selected', isSelected);
        
        // SYNC MAIN BUTTON ICON
        if (isSelected && selectorBtn && type) {
            selectorBtn.innerHTML = `<i data-lucide="${type.icon}"></i>`;
            if (window.lucide) lucide.createIcons({ scope: selectorBtn });
            selectorBtn.title = `Route Alignment: ${type.label}`;
        }
    });
}

// ── PATH COLOR SELECTION ──────────────────

window.SELECTED_PATH_COLOR = 0x00f0ff;
window.PATH_COLORS = [
    { id: 0x00f0ff, label: 'Frontier Cyan', hex: '#00f0ff' },
    { id: 0xff3e3e, label: 'Pulse Red',    hex: '#ff3e3e' },
    { id: 0x22c55e, label: 'Signal Green', hex: '#22c55e' },
    { id: 0x3b82f6, label: 'Neural Blue',  hex: '#3b82f6' },
    { id: 0xfacc15, label: 'Warning Yellow', hex: '#facc15' },
    { id: 0xa78bfa, label: 'Void Purple',  hex: '#a78bfa' },
    { id: 0xf97316, label: 'Alert Orange', hex: '#f97316' },
    { id: 0xec4899, label: 'Prism Pink',   hex: '#ec4899' }
];

function initPathColorSelection() {
    const selectorBtn = document.getElementById('btn-path-color-selector');
    const menu = document.getElementById('map-path-color-menu');
    if (!selectorBtn || !menu) return;

    // Populate menu
    menu.innerHTML = '';
    window.PATH_COLORS.forEach(color => {
        const opt = document.createElement('div');
        opt.className = `pointer-option ${window.SELECTED_PATH_COLOR === color.id ? 'selected' : ''}`;
        opt.innerHTML = `
            <div class="color-dot" style="color: ${color.hex}; background-color: ${color.hex}"></div>
            <span class="label">${color.label}</span>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            window.SELECTED_PATH_COLOR = color.id;
            updatePathColorUI();
            menu.classList.remove('active');
            
            // Re-run search to update path if coordinates exist
            const fromField = document.getElementById('map-search-from');
            const toField = document.getElementById('map-search-to');
            if (fromField && toField && fromField.value && toField.value) {
                const runBtn = document.getElementById('btn-run-search');
                if (runBtn) runBtn.click();
            }
            
            if (window.playSound) window.playSound('UI_CLICK');
        };
        menu.appendChild(opt);
    });

    selectorBtn.onclick = (e) => {
        e.stopPropagation();

        // Close other menus if open
        const allMenus = [
            'map-pointer-menu', 'map-line-style-menu', 
            'map-path-type-menu', 'map-pointer-color-menu'
        ];
        allMenus.forEach(id => document.getElementById(id)?.classList.remove('active'));

        menu.classList.toggle('active');
    };

    document.addEventListener('click', () => {
        if (menu) menu.classList.remove('active');
    });

    updatePathColorUI();
}

function updatePathColorUI() {
    const menu = document.getElementById('map-path-color-menu');
    const selectorBtn = document.getElementById('btn-path-color-selector');
    if (!menu) return;
    
    const opts = menu.querySelectorAll('.pointer-option');
    opts.forEach(opt => {
        const label = opt.querySelector('.label').textContent;
        const color = window.PATH_COLORS.find(c => c.label === label);
        const isSelected = window.SELECTED_PATH_COLOR === (color ? color.id : '');
        opt.classList.toggle('selected', isSelected);
        
        // SYNC MAIN BUTTON COLOR
        if (isSelected && selectorBtn && color) {
            selectorBtn.style.color = color.hex;
            selectorBtn.style.borderColor = color.hex;
            selectorBtn.style.boxShadow = `0 0 10px ${color.hex}`;
            selectorBtn.title = `Route Color: ${color.label}`;
        }
    });
}

// ── POINTER (ICON) COLOR SELECTION ──────────────────

window.SELECTED_POINTER_COLOR = 0x00f0ff;

function initPointerColorSelectionColor() {
    const selectorBtn = document.getElementById('btn-pointer-color-selector');
    const menu = document.getElementById('map-pointer-color-menu');
    if (!selectorBtn || !menu) return;

    // Use same colors as path for consistency
    menu.innerHTML = '';
    window.PATH_COLORS.forEach(color => {
        const opt = document.createElement('div');
        opt.className = `pointer-option ${window.SELECTED_POINTER_COLOR === color.id ? 'selected' : ''}`;
        opt.innerHTML = `
            <div class="color-dot" style="color: ${color.hex}; background-color: ${color.hex}"></div>
            <span class="label">${color.label}</span>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            window.SELECTED_POINTER_COLOR = color.id;
            updatePointerColorUI();
            menu.classList.remove('active');
            
            // Sync current path pointer immediately
            if (window.updateCurrentPathPointer) window.updateCurrentPathPointer();
            
            if (window.playSound) window.playSound('UI_CLICK');
        };
        menu.appendChild(opt);
    });

    selectorBtn.onclick = (e) => {
        e.stopPropagation();

        // Close other menus if open
        const allMenus = [
            'map-pointer-menu', 'map-line-style-menu', 
            'map-path-type-menu', 'map-path-color-menu'
        ];
        allMenus.forEach(id => document.getElementById(id)?.classList.remove('active'));

        menu.classList.toggle('active');
    };

    document.addEventListener('click', () => {
        if (menu) menu.classList.remove('active');
    });

    updatePointerColorUI();
}

function updatePointerColorUI() {
    const menu = document.getElementById('map-pointer-color-menu');
    const selectorBtn = document.getElementById('btn-pointer-color-selector');
    if (!menu) return;
    
    const opts = menu.querySelectorAll('.pointer-option');
    opts.forEach(opt => {
        const label = opt.querySelector('.label').textContent;
        const color = window.PATH_COLORS.find(c => c.label === label);
        const isSelected = window.SELECTED_POINTER_COLOR === (color ? color.id : '');
        opt.classList.toggle('selected', isSelected);
        
        // SYNC MAIN BUTTON COLOR
        if (isSelected && selectorBtn && color) {
            selectorBtn.style.color = color.hex;
            selectorBtn.style.borderColor = color.hex;
            selectorBtn.style.boxShadow = `0 0 10px ${color.hex}`;
            selectorBtn.title = `Pointer Color: ${color.label}`;
        }
    });
}

// ── PATH COLOR SELECTION ──────────────────

window.SELECTED_PATH_COLOR = 0x00f0ff;
window.PATH_COLORS = [
    { id: 0x00f0ff, label: 'Frontier Cyan', hex: '#00f0ff' },
    { id: 0xff3e3e, label: 'Pulse Red',    hex: '#ff3e3e' },
    { id: 0x22c55e, label: 'Signal Green', hex: '#22c55e' },
    { id: 0x3b82f6, label: 'Neural Blue',  hex: '#3b82f6' },
    { id: 0xfacc15, label: 'Warning Yellow', hex: '#facc15' },
    { id: 0xa78bfa, label: 'Void Purple',  hex: '#a78bfa' },
    { id: 0xf97316, label: 'Alert Orange', hex: '#f97316' },
    { id: 0xec4899, label: 'Prism Pink',   hex: '#ec4899' }
];

function initPathColorSelection() {
    const selectorBtn = document.getElementById('btn-path-color-selector');
    const menu = document.getElementById('map-path-color-menu');
    if (!selectorBtn || !menu) return;

    // Populate menu
    menu.innerHTML = '';
    window.PATH_COLORS.forEach(color => {
        const opt = document.createElement('div');
        opt.className = `pointer-option ${window.SELECTED_PATH_COLOR === color.id ? 'selected' : ''}`;
        opt.innerHTML = `
            <div class="color-dot" style="color: ${color.hex}; background-color: ${color.hex}"></div>
            <span class="label">${color.label}</span>
        `;
        opt.onclick = (e) => {
            e.stopPropagation();
            window.SELECTED_PATH_COLOR = color.id;
            updatePathColorUI();
            menu.classList.remove('active');
            
            // Re-run search to update path if coordinates exist
            const fromField = document.getElementById('map-search-from');
            const toField = document.getElementById('map-search-to');
            if (fromField && toField && fromField.value && toField.value) {
                const runBtn = document.getElementById('btn-run-search');
                if (runBtn) runBtn.click();
            }
            
            if (window.playSound) window.playSound('UI_CLICK');
        };
        menu.appendChild(opt);
    });

    selectorBtn.onclick = (e) => {
        e.stopPropagation();

        // Close other menus if open
        document.getElementById('map-pointer-menu')?.classList.remove('active');
        document.getElementById('map-line-style-menu')?.classList.remove('active');
        document.getElementById('map-path-type-menu')?.classList.remove('active');

        menu.classList.toggle('active');
    };

    document.addEventListener('click', () => {
        if (menu) menu.classList.remove('active');
    });

    updatePathColorUI();
}

function updatePathColorUI() {
    const menu = document.getElementById('map-path-color-menu');
    const selectorBtn = document.getElementById('btn-path-color-selector');
    if (!menu) return;
    
    const opts = menu.querySelectorAll('.pointer-option');
    opts.forEach(opt => {
        const label = opt.querySelector('.label').textContent;
        const color = window.PATH_COLORS.find(c => c.label === label);
        const isSelected = window.SELECTED_PATH_COLOR === (color ? color.id : '');
        opt.classList.toggle('selected', isSelected);
        
        // SYNC MAIN BUTTON COLOR
        if (isSelected && selectorBtn && color) {
            selectorBtn.style.color = color.hex;
            selectorBtn.style.borderColor = color.hex;
            selectorBtn.style.boxShadow = `0 0 10px ${color.hex}`;
            selectorBtn.title = `Route Color: ${color.label}`;
        }
    });
}

/**
 * Creates a Sprite from a Lucide icon using DOM-Proxy extraction
 */
window.createIconTexture = async function(iconName) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');

        // Glow background
        const grad = ctx.createRadialGradient(60, 60, 0, 60, 60, 60);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 120, 120);

        // ── DOM-PROXY EXTRACTION ──
        const proxyDiv = document.createElement('div');
        proxyDiv.style.display = 'none';
        
        // Direct mapping (Lucide-browser handles data-lucide kebab-case names natively)
        proxyDiv.innerHTML = `<i data-lucide="${iconName}"></i>`;
        document.body.appendChild(proxyDiv);

        if (window.lucide) {
            lucide.createIcons({
                scope: proxyDiv,
                attrs: { color: '#ffffff', 'stroke-width': 2.5, width: 70, height: 70 }
            });
        }

        const svgEl = proxyDiv.querySelector('svg');
        if (!svgEl) {
            document.body.removeChild(proxyDiv);
            return null;
        }

        const svgStr = svgEl.outerHTML;
        document.body.removeChild(proxyDiv);
        
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        return new Promise((resolve) => {
            img.onload = () => {
                ctx.drawImage(img, 25, 25, 70, 70);
                const tex = new THREE.CanvasTexture(canvas);
                URL.revokeObjectURL(url);
                resolve(tex);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(null);
            };
            img.src = url;
        });
    } catch (e) {
        console.warn('Pointer Texture Generation Failed:', e);
        return null;
    }
}

// ── AUTO-COMPLETE ENGINE (LOCAL ONLY) ──────────────────

window.SUGGESTIONS_ENABLED = true;
let _suggestionDebounceTimer = null;

function initAutocomplete(fromInput, viaInput, toInput) {
    const suggestionsContainer = document.getElementById('map-search-suggestions');
    const toggleBtn = document.getElementById('btn-suggestion-toggle');

    if (!fromInput || !toInput || !suggestionsContainer) return;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            window.SUGGESTIONS_ENABLED = !window.SUGGESTIONS_ENABLED;
            toggleBtn.classList.toggle('active', window.SUGGESTIONS_ENABLED);
            if (!window.SUGGESTIONS_ENABLED) hideSuggestions();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        });
    }

    const handleInput = (e) => {
        if (!window.SUGGESTIONS_ENABLED) return;
        const query = e.target.value.trim();

        clearTimeout(_suggestionDebounceTimer);
        if (query.length < 3) {
            hideSuggestions();
            return;
        }

        _suggestionDebounceTimer = setTimeout(() => {
            const results = findSuggestionsRecursive(query);
            if (results.length > 0) {
                renderSuggestionsUI(results, e.target);
            } else {
                hideSuggestions();
            }
        }, 300);
    };

    fromInput.addEventListener('input', handleInput);
    if (viaInput) viaInput.addEventListener('input', handleInput);
    toInput.addEventListener('input', handleInput);

    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== fromInput && (viaInput ? e.target !== viaInput : true) && e.target !== toInput) {
            hideSuggestions();
        }
    });
}

function findSuggestionsRecursive(query) {
    const q = query.toLowerCase();
    const results = [];
    const data = window.LOCATION_DATA;
    if (!data) return [];

    for (const country in data) {
        const states = data[country];
        for (const state in states) {
            const cities = states[state];
            if (typeof cities === 'object') {
                for (const city in cities) {
                    if (city.toLowerCase().includes(q)) {
                        results.push({
                            city: city.charAt(0).toUpperCase() + city.slice(1),
                            state: state,
                            country: country.charAt(0).toUpperCase() + country.slice(1),
                            coords: cities[city]
                        });
                        if (results.length >= 5) return results; // TOP 5 LIMIT
                    }
                }
            }
        }
    }
    return results;
}

function renderSuggestionsUI(results, inputRef) {
    const container = document.getElementById('map-search-suggestions');
    if (!container) return;

    container.innerHTML = '';
    results.forEach(res => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <i data-lucide="map-pin" style="width:12px; height:12px; opacity:0.7;"></i>
            <div class="suggestion-text">
                <span class="city-name">${res.city}</span>
                <span class="state-country">${res.state}, ${res.country}</span>
            </div>
        `;
        item.onclick = () => {
            inputRef.value = res.city;
            hideSuggestions();
            if (window.rotateGlobeToCoords) window.rotateGlobeToCoords(res.coords.lat, res.coords.lon);
            if (window.playSound) window.playSound('UI_CLICK');
        };
        container.appendChild(item);
    });

    if (window.lucide) window.lucide.createIcons({ scope: container });
    container.classList.add('active');
}

function hideSuggestions() {
    const container = document.getElementById('map-search-suggestions');
    if (container) container.classList.remove('active');
}
