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
        icon: 'power',
        spark: [80, 82, 85, 90, 88, 95, 93],
        cardType: 'bullets',
        bullets: ['Strict Boundaries', 'Memory Map', 'Excel Guardrail', 'Arch Standard', 'Old Archive', 'Governance Core'],
        footerLabel: 'SYSTEM & GUARDRAILS',
        footerMetrics: { label1: 'DOMAIN', val1: 'SYS-CORE', label2: 'TYPE', val2: 'Governance' },
        keywords: ['memory map', 'guardrails', 'architecture', 'governance'],
        resources: ['00.00_MEMORY_MAP.js', '00.01_STRICT_BOUNDARIES.md', '00.02_MEMORY_ARCHITECTURE.md']
    },
    {
        slot: '02',
        domainId: '05',
        name: 'Infrastructure',
        icon: 'crosshair',
        spark: [40, 38, 42, 45, 43, 50, 48],
        cardType: 'chart-bar',
        footerLabel: 'INFRASTRUCTURE',
        footerMetrics: { label1: 'SOURCE', val1: 'GitHub' },
        keywords: ['github', 'devops', 'changelog', 'systems'],
        resources: ['05.01_GITHUB_CHANGELOG.md', '05.02_GITHUB_MEMORY.md']
    },
    {
        slot: '03',
        domainId: '02',
        name: 'Research & Knowledge',
        icon: 'settings',
        spark: [5, 8, 10, 15, 18, 20, 25],
        cardType: 'chart-bar',
        footerLabel: 'RESEARCH & KNOWLEDGE',
        footerMetrics: { label1: 'TRAFFIC', val1: '5 docs', label2: 'TIME', val2: 'Deep' },
        keywords: ['database schema', 'TTS engines', 'roadmap', 'expansion', 'safety'],
        resources: ['02.01_Database_Schemas/', '02.02_TTS_Engines/', '02.03_Roadmap/']
    },
    {
        slot: '04',
        domainId: '10',
        name: 'MVP',
        icon: 'settings',
        spark: [10, 20, 40, 35, 50, 45, 60],
        cardType: 'chart-line',
        footerLabel: 'MVP',
        footerMetrics: { label1: 'PRIORITY', val1: 'P1 + P2', label2: 'STATE', val2: 'Active' },
        keywords: ['mvp audit', 'priority 1', 'priority 2', 'monetization'],
        resources: ['10.01_MVP_AUDIT_REPORT.md', '10.02_MVP_PRIORITY_1.md', '10.03_MVP_PRIORITY_2.md']
    },
    {
        slot: '05',
        domainId: '01',
        name: 'Current State',
        icon: 'sliders',
        spark: [20, 35, 50, 40, 60, 75, 80],
        cardType: 'chart-line',
        footerLabel: 'CURRENT STATE',
        footerMetrics: { label1: 'STREAMS', val1: '25 docs', label2: 'BASE', val2: 'v16.7' },
        keywords: ['project index', 'changelog', 'css', 'js', 'audio mapping'],
        resources: ['01.00_PROJECT_INDEX.md', '01.06_PROJECT_CHANGELOG.md', '01.10_MENU_NAVBAR.md']
    },
    {
        slot: '06',
        domainId: '06',
        name: 'Internal Audit',
        icon: 'alert-triangle',
        spark: [95, 98, 100, 99, 100, 98, 100],
        cardType: 'chart-shield',
        footerLabel: 'INTERNAL AUDIT',
        footerMetrics: { label1: 'THREAT', val1: '99.4%', label2: 'STATUS', val2: 'Clear' },
        keywords: ['audit', 'neural hub', 'frontier', 'mockup', 'fidelity'],
        resources: ['v2.0/index.html', 'v2_styles.css', 'v2_logic.js', 'Mockups/']
    },
    {
        slot: '07',
        domainId: '04',
        name: 'Sandbox & Demos',
        icon: 'cloud',
        spark: [10, 15, 20, 30, 25, 20, 15],
        cardType: 'two-col-stats',
        stats: [{ label: 'CLOUD', val: '329 TB' }, { label: 'RUNTIME', val: '55 TB' }],
        footerLabel: 'SANDBOX & DEMOS',
        footerMetrics: {},
        keywords: ['demo assets', 'sandbox', 'prototype', 'experiments'],
        resources: ['04.01_DEMO_ASSETS.md', '04.02_README.md']
    },
    {
        slot: '08',
        domainId: '03',
        name: 'Architecture & Planning',
        icon: 'align-justify',
        spark: [60, 55, 65, 70, 65, 75, 80],
        cardType: 'chart-line',
        footerLabel: 'ARCHITECTURE & PLANNING',
        footerMetrics: { label1: 'RESOURCE', val1: '53.3B', label2: 'BASE', val2: '4m 12s' },
        keywords: ['architecture', 'monorepo', 'domain-driven', 'johnny decimal'],
        resources: ['03.01_Current_Architecture.md', '03.03_Ultra_Refined.md', '03.06_Peak_Domain.md']
    },
    {
        slot: '09',
        domainId: '09',
        name: 'Audio Script',
        icon: 'activity',
        spark: [30, 50, 70, 40, 85, 60, 90],
        cardType: 'waveform',
        footerLabel: 'AUDIO SCRIPT',
        footerMetrics: { label1: 'DURATION', val1: '4m 12s' },
        keywords: ['audio scripts', 'matra gyan', 'hindi', 'tts', 'content'],
        resources: ['09.01_Matra_Gyan_Audio_Scripts.md']
    }
];

