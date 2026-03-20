/**
 * FRONTIER PROTOCOL v2.0 — Logic Engine
 * Pixel-perfect match to nav_entry_mockup.png with Rajshree Learning Project data
 */

// Domain data — mapped to user's MEMORY_MAP structure
const DOMAIN_DATA = [
    {
        slot: '01',
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
        footerMetrics: { label1: 'RULES', val1: '12', label2: 'DRIFT', val2: '0.0%' },
        keywords: ['memory map', 'guardrails', 'architecture', 'governance'],
        resources: ['00.00_MEMORY_MAP.js', '00.01_STRICT_BOUNDARIES.md']
    },
    {
        slot: '02',
        domainId: '05',
        name: 'Infrastructure',
        icon: 'server',
        graphLabel: 'NETWORK LATENCY',
        kpi: '12',
        units: 'ms',
        status: 'active',
        spark: [15, 12, 14, 22, 11, 13, 10, 12, 11, 15, 12, 18, 12, 13, 12],
        cardType: 'chart-bar',
        footerLabel: 'INFRASTRUCTURE',
        footerMetrics: { label1: 'COMMITS', val1: '45+', label2: 'UPTIME', val2: '99.9%' },
        keywords: ['github', 'devops', 'changelog', 'systems'],
        resources: ['05.01_GITHUB_CHANGELOG.md', '05.02_GITHUB_MEMORY.md']
    },
    {
        slot: '03',
        domainId: '02',
        name: 'Research & Knowledge',
        icon: 'book-open',
        graphLabel: 'TOPIC COVERAGE',
        kpi: '82',
        units: '%',
        status: 'stable',
        spark: [20, 25, 30, 45, 45, 50, 60, 62, 65, 70, 70, 75, 78, 80, 82],
        cardType: 'chart-bar',
        footerLabel: 'RESEARCH & KNOWLEDGE',
        footerMetrics: { label1: 'DOCS', val1: '124', label2: 'REFS', val2: '1.2k' },
        keywords: ['database schema', 'TTS engines', 'roadmap', 'expansion', 'safety'],
        resources: ['02.01_Database_Schemas/', '02.02_TTS_Engines/']
    },
    {
        slot: '04',
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
        footerMetrics: { label1: 'PRIORITY', val1: 'P1+P2', label2: 'TASKS', val2: '8/12' },
        keywords: ['mvp audit', 'priority 1', 'priority 2', 'monetization'],
        resources: ['10.01_MVP_AUDIT_REPORT.md', '10.02_MVP_PRIORITY_1.md']
    },
    {
        slot: '05',
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
        footerMetrics: { label1: 'VERSION', val1: 'v2.0', label2: 'DELTA', val2: '+15%' },
        keywords: ['project index', 'changelog', 'css', 'js', 'audio mapping'],
        resources: ['01.00_PROJECT_INDEX.md', '01.06_PROJECT_CHANGELOG.md']
    },
    {
        slot: '06',
        domainId: '06',
        name: 'Internal Audit',
        icon: 'search',
        graphLabel: 'FIDELITY SCORE',
        kpi: '99.4',
        units: '%',
        status: 'stable',
        spark: [95, 96, 96.5, 97, 98, 99, 98.5, 99.2, 99, 99.1, 99.3, 99.5, 99.2, 99.4, 99.4],
        cardType: 'chart-shield',
        footerLabel: 'INTERNAL AUDIT',
        footerMetrics: { label1: 'THREAT', val1: 'CLEAR', label2: 'ISSUES', val2: '0' },
        keywords: ['audit', 'neural hub', 'frontier', 'mockup', 'fidelity'],
        resources: [
            'index.html', 
            'Audit Memory/06.00_AUDIT_INDEX.md',
            'Audit Memory/06.01_AUDIT_HTML_LAYOUT.md',
            'Audit Memory/06.02_AUDIT_CSS_DYNAMICS.md',
            'Audit Memory/06.03_AUDIT_JS_LOGIC_FLOW.md',
            'Audit Memory/06.04_AUDIT_WORKFLOW.md'
        ]
    },
    {
        slot: '07',
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
        footerMetrics: { label1: 'STABLE', val1: '7', label2: 'EXP', val2: '12' },
        keywords: ['demo assets', 'sandbox', 'prototype', 'experiments'],
        resources: ['04.01_DEMO_ASSETS.md', '04.02_README.md']
    },
    {
        slot: '08',
        domainId: '03',
        name: 'Architecture & Planning',
        icon: 'layers',
        graphLabel: 'DEPENDENCY FLUX',
        kpi: '0',
        units: 'PASS',
        status: 'stable',
        spark: [40, 35, 20, 15, 10, 5, 2, 0, 0, 1, 0, 0, 0, 0, 0],
        cardType: 'chart-line',
        footerLabel: 'ARCHITECTURE & PLANNING',
        footerMetrics: { label1: 'LAYERS', val1: '3 Tier', label2: 'MODULES', val2: '24' },
        keywords: ['architecture', 'monorepo', 'domain-driven', 'johnny decimal'],
        resources: ['03.01_Current_Architecture.md', '03.03_Ultra_Refined.md']
    },
    {
        slot: '09',
        domainId: '09',
        name: 'Audio Script',
        icon: 'mic',
        graphLabel: 'PHONETIC ACCURACY',
        kpi: '95',
        units: 'SCORE',
        status: 'active',
        spark: [30, 50, 70, 40, 85, 60, 95],
        cardType: 'waveform',
        footerLabel: 'AUDIO SCRIPT',
        footerMetrics: { label1: 'SCRIPTS', val1: '505', label2: 'LEVEL', val2: 'High' },
        keywords: ['audio scripts', 'matra gyan', 'hindi', 'tts', 'content'],
        resources: ['09.01_Matra_Gyan_Audio_Scripts.md']
    }
];

