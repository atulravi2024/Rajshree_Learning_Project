/**
 * FRONTIER PROTOCOL v2.0 — Logic Engine
 * Pixel-perfect match to nav_entry_mockup.png with Rajshree Learning Project data
 */

// ── SETTINGS ENGINE ──────────────────────────────────
// Global config state, initialized from defaults.
// window.CONFIG is now initialized in shared/settings.js

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
        const glowOpacity = (window.CONFIG ? window.CONFIG.glowIntensity : 85) / 100;
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
 * Starts or restarts the data refresh simulation.
 */
function initDataRefresh() {
    stopDataRefresh();
    if (window.CONFIG && !window.CONFIG.autoSync) return;

    const intervalMs = (window.CONFIG ? window.CONFIG.refreshRate : 2.5) * 1000;
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
            'dashboard.html', 
            'global.html', 
            'map.html', 
            'assets.html'
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

        // Settings button logic now handled by shared/navbar.js

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
                        <button class="btn-launch" onclick="window.location.href='../terminal/domain/domain.html?domain=${d.name}'">
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
                            <button class="btn-launch" onclick="window.location.href='../terminal/domain/domain.html?domain=${d.name}'">
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
