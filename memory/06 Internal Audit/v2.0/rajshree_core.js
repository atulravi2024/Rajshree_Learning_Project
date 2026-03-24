/**
 * FRONTIER PROTOCOL v2.0 — Logic Engine
 * Pixel-perfect match to nav_entry_mockup.png with Rajshree Learning Project data
 */

// ── SETTINGS ENGINE ──────────────────────────────────
// Global config state, initialized from defaults.
const CONFIG = {
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
};

let dataRefreshInterval = null;

/**
 * Synchronizes CSS variables that depend on the active theme's RGB color.
 * Avoids browser compatibility issues with calc() inside rgba().
 */
function updateVisualSettings() {
    requestAnimationFrame(() => {
        const root = document.documentElement;
        const body = document.body;
        
        let rgb = getComputedStyle(body).getPropertyValue('--accent-rgb').trim();
        if (!rgb) rgb = '0, 240, 255'; 

        const accentColor = `rgb(${rgb})`;
        
        // Root Variable Synchronization (The Single Source of Truth)
        root.style.setProperty('--accent-rgb', rgb);
        root.style.setProperty('--theme-accent', accentColor);
        root.style.setProperty('--cyan', accentColor);
        root.style.setProperty('--cyan-dim', `rgba(${rgb}, 0.6)`);
        root.style.setProperty('--text-cyan', accentColor);

        // Dynamic style injection for pseudo-elements and scrollbars
        let themeStyle = document.getElementById('frontier-dynamic-theme');
        if (!themeStyle) {
            themeStyle = document.createElement('style');
            themeStyle.id = 'frontier-dynamic-theme';
            document.head.appendChild(themeStyle);
        }
        const glowOpacity = CONFIG.glowIntensity / 100;
        const glowSoft = 0.2 * glowOpacity; // Soft glow (20%)
        const glowMid = 0.4 * glowOpacity; // Mid glow (40%) for cards
        themeStyle.innerHTML = `
            .nav-link.active::after { 
                background: var(--theme-accent) !important; 
                box-shadow: 0 0 12px rgba(${rgb}, ${glowSoft}) !important; 
            }
            ::-webkit-scrollbar-thumb {
                background: rgba(${rgb}, ${glowSoft}) !important;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: rgba(${rgb}, ${glowMid}) !important;
            }
        `;
    });
}

/**
 * Applies a setting change to the live DOM.
 * @param {string} id - The setting key
 * @param {*} value - The new value
 */
function applySettingEffect(id, value) {
    const root = document.documentElement;
    const body = document.body;
    const mainEl = document.querySelector('.frontier-main');

    switch (id) {
        case 'theme':
            // List of all theme classes to clear
            const themeClasses = [
                'theme-frontier', 'theme-obsidian', 'theme-ghost', 'theme-nordic', 
                'theme-synth', 'theme-royal', 'theme-emerald', 'theme-crimson', 
                'theme-solar', 'theme-stealth'
            ];
            body.classList.remove(...themeClasses);
            
            if (value !== 'frontier') {
                body.classList.add(`theme-${value}`);
            } else {
                body.classList.add('theme-frontier');
            }
            CONFIG.theme = value;
            updateVisualSettings();
            hapticPulse();
            break;

        case 'glow':
            CONFIG.glowIntensity = value;
            root.style.setProperty('--neural-glow-opacity', value / 100);
            updateVisualSettings();
            break;

        case 'scanline':
            CONFIG.scanlineIntensity = value;
            // Boost scanline opacity mapping to make it very obvious when sliding (0 to 1.5)
            root.style.setProperty('--scanline-opacity', (value / 100) * 1.5);
            break;

        case 'glare':
            CONFIG.glareIntensity = value;
            root.style.setProperty('--glare-opacity', value / 100);
            break;

        case 'grid':
            CONFIG.gridOpacity = value;
            root.style.setProperty('--grid-opacity', value / 100);
            break;

        case 'glass':
            CONFIG.glassBlur = value;
            root.style.setProperty('--glass-blur', `${value}px`);
            break;

        case 'chroma':
            CONFIG.chromaShift = value;
            root.style.setProperty('--chroma-shift', `${value / 5}px`);
            body.classList.toggle('chroma-distort', value > 0);
            break;

        case 'refresh':
            CONFIG.refreshRate = parseFloat(value);
            initDataRefresh();
            break;

        case 'sync':
            CONFIG.autoSync = value;
            if (value) initDataRefresh();
            else stopDataRefresh();
            break;

        case 'masking':
            CONFIG.dataMasking = value;
            root.style.setProperty('--data-blur-amount', value ? '6px' : '0px');
            if (mainEl) mainEl.classList.toggle('data-masked', value);
            hapticPulse();
            break;

        case 'lock':
            CONFIG.protocolLock = value;
            if (mainEl) mainEl.classList.toggle('protocol-locked', value);
            hapticPulse();
            break;

        case 'auditor-name': {
            CONFIG.auditorName = value || 'ATUL VERMA';
            const nameEl = document.querySelector('.nav-user-info .name');
            if (nameEl) {
                nameEl.textContent = CONFIG.auditorName.toUpperCase();
                nameEl.classList.remove('name-updated');
                void nameEl.offsetWidth; // trigger reflow for animation restart
                nameEl.classList.add('name-updated');
                setTimeout(() => nameEl.classList.remove('name-updated'), 900);
            }
            break;
        }

        case 'volume':
            CONFIG.masterVolume = value;
            updateVolIndicator(value);
            break;

        case 'bleeps':
            CONFIG.feedbackBleeps = value;
            break;
    }
}

/**
 * Triggers a brief visual pulse on the navbar to simulate haptic/bleep feedback.
 */
function hapticPulse() {
    if (!CONFIG.feedbackBleeps) return;
    const body = document.body;
    const nav = document.querySelector('.frontier-nav');
    
    // Pulse the navbar (classic)
    if (nav) {
        nav.classList.remove('haptic-pulse');
        void nav.offsetWidth;
        nav.classList.add('haptic-pulse');
    }

    // Pulse the entire body background/glare if it exists
    const glare = document.querySelector('.holographic-glare');
    if (glare) {
        glare.classList.remove('glare-pulse');
        void glare.offsetWidth;
        glare.classList.add('glare-pulse');
    }
}

/**
 * Updates the volume indicator bar in the settings sidebar.
 * @param {number} vol - Volume 0–100
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

/**
 * Starts or restarts the data refresh simulation.
 */
function initDataRefresh() {
    stopDataRefresh();
    if (!CONFIG.autoSync) return;

    const intervalMs = CONFIG.refreshRate * 1000;
    dataRefreshInterval = setInterval(() => {
        // Slightly jitter visible KPI val spans on cards
        document.querySelectorAll('.domain-kpi').forEach(el => {
            const base = parseFloat(el.dataset.base || el.textContent);
            if (!el.dataset.base) el.dataset.base = base;
            const jitter = (Math.random() - 0.5) * 4;
            const newVal = Math.max(0, (base + jitter)).toFixed(0);
            el.textContent = newVal;
        });
    }, intervalMs);
}

function stopDataRefresh() {
    if (dataRefreshInterval) {
        clearInterval(dataRefreshInterval);
        dataRefreshInterval = null;
    }
}