const WAVE_HEIGHTS = [
    18, 32, 45, 60, 25, 80, 55, 95, 40, 70, 35, 65, 20, 50, 48, 75, 30, 85, 60, 90,
    15, 40, 55, 78, 42, 88, 62, 98, 50, 82, 38, 72, 28, 58, 46, 76, 32, 86, 64, 92,
    22, 44, 58, 82, 45, 92, 65, 95, 55, 85, 42, 75, 35, 65, 52, 80, 38, 88, 68, 96
];

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

        // Auto-select domain 09 to match mockup default
        const d09 = DOMAIN_DATA.find(d => d.slot === '09');
        if (d09) selectDomain(d09);
    }, 150);
});

// ─────────────────────────────────────────────────
// CARD HTML BUILDER
// ─────────────────────────────────────────────────
function buildCardHTML(d) {
    const metrics = d.footerMetrics || {};
    const metricsHTML = `
        <div class="card-data-row">
            <div class="card-metric primary">
                <span class="metric-label">CURRENT</span>
                <span class="metric-value">${d.kpi}<small>${d.units}</small></span>
            </div>
            ${metrics.label1 ? `<div class="card-metric">
                <span class="metric-label">${metrics.label1}</span>
                <span class="metric-value">${metrics.val1}</span>
            </div>` : ''}
            ${metrics.label2 ? `<div class="card-metric">
                <span class="metric-label">${metrics.label2}</span>
                <span class="metric-value">${metrics.val2}</span>
            </div>` : ''}
        </div>`;

    return `
        <div class="card-top">
            <span class="card-num">${d.slot}</span>
            <div class="card-status-badge status-${d.status}"></div>
            <span class="card-icon"><i data-lucide="${d.icon}"></i></span>
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

    // Premium "Sparkling" Gradient for line charts
    let gradient = 'rgba(0, 240, 255, 0.08)';
    if (!isBar) {
        gradient = ctx.createLinearGradient(0, 0, 0, 40);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    }

    new Chart(ctx, {
        type: isBar ? 'bar' : 'line',
        data: {
            labels: d.spark.map((_, i) => 'T-' + (d.spark.length - i - 1)),
            datasets: [{
                label: d.graphLabel,
                data: d.spark,
                borderColor: 'rgba(0, 240, 255, 0.9)',
                backgroundColor: isBar ? 'rgba(0, 240, 255, 0.4)' : gradient,
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
                    borderColor: 'rgba(0, 240, 255, 0.3)',
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
                    shadowColor: 'rgba(0, 240, 255, 0.6)',
                    shadowBlur: 10
                }
            }
        }
    });
}

// ─────────────────────────────────────────────────
// DOMAIN SELECTION + SIDEBAR
// ─────────────────────────────────────────────────
function selectDomain(d) {
    // Deactivate all, activate selected
    document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('active'));
    const card = document.querySelector(`.domain-card[data-slot="${d.slot}"]`);
    if (card) card.classList.add('active');

    // Update header
    document.getElementById('console-title').textContent = `${d.name.toUpperCase()} // ${d.slot}`;

    // Rebuild sidebar body
    const body = document.getElementById('console-body');
    body.innerHTML = buildSidebarHTML(d);
    body.scrollTop = 0; // Always scroll to top

    // Render sidebar traffic chart
    setTimeout(() => renderSidebarChart(d), 60);

    // Re-init Lucide icons inside sidebar
    lucide.createIcons();
}

