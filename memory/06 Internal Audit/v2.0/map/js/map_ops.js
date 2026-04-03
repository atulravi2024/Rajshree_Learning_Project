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
    window._isLockedDown = isLockdown;
    document.body.classList.toggle('stealth-mode-active', isLockdown);
    
    // Play sound
    if (window.playSound) {
        window.playSound(isLockdown ? 'LOCKDOWN_ALARM' : 'UI_GENERIC_TAP');
    }

    // Toggle critical state locally
    const btnLockdown = document.getElementById('btn-lockdown');
    if (btnLockdown) {
        btnLockdown.classList.toggle('active', isLockdown);
        const icon = btnLockdown.querySelector('i');
        if (icon && window.lucide) {
            icon.setAttribute('data-lucide', isLockdown ? 'shield' : 'shield-off');
            lucide.createIcons();
        }
    }

    // Manage Overlay
    const overlay = document.getElementById('lockdown-overlay');
    if (overlay) {
        if (isLockdown) {
            overlay.classList.remove('hidden');
            
            // USEFUL CASE: System Purge & Quarantine
            purgeActiveSessionData();
            performGlobalQuarantine();
            startLockdownLiveFeed();

            // Attach override listeners (Hold pattern)
            const overrideBtn = document.getElementById('btn-manual-override');
            if (overrideBtn && !overrideBtn._holdListenersAttached) {
                overrideBtn.addEventListener('mousedown', startOverrideHold);
                overrideBtn.addEventListener('touchstart', startOverrideHold);
                overrideBtn.addEventListener('mouseleave', cancelOverrideHold);
                overrideBtn.addEventListener('mouseup', cancelOverrideHold);
                overrideBtn.addEventListener('touchend', cancelOverrideHold);
                overrideBtn._holdListenersAttached = true;
            }
        } else {
            overlay.classList.add('hidden');
            stopLockdownLiveFeed();
        }
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

            // Log initial event
            if (window.AUDIT_LOG_HISTORY) {
                window.AUDIT_LOG_HISTORY.unshift({
                    ts: new Date().toLocaleTimeString(),
                    type: 'threat',
                    event: 'SYSTEM LOCKDOWN',
                    text: 'Critical security protocol Sigma-9 engaged.',
                    loc: 'LEVEL 1 AUTH'
                });
                if (typeof syncAuditTrail === 'function') syncAuditTrail();
            }
        } else {
            window.DEFAULT_GLOBAL_METRICS.sectorStatus = window._prevSectorStatus || '2 warn';
        }
        if (typeof updateSidebarForSelection === 'function') updateSidebarForSelection();
    }

    // Update Globe Visuals and Controls
    if (window.controls) {
        window.controls.enabled = !isLockdown;
    }

    if (isLockdown && typeof activateMapMode === 'function') {
        activateMapMode('threat'); // Focus on threat sector
    }
}

function purgeActiveSessionData() {
    const from = document.getElementById('map-input-from');
    const via = document.getElementById('map-input-via');
    const to = document.getElementById('map-input-to');
    if (from) from.value = '';
    if (via) via.value = '';
    if (to) to.value = '';
    if (window.drawQuantumPath) window.drawQuantumPath([]);
    console.log('[Lockdown] Session data purged.');
}

function performGlobalQuarantine() {
    if (window._mapGlobe && window._mapGlobe.nodes) {
        let quarantinedCount = 0;
        window._mapGlobe.nodes.forEach(n => {
            if (n.userData.status === 'critical') {
                n.userData.status = 'resolved';
                n.material.color.setHex(0x22c55e); // Green
                n.scale.set(1, 1, 1);
                quarantinedCount++;
            }
        });
        console.log(`[Lockdown] Global Quarantine complete: ${quarantinedCount} threads secured.`);
    }
}

function startLockdownLiveFeed() {
    const logContainer = document.getElementById('lockdown-live-logs');
    if (!logContainer) return;
    logContainer.innerHTML = '';
    
    const events = [
        { msg: '> INITIALIZING SESSION PURGE...', cls: '' },
        { msg: '> CLEARING GEOGRAPHIC CACHE...', cls: '' },
        { msg: '[OK] ACTIVE SESSION DATA SANITIZED', cls: 'warn' },
        { msg: '> SCANNING GLOBAL MESH FOR CRITICAL THREATS...', cls: '' },
        { msg: '[OK] AUTOMATIC QUARANTINE PROTOCOL APPLIED', cls: 'warn' },
        { msg: '> ENCRYPTING INTERFACE (STEALTH MODE ACTIVE)', cls: '' },
        { msg: '> SIGNAL INTERFERENCE MASKED: 98% SUCCESS', cls: '' },
        { msg: '[OK] SYSTEM STATUS: SECURE', cls: 'crit' },
        { msg: '> MONITORING NEURAL RADIANCE FIELDS...', cls: '' }
    ];

    window._lockdownLogIdx = 0;
    window._lockdownLogInterval = setInterval(() => {
        const entry = events[window._lockdownLogIdx % events.length];
        const line = document.createElement('div');
        line.className = 'lockdown-log-line ' + entry.cls;
        line.textContent = entry.msg;
        logContainer.prepend(line);
        if (logContainer.children.length > 8) logContainer.lastElementChild.remove();
        window._lockdownLogIdx++;
    }, 1800);
}

