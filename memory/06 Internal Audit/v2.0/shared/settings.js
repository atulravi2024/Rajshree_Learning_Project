/**
 * SHARED SETTINGS ENGINE
 * Handles global configuration and visual protocol effects.
 */

window.CONFIG = {
    theme: 'frontier',
    glowIntensity: 85,
    scanlineIntensity: 40,
    glareIntensity: 40,
    gridOpacity: 100,
    glassBlur: 10,
    chromaShift: 0,
    refreshRate: 2.5,
    autoSync: true,
    masterVolume: 75,
    feedbackBleeps: true,
    dataMasking: false,
    protocolLock: false,
    auditorName: 'ATUL VERMA'
};

/**
 * Initializes the settings component by injecting the HTML and binding listeners.
 */
function initSettings() {
    const container = document.getElementById('settings-sidebar-container');
    if (!container) return;

    // Inject Settings HTML Template
    container.innerHTML = `
        <div class="settings-view" id="settings-view">
            <!-- SYSTEM OPS -->
            <div class="settings-accordion-item active">
                <div class="settings-item-header">
                    <i data-lucide="settings-2"></i>
                    <span class="settings-item-title">System Ops</span>
                </div>
                <div class="settings-item-content">
                    <div class="content-inner">
                        <div class="settings-field">
                            <div class="field-header">
                                <span class="field-label">Data Refresh Rate</span>
                                <span class="field-value" id="val-refresh">2.5s</span>
                            </div>
                            <input type="range" class="console-slider" id="sl-refresh" min="0.5" max="5.0" step="0.1" value="2.5" title="Data Refresh Rate">
                        </div>
                        <div class="settings-field settings-field-row">
                            <span class="field-label">Neural Auto-Sync</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="tg-sync" checked title="Neural Auto-Sync">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- VISUAL PROTOCOL -->
            <div class="settings-accordion-item">
                <div class="settings-item-header">
                    <i data-lucide="monitor"></i>
                    <span class="settings-item-title">Visual Protocol</span>
                </div>
                <div class="settings-item-content">
                    <div class="content-inner">
                        <div class="settings-field">
                            <span class="field-label">Interface Theme</span>
                            <select class="console-select" id="sel-theme" title="Interface Theme">
                                <option value="frontier">FRONTIER (DEFAULT)</option>
                                <option value="obsidian">OBSIDIAN NIGHT</option>
                                <option value="ghost">GHOST LIGHT</option>
                                <option value="nordic">NORDIC FROST</option>
                                <option value="synth">CYBER SYNTH</option>
                                <option value="royal">ROYAL VELVET</option>
                                <option value="emerald">EMERALD GATE</option>
                                <option value="crimson">CRIMSON CORE</option>
                                <option value="solar">SOLARIZED TEAL</option>
                                <option value="stealth">CARBON STEALTH</option>
                            </select>
                        </div>
                        <div class="settings-field">
                            <div class="field-header">
                                <span class="field-label">Neural Glow</span>
                                <span class="field-value" id="val-glow">85%</span>
                            </div>
                            <input type="range" class="console-slider" id="sl-glow" min="0" max="100" value="85" title="Neural Glow Intensity">
                        </div>
                        <div class="settings-field">
                            <div class="field-header">
                                <span class="field-label">Scanline Intensity</span>
                                <span class="field-value" id="val-scan">40%</span>
                            </div>
                            <input type="range" class="console-slider" id="sl-scan" min="0" max="100" value="40" title="Scanline Intensity">
                        </div>
                        <div class="settings-field">
                            <div class="field-header">
                                <span class="field-label">Holographic Glare</span>
                                <span class="field-value" id="val-glare">40%</span>
                            </div>
                            <input type="range" class="console-slider" id="sl-glare" min="0" max="100" value="40" title="Holographic Glare Intensity">
                        </div>
                        <div class="settings-field">
                            <div class="field-header">
                                <span class="field-label">Grid Background</span>
                                <span class="field-value" id="val-grid">100%</span>
                            </div>
                            <input type="range" class="console-slider" id="sl-grid" min="0" max="100" value="100" title="Grid Background Opacity">
                        </div>
                        <div class="settings-field">
                            <div class="field-header">
                                <span class="field-label">Backdrop Blur</span>
                                <span class="field-value" id="val-glass">10px</span>
                            </div>
                            <input type="range" class="console-slider" id="sl-glass" min="0" max="40" value="10" title="Backdrop Blur Intensity">
                        </div>
                        <div class="settings-field">
                            <div class="field-header">
                                <span class="field-label">Chroma Distortion</span>
                                <span class="field-value" id="val-chroma">0%</span>
                            </div>
                            <input type="range" class="console-slider" id="sl-chroma" min="0" max="100" value="0" title="Chroma Distortion Amount">
                        </div>
                    </div>
                </div>
            </div>

            <!-- USER GATEWAY -->
            <div class="settings-accordion-item">
                <div class="settings-item-header">
                    <i data-lucide="user-check"></i>
                    <span class="settings-item-title">User Gateway</span>
                </div>
                <div class="settings-item-content">
                    <div class="content-inner">
                        <div class="settings-field">
                            <span class="field-label">Auditor Codename</span>
                            <input type="text" class="console-input" id="in-auditor" placeholder="Enter codename..." title="Auditor Codename" value="${window.CONFIG.auditorName}">
                        </div>
                        <button class="console-button btn-margin-top" id="btn-activity-logs">View Activity Logs</button>
                    </div>
                </div>
            </div>

            <!-- NEURAL AUDIO -->
            <div class="settings-accordion-item">
                <div class="settings-item-header">
                    <i data-lucide="volume-2"></i>
                    <span class="settings-item-title">Neural Audio</span>
                </div>
                <div class="settings-item-content">
                    <div class="content-inner">
                        <div class="settings-field">
                            <div class="field-header">
                                <span class="field-label">Master UI Volume</span>
                                <div class="vol-indicator-wrapper">
                                    <div class="vol-indicator-bar" id="vol-indicator">
                                        <span></span><span></span><span></span><span></span><span></span>
                                        <span></span><span></span><span></span><span></span><span></span>
                                    </div>
                                    <span class="field-value" id="val-vol">75%</span>
                                </div>
                            </div>
                            <input type="range" class="console-slider" id="sl-vol" min="0" max="100" value="75" title="Master UI Volume">
                        </div>
                        <div class="settings-field settings-field-row">
                            <span class="field-label">Feedback Bleeps</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="tg-bleeps" checked title="Feedback Bleeps">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECURITY GUARDRAILS -->
            <div class="settings-accordion-item">
                <div class="settings-item-header">
                    <i data-lucide="shield"></i>
                    <span class="settings-item-title">Security Guardrails</span>
                </div>
                <div class="settings-item-content">
                    <div class="content-inner">
                        <div class="settings-field settings-field-row">
                            <span class="field-label">Sensitive Data Masking</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="tg-mask" title="Sensitive Data Masking">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="settings-field settings-field-row">
                            <span class="field-label">Protocol Lockdown</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="tg-lock" title="Protocol Lockdown">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize Lucide icons for the injected HTML
    if (window.lucide) lucide.createIcons();

    // Bind Accordion Logic
    container.querySelectorAll('.settings-item-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close others
            container.querySelectorAll('.settings-accordion-item').forEach(el => el.classList.remove('active'));
            
            if (!isActive) item.classList.add('active');
            if (window.hapticPulse) window.hapticPulse();
        });
    });

    // Bind Control Listeners
    const bindControl = (id, effectKey, valId, suffix = '') => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', (e) => {
            const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            applySettingEffect(effectKey, val);
            if (valId) {
                const display = document.getElementById(valId);
                if (display) display.textContent = val + suffix;
            }
        });
    };

    bindControl('sl-refresh', 'refresh', 'val-refresh', 's');
    bindControl('tg-sync', 'sync');
    bindControl('sel-theme', 'theme');
    bindControl('sl-glow', 'glow', 'val-glow', '%');
    bindControl('sl-scan', 'scanline', 'val-scan', '%');
    bindControl('sl-glare', 'glare', 'val-glare', '%');
    bindControl('sl-grid', 'grid', 'val-grid', '%');
    bindControl('sl-glass', 'glass', 'val-glass', 'px');
    bindControl('sl-chroma', 'chroma', 'val-chroma', '%');
    bindControl('in-auditor', 'auditor-name');
    bindControl('sl-vol', 'volume', 'val-vol', '%');
    bindControl('tg-bleeps', 'bleeps');
    bindControl('tg-mask', 'masking');
    bindControl('tg-lock', 'lock');

    updateVolIndicator(window.CONFIG.masterVolume);
}

/**
 * Toggles the settings sidebar visibility.
 */
window.showSettingsMenu = function() {
    let sidebar = document.querySelector('.neural-console');
    if (!sidebar) sidebar = document.querySelector('.settings-global-overlay');
    
    if (!sidebar) return;

    const currentMode = sidebar.getAttribute('data-mode');
    if (currentMode === 'settings') {
        sidebar.setAttribute('data-mode', 'normal');
    } else {
        sidebar.setAttribute('data-mode', 'settings');
    }
    
    if (window.hapticPulse) window.hapticPulse();
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', initSettings);

/**
 * Applies a setting change to the live DOM.
 */
function applySettingEffect(id, value) {
    const root = document.documentElement;
    const body = document.body;
    const mainEl = document.querySelector('.frontier-main');

    switch (id) {
        case 'theme':
            const themeClasses = [
                'theme-frontier', 'theme-obsidian', 'theme-ghost', 'theme-nordic', 
                'theme-synth', 'theme-royal', 'theme-emerald', 'theme-crimson', 
                'theme-solar', 'theme-stealth'
            ];
            body.classList.remove(...themeClasses);
            if (value !== 'frontier') body.classList.add(`theme-${value}`);
            else body.classList.add('theme-frontier');
            window.CONFIG.theme = value;
            if (window.updateVisualSettings) window.updateVisualSettings();
            if (window.hapticPulse) window.hapticPulse();
            break;

        case 'glow':
            window.CONFIG.glowIntensity = value;
            root.style.setProperty('--neural-glow-opacity', value / 100);
            if (window.updateVisualSettings) window.updateVisualSettings();
            break;

        case 'scanline':
            window.CONFIG.scanlineIntensity = value;
            root.style.setProperty('--scanline-opacity', (value / 100) * 1.5);
            break;

        case 'glare':
            window.CONFIG.glareIntensity = value;
            root.style.setProperty('--glare-opacity', value / 100);
            break;

        case 'grid':
            window.CONFIG.gridOpacity = value;
            root.style.setProperty('--grid-opacity', value / 100);
            break;

        case 'glass':
            window.CONFIG.glassBlur = value;
            root.style.setProperty('--glass-blur', `${value}px`);
            break;

        case 'chroma':
            window.CONFIG.chromaShift = value;
            root.style.setProperty('--chroma-shift', `${value / 5}px`);
            body.classList.toggle('chroma-distort', value > 0);
            break;

        case 'refresh':
            window.CONFIG.refreshRate = parseFloat(value);
            if (window.initDataRefresh) window.initDataRefresh();
            break;

        case 'sync':
            window.CONFIG.autoSync = value;
            if (value) { if (window.initDataRefresh) window.initDataRefresh(); }
            else { if (window.stopDataRefresh) window.stopDataRefresh(); }
            break;

        case 'masking':
            window.CONFIG.dataMasking = value;
            root.style.setProperty('--data-blur-amount', value ? '6px' : '0px');
            if (mainEl) mainEl.classList.toggle('data-masked', value);
            if (window.hapticPulse) window.hapticPulse();
            break;

        case 'lock':
            window.CONFIG.protocolLock = value;
            if (mainEl) mainEl.classList.toggle('protocol-locked', value);
            if (window.hapticPulse) window.hapticPulse();
            break;

        case 'auditor-name': {
            window.CONFIG.auditorName = value || 'ATUL VERMA';
            const nameEl = document.querySelector('.nav-user-info .name');
            if (nameEl) {
                nameEl.textContent = window.CONFIG.auditorName.toUpperCase();
                nameEl.classList.remove('name-updated');
                void nameEl.offsetWidth; 
                nameEl.classList.add('name-updated');
                setTimeout(() => nameEl.classList.remove('name-updated'), 900);
            }
            break;
        }

        case 'volume':
            window.CONFIG.masterVolume = value;
            updateVolIndicator(value);
            break;

        case 'bleeps':
            window.CONFIG.feedbackBleeps = value;
            break;
    }
}

/**
 * Updates the volume indicator bar.
 */
function updateVolIndicator(vol) {
    const bar = document.getElementById('vol-indicator');
    if (!bar) return;
    const bars = bar.querySelectorAll('span');
    const activeCount = Math.round((vol / 100) * bars.length);
    bars.forEach((b, i) => {
        if (i < activeCount) {
            b.classList.remove('inactive');
            const heights = [4, 6, 8, 10, 12, 10, 8, 6, 4, 6];
            b.style.height = `${heights[i] || 8}px`;
        } else {
            b.classList.add('inactive');
            b.style.height = '4px';
        }
    });
}
