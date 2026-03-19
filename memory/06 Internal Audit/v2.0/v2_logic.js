const domains = {
    "10": { name: "MVP", icon: "🚀", id: "MVP-77", spark: [10, 40, 20, 50, 30] },
    "00": { name: "System & Guardrails", icon: "⌬", id: "SYS-CORE", spark: [80, 85, 90, 88, 95] },
    "01": { name: "Current State", icon: "⌬", id: "DEV-LOGS", spark: [20, 50, 40, 80, 60] },
    "02": { name: "Research & Knowledge", icon: "🖧", id: "RSH-DATA", spark: [5, 10, 15, 20, 25] },
    "03": { name: "Architecture & Planning", icon: "⚙", id: "ARC-BLUE", spark: [60, 55, 70, 65, 75] },
    "04": { name: "Sandbox & Demos", icon: "⌗", id: "SND-BOX", spark: [10, 20, 30, 20, 10] },
    "05": { name: "Infrastructure", icon: "☁", id: "INF-OPS", spark: [40, 42, 45, 43, 50] },
    "06": { name: "Internal Audit", icon: "🛡", id: "AUD-INT", spark: [100, 98, 100, 99, 100] },
    "09": { name: "Audio Script", icon: "∿", id: "AUD-SCRIPT", spark: [30, 70, 40, 90, 50] }
};

const mockTranscription = "Neural engine initialized. Parsing Matra_Gyan_Audio_Scripts.md... Domain 09 status is stable. All waveforms validated. CMDR Atul access granted.";

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('domain-grid');
    const consoleBody = document.getElementById('console-body');
    const consoleTitle = document.getElementById('console-title');

    if (!window.MEMORY_MAP) return;
    const data = window.MEMORY_MAP.memory_map;

    // Render Cards
    Object.keys(domains).forEach(id => {
        const d = domains[id];
        const count = data.filter(item => item.id.startsWith(id)).length;
        
        const card = document.createElement('div');
        card.className = 'domain-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="d-id">${id}</span>
                <span class="d-icon">${d.icon}</span>
            </div>
            <div class="d-name">${d.name}</div>
            <div class="d-status">${count} ARTIFACTS MAPPED</div>
            <canvas class="card-visual" id="chart-${id}"></canvas>
        `;
        
        card.addEventListener('click', () => selectDomain(id, count));
        grid.appendChild(card);
        
        // Render spark chart
        setTimeout(() => renderSpark(id, d.spark), 10);
    });

    function renderSpark(id, points) {
        const ctx = document.getElementById(`chart-${id}`).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: points,
                datasets: [{
                    data: points,
                    borderColor: '#7094a1',
                    borderWidth: 1,
                    pointRadius: 0,
                    tension: 0.4
                }]
            },
            options: {
                events: [],
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { display: false }, y: { display: false } },
                plugins: { legend: { display: false } }
            }
        });
    }

    function selectDomain(id, count) {
        document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('active'));
        const activeCard = Array.from(document.querySelectorAll('.domain-card')).find(c => c.querySelector('.d-id').innerText === id);
        activeCard.classList.add('active');

        consoleTitle.innerText = `${domains[id].name.toUpperCase()} // ${id}`;
        
        consoleBody.innerHTML = `
            <div class="meta-block">
                <div><span class="m-label">STATUS</span><span class="m-value">ACTIVE</span></div>
                <div><span class="m-label">DOMAIN ID</span><span class="m-value">${domains[id].id}</span></div>
                <div><span class="m-label">ARTIFACTS</span><span class="m-value">${count}</span></div>
                <div><span class="m-label">HEALTH</span><span class="m-value">99.4%</span></div>
            </div>

            <div class="m-label" style="margin-bottom: 0.5rem">AI TRANSCRIPTION</div>
            <div class="ai-transcription">
                ${mockTranscription}
            </div>

            <div class="m-label" style="margin-bottom: 0.5rem">DOMAIN TRAFFIC</div>
            <canvas id="console-chart" style="height: 150px; margin-bottom: 2rem"></canvas>

            <div class="m-label" style="margin-bottom: 0.5rem">KEYWORDS</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem">
                <span class="pill pill-cyan" style="font-size: 0.6rem">audio scripts</span>
                <span class="pill pill-cyan" style="font-size: 0.6rem">macrotis</span>
                <span class="pill pill-cyan" style="font-size: 0.6rem">hi-res</span>
                <span class="pill pill-cyan" style="font-size: 0.6rem">neuro-link</span>
            </div>

            <div class="m-label" style="margin-bottom: 0.5rem">RESOURCES</div>
            <div style="font-size: 0.7rem; color: var(--text-dim); margin-bottom: 2rem">
                • 09.01_Audio_Mapping.js<br>
                • matra_gyan_scripts.vault<br>
                • frontier_resource_usage.json
            </div>

            <div class="launch-area">
                <button class="btn-launch" onclick="alert('Terminal Initialized')">
                    <div class="term-icon">>_]</div>
                    <span>LAUNCH<br>DOMAIN TERMINAL</span>
                </button>
            </div>
        `;

        renderConsoleChart(domains[id].spark);
    }

    function renderConsoleChart(points) {
        const ctx = document.getElementById('console-chart').getContext('2d');
        if (window.activeConsoleChart) window.activeConsoleChart.destroy();
        
        window.activeConsoleChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['01', '02', '03', '04', '05'],
                datasets: [{
                    label: 'TRAFFIC',
                    data: points,
                    borderColor: '#00f3ff',
                    backgroundColor: 'rgba(0, 243, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00f3ff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { bottom: 10 } },
                scales: { 
                    x: { ticks: { color: '#7094a1', font: { size: 8 } }, grid: { display: false } },
                    y: { display: false }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
});
