// map_widgets.js - 2D Widget Renderers for the Holographic Map

function initMockDataFeeds() {
    const barsContainer = document.getElementById('metric-bars-container');
    if (barsContainer) {
        for (let i = 0; i < 12; i++) {
            const bar = document.createElement('div');
            bar.className = `metric-bar ${Math.random() > 0.5 ? 'level-high' : 'level-low'}`;
            bar.style.height = `${Math.floor(Math.random() * 80 + 20)}%`;
            barsContainer.appendChild(bar);
        }
        setInterval(() => {
            Array.from(barsContainer.children).forEach(bar => {
                bar.style.height = `${Math.floor(Math.random() * 80 + 20)}%`;
                bar.className = `metric-bar ${Math.random() > 0.6 ? 'level-high' : 'level-low'}`;
            });
        }, 1500);
    }

    renderComplianceWidget();
    renderDonutChart();
    renderAdminActivity();
    renderSessions();
    renderHardwareGauges();
    initAnomalyScanner();
    renderLatencyMatrix();
    renderIntegritySeals();
    renderSectorFlow();
    renderIncidents();
    renderBackups();
    renderCredentialGauge();
    renderTopology();
    renderThreatVectors();
    renderGeoLogs();
    renderQuarantineList();
    renderUptime();
    renderMemoryMatrix();
    renderSignalInterference();

    setInterval(renderHardwareGauges, 2000);
    setInterval(renderSessions, 3000);
    setInterval(renderLatencyMatrix, 2500);
    setInterval(renderMemoryMatrix, 5000);
}

function initRealDataFeeds() {
    const logContainer = document.getElementById('audit-trail-log');
    if (logContainer && window.AUDIT_LOG_HISTORY) {
        syncAuditTrail();
        setInterval(() => {
            if (window._mapTabState === 'monitoring') {
                const pool = window.AUDIT_LOG_HISTORY;
                const entry = pool[Math.floor(Math.random() * pool.length)];
                addAuditTrailEntry(entry);
            }
        }, 4000);
    }
    updateSidebarForSelection();
    setInterval(updateSidebarForSelection, 2000);
}

function syncAuditTrail() {
    const logContainer = document.getElementById('audit-trail-log');
    if (!logContainer || !window.AUDIT_LOG_HISTORY) return;
    logContainer.innerHTML = '';
    const recent = window.AUDIT_LOG_HISTORY.slice(0, 6);
    recent.forEach(log => addAuditTrailEntry(log, false));
}

function addAuditTrailEntry(log, prepend = true) {
    const logContainer = document.getElementById('audit-trail-log');
    if (!logContainer) return;
    const el = document.createElement('div');
    el.className = `log-entry ${log.type === 'threat' ? 'threat-log' : ''}`;
    el.innerHTML = `<div class="dot"></div><div class="log-text"><span class="${log.type === 'threat' ? 'highlight' : 'text-dim'}">${log.event}</span><br/>${log.text}<br/><span style="font-size:0.65rem;color:var(--text-dim)">${log.loc}</span></div>`;
    if (prepend) {
        logContainer.prepend(el);
        if (logContainer.children.length > 8) logContainer.lastElementChild.remove();
    } else logContainer.appendChild(el);
}

function renderComplianceWidget() {
    const container = document.getElementById('compliance-list');
    if (!container || !window.COMPLIANCE_DATA) return;
    container.innerHTML = window.COMPLIANCE_DATA.map(item => `
        <div class="compliance-row">
            <span style="color:var(--text-mid);font-size:0.72rem;min-width:50px">${item.sector}</span>
            <div class="compliance-bar-wrap"><div class="compliance-bar ${item.tier}" style="width:${item.score}%"></div></div>
            <span class="compliance-pct">${item.score}%</span>
        </div>`).join('');
}

function renderDonutChart() {
    const canvas = document.getElementById('resource-donut');
    const legend = document.getElementById('donut-legend');
    if (!canvas || !window.RESOURCE_DATA) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = cx - 4, innerR = outerR * 0.55;
    let startAngle = -Math.PI / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.RESOURCE_DATA.forEach(item => {
        const sweep = (item.pct / 100) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep); ctx.closePath();
        ctx.fillStyle = item.color; ctx.globalAlpha = 0.85; ctx.fill();
        startAngle += sweep + 0.04;
    });
    ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2); ctx.fillStyle = 'rgba(4, 14, 22, 0.95)'; ctx.fill();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.8)'; ctx.font = 'bold 9px Fira Code, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('ALLOC', cx, cy - 5); ctx.fillText('%', cx, cy + 7);
    if (legend) legend.innerHTML = window.RESOURCE_DATA.map(item => `<div class="donut-item"><div class="donut-dot" style="background:${item.color}"></div><span>${item.label} <strong style="color:var(--text-bright)">${item.pct}%</strong></span></div>`).join('');
}