// Domain data — mapped to user's MEMORY_MAP structure
const DOMAIN_DATA = [

    {
        slot: '00',
        domainId: '00',
        name: 'System & Guardrails',
        icon: 'shield-check',
        graphLabel: 'PROTOCOL INTEGRITY',
        kpi: '100',
        units: 'PASS',
        status: 'stable',
        spark: [98, 100, 99, 100, 100, 98, 100, 100, 99, 100, 100, 100, 99, 100, 100],
        cardType: 'chart-shield',
        footerLabel: 'SYSTEM & GUARDRAILS',
        footerMetrics: { 
            label1: 'RULES', val1: '12', 
            label2: 'DRIFT', val2: '0.0%',
            label3: 'LATENCY', val3: '2ms',
            label4: 'UPTIME', val4: '100%',
            label5: 'LOAD', val5: '14%'
        },
        keywords: ['memory map', 'guardrails', 'architecture', 'governance'],
        resources: ['00.00_MEMORY_MAP.js', '00.01_STRICT_BOUNDARIES.md']
    },
    {
        slot: '01',
        domainId: '01',
        name: 'Current State',
        icon: 'activity',
        graphLabel: 'VERSION PULSE',
        kpi: '4',
        units: 'MODS',
        status: 'stable',
        spark: [2, 5, 3, 8, 4, 1, 6, 4, 9, 3, 4, 2, 7, 5, 4],
        cardType: 'chart-line',
        footerLabel: 'CURRENT STATE',
        footerMetrics: { 
            label1: 'VERSION', val1: 'v2.0', 
            label2: 'DELTA', val2: '+15%',
            label3: 'MODS', val3: '04',
            label4: 'BRANCH', val4: 'MAIN',
            label5: 'STABLE', val5: 'YES'
        },
        keywords: ['project index', 'changelog', 'css', 'js', 'audio mapping'],
        resources: ['01.00_PROJECT_INDEX.md', '01.06_PROJECT_CHANGELOG.md']
    },
    {
        slot: '02',
        domainId: '02',
        name: 'Research & Knowledge',
        icon: 'book-open',
        status: 'warning',
        spark: [20, 25, 30, 45, 45, 50, 60, 62, 65, 70, 70, 75, 78, 80, 82],
        graphLabel: 'TOPIC COVERAGE',
        kpi: '82',
        units: '%',
        cardType: 'chart-bar',
        footerLabel: 'RESEARCH & KNOWLEDGE',
        footerMetrics: { 
            label1: 'DOCS', val1: '124', 
            label2: 'REFS', val2: '1.2k',
            label3: 'TOPICS', val3: '42',
            label4: 'SOURCES', val4: '09',
            label5: 'CITES', val5: '380'
        },
        keywords: ['database schema', 'TTS engines', 'roadmap', 'expansion', 'safety'],
        resources: ['02.01_Database_Schemas/', '02.02_TTS_Engines/']
    },
    {
        slot: '03',
        domainId: '03',
        name: 'Architecture & Planning',
        icon: 'layout',
        status: 'active',
        graphLabel: 'DESIGN COHESION',
        kpi: '88',
        units: '%',
        spark: [70, 72, 75, 78, 80, 82, 85, 88],
        cardType: 'chart-line',
        footerLabel: 'ARCHITECTURE & PLANNING',
        footerMetrics: { 
            label1: 'MODULES', val1: '24', 
            label2: 'TIERS', val2: '04',
            label3: 'DEBT', val3: 'LOW',
            label4: 'DOCS', val4: 'YES',
            label5: 'SYNC', val5: 'ON'
        },
        keywords: ['blueprint', 'structural', 'planning', 'scaling'],
        resources: ['03.01_ARCHITECTURE_MAP.md', '03.02_PROJECT_ROADMAP.md']
    },
    {
        slot: '04',
        domainId: '04',
        name: 'Sandbox & Demos',
        icon: 'flask-conical',
        graphLabel: 'PROTOTYPE DRIFT',
        kpi: '0.4',
        units: 'LOW',
        status: 'active',
        spark: [2.1, 1.8, 2.5, 1.5, 3.0, 1.2, 0.8, 1.4, 0.5, 1.1, 0.9, 0.3, 0.7, 0.4, 0.4],
        cardType: 'chart-bar',
        footerLabel: 'SANDBOX & DEMOS',
        footerMetrics: { 
            label1: 'STABLE', val1: 'YES',
            label2: 'EXP', val2: '02',
            label3: 'PUSH', val3: 'READY',
            label4: 'ENV', val4: 'PROD',
            label5: 'HASH', val5: '8F2C'
        }
    },
    {
        slot: '05',
        domainId: '05',
        name: 'Infrastructure & Workflows',
        icon: 'server',
        graphLabel: 'NETWORK LATENCY',
        kpi: '12',
        units: 'ms',
        status: 'active',
        spark: [15, 12, 14, 22, 11, 13, 10, 12, 11, 15, 12, 18, 12, 13, 12],
        cardType: 'chart-bar',
        footerLabel: 'INFRASTRUCTURE',
        footerMetrics: { 
            label1: 'COMMITS', val1: '45+', 
            label2: 'UPTIME', val2: '99.9%',
            label3: 'NODES', val3: '08',
            label4: 'TRAFFIC', val4: 'HIGH',
            label5: 'SENSORS', val5: 'ON'
        },
        keywords: ['github', 'devops', 'changelog', 'systems'],
        resources: ['05.01_GITHUB_CHANGELOG.md', '05.02_GITHUB_MEMORY.md']
    },
    {
        slot: '06',
        domainId: '06',
        name: 'Internal Audit',
        icon: 'search',
        graphLabel: 'FIDELITY SCORE',
        kpi: '404',
        units: 'LEAKS',
        status: 'threat',
        spark: [50, 120, 250, 380, 420, 404],
        cardType: 'chart-shield',
        footerLabel: 'INTERNAL AUDIT',
        footerMetrics: { 
            label1: 'THREAT', val1: 'HIGH', 
            label2: 'ISSUES', val2: '08',
            label3: 'SCORE', val3: '9.9/10',
            label4: 'ALARM', val4: 'ON',
            label5: 'SOURCE', val5: 'EXT'
        },
        keywords: ['audit', 'neural hub', 'frontier', 'mockup', 'fidelity'],
        resources: [
            'index.html', 
            'Audit Memory/06.00_AUDIT_INDEX.md',
            'Audit Memory/06.01_AUDIT_HTML_LAYOUT.md'
        ]
    },
    {
        slot: '07',
        domainId: '07',
        name: 'AI Training & Models',
        icon: 'cpu',
        status: 'stable',
        graphLabel: 'MODEL ACCURACY',
        kpi: '98.4',
        units: '%',
        spark: [90, 92, 94, 95, 96, 97, 98, 98.4],
        footerLabel: 'AI TRAINING',
        footerMetrics: { 
            label1: 'EPOCHS', val1: '250', 
            label2: 'PARAMS', val2: '1.2B',
            label3: 'LOSS', val3: '0.04',
            label4: 'BIAS', val4: 'MIN',
            label5: 'OPT', val5: 'ADAM'
        },
        keywords: ['neural', 'weights', 'inference', 'training']
    },
    {
        slot: '08',
        domainId: '08',
        name: 'Protocol X',
        icon: 'hexagon',
        status: 'warning',
        kpi: '0.12',
        units: 'drift',
        spark: [0.05, 0.08, 0.15, 0.1, 0.11, 0.12],
        graphLabel: 'DRIFT ANALYSIS',
        cardType: 'chart-line',
        footerLabel: 'PROTOCOL X',
        footerMetrics: { 
            label1: 'LAYERS', val1: '12', 
            label2: 'MODULES', val2: '04',
            label3: 'SYNC', val3: 'FAIL',
            label4: 'PORT', val4: '8080',
            label5: 'IP', val5: '127.0.0.1'
        }
    },
    {
        slot: '09',
        domainId: '09',
        name: 'Audio Script',
        icon: 'mic',
        status: 'stable',
        kpi: '505',
        units: 'files',
        spark: [100, 250, 400, 480, 495, 505],
        graphLabel: 'CONTENT TOTAL',
        cardType: 'waveform',
        footerLabel: 'AUDIO SCRIPT',
        footerMetrics: { 
            label1: 'SCRIPTS', val1: 'ON', 
            label2: 'LEVEL', val2: 'MAX',
            label3: 'PHASE', val3: '02',
            label4: 'LANG', val4: 'HINDI',
            label5: 'QUAL', val5: 'HD'
        }
    },
    {
        slot: '10',
        domainId: '10',
        name: 'MVP',
        icon: 'rocket',
        graphLabel: 'BUILD PROGRESS',
        kpi: '92',
        units: '%',
        status: 'active',
        spark: [10, 15, 25, 30, 40, 45, 55, 60, 65, 75, 80, 85, 88, 90, 92],
        cardType: 'chart-line',
        footerLabel: 'MVP',
        footerMetrics: { 
            label1: 'PRIORITY', val1: 'P1+P2', 
            label2: 'TASKS', val2: '8/12',
            label3: 'STAGE', val3: 'BETA',
            label4: 'SPRINT', val4: '04',
            label5: 'VELO', val5: '1.4x'
        },
        keywords: ['mvp audit', 'priority 1', 'priority 2', 'monetization'],
        resources: ['10.01_MVP_AUDIT_REPORT.md', '10.02_MVP_PRIORITY_1.md']
    },
    {
        slot: '11',
        domainId: '11',
        name: 'Security & Ethics',
        icon: 'lock',
        status: 'stable',
        graphLabel: 'ETHICS SCORE',
        kpi: '100',
        units: 'SAFE',
        spark: [100, 100, 100, 100, 100],
        footerLabel: 'SECURITY & ETHICS',
        footerMetrics: { 
            label1: 'FILTER', val1: 'ON', 
            label2: 'BIAS', val2: 'ZERO',
            label3: 'JAIL', val3: 'PROOT',
            label4: 'AUDIT', val4: 'PASS',
            label5: 'POL+', val5: 'YES'
        },
        keywords: ['safety', 'ethics', 'security', 'privacy']
    }
];

