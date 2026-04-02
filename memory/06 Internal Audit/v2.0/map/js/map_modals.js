// map_modals.js - Modal Data Population Logic

window.populateLogsModal = populateLogsModal;
window.populateInfoModal = populateInfoModal;
window.populateHistoryList = populateHistoryList;

function populateLogsModal() {
    const body = document.getElementById('logs-modal-body');
    if (!body || !window.AUDIT_LOG_HISTORY) return;
    body.innerHTML = window.AUDIT_LOG_HISTORY.map(log => `
        <div class="log-row">
            <span class="log-ts">${log.ts}</span>
            <span class="log-badge ${log.type}">${log.type.toUpperCase()}</span>
            <div>
                <div class="log-content"><span class="log-event">${log.event}</span>${log.text}</div>
                <div class="log-loc">↳ ${log.loc}</div>
            </div>
        </div>`).join('');
}

function populateInfoModal() {
    const body = document.getElementById('info-modal-body');
    if (!body || !window.SYSTEM_METRICS) return;
    body.innerHTML = window.SYSTEM_METRICS.map(m => {
        const val = typeof m.value === 'function' ? m.value() : m.value;
        const status = typeof m.status === 'function' ? m.status() : m.status;
        return `
            <div class="metric-row">
                <span class="m-label">${m.label}</span>
                <span class="m-value ${status === 'critical' ? 'critical' : (val === 'SEALED' ? 'sealed' : '')}">${val}</span>
            </div>`;
    }).join('');
}

function populateHistoryList() {
    const listBody = document.getElementById('history-modal-body');
    if (!listBody) return;

    let contentHtml = '';

    // Section 1: Information about the project
    contentHtml += '<div style="color:var(--theme-accent); font-weight:bold; margin-bottom:10px; font-size:0.85rem; border-bottom:1px solid rgba(0,240,255,0.2); padding-bottom:5px;">PROJECT INFORMATION</div>';
    if (window.SYSTEM_METRICS) {
        const infoItems = window.SYSTEM_METRICS.slice(0, 4); // Show top 4 metrics
        contentHtml += '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-bottom:15px; font-size:0.75rem;">';
        infoItems.forEach(item => {
            const val = typeof item.value === 'function' ? item.value() : item.value;
            contentHtml += `<div style="background:rgba(255,255,255,0.02); padding:5px; border-radius:4px;"><span style="color:var(--text-dim)">${item.label}:</span> <span style="color:var(--text-bright)">${val}</span></div>`;
        });
        contentHtml += '</div>';
    }

    // Section 2: Log of warnings and criticals
    contentHtml += '<div style="color:#facc15; font-weight:bold; margin-bottom:10px; font-size:0.85rem; border-bottom:1px solid rgba(250,204,21,0.2); padding-bottom:5px; margin-top:20px;">WARNING & CRITICAL LOGS</div>';
    
    if (window.AUDIT_LOG_HISTORY) {
        // Filter specifically for warning, threat (critical), or error
        const alerts = window.AUDIT_LOG_HISTORY.filter(log => log.type === 'warning' || log.type === 'threat' || log.status === 'critical');
        if (alerts.length > 0) {
            contentHtml += alerts.map(log => {
                const color = log.type === 'warning' ? '#facc15' : '#ff3e3e';
                return `
                <div class="log-row" style="padding: 0.6rem 0; border-bottom: 1px dashed rgba(255,255,255,0.05); display:flex; flex-direction:column; gap:4px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:${color}; font-weight:700; font-size:0.75rem;">[${log.type.toUpperCase()}] ${log.event}</span>
                        <span style="font-size:0.65rem; color:var(--text-dim)">${log.ts}</span>
                    </div>
                    <div style="color:var(--text-mid); font-size:0.8rem;">${log.text}</div>
                    <div style="color:var(--text-dim); font-size:0.7rem; font-family:var(--font-mono);">LOC: ${log.loc}</div>
                </div>`;
            }).join('');
        } else {
            contentHtml += '<div style="color:var(--text-dim); padding:1rem; text-align:center;">No warnings or critical alerts found.</div>';
        }
    }

    listBody.innerHTML = contentHtml;

    // Dynamically update the modal title to match the new functionality
    const modalTitle = document.querySelector('#modal-search-history .hud-modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = '<i data-lucide="info"></i> Project History & Alerts';
    }
}
