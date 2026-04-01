// map_search.js - Location Search Engine for the Holographic Map

/**
 * Searches through all available datasets for location coordinates.
 */
function searchDeepLocation(name) {
    if (!name) return null;
    const q = name.toLowerCase().trim();

    // 1. Check flat master list
    if (window.LOCATION_COORDS && window.LOCATION_COORDS[q]) return window.LOCATION_COORDS[q];

    // 2. Search deep in country data
    if (window.LOCATION_DATA) {
        for (const country in window.LOCATION_DATA) {
            const cData = window.LOCATION_DATA[country];
            if (country.toLowerCase() === q) return findNestedCoords(cData);

            for (const state in cData) {
                const sData = cData[state];
                if (state.toLowerCase() === q) return findNestedCoords(sData);

                if (typeof sData === 'object') {
                    for (const city in sData) {
                        if (city.toLowerCase() === q) return sData[city];
                    }
                }
            }
        }
    }
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

function initGlobalSearch() {
    const fromInput = document.getElementById('map-search-from');
    const toInput = document.getElementById('map-search-to');
    const runBtn = document.getElementById('btn-run-search');
    const container = document.getElementById('global-search-container');

    if (!fromInput || !toInput || !runBtn) return;

    if (window.lucide) window.lucide.createIcons();

    async function executeSearch() {
        const from = fromInput.value.trim();
        const to = toInput.value.trim();
        
        console.log(`Pathfinding Request: ${from} -> ${to}`);

        const fromCoords = searchDeepLocation(from);
        const toCoords = searchDeepLocation(to);

        if (fromCoords && toCoords) {
            await drawQuantumPath(fromCoords, toCoords);
            window.rotateGlobeToCoords(toCoords.lat, toCoords.lon);
            runBtn.style.transform = 'scale(0.9)';
            setTimeout(() => runBtn.style.transform = '', 100);
            if (window.playSound) window.playSound('UI_QUANTUM_LOCK');
            
            // Sync Navbar Distance Calculator
            if (window.updateNavbarMetrics) window.updateNavbarMetrics(fromCoords, toCoords);

            // AUTOMATION: Zoom to 150 on search
            window._mapTargetCameraZ = 150;
            const zSlider = document.getElementById('globe-zoom-slider');
            if (zSlider && typeof mapZToSlider === 'function') {
                zSlider.value = mapZToSlider(150);
            }
        } else if (toCoords) {
            window.rotateGlobeToCoords(toCoords.lat, toCoords.lon);
        } else if (fromCoords) {
            window.rotateGlobeToCoords(fromCoords.lat, fromCoords.lon);
        } else {
            container.classList.add('error-shake');
            setTimeout(() => container.classList.remove('error-shake'), 400);
            if (window.playSound) window.playSound('UI_ERROR');
        }
    }

    fromInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeSearch(); });
    toInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeSearch(); });
    runBtn.addEventListener('click', executeSearch);

    // Swap locations logic
    const swapBtn = document.getElementById('btn-swap-locations');
    if (swapBtn) {
        swapBtn.onclick = () => {
            const fromVal = fromInput.value;
            const toVal = toInput.value;
            fromInput.value = toVal;
            toInput.value = fromVal;

            // Visual feedback: rotate the icon
            const icon = swapBtn.querySelector('.swap-icon');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => { icon.style.transform = ''; }, 300);
            }

            if (window.playSound) window.playSound('UI_CLICK');
        };
    }

    // Initialize Auto-complete
    initAutocomplete(fromInput, toInput);

    // Initialize Pointer Selection
    initPointerSelection();

    // Initialize Line Style Selection
    initLineStyleSelection();

    // Initialize Path Type Selection
    initPathTypeSelection();

    // Initialize Path Color Selection
    initPathColorSelection();

    // Initialize Pointer Color Selection
    initPointerColorSelectionColor();

    // Initial check (delay to allow datasets to load)
    setTimeout(() => {
        if (fromInput.value && toInput.value) executeSearch();
    }, 2000);
}

// ── POINTER & TRAVEL MODE SELECTION ──────────────────

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
            updatePointerSelectionUI();
            menu.classList.remove('active');
            
            // Sync current path immediately
            if (window.updateCurrentPathPointer) window.updateCurrentPathPointer();
            
            if (window.playSound) window.playSound('UI_CLICK');
        };
        menu.appendChild(opt);
    });

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

function initAutocomplete(fromInput, toInput) {
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
    toInput.addEventListener('input', handleInput);

    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== fromInput && e.target !== toInput) {
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