const WAVE_HEIGHTS = [
    18, 32, 45, 60, 25, 80, 55, 95, 40, 70, 35, 65, 20, 50, 48, 75, 30, 85, 60, 90,
    15, 40, 55, 78, 42, 88, 62, 98, 50, 82, 38, 72, 28, 58, 46, 76, 32, 86, 64, 92,
    22, 44, 58, 82, 45, 92, 65, 95, 55, 85, 42, 75, 35, 65, 52, 80, 38, 88, 68, 96
];

const NOTIFICATIONS = [
    {
        id: 1,
        type: 'AUDITS',
        title: 'System Drift Detected',
        desc: 'Minor variance in Sector 08 (Protocol X) requires verification. Current deviation: +5.2%.',
        time: '2 mins ago',
        icon: 'alert-triangle',
        unread: true
    },
    {
        id: 2,
        type: 'SECURITY',
        title: 'Leaked Credential Alert',
        desc: 'Potential compromise in Sector 02 portal access restricted. Lead Auditor review required.',
        time: '45 mins ago',
        icon: 'shield-alert',
        unread: true
    },
    {
        id: 3,
        type: 'REPORTS',
        title: 'Q1 Audit Report Ready',
        desc: 'Consolidated report for Sector 09 (Cultural Matra) generated. Ready for executive review.',
        time: '1 hour ago',
        icon: 'file-text',
        unread: true
    },
    {
        id: 4,
        type: 'MIGRATIONS',
        title: 'Data Sync Complete',
        desc: 'Migration of Sector 11 (Hindi Matra) artifacts to Frontier Hub finalized. Integrity check: PASS.',
        time: '2 hours ago',
        icon: 'database',
        unread: false
    },
    {
        id: 5,
        type: 'SYSTEM',
        title: 'Core Protocol Upgrade',
        desc: 'Frontier Hub v2.1 deployment pending. System stability: 99.8%. Check log #409.',
        time: '3 hours ago',
        icon: 'cpu',
        unread: false
    },
    {
        id: 6,
        type: 'ANALYTICS',
        title: 'Anomalous Traffic Spike',
        desc: 'Data throughput spike detected in Sector 05. Pattern mismatch with baseline. Investigating...',
        time: '5 hours ago',
        icon: 'activity',
        unread: false
    },
    {
        id: 7,
        type: 'REPORTS',
        title: 'Compliance Summary Extracted',
        desc: 'Export of "System & Guardrails" compliance data completed. Files stored in secure vault.',
        time: '7 hours ago',
        icon: 'save',
        unread: false
    },
    {
        id: 8,
        type: 'AUDITS',
        title: 'Audit Log Sealed: Sector 00',
        desc: 'All sector reports verified for Lead Auditor review. Fidelity: 100%. Protocol engaged.',
        time: '8 hours ago',
        icon: 'check-circle',
        unread: false
    },
    {
        id: 9,
        type: 'MIGRATIONS',
        title: 'Legacy Data Archive',
        desc: 'Sector 01 legacy records re-indexed for deep-audit compliance. Storage optimized.',
        time: '12 hours ago',
        icon: 'archive',
        unread: false
    },
    {
        id: 10,
        type: 'SYSTEM',
        title: 'Network Latency Shift',
        desc: 'Sector 05 node response > 20ms detected. Automatic relay rerouting active.',
        time: '1 day ago',
        icon: 'wifi-off',
        unread: false
    },
    {
        id: 11,
        type: 'SECURITY',
        title: 'New Access Pattern',
        desc: 'Lead Auditor verified access from secure relay 10.0.8.2. Session logged.',
        time: '2 days ago',
        icon: 'key',
        unread: false
    }
];

// ─────────────────────────────────────────────────
// RICH TOOLTIP MAPPINGS
// ─────────────────────────────────────────────────
const ICON_DESC = {
    'shield-check': 'SECURITY SENTINEL: Ensures protocol integrity and safety guardrails.',
    'activity': 'VERSION PULSE: Real-time monitoring of project modifications and stability.',
    'book-open': 'KNOWLEDGE REPOSITORY: Tracks research progress and documentation coverage.',
    'layout': 'STRUCTURE ENGINE: Optimizes multi-tier architecture and design cohesion.',
    'flask-conical': 'INNOVATION SANDBOX: Experimental testing ground for new prototypes.',
    'server': 'INFRASTRUCTURE CORE: Monitors network latency and system stability.',
    'search': 'AUDIT LENS: Scans for fidelity leaks and structural anomalies.',
    'cpu': 'NEURAL PROCESSOR: Handles model training, epochs, and inference weights.',
    'hexagon': 'PROTOCOL X: Advanced drift analysis and modular synchronization.',
    'mic': 'AUDIO PROCESSOR: High-definition mapping of Hindi script assets.',
    'rocket': 'MVP LAUNCH GATEWAY: Manages development milestones and sprint velocity.',
    'lock': 'ETHICAL LOCKDOWN: Ensures safety filters, bias mitigation, and proot-level security.'
};

const STATUS_DESC = {
    'stable': 'STATUS: OPTIMIZED — System operating within nominal parameters. No action required.',
    'active': 'STATUS: SYNCING — Real-time processing active. Monitoring high-frequency data.',
    'warning': 'STATUS: CAUTION — Minor drift detected. Heuristic analysis recommended.',
    'threat': 'STATUS: CRITICAL — Security breach or fidelity leak detected. Immediate audit required.'
};

