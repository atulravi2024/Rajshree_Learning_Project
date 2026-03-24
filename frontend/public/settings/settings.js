/**
 * Settings Page — Five-Section Logic
 * Sections: General, Kids, Parent, Admin, Developer
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Section Navigation ─────────────────────────────────────────
    const navPills = document.querySelectorAll('.nav-pill');
    const sections = document.querySelectorAll('.settings-section');

    navPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const target = pill.getAttribute('data-target');

            // Update pills
            navPills.forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-selected', 'false');
            });
            pill.classList.add('active');
            pill.setAttribute('aria-selected', 'true');

            // Update sections
            sections.forEach(sec => sec.classList.remove('active'));
            const targetSection = document.getElementById(`section-${target}`);
            if (targetSection) targetSection.classList.add('active');
        });
    });

    // ─── Close Button ────────────────────────────────────────────────
    const closeBtn = document.getElementById('close-settings');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (window.parent) {
                window.parent.postMessage({ action: 'close-modal' }, '*');
            }
        });
    }

    // ─── SMods Side Tab ──────────────────────────────────────────────
    const smodsTab = document.querySelector('.smods-tab');
    if (smodsTab) {
        smodsTab.addEventListener('click', () => {
            console.log('SMods tab clicked');
        });
    }

    // ─── GENERAL: Volume Slider ──────────────────────────────────────
    const volumeControl = document.getElementById('volume-control');
    const volumeIcon    = document.getElementById('volume-icon');
    const volumeValue   = document.getElementById('volume-value');

    const updateVolume = (val) => {
        const pct = Math.round(val * 100);
        if (volumeValue) volumeValue.textContent = `${pct}%`;

        if (volumeIcon) {
            if (val == 0)       volumeIcon.textContent = '🔇';
            else if (val < 0.4) volumeIcon.textContent = '🔈';
            else if (val < 0.7) volumeIcon.textContent = '🔉';
            else                volumeIcon.textContent = '🔊';
        }

        if (volumeControl) {
            volumeControl.style.background =
                `linear-gradient(90deg, #8B5CF6, #EC4899) 0% 0% / ${pct}% 100% no-repeat, #E2E8F0`;
        }
    };

    if (volumeControl) {
        updateVolume(volumeControl.value);
        volumeControl.addEventListener('input', (e) => {
            updateVolume(e.target.value);
            if (window.parent) {
                window.parent.postMessage({ action: 'volume-change', value: e.target.value }, '*');
            }
        });
    }

    // ─── PARENT: Time Limit Stepper ─────────────────────────────────
    const timeInput = document.getElementById('time-limit');
    const timeInc   = document.getElementById('time-inc');
    const timeDec   = document.getElementById('time-dec');

    if (timeInc && timeDec && timeInput) {
        timeInc.addEventListener('click', () => {
            const val = parseInt(timeInput.value, 10);
            if (val < parseInt(timeInput.max, 10)) {
                timeInput.value = val + 5;
            }
        });
        timeDec.addEventListener('click', () => {
            const val = parseInt(timeInput.value, 10);
            if (val > parseInt(timeInput.min, 10)) {
                timeInput.value = val - 5;
            }
        });
    }

    // ─── PARENT: PIN Button ──────────────────────────────────────────
    const setPinBtn = document.getElementById('set-pin-btn');
    if (setPinBtn) {
        setPinBtn.addEventListener('click', () => {
            console.log('Set PIN clicked — implement PIN modal here');
            if (window.parent) {
                window.parent.postMessage({ action: 'open-pin-modal' }, '*');
            }
        });
    }

    // ─── ADMIN: Save Auditor Name ────────────────────────────────────
    const auditorInput   = document.getElementById('auditor-name');
    const saveAuditorBtn = document.getElementById('save-auditor-btn');

    if (saveAuditorBtn && auditorInput) {
        saveAuditorBtn.addEventListener('click', () => {
            const name = auditorInput.value.trim();
            if (name) {
                localStorage.setItem('rajshree_auditor', name);
                saveAuditorBtn.textContent = '✓';
                setTimeout(() => { saveAuditorBtn.textContent = '✓'; }, 1200);
                console.log('Auditor saved:', name);
            }
        });
        // Restore saved value
        const saved = localStorage.getItem('rajshree_auditor');
        if (saved) auditorInput.value = saved;
    }

    // ─── ADMIN: Activity Logs ────────────────────────────────────────
    const adminLogsBtn = document.getElementById('admin-logs');
    if (adminLogsBtn) {
        adminLogsBtn.addEventListener('click', () => {
            console.log('Activity logs requested');
            if (window.parent) {
                window.parent.postMessage({ action: 'open-activity-logs' }, '*');
            }
        });
    }

    // ─── ADMIN: Reset Data ───────────────────────────────────────────
    const resetBtn = document.getElementById('reset-data-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (window.parent) {
                window.parent.postMessage({ action: 'confirm-reset' }, '*');
            } else {
                console.warn('Reset: not inside iframe, confirm manually.');
            }
        });
    }

    // ─── DEVELOPER: Data Sync ────────────────────────────────────────
    const dataSyncBtn = document.getElementById('data-sync');
    if (dataSyncBtn) {
        dataSyncBtn.addEventListener('click', () => {
            console.log('Sync Excel triggered');
            if (window.parent) {
                window.parent.postMessage({ action: 'sync-excel' }, '*');
            }
        });
    }

    // ─── DEVELOPER: Audit Dashboard ──────────────────────────────────
    const openDashboardBtn = document.getElementById('open-dashboard');
    if (openDashboardBtn) {
        openDashboardBtn.addEventListener('click', () => {
            console.log('Open Dashboard triggered');
            if (window.parent) {
                window.parent.postMessage({ action: 'open-dashboard' }, '*');
            }
        });
    }

    // ─── DEVELOPER: Debug Mode ───────────────────────────────────────
    const debugCheck = document.getElementById('debug-check');
    if (debugCheck) {
        debugCheck.addEventListener('change', (e) => {
            console.log('Debug mode:', e.target.checked);
            if (window.parent) {
                window.parent.postMessage({ action: 'debug-toggle', value: e.target.checked }, '*');
            }
        });
    }

    // ─── Version ─────────────────────────────────────────────────────
    const versionEl = document.getElementById('app-version');
    const envEl     = document.getElementById('app-env');
    if (versionEl && window.RAJSHREE_VERSION) versionEl.textContent = window.RAJSHREE_VERSION;
    if (envEl && window.RAJSHREE_ENV) envEl.textContent = window.RAJSHREE_ENV;

    console.log('✅ Settings — five-section UI initialized.');
});
