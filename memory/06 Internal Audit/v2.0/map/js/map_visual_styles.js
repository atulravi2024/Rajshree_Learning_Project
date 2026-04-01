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
            'map-path-color-menu', 'map-pointer-color-menu', 'map-altitude-menu', 'map-speed-menu', 'map-search-mode-menu'
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
        const labelSpan = opt.querySelector('.label');
        const label = labelSpan ? labelSpan.textContent : '';
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
            'map-path-color-menu', 'map-pointer-color-menu', 'map-altitude-menu', 'map-speed-menu', 'map-search-mode-menu'
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
        const labelSpan = opt.querySelector('.label');
        const label = labelSpan ? labelSpan.textContent : '';
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
            'map-path-type-menu', 'map-pointer-color-menu', 'map-altitude-menu', 'map-speed-menu', 'map-search-mode-menu'
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
        const labelSpan = opt.querySelector('.label');
        const label = labelSpan ? labelSpan.textContent : '';
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
            'map-path-type-menu', 'map-path-color-menu', 'map-altitude-menu', 'map-speed-menu', 'map-search-mode-menu'
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
        const labelSpan = opt.querySelector('.label');
        const label = labelSpan ? labelSpan.textContent : '';
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