const DETAILED_STATUS = {
    'stable': {
        title: 'PROTOCOL INTEGRITY: PASS',
        problem: 'No structural anomalies or fidelity leaks detected in the current sector.',
        reason: 'Periodic audit cycle #402 confirms 100% compliance with Frontier v2.0-Fidelity guardrails.',
        solution: 'Continue standard monitoring. Baseline integrity is stable.',
        location: 'Core Neural Path / Sector 00'
    },
    'active': {
        title: 'SYNCING: NOMINAL',
        problem: 'High-frequency delta synchronization in progress.',
        reason: 'Real-time processing of incoming telemetry from local prototypes to Frontier Hub.',
        solution: 'Observe throughput stability. Avoid manual override during high-load cycles.',
        location: 'Neural Gateway / Production Port'
    },
    'warning': {
        title: 'HEURISTIC VARIANCE DETECTED',
        problem: 'Minor drift in Sector mapping detected (+5.2%).',
        reason: 'Heuristic pattern mismatch in recently indexed Hindi script assets or CSS descriptors.',
        solution: 'Execute manual re-indexing on the affected nodes. Review recent changelog for drift vectors.',
        location: 'Sector 08 / Extension Protocol'
    },
    'threat': {
        title: 'CRITICAL AUDIT EXCEPTION',
        problem: 'Severe fidelity leak or unauthorized access attempt detected.',
        reason: 'Neural pathway contradiction identified by System Guardrails. Potential external intercept.',
        solution: 'Engage mandatory sector quarantine. Initiate Lead Auditor override protocol immediately.',
        location: 'Sector 06 / Internal Audit'
    }
};

const VISUAL_STATE_DESC = {
    'stable': 'PULSE: Aura (Broad 4s cycle) | COLOR: Emerald Green — High stability detected.',
    'active': 'PULSE: Glitch (High-frequency 0.15s) | COLOR: Electric Cyan — Intensive data processing.',
    'warning': 'PULSE: Spin (Sustained 6s rotation) | COLOR: Amber Yellow — Heuristic analysis engaged.',
    'threat': 'PULSE: Alarm (Urgent 0.5s cycle) | COLOR: Crimson Red — Immediate investigator override required.'
};

function generateIconTooltip(d) {
    const iconSignificance = ICON_DESC[d.icon] || 'CORE MODULE: System component monitoring.';
    const visualState = VISUAL_STATE_DESC[d.status] || 'PULSE: Stable | COLOR: Deep Cyan.';
    const statusMeaning = STATUS_DESC[d.status] || 'STATUS: ACTIVE — Operational.';
    const [title, ...descParts] = iconSignificance.split(':');
    const description = descParts.join(':').trim();

    return `<span class="tooltip-title">${title}</span>` +
           `<div style="margin-bottom: 0.4rem">${description}</div>` +
           `<div style="font-size: 0.72rem; opacity: 0.7; margin-bottom: 0.4rem;">${visualState}</div>` +
           `<div class="tooltip-status ${d.status}">${statusMeaning.replace('STATUS: ', '')}</div>`;
}

let activeConsoleChart = null;

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('domain-grid');
    const memData = window.MEMORY_MAP ? window.MEMORY_MAP.memory_map : [];

    // Build and inject all cards
    DOMAIN_DATA.forEach(d => {
        const count = memData.filter(item => item.id.startsWith(d.domainId)).length;
        d._count = count;

        const card = document.createElement('div');
        card.className = 'domain-card';
        card.dataset.slot = d.slot;
        card.innerHTML = buildCardHTML(d);
        card.addEventListener('click', () => selectDomain(d));
        grid.appendChild(card);
    });

    // Initialize Lucide icons
    lucide.createIcons();

    // Render all charts after DOM settles
    setTimeout(() => {
        DOMAIN_DATA.forEach(d => {
            renderCardChart(d);
        });

        // Auto-select prioritized domain (Threat > Current State)
        const initialCard = DOMAIN_DATA.find(d => d.status === 'threat') || 
                          DOMAIN_DATA.find(d => d.slot === '01');
        if (initialCard) {
            selectDomain(initialCard);
        } else {
            closeConsole();
        }

        // Bind Close Button to reset layout
        const closeBtn = document.querySelector('.close-console');
        if (closeBtn) closeBtn.addEventListener('click', closeConsole);

        // Bind collapsable sections via event delegation
        const consoleBody = document.getElementById('console-body');
        if (consoleBody) {
            consoleBody.addEventListener('click', (e) => {
                const label = e.target.closest('.sidebar-section-label');
                if (label) {
                    const section = label.closest('.sidebar-section.collapsable');
                    if (section) section.classList.toggle('collapsed');
                }
            });
        }

        // Init Tooltip Engine
        initSentinelTooltips();

        // Init Notification Engine
        initNotifications();

        // Bind Settings Button
        const settingsBtn = document.getElementById('nav-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                showSettingsMenu();
            });
        }

        // Apply initial visual state from CONFIG
        applySettingEffect('theme', CONFIG.theme);
        applySettingEffect('glow', CONFIG.glowIntensity);
        applySettingEffect('scanline', CONFIG.scanlineIntensity);
        applySettingEffect('glare', CONFIG.glareIntensity);
        applySettingEffect('grid', CONFIG.gridOpacity);
        applySettingEffect('glass', CONFIG.glassBlur);
        applySettingEffect('chroma', CONFIG.chromaShift);
    }, 150);
});

// ─────────────────────────────────────────────────
// CARD HTML BUILDER
// ─────────────────────────────────────────────────
function buildCardHTML(d) {
    const metrics = d.footerMetrics || {};
    const tooltipData = generateIconTooltip(d);

    const metricsHTML = `
        <div class="card-data-row">
            <div class="card-metric primary">
                <span class="metric-label">CURRENT</span>
                <span class="metric-value">${d.kpi}<small>${d.units}</small></span>
            </div>
            ${Object.keys(metrics).filter(k => k.startsWith('label')).map(k => {
                const id = k.replace('label', '');
                return `
                    <div class="card-metric">
                        <span class="metric-label">${metrics['label' + id]}</span>
                        <span class="metric-value">${metrics['val' + id]}</span>
                    </div>`;
            }).join('')}
        </div>`;

    return `
        <div class="card-top">
            <span class="card-num">${d.slot}</span>
            <span class="card-icon" data-status="${d.status}" data-tooltip='${tooltipData.replace(/'/g, "&apos;")}'>
                <i data-lucide="${d.icon}"></i>
            </span>
        </div>
        <div class="card-title">${d.name}</div>
        <div class="card-body">
            ${buildCardBody(d)}
        </div>
        ${metricsHTML}
        <div class="card-accent"></div>
    `;
}

function buildCardBody(d) {
    let vizHTML = `<div class="card-viz"><canvas id="spark-${d.slot}"></canvas></div>`;
    
    // Waveform has a custom HTML structure instead of a chart canvas
    if (d.cardType === 'waveform') {
        vizHTML = `
            <div class="card-waveform">
                ${WAVE_HEIGHTS.map((h, i) =>
                    `<div class="wave-bar" style="height:${h}%;animation-duration:${(1.2 + Math.random() * 0.6).toFixed(2)}s;animation-delay:${(Math.random() * -2).toFixed(2)}s"></div>`
                ).join('')}
            </div>`;
    }

    const kpiHeader = `
        <div class="card-kpi-row">
            <div class="kpi-label">${d.graphLabel}</div>
        </div>`;

    return `${kpiHeader}${vizHTML}`;
}