function renderAdminActivity() {
    const container = document.getElementById('admin-activity-log');
    if (!container || !window.ADMIN_ACTIVITY) return;
    container.innerHTML = window.ADMIN_ACTIVITY.map(e => `<div class="admin-entry"><div class="adot"></div><span class="a-time">${e.time}</span><span class="a-msg"><span class="a-who">${e.who}</span> — ${e.msg}</span></div>`).join('');
}

function renderSessions() {
    const container = document.getElementById('session-feed');
    if (!container || !window.SESSION_DATA) return;
    container.innerHTML = window.SESSION_DATA.map(s => {
        const pingBase = parseInt(s.ping), jitter = Math.floor(Math.random() * 3);
        return `<div class="session-row ${s.active ? 'active-session' : ''}"><div><div class="session-user">${s.user}</div><div class="session-node">${s.node}</div></div><div class="session-ping">${pingBase + jitter}ms</div></div>`;
    }).join('');
}

function renderHardwareGauges() {
    const container = document.getElementById('hw-gauges');
    if (!container || !window.HARDWARE_METRICS) return;
    container.innerHTML = window.HARDWARE_METRICS.map(m => {
        const val = Math.min(100, Math.max(10, m.base + Math.floor(Math.random() * m.variance * 2) - m.variance));
        const cls = val >= 80 ? 'hot' : val >= 55 ? 'warm' : 'cool';
        return `<div class="hw-gauge-item"><span class="hw-label">${m.label}</span><div class="hw-track"><div class="hw-fill ${cls}" style="width:${val}%"></div></div><span class="hw-value">${val}°C</span></div>`;
    }).join('');
}

function initAnomalyScanner() {
    const resultEl = document.getElementById('anomaly-result');
    if (!resultEl) return;
    const states = [{ text: 'SCANNING…' }, { text: 'NO ANOMALY' }, { text: 'VARIANCE +2.1%' }];
    let idx = 0;
    setInterval(() => {
        if (document.body.classList.contains('lockdown-active')) return;
        const s = states[idx % states.length];
        resultEl.textContent = s.text;
        idx++;
    }, 3200);
}

function renderLatencyMatrix() {
    const grid = document.getElementById('latency-matrix-grid');
    if (!grid || !window.LATENCY_MATRIX_DATA) return;
    grid.innerHTML = window.LATENCY_MATRIX_DATA.map(d => {
        const val = d.val + Math.floor(Math.random() * 5);
        return `<div class="latency-cell ${val > 30 ? 'high-latency' : val < 10 ? 'low-latency' : ''}">${val}ms</div>`;
    }).join('');
}

function renderIntegritySeals() {
    const container = document.getElementById('seal-container');
    if (!container || !window.INTEGRITY_SEAL_DATA) return;
    container.innerHTML = window.INTEGRITY_SEAL_DATA.map(s => `<div class="seal-indicator ${s.status}"><i data-lucide="${s.status === 'locked' ? 'lock' : 'unlock'}"></i><span style="font-size:0.6rem;margin-top:2px;">${s.name}</span></div>`).join('');
    lucide.createIcons();
}

/**
 * Animated Sector Flow wave.
 */