const WAVE_HEIGHTS = [15, 35, 55, 70, 45, 80, 60, 90, 50, 75, 40, 65, 30, 55, 45, 70, 35, 60, 25, 80];

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
            if (['chart-line','chart-bar','chart-shield'].includes(d.cardType)) {
                renderCardChart(d);
            }
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
    const metricsHTML = (metrics.label1 || metrics.label2) ? `
        <div class="card-data-row">
            ${metrics.label1 ? `<div class="card-metric">
                <span class="metric-label">${metrics.label1}</span>
                <span class="metric-value">${metrics.val1}</span>
            </div>` : ''}
            ${metrics.label2 ? `<div class="card-metric">
                <span class="metric-label">${metrics.label2}</span>
                <span class="metric-value">${metrics.val2}</span>
            </div>` : ''}
        </div>` : '';

    return `
        <div class="card-top">
            <span class="card-num">${d.slot}</span>
            <span class="card-icon"><i data-lucide="${d.icon}"></i></span>
        </div>
        <div class="card-title">${d.name}</div>
        <div class="card-body">${buildCardBody(d)}</div>
        ${metricsHTML}
        <div class="card-footer-link">
            <span>${d.footerLabel}</span>
            <span class="arrow">→</span>
        </div>
        <div class="card-accent"></div>
    `;
}

function buildCardBody(d) {
    switch (d.cardType) {
        case 'bullets':
            return `<div class="card-bullets">
                ${(d.bullets || []).map(b => `<span class="card-bullet">${b}</span>`).join('')}
            </div>`;

        case 'two-col-stats':
            return `<div class="card-big-stats">
                ${(d.stats || []).map(s => `<div class="big-stat">
                    <div class="big-stat-val">${s.val}</div>
                    <div class="big-stat-label">${s.label}</div>
                </div>`).join('')}
            </div>`;

        case 'waveform':
            return `<div class="card-waveform">
                ${WAVE_HEIGHTS.map((h, i) =>
                    `<div class="wave-bar" style="height:${h}%;animation-delay:${(i * 0.065).toFixed(2)}s"></div>`
                ).join('')}
            </div>`;

        case 'chart-shield':
            return `<div class="card-shield-icon"><i data-lucide="shield-alert"></i></div>
                    <div class="card-viz"><canvas id="spark-${d.slot}"></canvas></div>`;

        case 'chart-line':
        case 'chart-bar':
        default:
            return `<div class="card-viz"><canvas id="spark-${d.slot}"></canvas></div>`;
    }
}

// ─────────────────────────────────────────────────
// CARD CHART RENDERER
// ─────────────────────────────────────────────────
function renderCardChart(d) {
    const canvas = document.getElementById(`spark-${d.slot}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isBar = d.cardType === 'chart-bar' || d.cardType === 'chart-shield';

    new Chart(ctx, {
        type: isBar ? 'bar' : 'line',
        data: {
            labels: d.spark.map((_, i) => i),
            datasets: [{
                data: d.spark,
                borderColor: 'rgba(0,240,255,0.8)',
                backgroundColor: isBar
                    ? d.spark.map(() => 'rgba(0,240,255,0.35)')
                    : 'rgba(0,240,255,0.08)',
                borderWidth: isBar ? 0 : 1.5,
                borderRadius: isBar ? 2 : 0,
                pointRadius: 0,
                tension: 0.4,
                fill: !isBar
            }]
        },
        options: {
            events: [],
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { display: false }, y: { display: false } },
            plugins: { legend: { display: false } },
            animation: { duration: 600, easing: 'easeOutQuart' }
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
            labels: ['W1','W2','W3','W4','W5','W6','W7'],
            datasets: [{
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
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: '#4a6a78', font: { size: 8, family: 'Fira Code' } },
                    grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }
                },
                y: { display: false }
            },
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });
}
