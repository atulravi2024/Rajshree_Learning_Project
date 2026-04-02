// map_ops.js - System Operations: Deep Scan, Lockdown, and Quarantine

window.runDeepScan = runDeepScan;
window.triggerLockdown = triggerLockdown;
window.runQuarantineSequence = runQuarantineSequence;

function runDeepScan() {
    if (window._isDeepScanning) return;
    window._isDeepScanning = true;

    // Play sound if available
    if (window.playSound) window.playSound('SCAN_INITIATE');

    const btn = document.getElementById('btn-deep-scan');
    if (btn) btn.classList.add('active');

    // Trigger subtle globe rotation animation
    if (typeof activateMapMode === 'function') {
        activateMapMode('scan');
    }

    // Simulate scan duration
    setTimeout(() => {
        if (btn) btn.classList.remove('active');
        window._isDeepScanning = false;
        
        if (window.playSound) window.playSound('UI_GENERIC_TAP');

        // Logic for Deep Scan: clear out warnings, optimize metrics
        if (window.DEFAULT_GLOBAL_METRICS) {
            window.DEFAULT_GLOBAL_METRICS.activeNodes = 1450 + Math.floor(Math.random() * 50);
            window.DEFAULT_GLOBAL_METRICS.systemLoad = (Math.floor(Math.random() * 15) + 20) + '%';
            window.DEFAULT_GLOBAL_METRICS.latency = (Math.floor(Math.random() * 3) + 1) + '.' + Math.floor(Math.random() * 9) + ' ms';
            window.DEFAULT_GLOBAL_METRICS.netIntegrity = '100% SECURE';
            window.DEFAULT_GLOBAL_METRICS.sectorStatus = '1 OPTIMAL';
            window.DEFAULT_GLOBAL_METRICS.activeThreats = 0;
            if (typeof updateSidebarForSelection === 'function') updateSidebarForSelection();
        }

        // Push a log to history if AUDIT_LOG_HISTORY exists
        if (window.AUDIT_LOG_HISTORY) {
            window.AUDIT_LOG_HISTORY.unshift({
                ts: new Date().toLocaleTimeString(),
                type: 'info',
                event: 'DEEP SCAN COMPLETE',
                text: 'Network integrity verified. Anomalies resolved.',
                loc: 'GLOBAL'
            });
            if (typeof syncAuditTrail === 'function') syncAuditTrail();
        }
    }, 4000);
}

function triggerLockdown() {
    const isLockdown = document.body.classList.toggle('lockdown-active');
    
    // Play sound
    if (window.playSound) {
        window.playSound(isLockdown ? 'LOCKDOWN_ALARM' : 'UI_GENERIC_TAP');
    }

    // Toggle critical state locally
    const btnLockdown = document.getElementById('btn-lockdown');
    if (btnLockdown) {
        btnLockdown.classList.toggle('active', isLockdown);
    }
    
    // Clear paths immediately when lockdown initiates
    if (isLockdown && window.drawQuantumPath) {
        window.drawQuantumPath([]);
        // Ensure distance metrics bar is hidden since path is cleared
        document.getElementById('distance-metrics-bar')?.classList.add('hidden');
    }
    
    // Update global metrics to critical if lockdown active
    if (window.DEFAULT_GLOBAL_METRICS) {
        if (isLockdown) {
            window._prevSectorStatus = window.DEFAULT_GLOBAL_METRICS.sectorStatus;
            window.DEFAULT_GLOBAL_METRICS.sectorStatus = 'CRITICAL ALERT';
        } else {
            window.DEFAULT_GLOBAL_METRICS.sectorStatus = window._prevSectorStatus || '2 warn';
        }
        if (typeof updateSidebarForSelection === 'function') updateSidebarForSelection();
    }
}

function runQuarantineSequence() {
    const btn = document.getElementById('btn-quarantine');
    const log = document.getElementById('threat-action-log');
    if (!btn || !log || window._threatQuarantined) return;
    btn.disabled = true;
    const steps = [
        { delay: 0, cls: 'warn', text: '> Initiating Quarantine Protocol…' },
        { delay: 600, cls: 'ok', text: '  [OK] Isolating Node G-14 from Sector G mesh…' },
        { delay: 1300, cls: 'ok', text: '  [OK] Neural pathway override: CMDR-77X applied.' },
        { delay: 2100, cls: 'warn', text: '  [~]  Scrubbing exfil packet queue…' },
        { delay: 3000, cls: 'ok', text: '  [OK] 847 anomalous packets discarded.' },
        { delay: 3800, cls: 'ok', text: '  [OK] Node G-14 sealed in sandbox layer.' },
        { delay: 4600, cls: 'done', text: '  ✓ QUARANTINE COMPLETE — Sector G integrity restored.' },
    ];
    log.innerHTML = '';
    steps.forEach(s => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = `threat-log-line ${s.cls}`;
            line.textContent = s.text;
            log.appendChild(line);
            log.scrollTop = log.scrollHeight;
        }, s.delay);
    });

    setTimeout(() => {
        window._threatQuarantined = true;
        btn.textContent = '✓ QUARANTINE SEALED';
        const callout = document.getElementById('breach-callout');
        if (callout) {
            callout.style.transition = 'opacity 1s';
            callout.style.opacity = '0';
            setTimeout(() => callout.classList.add('hidden'), 1000);
        }
        if (window._mapGlobe && window._mapGlobe.nodes) {
            window._mapGlobe.nodes.forEach(n => {
                if (n.userData.status === 'critical') {
                    n.userData.status = 'resolved';
                    n.material.color.setHex(0x22c55e);
                    n.scale.set(1, 1, 1);
                }
            });
        }
        const alertBanner = document.querySelector('.red-alert');
        if (alertBanner) {
            alertBanner.style.background = 'rgba(34, 197, 94, 0.15)';
            alertBanner.style.borderColor = 'rgba(34, 197, 94, 0.4)';
            alertBanner.style.color = '#22c55e';
            alertBanner.innerHTML = '<i data-lucide="shield-check"></i> Quarantine Sealed';
            if (window.lucide) lucide.createIcons();
        }
    }, steps[steps.length - 1].delay + 800);
}
