/**
 * nav_back.js - Logic for Back Side (Globe Search, Location, and Travel).
 * Handles: Global Search, Distance Bar, metrics popup, and search mode selection.
 */

window.SEARCH_MODE = 'route'; // POI | ROUTE | VIA
window.VIA_MODE_ACTIVE = false;

function initNavBack() {
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

        // SearchDeepLocation should be available globally
        const fromCoords = typeof searchDeepLocation === 'function' ? searchDeepLocation(from) : null;
        const viaCoords = (window.SEARCH_MODE === 'via' && via && typeof searchDeepLocation === 'function') ? searchDeepLocation(via) : null;
        const toCoords = (window.SEARCH_MODE !== 'poi' && to && typeof searchDeepLocation === 'function') ? searchDeepLocation(to) : null;

        if (window.SEARCH_MODE === 'poi') {
            if (fromCoords) {
                if (window.rotateGlobeToCoords) window.rotateGlobeToCoords(fromCoords.lat, fromCoords.lon);
                if (window.playSound) window.playSound('UI_QUANTUM_LOCK');
                if (window.drawQuantumPath) window.drawQuantumPath([]);
                if (window.updateNavbarMetrics) window.updateNavbarMetrics(fromCoords, null, null);
                window._mapTargetCameraZ = 150;
                // Sync zoom slider UI
                const zSlider = document.getElementById('globe-zoom-slider');
                if (zSlider && typeof window.mapZToSlider === 'function') {
                    zSlider.value = window.mapZToSlider(150);
                }
                recordSearchHistory(from, '', '', 'poi');
            } else {
                if (window.showErrorShake) window.showErrorShake();
            }
        } else {
            if (fromCoords && toCoords) {
                const coordinateArray = viaCoords ? [fromCoords, viaCoords, toCoords] : [fromCoords, toCoords];
                if (window.drawQuantumPath) window.drawQuantumPath(coordinateArray);
                if (window.playSound) window.playSound('UI_CONFIRM');
                
                // CALCULATE MIDPOINT FOR FOCUS
                const midLat = (fromCoords.lat + toCoords.lat) / 2;
                let midLon;
                const dLon = toCoords.lon - fromCoords.lon;
                if (Math.abs(dLon) > 180) {
                    midLon = (fromCoords.lon + toCoords.lon + 360) / 2;
                    if (midLon > 180) midLon -= 360;
                } else {
                    midLon = (fromCoords.lon + toCoords.lon) / 2;
                }

                if (window.rotateGlobeToCoords) window.rotateGlobeToCoords(midLat, midLon);
                if (window.updateNavbarMetrics) window.updateNavbarMetrics(fromCoords, toCoords, viaCoords);
                
                // BACK TO FIXED ZOOM (DEFAULT 150)
                window._mapTargetCameraZ = 150;
                // Sync zoom slider UI
                const zSlider = document.getElementById('globe-zoom-slider');
                if (zSlider && typeof window.mapZToSlider === 'function') {
                    zSlider.value = window.mapZToSlider(150);
                }
                recordSearchHistory(from, via, to, window.SEARCH_MODE);
            } else {
                if (window.showErrorShake) window.showErrorShake();
            }
        }
        
        runBtn.style.transform = 'scale(0.9)';
        setTimeout(() => runBtn.style.transform = '', 100);
    }

    // Key Listeners
    [fromInput, viaInput, toInput].forEach(inp => {
        if (inp) inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeSearch(); });
    });
    runBtn.addEventListener('click', executeSearch);

    // New Search History Button (Back Side)
    const historyBtn = document.getElementById('btn-search-history-settings');
    if (historyBtn) {
        historyBtn.addEventListener('click', () => {
            if (typeof populateSearchHistoryList === 'function') populateSearchHistoryList();
            document.getElementById('modal-search-history')?.classList.add('open');
            if (window.lucide) lucide.createIcons();
            if (window.playSound) window.playSound('UI_CLICK');
        });
    }

    // Initializations
    if (window.initAutocomplete) window.initAutocomplete(fromInput, viaInput, toInput);
    if (window.initClearButtons) window.initClearButtons(fromInput, viaInput, toInput);
    if (window.initSwapHandlers) window.initSwapHandlers(fromInput, viaInput, toInput);
    initSearchModeSelection(fromInput, viaInput, toInput);

    if (window.initPointerSelection) window.initPointerSelection();
    if (window.initLineStyleSelection) window.initLineStyleSelection();
    if (window.initPathTypeSelection) window.initPathTypeSelection();
    if (window.initPathColorSelection) window.initPathColorSelection();
    if (window.initPointerColorSelectionColor) window.initPointerColorSelectionColor();

    // --- DISTANCE METRICS (BACK SIDE) ---
    const metricTrigger = document.getElementById('trigger-actual-metrics');
    const metricPopup = document.getElementById('metrics-popup');
    
    if (metricTrigger && metricPopup) {
        metricTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = metricPopup.classList.toggle('active');
            metricTrigger.classList.toggle('active', isActive);
        });

        document.addEventListener('click', (e) => {
            if (metricPopup.classList.contains('active') && !metricPopup.contains(e.target) && !metricTrigger.contains(e.target)) {
                metricPopup.classList.remove('active');
                metricTrigger.classList.remove('active');
            }
        });
    }
}