function renderSectorFlow() {
    const canvas = document.getElementById('sector-flow-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h); ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, h / 2);
    for (let i = 0; i < w; i += 10) ctx.lineTo(i, h / 2 + Math.sin(i / 20 + Date.now() / 500) * 15);
    ctx.stroke(); requestAnimationFrame(renderSectorFlow);
}

function renderIncidents() {
    const feed = document.getElementById('incident-list');
    if (!feed || !window.INCIDENT_DATA) return;
    feed.innerHTML = window.INCIDENT_DATA.map(i => `<div class="incident-entry"><span class="incident-code">${i.code}</span><span class="incident-msg">${i.msg}</span><span class="incident-loc">${i.loc}</span></div>`).join('');
}

function renderBackups() {
    const grid = document.getElementById('backup-list');
    if (!grid || !window.BACKUP_DATA) return;
    grid.innerHTML = window.BACKUP_DATA.map(b => `<div class="backup-snap"><span class="snap-label">${b.label}</span><span class="snap-item">${b.time}</span><span class="snap-item" style="color:${b.integrity === '100%' ? '#22c55e' : '#ff3e3e'}">${b.integrity}</span></div>`).join('');
}

function renderCredentialGauge() {
    const container = document.getElementById('credential-gauge');
    if (!container || !window.CREDENTIAL_LEVEL) return;
    container.innerHTML = `<div class="cred-meter"><div class="cred-fill" style="width:${window.CREDENTIAL_LEVEL.access}%"></div></div><div style="font-size:0.6rem;color:var(--text-dim);margin-top:5px;font-family:var(--font-mono)">${window.CREDENTIAL_LEVEL.tier} // ACCESS ${window.CREDENTIAL_LEVEL.access}%</div>`;
}

function renderTopology() {
    const wrap = document.getElementById('topology-map');
    if (wrap) wrap.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--text-dim);font-family:var(--font-mono)">MAP RECON [OK]</div>';
}

function renderThreatVectors() {
    const map = document.getElementById('threat-vector-map');
    if (!map || !window.THREAT_VECTOR_DATA) return;
    let dots = '';
    for (let i = 0; i < 60; i++) dots += `<div class="vector-dot ${window.THREAT_VECTOR_DATA.some(v => v.id === i && v.alert) ? 'alert' : ''}"></div>`;
    map.innerHTML = dots;
}

function renderGeoLogs() {
    const feed = document.getElementById('geo-log-list');
    if (!feed || !window.GEO_LOG_DATA) return;
    feed.innerHTML = window.GEO_LOG_DATA.map(l => `<div class="geo-entry"><span class="geo-coord">${l.coord}</span><span class="geo-label">${l.label}</span></div>`).join('');
}

function renderQuarantineList() {
    const feed = document.getElementById('quarantine-list');
    if (!feed || !window.QUARANTINE_DATA) return;
    feed.innerHTML = window.QUARANTINE_DATA.map(q => `<div class="quarantine-item"><i data-lucide="skull"></i> ${q}</div>`).join('');
    lucide.createIcons();
}

function renderUptime() {
    const grid = document.getElementById('uptime-stats');
    if (!grid || !window.UPTIME_DATA) return;
    grid.innerHTML = window.UPTIME_DATA.map(u => `<div class="uptime-box"><div class="uptime-label">${u.label}</div><div class="uptime-val">${u.val}</div></div>`).join('');
}

function renderMemoryMatrix() {
    const grid = document.getElementById('memory-matrix-grid');
    if (!grid || !window.MEMORY_MATRIX_DATA) return;
    grid.innerHTML = window.MEMORY_MATRIX_DATA.map(p => `<div class="mem-pixel ${p === 1 ? 'filled' : ''}"></div>`).join('');
}

function renderSignalInterference() {
    const val = document.getElementById('noise-value');
    if (val) val.textContent = (Math.random() * 5).toFixed(1) + '%';
    const canvas = document.getElementById('noise-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#facc15';
    for (let i = 0; i < 50; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    setTimeout(renderSignalInterference, 100);
}

function populateLogsModal() {
    const body = document.getElementById('logs-modal-body');
    if (!body || !window.AUDIT_LOG_HISTORY) return;
    body.innerHTML = window.AUDIT_LOG_HISTORY.map(log => `<div class="log-row"><span class="log-ts">${log.ts}</span><span class="log-badge ${log.type}">${log.type.toUpperCase()}</span><div><div class="log-content"><span class="log-event">${log.event}</span>${log.text}</div><div class="log-loc">↳ ${log.loc}</div></div></div>`).join('');
}

function populateInfoModal() {
    const body = document.getElementById('info-modal-body');
    if (!body || !window.SYSTEM_METRICS) return;
    body.innerHTML = window.SYSTEM_METRICS.map(m => {
        const val = typeof m.value === 'function' ? m.value() : m.value;
        const status = typeof m.status === 'function' ? m.status() : m.status;
        return `<div class="metric-row"><span class="m-label">${m.label}</span><span class="m-value ${status === 'critical' ? 'critical' : (val === 'SEALED' ? 'sealed' : '')}">${val}</span></div>`;
    }).join('');
}

function initCardCollapsibility() {
    document.querySelectorAll('.widget-header').forEach(header => {
        header.addEventListener('click', () => {
            const widget = header.closest('.holo-widget');
            if (widget) widget.classList.toggle('collapsed');
        });
    });
}