// ─────────────────────────────────────────────────
// CARD CHART RENDERER
// ─────────────────────────────────────────────────
function renderCardChart(d) {
    const canvas = document.getElementById(`spark-${d.slot}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isBar = d.cardType === 'chart-bar' || d.cardType === 'chart-shield';
    const glowVal = CONFIG.glowIntensity / 100;
    const glowMid = 0.4 * glowVal; // Mid glow for charts (40%)
    const rgb = '0, 240, 255';

    // Premium "Sparkling" Gradient for line charts
    let gradient = `rgba(${rgb}, ${glowMid})`;
    if (!isBar) {
        gradient = ctx.createLinearGradient(0, 0, 0, 40);
        gradient.addColorStop(0, `rgba(${rgb}, ${glowMid})`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);
    }

    new Chart(ctx, {
        type: isBar ? 'bar' : 'line',
        data: {
            labels: d.spark.map((_, i) => 'T-' + (d.spark.length - i - 1)),
            datasets: [{
                label: d.graphLabel,
                data: d.spark,
                borderColor: `rgba(${rgb}, ${glowMid})`,
                backgroundColor: isBar ? `rgba(${rgb}, ${glowMid})` : gradient,
                borderWidth: isBar ? 0 : 2,
                borderRadius: isBar ? 2 : 0,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: '#00f0ff',
                tension: 0.45,
                fill: !isBar
            }]
        },
        options: {
            interaction: { mode: 'index', intersect: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { display: false }, y: { display: false, beginAtZero: isBar } },
            plugins: { 
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 30, 40, 0.9)',
                    titleColor: '#8db4c0',
                    bodyColor: '#00f0ff',
                    borderColor: `rgba(${rgb}, ${glowMid})`,
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) { return context.parsed.y + ' ' + d.units; }
                    }
                }
            },
            animation: { duration: 800, easing: 'easeOutQuart' },
            elements: {
                line: {
                    shadowColor: `rgba(${rgb}, ${glowMid})`,
                    shadowBlur: 10
                }
            }
        }
    });
}

// ─────────────────────────────────────────────────
// DYNAMIC TOOLTIP ENGINE
// ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────
// DYNAMIC TOOLTIP ENGINE
// ─────────────────────────────────────────────────
function initSentinelTooltips() {
    let tooltip = document.getElementById('sentinel-tooltip-float');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'sentinel-tooltip-float';
        tooltip.className = 'sentinel-tooltip-float';
        document.body.appendChild(tooltip);
    }

    let tooltipTimeout;

    const hideTooltip = () => { 
        clearTimeout(tooltipTimeout);
        tooltip.classList.remove('visible'); 
    };

    // Global delegation for tooltips
    document.body.addEventListener('mouseover', (e) => {
        // Find target with data-tooltip
        const target = e.target.closest('[data-tooltip], .card-icon, .close-console, .expand-btn');
        if (!target) return;

        let text = target.getAttribute('data-tooltip');
        
        // Fallback or specific logic for elements without explicit data-tooltip at runtime
        if (!text) {
            if (target.classList.contains('close-console')) text = '<span class="tooltip-title">DISCONNECT</span>Disconnect from current neural node.';
            if (target.classList.contains('expand-btn')) text = '<span class="tooltip-title">TOGGLE</span>Collapse or expand data section.';
            if (target.classList.contains('btn-launch')) text = '<span class="tooltip-title">TERMINAL</span>Launch direct protocol interface.';
        }

        if (!text) return;

        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltip.innerHTML = text;
            tooltip.classList.add('visible');

            const rect = target.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let top = rect.bottom + 8;
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

            // Flip if hits bottom
            if (top + tooltipRect.height > window.innerHeight) {
                top = rect.top - tooltipRect.height - 8;
            }

            // Boundary checks
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }

            tooltip.style.top = `${top + window.scrollY}px`;
            tooltip.style.left = `${left + window.scrollX}px`;
        }, 300); // 300ms delay for premium feel
    }, true);

    document.body.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-tooltip], .card-icon, .close-console, .expand-btn');
        if (target) hideTooltip();
    }, true);

    window.addEventListener('scroll', hideTooltip, { passive: true });
    window.addEventListener('resize', hideTooltip);
}

// ─────────────────────────────────────────────────
// DOMAIN SELECTION + SIDEBAR
// ─────────────────────────────────────────────────

function closeConsole() {
    const consoleEl = document.getElementById('neural-console');
    // Remove active state from all cards
    document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('active'));
    
    // Hide panel layout via CSS class
    const mainArea = document.querySelector('.frontier-main');
    if (mainArea) mainArea.classList.add('console-hidden');

    // Reset Title safely
    const title = document.getElementById('console-title');
    if (title) title.textContent = 'NEURAL HUB // 00';

    // Reset Mode
    if (consoleEl) consoleEl.removeAttribute('data-mode');
}

function selectDomain(d) {
    const consoleEl = document.getElementById('neural-console');
    const card = document.querySelector(`.domain-card[data-slot="${d.slot}"]`);
    
    // Toggle Logic: If the clicked card is already active and we are in details mode, shut it off
    if (card && card.classList.contains('active') && consoleEl.getAttribute('data-mode') !== 'settings') {
        closeConsole();
        return;
    }

    // Set Mode to Details
    if (consoleEl) consoleEl.setAttribute('data-mode', 'details');

    // Deactivate all, activate selected
    document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('active'));
    if (card) card.classList.add('active');

    // Reveal the panel if it was hidden
    const mainArea = document.querySelector('.frontier-main');
    if (mainArea) mainArea.classList.remove('console-hidden');

    // Update header: Matches folder format "06 INTERNAL AUDIT"
    document.getElementById('console-title').textContent = `${d.slot} ${d.name.toUpperCase()}`;

    // Inject dynamic icon matching the card with status-driven styling
    const iconWrap = document.getElementById('console-icon-wrap');
    if (iconWrap) {
        const tooltipData = generateIconTooltip(d);
        iconWrap.innerHTML = `
            <div class="card-icon" data-status="${d.status}" data-tooltip='${tooltipData.replace(/'/g, "&apos;")}'>
                <i data-lucide="${d.icon}"></i>
            </div>`;
        
        // Add click listener to the icon in the header
        const icon = iconWrap.querySelector('.card-icon');
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSidebarFlip();
            });
        }
    }
    
    // Scale title if needed
    setTimeout(scaleConsoleTitle, 10);

    // Rebuild sidebar body
    const body = document.getElementById('console-body');
    body.innerHTML = buildSidebarHTML(d);
    body.scrollTop = 0; // Always scroll to top

    // Render sidebar traffic chart
    setTimeout(() => renderSidebarChart(d), 60);

    // Re-init Lucide icons inside sidebar
    lucide.createIcons();
}

/**
 * 3D Flip Animation Toggle
 * Swaps between the standard domain overview and detailed audit findings.
 */
function toggleSidebarFlip() {
    const consoleEl = document.getElementById('neural-console');
    if (consoleEl && consoleEl.getAttribute('data-mode') === 'settings') return; // No flip in settings

    const body = document.getElementById('console-body');
    if (body) {
        body.classList.toggle('flipped');
        
        // Re-init Lucide icons for the back face if needed
        if (body.classList.contains('flipped')) {
            lucide.createIcons();
        }
    }
}

/**
 * Switch Sidebar to Settings Mode
 */
function showSettingsMenu() {
    const consoleEl = document.getElementById('neural-console');
    const mainArea = document.querySelector('.frontier-main');

    // Toggle Logic: If sidebar is open and in settings mode, close it
    if (consoleEl.getAttribute('data-mode') === 'settings' && !mainArea.classList.contains('console-hidden')) {
        closeConsole();
        return;
    }

    const title = document.getElementById('console-title');
    const iconWrap = document.getElementById('console-icon-wrap');
    const body = document.getElementById('console-body');

    // Deactivate all cards
    document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('active'));

    // Set Mode
    if (consoleEl) consoleEl.setAttribute('data-mode', 'settings');
    if (mainArea) mainArea.classList.remove('console-hidden');
    if (title) title.textContent = 'SYSTEM SETTINGS';

    // Set Header Icon
    if (iconWrap) {
        iconWrap.innerHTML = `
            <div class="card-icon" data-status="stable">
                <i data-lucide="settings"></i>
            </div>`;
    }

    // Build/Inject Settings View if not exists
    let settingsView = body.querySelector('.settings-view');
    if (!settingsView) {
        settingsView = document.createElement('div');
        settingsView.className = 'settings-view';
        body.appendChild(settingsView);
    }
    
    settingsView.innerHTML = buildSettingsHTML();

    // Bind Accordion Logic
    const items = settingsView.querySelectorAll('.settings-accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.settings-item-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Collapse all
            items.forEach(i => i.classList.remove('active'));
            
            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ── WIRE CONTROLS TO SETTINGS ENGINE ─────────────
    // Sliders: update label AND apply live effect
    const bindSlider = (id, valId, suffix, effectKey) => {
        const slider = document.getElementById(id);
        const label = document.getElementById(valId);
        if (!slider) return;
        // Restore state from CONFIG on re-open
        if (effectKey === 'glow')    { slider.value = CONFIG.glowIntensity; }
        if (effectKey === 'scanline'){ slider.value = CONFIG.scanlineIntensity; }
        if (effectKey === 'glare')   { slider.value = CONFIG.glareIntensity; }
        if (effectKey === 'grid')    { slider.value = CONFIG.gridOpacity; }
        if (effectKey === 'glass')   { slider.value = CONFIG.glassBlur; }
        if (effectKey === 'chroma')  { slider.value = CONFIG.chromaShift; }
        if (effectKey === 'refresh') { slider.value = CONFIG.refreshRate; }
        if (effectKey === 'volume')  { slider.value = CONFIG.masterVolume; }
        if (label) label.textContent = slider.value + suffix;
        slider.addEventListener('input', () => {
            if (label) label.textContent = slider.value + suffix;
            applySettingEffect(effectKey, parseFloat(slider.value));
        });
    };

    bindSlider('sl-refresh', 'val-refresh', 's', 'refresh');
    bindSlider('sl-glow',    'val-glow',    '%', 'glow');
    bindSlider('sl-scan',    'val-scan',    '%', 'scanline');
    bindSlider('sl-glare',   'val-glare',   '%', 'glare');
    bindSlider('sl-grid',    'val-grid',    '%', 'grid');
    bindSlider('sl-glass',   'val-glass',   'px', 'glass');
    bindSlider('sl-chroma',  'val-chroma',  '%', 'chroma');
    bindSlider('sl-vol',     'val-vol',     '%', 'volume');

    // Theme select
    const themeSelect = document.getElementById('sel-theme');
    if (themeSelect) {
        themeSelect.value = CONFIG.theme;
        themeSelect.addEventListener('change', () => {
            applySettingEffect('theme', themeSelect.value);
        });
    }

    // Toggles: update CONFIG and apply live effect
    const bindToggle = (id, effectKey) => {
        const toggle = document.getElementById(id);
        if (!toggle) return;
        // Restore state from CONFIG on re-open
        if (effectKey === 'sync')    toggle.checked = CONFIG.autoSync;
        if (effectKey === 'masking') toggle.checked = CONFIG.dataMasking;
        if (effectKey === 'lock')    toggle.checked = CONFIG.protocolLock;
        if (effectKey === 'bleeps')  toggle.checked = CONFIG.feedbackBleeps;
        toggle.addEventListener('change', () => {
            applySettingEffect(effectKey, toggle.checked);
        });
    };

    bindToggle('tg-sync',   'sync');
    bindToggle('tg-bleeps', 'bleeps');
    bindToggle('tg-mask',   'masking');
    bindToggle('tg-lock',   'lock');

    // Start data refresh engine if auto-sync is on
    if (CONFIG.autoSync) initDataRefresh();

    // ── AUDITOR NAME ──────────────────────────────────
    const auditorInput = document.getElementById('in-auditor');
    if (auditorInput) {
        // Restore from CONFIG
        auditorInput.value = CONFIG.auditorName || 'ATUL VERMA';
        auditorInput.addEventListener('input', () => {
            applySettingEffect('auditor-name', auditorInput.value.trim());
        });
    }

    // ── ACTIVITY LOGS BUTTON ──────────────────────────
    const logsBtn = document.getElementById('btn-activity-logs');
    if (logsBtn) {
        logsBtn.addEventListener('click', () => {
            openAlertsModal();
        });
    }

    // ── VOLUME INDICATOR ──────────────────────────────
    // Draw the initial state based on CONFIG
    updateVolIndicator(CONFIG.masterVolume);

    // Re-init Lucide
    lucide.createIcons();
}


function buildSettingsHTML() {
    return `
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
                        <input type="range" class="console-slider" id="sl-refresh" min="0.5" max="5.0" step="0.1" value="2.5">
                    </div>
                    <div class="settings-field" style="flex-direction: row; justify-content: space-between; align-items: center;">
                        <span class="field-label">Neural Auto-Sync</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="tg-sync" checked>
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
                        <select class="console-select" id="sel-theme">
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
                        <input type="range" class="console-slider" id="sl-glow" min="0" max="100" value="85">
                    </div>
                    <div class="settings-field">
                        <div class="field-header">
                            <span class="field-label">Scanline Intensity</span>
                            <span class="field-value" id="val-scan">40%</span>
                        </div>
                        <input type="range" class="console-slider" id="sl-scan" min="0" max="100" value="40">
                    </div>
                    <div class="settings-field">
                        <div class="field-header">
                            <span class="field-label">Holographic Glare</span>
                            <span class="field-value" id="val-glare">40%</span>
                        </div>
                        <input type="range" class="console-slider" id="sl-glare" min="0" max="100" value="40">
                    </div>
                    <div class="settings-field">
                        <div class="field-header">
                            <span class="field-label">Grid Background</span>
                            <span class="field-value" id="val-grid">100%</span>
                        </div>
                        <input type="range" class="console-slider" id="sl-grid" min="0" max="100" value="100">
                    </div>
                    <div class="settings-field">
                        <div class="field-header">
                            <span class="field-label">Backdrop Blur</span>
                            <span class="field-value" id="val-glass">10px</span>
                        </div>
                        <input type="range" class="console-slider" id="sl-glass" min="0" max="40" value="10">
                    </div>
                    <div class="settings-field">
                        <div class="field-header">
                            <span class="field-label">Chroma Distortion</span>
                            <span class="field-value" id="val-chroma">0%</span>
                        </div>
                        <input type="range" class="console-slider" id="sl-chroma" min="0" max="100" value="0">
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
                        <input type="text" class="console-input" id="in-auditor" placeholder="Enter codename..." value="RAVI_01">
                    </div>
                    <button class="console-button" id="btn-activity-logs" style="margin-top: 5px;">View Activity Logs</button>
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
                            <div style="display:flex;align-items:center;gap:6px;">
                                <div class="vol-indicator-bar" id="vol-indicator">
                                    <span></span><span></span><span></span><span></span><span></span>
                                    <span></span><span></span><span></span><span></span><span></span>
                                </div>
                                <span class="field-value" id="val-vol">75%</span>
                            </div>
                        </div>
                        <input type="range" class="console-slider" id="sl-vol" min="0" max="100" value="75">
                    </div>
                    <div class="settings-field" style="flex-direction: row; justify-content: space-between; align-items: center;">
                        <span class="field-label">Feedback Bleeps</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="tg-bleeps" checked>
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
                    <div class="settings-field" style="flex-direction: row; justify-content: space-between; align-items: center;">
                        <span class="field-label">Sensitive Data Masking</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="tg-mask">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="settings-field" style="flex-direction: row; justify-content: space-between; align-items: center;">
                        <span class="field-label">Protocol Lockdown</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="tg-lock">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ─────────────────────────────────────────────────
