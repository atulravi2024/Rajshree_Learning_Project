// map_modals.js - Modal Data Population Logic

window.populateLogsModal = populateLogsModal;
window.populateInfoModal = populateInfoModal;
window.populateSearchHistoryList = populateSearchHistoryList;
window.populateAuditLogHistoryList = populateAuditLogHistoryList;

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

function populateSearchHistoryList() {
    const listBody = document.getElementById('history-modal-body');
    if (!listBody) return;

    if (!window.SEARCH_HISTORY || window.SEARCH_HISTORY.length === 0) {
        listBody.innerHTML = `
            <div style="text-align:center; padding:2rem; color:var(--text-dim);">
                <i data-lucide="search" style="width:40px; height:40px; opacity:0.2; margin-bottom:1rem;"></i>
                <p>No quantum search records found.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons({ scope: listBody });
        return;
    }

    let html = `
        <div class="history-controls" style="margin-bottom:1.5rem; display:flex; justify-content:flex-end;">
            <button class="orbital-btn-primary small" id="btn-clear-search-history" style="font-size:0.7rem; padding:4px 10px;">CLEAR ALL RECORDS</button>
        </div>
        <div class="history-list-grid" style="display:flex; flex-direction:column; gap:10px;">
    `;

    window.SEARCH_HISTORY.forEach((entry, idx) => {
        const date = new Date(entry.ts);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let modeIcon = 'map-pin';
        let routeHtml = `<span class="text-bright">${entry.from}</span>`;
        
        if (entry.mode === 'route') {
            modeIcon = 'move-right';
            routeHtml = `<span class="text-bright">${entry.from}</span> <i data-lucide="arrow-right" class="icon-tiny"></i> <span class="text-purple">${entry.to}</span>`;
        } else if (entry.mode === 'via') {
            modeIcon = 'map-pinned';
            routeHtml = `<span class="text-bright">${entry.from}</span> <i data-lucide="arrow-right" class="icon-tiny"></i> <span class="text-yellow">${entry.via}</span> <i data-lucide="arrow-right" class="icon-tiny"></i> <span class="text-purple">${entry.to}</span>`;
        }

        html += `
            <div class="history-item-row" onclick="recallSearch(${idx})" style="background:rgba(255,255,255,0.03); border:1px solid rgba(0,240,255,0.1); border-radius:6px; padding:12px; cursor:pointer; transition:all 0.2s ease; position:relative; overflow:hidden;">
                <div class="history-item-bg-glow"></div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <i data-lucide="${modeIcon}" class="text-cyan" style="width:14px; height:14px;"></i>
                        <span style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px;">${entry.mode}</span>
                    </div>
                    <span style="font-size:0.65rem; color:var(--text-dim); font-family:var(--font-code);">${timeStr}</span>
                </div>
                <div class="history-route" style="font-size:0.85rem; display:flex; align-items:center; gap:6px;">
                    ${routeHtml}
                </div>
            </div>
        `;
    });

    html += '</div>';
    listBody.innerHTML = html;

    // Clear History Event
    const clearBtn = document.getElementById('btn-clear-search-history');
    if (clearBtn) {
        clearBtn.onclick = (e) => {
            e.stopPropagation();
            window.SEARCH_HISTORY = [];
            localStorage.removeItem('FRONTIER_SEARCH_HISTORY');
            populateSearchHistoryList();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        };
    }

    if (window.lucide) lucide.createIcons({ scope: listBody });

    // Update modal title
    const modalTitle = document.querySelector('#modal-search-history .hud-modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = '<i data-lucide="history"></i> QUANTUM SEARCH HISTORY';
    }
}

function populateAuditLogHistoryList() {
    const listBody = document.getElementById('logs-modal-body');
    if (!listBody) return;

    let contentHtml = '';

    // Section 1: Information about the project
    contentHtml += '<div style="color:var(--theme-accent); font-weight:bold; margin-bottom:10px; font-size:0.85rem; border-bottom:1px solid rgba(0,240,255,0.2); padding-bottom:5px; display:flex; align-items:center; gap:6px;"><i data-lucide="cpu" style="width:14px; height:14px;"></i> SYSTEM STATUS</div>';
    if (window.SYSTEM_METRICS) {
        const infoItems = window.SYSTEM_METRICS.slice(0, 4); // Show top 4 metrics
        contentHtml += '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-bottom:15px; font-size:0.75rem;">';
        infoItems.forEach(item => {
            const val = typeof item.value === 'function' ? item.value() : item.value;
            contentHtml += `<div style="background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.03);"><span style="color:var(--text-dim)">${item.label}:</span> <span style="color:var(--text-bright)">${val}</span></div>`;
        });
        contentHtml += '</div>';
    }

    // Section 2: Full Audit Trail
    contentHtml += '<div style="color:#facc15; font-weight:bold; margin-bottom:10px; font-size:0.85rem; border-bottom:1px solid rgba(250,204,21,0.2); padding-bottom:5px; margin-top:20px; display:flex; align-items:center; gap:6px;"><i data-lucide="scroll-text" style="width:14px; height:14px;"></i> AUDIT TRAIL RECORDS</div>';
    
    if (window.AUDIT_LOG_HISTORY) {
        // Show everything: threat, warning, info
        contentHtml += window.AUDIT_LOG_HISTORY.map(log => {
            const color = {
                'threat': '#ff3e3e',
                'warning': '#facc15',
                'info': '#00f0ff'
            }[log.type] || 'var(--text-mid)';
            
            const badgeCls = log.type === 'threat' ? 'threat' : (log.type === 'warning' ? 'warning' : 'info');
            
            return `
            <div class="log-row" style="padding: 0.8rem 0; border-bottom: 1px dashed rgba(255,255,255,0.05); display:flex; flex-direction:column; gap:4px; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:4px; height:12px; background:${color}; border-radius:2px;"></div>
                        <span style="color:${color}; font-weight:700; font-size:0.75rem; letter-spacing:0.5px;">[${log.type.toUpperCase()}] ${log.event}</span>
                    </div>
                    <span style="font-size:0.65rem; color:var(--text-dim); font-family:var(--font-code);">${log.ts}</span>
                </div>
                <div style="color:var(--text-mid); font-size:0.82rem; margin-left:12px; line-height:1.4;">${log.text}</div>
                <div style="color:var(--text-dim); font-size:0.68rem; font-family:var(--font-mono); margin-left:12px; display:flex; align-items:center; gap:4px;">
                    <i data-lucide="map-pin" style="width:10px; height:10px;"></i> ${log.loc}
                </div>
            </div>`;
        }).join('');
    } else {
        contentHtml += '<div style="color:var(--text-dim); padding:1rem; text-align:center;">No audit trail records found.</div>';
    }

    listBody.innerHTML = contentHtml;

    // Update modal title
    const modalTitle = document.querySelector('#modal-audit-logs .hud-modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = '<i data-lucide="list"></i> HISTORY LOG // AUDIT TRAIL';
    }
    if (window.lucide) lucide.createIcons({ scope: listBody });
}

function recallSearch(index) {
    const entry = window.SEARCH_HISTORY[index];
    if (!entry) return;

    const fromInput = document.getElementById('map-search-from');
    const viaInput = document.getElementById('map-search-via');
    const toInput = document.getElementById('map-search-to');

    if (fromInput) fromInput.value = entry.from;
    if (viaInput) viaInput.value = entry.via || '';
    if (toInput) toInput.value = entry.to || '';

    window.SEARCH_MODE = entry.mode;
    window.VIA_MODE_ACTIVE = (entry.mode === 'via');

    if (typeof updateSearchModeUI === 'function') updateSearchModeUI();
    
    // Close modal
    document.getElementById('modal-search-history')?.classList.remove('open');

    // Trigger Search
    setTimeout(() => {
        document.getElementById('btn-run-search')?.click();
    }, 300);

    if (window.playSound) window.playSound('UI_CONFIRM');
}

window.recallSearch = recallSearch;