function stopLockdownLiveFeed() {
    if (window._lockdownLogInterval) {
        clearInterval(window._lockdownLogInterval);
        window._lockdownLogInterval = null;
    }
}

let holdTimer = null;
let holdProgress = 0;

function startOverrideHold() {
    if (window._isOverriding) return;
    holdProgress = 0;
    const progressWrap = document.getElementById('override-progress-wrap');
    const fill = document.getElementById('override-progress-fill');
    const label = document.getElementById('override-progress-label');
    const btnText = document.getElementById('override-btn-text');

    if (!progressWrap || !fill || !label || !btnText) return;

    progressWrap.classList.remove('hidden');
    btnText.textContent = 'RESTRICTED ACTION IN PROGRESS...';
    
    if (window.playSound) window.playSound('SCAN_INITIATE');

    holdTimer = setInterval(() => {
        holdProgress += 1.5;
        fill.style.width = holdProgress + '%';

        // Update Labels based on progress
        if (holdProgress < 33) {
            label.textContent = 'CRACKING ENCRYPTION SEALS...';
        } else if (holdProgress < 66) {
            label.textContent = 'BYPASSING NEURAL GATEWAYS...';
        } else {
            label.textContent = 'RESTORING SYSTEM KERNEL...';
        }

        if (holdProgress >= 100) {
            clearInterval(holdTimer);
            completeOverride();
        }
    }, 45); // Approx 3 seconds
}

function cancelOverrideHold() {
    if (holdProgress < 100 && holdTimer) {
        clearInterval(holdTimer);
        const progressWrap = document.getElementById('override-progress-wrap');
        const btnText = document.getElementById('override-btn-text');
        if (progressWrap) progressWrap.classList.add('hidden');
        if (btnText) btnText.textContent = 'HOLD FOR MANUAL OVERRIDE';
        holdProgress = 0;
    }
}

function completeOverride() {
    window._isOverriding = true; // Temporary flag to prevent double-fire
    const btnText = document.getElementById('override-btn-text');
    if (btnText) btnText.textContent = 'SYSTEM ACCESS RESTORED';

    setTimeout(() => {
        triggerLockdown(); // Toggle off
        window._isOverriding = false;
        holdProgress = 0;
    }, 800);

    if (window.playSound) window.playSound('UI_GENERIC_TAP');

    // Audit Log
    if (window.AUDIT_LOG_HISTORY) {
        window.AUDIT_LOG_HISTORY.unshift({
            ts: new Date().toLocaleTimeString(),
            type: 'info',
            event: 'OVERRIDE COMPLETE',
            text: 'System access restored via Manual Protocol.',
            loc: 'LEVEL 1 AUTH'
        });
        if (typeof syncAuditTrail === 'function') syncAuditTrail();
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
        
        // Logical Update: Resolve globe node
        if (window._mapGlobe && window._mapGlobe.nodes) {
            window._mapGlobe.nodes.forEach(n => {
                if (n.userData.status === 'critical') {
                    n.userData.status = 'resolved';
                    if (n.material) n.material.color.setHex(0x22c55e);
                    n.scale.set(1, 1, 1);
                }
            });
        }
        
        // Update Metrics
        if (window.DEFAULT_GLOBAL_METRICS && window.DEFAULT_GLOBAL_METRICS.activeThreats > 0) {
            window.DEFAULT_GLOBAL_METRICS.activeThreats--;
            if (typeof updateSidebarForSelection === 'function') updateSidebarForSelection();
        }

        const alertBanner = document.querySelector('.red-alert');
        if (alertBanner) {
            alertBanner.style.background = 'rgba(0, 0, 0, 0.7)';
            alertBanner.style.backdropFilter = 'blur(10px)';
            alertBanner.style.webkitBackdropFilter = 'blur(10px)';
            alertBanner.style.display = 'flex';
            alertBanner.style.borderColor = 'rgba(34, 197, 94, 0.4)';
            alertBanner.style.color = '#22c55e';
            alertBanner.innerHTML = '<i data-lucide="shield-check"></i> Quarantine Sealed';
            if (window.lucide) lucide.createIcons();
        }

        // Final Global Log
        if (window.AUDIT_LOG_HISTORY) {
            window.AUDIT_LOG_HISTORY.unshift({
                ts: new Date().toLocaleTimeString(),
                type: 'info',
                event: 'QUARANTINE_SEALED',
                text: 'Node G-14 fully isolated. Sector G integrity secured.',
                loc: 'SECTOR ZETA'
            });
            if (typeof syncAuditTrail === 'function') syncAuditTrail();
        }
    }, steps[steps.length - 1].delay + 800);
}

// Global Listener for Threat Panel Dismiss
function initThreatPanelHandlers() {
    const qBtn = document.getElementById('btn-quarantine');
    if (qBtn) {
        qBtn.onclick = () => {
            if (typeof runQuarantineSequence === 'function') runQuarantineSequence();
        };
    }

    const dBtn = document.getElementById('close-threat-panel');
    if (dBtn) {
        dBtn.onclick = () => {
            const panel = document.getElementById('panel-threat-action');
            if (panel) panel.classList.add('hidden');
            window._threatQuarantined = false; // Reset for next potential trigger
            if (window.playSound) window.playSound('UI_CLICK');
        };
    }
}

document.addEventListener('DOMContentLoaded', initThreatPanelHandlers);
// Also call immediately in case DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initThreatPanelHandlers();
}