// DYNAMIC HEADER SCALING
// ─────────────────────────────────────────────────
function scaleConsoleTitle() {
    const title = document.getElementById('console-title');
    if (!title) return;

    // Reset to base size first to measure native width
    title.style.fontSize = '0.85rem';
    
    // The panel has a fixed target width of 360px (--side-w).
    // During the opening CSS animation, clientWidth is artificially small, 
    // causing the math to aggressively shrink the font.
    // By hardcoding the target available space (360px panel - 40px padding - 40px close button area),
    // it calculates the perfect size instantly without waiting for the animation.
    const maxWidth = 280; 
    
    let currentSize = 0.85; // rem
    
    // Loop to decrease size until it fits, down to a minimum of 0.5rem
    while (title.scrollWidth > maxWidth && currentSize > 0.5) {
        currentSize -= 0.05;
        title.style.fontSize = `${currentSize}rem`;
    }
}

// Re-scale on window resize
window.addEventListener('resize', () => {
    // Only scale if the console is actively displaying a custom title
    const title = document.getElementById('console-title');
    if (title && title.textContent !== 'NEURAL HUB // 00') {
        scaleConsoleTitle();
    }
});

// ─────────────────────────────────────────────────
// SIDEBAR HTML BUILDER
// ─────────────────────────────────────────────────
function buildSidebarHTML(d) {
    // 1. Calculate Status Colors
    const s = (d.status || 'ACTIVE').toUpperCase();
    let statusClass = 'text-stable';
    if (s.includes('THREAT') || s.includes('BREACH')) statusClass = 'text-threat';
    else if (s.includes('WARNING') || s.includes('INVESTIGATION')) statusClass = 'text-warning';

    // 2. Generate System Metrics Section dynamically
    let metricsHTML = '';
    if (d.footerMetrics && Object.keys(d.footerMetrics).length > 0) {
        const fields = Object.entries(d.footerMetrics).map(([k, v]) => `
            <div class="meta-field">
                <span class="meta-label">${k}</span>
                <span class="meta-val">${v}</span>
            </div>
        `).join('');
        metricsHTML = `
            <!-- System Metrics (Collapsible) -->
            <div class="sidebar-section collapsable collapsed">
                <div class="sidebar-section-label">
                    System Metrics <span class="expand-btn">∨</span>
                </div>
                <div class="sidebar-section-content sidebar-meta">
                    ${fields}
                </div>
            </div>
        `;
    }

    // 3. Conditional Keywords and Resources
    let kwSection = '';
    if (d.keywords && d.keywords.length > 0) {
        const kwHTML = d.keywords.map(k => `<span class="kw-pill">${k}</span>`).join('');
        kwSection = `
            <!-- Keywords (Collapsible) -->
            <div class="sidebar-section collapsable collapsed">
                <div class="sidebar-section-label">
                    Keywords <span class="expand-btn">∨</span>
                </div>
                <div class="sidebar-section-content keywords-wrap">${kwHTML}</div>
            </div>
        `;
    }

    let resSection = '';
    if (d.resources && d.resources.length > 0) {
        const resHTML = d.resources.map(r => `<div>• <span>${r}</span></div>`).join('');
        resSection = `
            <!-- Resources (Collapsible) -->
            <div class="sidebar-section collapsable collapsed">
                <div class="sidebar-section-label">
                    Resources <span class="expand-btn">∨</span>
                </div>
                <div class="sidebar-section-content resources-list">${resHTML}</div>
            </div>
        `;
    }

    // 4. Dynamic Logs
    const logText = statusClass === 'text-threat' 
        ? `CRITICAL ALERT: Anomalies detected in <em>${d.footerLabel}</em> sector. Automated quarantine protocols engaged. Administrator override required.` 
        : statusClass === 'text-warning'
        ? `Caution advised. Irregularities logged in <em>${d.footerLabel}</em> mapping. Neural heuristic analyzing potential vectors. Proceed with awareness.`
        : `Neural engine initialized. Parsing <em>${d.footerLabel}</em> domain… Artifact count: ${d._count || Math.floor(Math.random()*100)}. All systems validated. CMDR Atul Verma access granted.`;

    const detail = DETAILED_STATUS[d.status] || DETAILED_STATUS['active'];

    return `
        <!-- FRONT FACE: Standard Dashboard -->
        <div class="console-front">
                <!-- 1. Overview -->
                <div class="sidebar-section collapsable">
                    <div class="sidebar-section-label">
                        Overview <span class="expand-btn">∨</span>
                    </div>
                    <div class="sidebar-section-content sidebar-meta">
                        <div class="meta-field">
                            <span class="meta-label">Status</span>
                            <span class="meta-val ${statusClass}">${d.status || 'ACTIVE'}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label">ID</span>
                            <span class="meta-val">${d.domainId.toString().padStart(2,'0')}-CORE</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label">KPI Index</span>
                            <span class="meta-val">${d.kpi || '---'} ${d.units || ''}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label">Designation</span>
                            <span class="meta-val">${d.name.length > 15 ? d.name.substring(0, 15).toUpperCase() + '...' : d.name.toUpperCase()}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label">Sector Slot</span>
                            <span class="meta-val">SEC-${d.slot || 'XX'}</span>
                        </div>
                        ${d.footerLabel ? `
                        <div class="meta-field">
                            <span class="meta-label">Node Class</span>
                            <span class="meta-val">${d.footerLabel.toUpperCase()}</span>
                        </div>` : ''}
                    </div>
                </div>

                ${metricsHTML}

                <!-- 3. AI Transcription -->
                <div class="sidebar-section collapsable collapsed">
                    <div class="sidebar-section-label">
                        AI Interpretation <span class="expand-btn">∨</span>
                    </div>
                    <div class="sidebar-section-content transcription-box">
                        ${logText}
                    </div>
                </div>

                <!-- 4. Launch Terminal Button (Hidden during flip) -->
                <div class="sidebar-section">
                    <div class="launch-wrap">
                        <button class="btn-launch" onclick="alert('Frontier Terminal: ${d.name}')">
                            <div class="launch-terminal-icon">&gt;_]</div>
                            <div class="launch-text">
                                <strong>DOMAIN<br>TERMINAL</strong>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- 5. Domain Traffic Chart -->
                <div class="sidebar-section collapsable">
                    <div class="sidebar-section-label">
                        Domain Traffic <span class="expand-btn">∨</span>
                    </div>
                    <div class="sidebar-section-content traffic-chart-wrap">
                        <canvas id="console-chart"></canvas>
                    </div>
                </div>

                ${kwSection}
                ${resSection}
        </div>

        <!-- BACK FACE: Detailed Audit Findings -->
        <div class="console-back">
                <div class="audit-details-container">
                    <div class="audit-header">
                        <i data-lucide="shield-alert"></i>
                        <h3>DETAILED AUDIT FINDINGS</h3>
                    </div>
                    
                    <div class="audit-item critical">
                        <div class="audit-item-label">REPORTED EVENT</div>
                        <div class="audit-item-value">${detail.title}</div>
                    </div>

                    <!-- 4. Launch Terminal Button (Persistent version for back face) - MOVED BELOW CRITICAL ITEM -->
                    <div class="sidebar-section">
                        <div class="launch-wrap">
                            <button class="btn-launch" onclick="alert('Frontier Terminal: ${d.name}')">
                                <div class="launch-terminal-icon">&gt;_]</div>
                                <div class="launch-text">
                                    <strong>DOMAIN<br>TERMINAL</strong>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div class="audit-item">
                        <div class="audit-item-label">STRUCTURAL ANOMALY</div>
                        <div class="audit-item-value">${detail.problem}</div>
                    </div>

                    <div class="audit-item">
                        <div class="audit-item-label">HEURISTIC ANALYSIS</div>
                        <div class="audit-item-value">${detail.reason}</div>
                    </div>

                    <div class="audit-item">
                        <div class="audit-item-label">MITIGATION PROTOCOL</div>
                        <div class="audit-item-value">${detail.solution}</div>
                    </div>

                    <div class="audit-item">
                        <div class="audit-item-label">VECTOR LOCATION</div>
                        <div class="audit-item-value">${detail.location}</div>
                    </div>


                    <div class="audit-footer">
                        <p>AUDIT TIMESTAMP: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}</p>
                        <p>CMDR ATUL VERMA // PROTOCOL V2.0</p>
                    </div>
                </div>
            </div>
    `;
}