// ─────────────────────────────────────────────────
// SIDEBAR HTML BUILDER
// ─────────────────────────────────────────────────
function buildSidebarHTML(d) {
    const kwHTML = (d.keywords || []).map(k => `<span class="kw-pill">${k}</span>`).join('');
    const resHTML = (d.resources || []).map(r => `<div>• <span>${r}</span></div>`).join('');

    return `
        <!-- 2×2 Meta Grid -->
        <div class="sidebar-meta">
            <div class="meta-field">
                <span class="meta-label">Status</span>
                <span class="meta-val status-active">ACTIVE</span>
            </div>
            <div class="meta-field">
                <span class="meta-label">Script ID</span>
                <span class="meta-val">${d.domainId.padStart(2,'0')}-CORE</span>
            </div>
            <div class="meta-field">
                <span class="meta-label">Source</span>
                <span class="meta-val">AMU7/V1</span>
            </div>
            <div class="meta-field">
                <span class="meta-label">Duration</span>
                <span class="meta-val">4m 12s</span>
            </div>
        </div>

        <!-- AI Transcription -->
        <div class="sidebar-section">
            <div class="sidebar-section-label">AI Transcription</div>
            <div class="transcription-box">
                Neural engine initialized. Parsing <em>${d.footerLabel}</em> domain… 
                Artifact count: ${d._count || 0}. All systems validated. 
                CMDR Atul Verma access granted.
            </div>
        </div>

        <!-- Launch Terminal Button (Moved here) -->
        <div class="launch-wrap">
            <button class="btn-launch" onclick="alert('Frontier Terminal: ${d.name}')">
                <div class="launch-terminal-icon">&gt;_]</div>
                <div class="launch-text">
                    <strong>DOMAIN<br>TERMINAL</strong>
                </div>
            </button>
        </div>

        <!-- Domain Traffic Chart -->
        <div class="sidebar-section">
            <div class="sidebar-section-label">Domain Traffic</div>
            <div class="traffic-chart-wrap">
                <canvas id="console-chart"></canvas>
            </div>
        </div>

        <!-- Keywords -->
        <div class="sidebar-section">
            <div class="sidebar-section-label">
                Keywords <span class="expand-btn">∨</span>
            </div>
            <div class="keywords-wrap">${kwHTML}</div>
        </div>

        <!-- Resources -->
        <div class="sidebar-section">
            <div class="sidebar-section-label">
                Resources <span class="expand-btn">∨</span>
            </div>
            <div class="resources-list">${resHTML}</div>
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

    activeConsoleChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: d.spark.map((_, i) => 'T-' + (d.spark.length - i - 1)),
            datasets: [{
                label: d.graphLabel,
                data: d.spark,
                borderColor: '#00f0ff',
                backgroundColor: 'rgba(0,240,255,0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00f0ff',
                pointBorderColor: 'rgba(0,240,255,0.3)',
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
                y: { display: false, beginAtZero: false } // ensure auto-scaling
            },
            plugins: { 
                legend: { display: false }, 
                tooltip: { 
                    enabled: true,
                    backgroundColor: 'rgba(0, 30, 40, 0.9)',
                    titleColor: '#8db4c0',
                    bodyColor: '#00f0ff',
                    borderColor: 'rgba(0, 240, 255, 0.3)',
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