// ── SEARCH HISTORY SYSTEM ──────────────────────────────

window.SEARCH_HISTORY = JSON.parse(localStorage.getItem('FRONTIER_SEARCH_HISTORY') || '[]');

function recordSearchHistory(from, via, to, mode) {
    const entry = {
        ts: new Date().toISOString(),
        mode: mode,
        from: from,
        via: via,
        to: to
    };
    
    // Check if duplicate of last entry
    const last = window.SEARCH_HISTORY[0];
    if (last && last.from === from && last.via === via && last.to === to && last.mode === mode) return;

    window.SEARCH_HISTORY.unshift(entry);
    if (window.SEARCH_HISTORY.length > 50) window.SEARCH_HISTORY.pop();
    
    localStorage.setItem('FRONTIER_SEARCH_HISTORY', JSON.stringify(window.SEARCH_HISTORY));
    console.log('[History] Search Recorded:', entry);
}

window.recordSearchHistory = recordSearchHistory;

/**
 * Selection of Search Mode (POI/Route/Via).
 */
function initSearchModeSelection(from, via, to) {
    const selectorBtn = document.getElementById('btn-search-mode-selector');
    const menu = document.getElementById('map-search-mode-menu');

    if (!selectorBtn || !menu) return;

    const modes = [
        { id: 'poi',    label: 'Point Interest', icon: 'map-pin', badge: 'P', desc: 'Single location search' },
        { id: 'route',  label: 'Direct Route',   icon: 'move-right', badge: 'R', desc: 'Start to Destination' },
        { id: 'via',    label: 'Navigation Via', icon: 'map-pinned', badge: 'V', desc: 'Start, Via, and Destination' }
    ];

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
            window.VIA_MODE_ACTIVE = (m.id === 'via');
            updateSearchModeUI();
            menu.classList.remove('active');
            if (window.playSound) window.playSound('UI_CLICK');
            if (from.value) document.getElementById('btn-run-search')?.click();
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
        'poi':    { icon: 'map-pin', badge: 'P', placeholder: 'SEARCH CITY/NODE...', title: 'Location: POINT' },
        'route':  { icon: 'move-right', badge: 'R', placeholder: 'START...', title: 'Location: START' },
        'via':    { icon: 'map-pinned', badge: 'V', placeholder: 'START...', title: 'Location: START' }
    }[window.SEARCH_MODE];

    selectorBtn.innerHTML = `<i data-lucide="${m.icon}"></i><span class="btn-badge">${m.badge}</span>`;
    if (window.lucide) lucide.createIcons({ scope: selectorBtn });
    
    if (fromInput) {
        fromInput.placeholder = m.placeholder;
        if (fromInput.parentElement) fromInput.parentElement.setAttribute('title', m.title);
    }

    container.classList.toggle('mode-poi', window.SEARCH_MODE === 'poi');
    container.classList.toggle('mode-route', window.SEARCH_MODE === 'route');
    container.classList.toggle('mode-via', window.SEARCH_MODE === 'via');
    container.classList.toggle('via-mode-disabled', window.SEARCH_MODE !== 'via');

    if (menu) {
        menu.querySelectorAll('.pointer-option').forEach(opt => {
            const labelEl = opt.querySelector('.label');
            if (labelEl) {
                const text = labelEl.textContent.trim().toLowerCase();
                let isSelected = false;
                if (window.SEARCH_MODE === 'poi' && text.includes('point interest')) isSelected = true;
                if (window.SEARCH_MODE === 'route' && text.includes('direct route')) isSelected = true;
                if (window.SEARCH_MODE === 'via' && text.includes('navigation via')) isSelected = true;
                opt.classList.toggle('selected', isSelected);
            }
        });
    }

    const fromBtn = document.querySelector('.from-field .clear-input-btn');
    const viaBtn = document.querySelector('.via-field .clear-input-btn');
    const toBtn = document.querySelector('.to-field .clear-input-btn');
    if (fromBtn) fromBtn.classList.toggle('visible', !!fromInput?.value);
    if (viaBtn) viaBtn.classList.toggle('visible', !!document.getElementById('map-search-via')?.value);
    if (toBtn) toBtn.classList.toggle('visible', !!document.getElementById('map-search-to')?.value);
}

window.initNavBack = initNavBack;
window.updateSearchModeUI = updateSearchModeUI;

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
};