// ─────────────────────────────────────────────────
// SIDEBAR CHART RENDERER
// ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────
// NOTIFICATION ENGINE
// ─────────────────────────────────────────────────
function initNotifications() {
    const bell = document.getElementById('notification-bell');
    const dropdown = document.getElementById('notification-dropdown');
    const list = document.getElementById('notification-list');
    const badge = bell.querySelector('.nav-badge');

    if (!bell || !dropdown || !list) return;

    // Toggle logic
    bell.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            renderNotifications();
        }
    });

    // Close on click outside
    window.addEventListener('click', () => {
        dropdown.classList.remove('active');
    });

    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Mark All Read
    const markAllBtn = dropdown.querySelector('.mark-read');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            NOTIFICATIONS.forEach(n => n.unread = false);
            renderNotifications();
            updateNotifBadge();
        });
    }

    // View All Alerts
    const viewAllBtn = dropdown.querySelector('.dropdown-footer a');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openAlertsModal();
            dropdown.classList.remove('active');
        });
    }

    // Modal Close
    const closeModalBtn = document.getElementById('close-alerts-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAlertsModal);
    }

    const modalOverlay = document.getElementById('alerts-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeAlertsModal();
        });
    }

    // Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderModalAlerts(btn.textContent);
        });
    });

    // Initial Badge State
    updateNotifBadge();
}

function openAlertsModal() {
    const modal = document.getElementById('alerts-modal');
    if (modal) {
        modal.classList.add('active');
        // Reset filter to ALL on open
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(b => b.classList.remove('active'));
        if (filterBtns[0]) filterBtns[0].classList.add('active');
        renderModalAlerts();
    }
}

function closeAlertsModal() {
    const modal = document.getElementById('alerts-modal');
    if (modal) modal.classList.remove('active');
}

function renderModalAlerts(filterType = 'ALL ALERTS') {
    const list = document.getElementById('modal-alerts-list');
    if (!list) return;

    const filtered = filterType === 'ALL ALERTS' 
        ? NOTIFICATIONS 
        : NOTIFICATIONS.filter(n => n.type === filterType);

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-alerts">
                <i data-lucide="info"></i>
                <p>No alerts found in ${filterType} category.</p>
            </div>
        `;
    } else {
        list.innerHTML = filtered.map(n => `
            <div class="modal-alert-item ${n.unread ? 'unread' : ''}">
                <div class="alert-marker"></div>
                <div class="alert-icon"><i data-lucide="${n.icon}"></i></div>
                <div class="alert-info">
                    <h3>${n.title}</h3>
                    <p>${n.desc}</p>
                </div>
                <div class="alert-meta">
                    <span>${n.time}</span>
                    <button onclick="toggleRead(${n.id}); renderModalAlerts('${filterType}');">${n.unread ? 'MARK READ' : 'MARK UNREAD'}</button>
                </div>
            </div>
        `).join('');
    }

    lucide.createIcons();
}

function renderNotifications() {
    const list = document.getElementById('notification-list');
    if (!list) return;

    list.innerHTML = NOTIFICATIONS.map(n => `
        <div class="notification-item ${n.unread ? 'unread' : ''}" onclick="toggleRead(${n.id})">
            <div class="notif-icon">
                <i data-lucide="${n.icon}"></i>
            </div>
            <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-desc">${n.desc}</div>
                <span class="notif-time">${n.time}</span>
            </div>
        </div>
    `).join('');

    // Re-init Lucide for new icons
    lucide.createIcons();
}

function updateNotifBadge() {
    const badge = document.querySelector('#notification-bell .nav-badge');
    const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
    if (badge) {
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    }
}

function toggleRead(id) {
    const notif = NOTIFICATIONS.find(n => n.id === id);
    if (notif) {
        notif.unread = !notif.unread;
        renderNotifications();
        updateNotifBadge();
        
        // If modal is open, refresh it too
        const modal = document.getElementById('alerts-modal');
        if (modal && modal.classList.contains('active')) {
            renderModalAlerts();
        }
    }
}

function renderSidebarChart(d) {
    const canvas = document.getElementById('console-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (activeConsoleChart) { activeConsoleChart.destroy(); activeConsoleChart = null; }

    const rootStyles = getComputedStyle(document.body);
    const accentRgb = rootStyles.getPropertyValue('--accent-rgb').trim() || '0, 240, 255';
    const glowVal = CONFIG.glowIntensity / 100;

    activeConsoleChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: d.spark.map((_, i) => 'T-' + (d.spark.length - i - 1)),
            datasets: [{
                label: d.graphLabel,
                data: d.spark,
                borderColor: `rgb(${accentRgb})`,
                backgroundColor: `rgba(${accentRgb}, ${0.15 * glowVal})`,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: `rgb(${accentRgb})`,
                pointBorderColor: `rgba(${accentRgb}, ${0.4 * glowVal})`,
                pointRadius: 3,
                pointHoverRadius: 5,
                borderWidth: 2
            }]
        },
        options: {
            interaction: { mode: 'index', intersect: false },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: '#4a6a78', font: { size: 8, family: 'Fira Code' } },
                    grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }
                },
                y: { display: false, beginAtZero: false } 
            },
            plugins: { 
                legend: { display: false }, 
                tooltip: { 
                    enabled: true,
                    backgroundColor: 'rgba(0, 15, 25, 0.95)',
                    titleColor: '#8db4c0',
                    bodyColor: `rgb(${accentRgb})`,
                    borderColor: `rgba(${accentRgb}, ${0.3 * glowVal})`,
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) { return context.parsed.y + ' ' + d.units; }
                    }
                } 
            }
        }
    });
}
