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

    // ─── Accordion Logic (Single-Open, No Icons) ─────────────────────
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('active'));

            // Toggle clicked item (if it wasn't already active)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ─── KIDS' PLAY ZONE: Avatar Picker ──────────────────────────────
    const avatarItems = document.querySelectorAll('.avatar-item');
    avatarItems.forEach(item => {
        item.addEventListener('click', () => {
            avatarItems.forEach(a => a.classList.remove('active'));
            item.classList.add('active');
            const avatar = item.getAttribute('data-avatar');
            localStorage.setItem('rajshree_avatar', avatar);
            if (window.parent) {
                window.parent.postMessage({ action: 'avatar-change', value: avatar }, '*');
            }
        });
    });

    // Restore saved avatar
    const savedAvatar = localStorage.getItem('rajshree_avatar');
    if (savedAvatar) {
        avatarItems.forEach(a => {
            if (a.getAttribute('data-avatar') === savedAvatar) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    }

    // ─── KIDS' PLAY ZONE: Theme Picker ───────────────────────────────
    const themePills = document.querySelectorAll('.color-pill');
    themePills.forEach(pill => {
        pill.addEventListener('click', () => {
            themePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const theme = pill.getAttribute('data-theme');
            localStorage.setItem('rajshree_theme', theme);
            if (window.parent) {
                window.parent.postMessage({ action: 'theme-change', value: theme }, '*');
            }
        });
    });

    // Restore saved theme
    const savedTheme = localStorage.getItem('rajshree_theme');
    if (savedTheme) {
        themePills.forEach(p => {
            if (p.getAttribute('data-theme') === savedTheme) p.classList.add('active');
            else p.classList.remove('active');
        });
    }

    // ─── KIDS' PLAY ZONE: Music Picker ───────────────────────────────
    const musicOptions = document.querySelectorAll('.music-option');
    musicOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            musicOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            const music = opt.getAttribute('data-music');
            localStorage.setItem('rajshree_bg_music', music);
            if (window.parent) {
                window.parent.postMessage({ action: 'music-change', value: music }, '*');
            }
        });
    });

    // ─── Toggles Handler (General & Kids Safety) ─────────────────────
    const toggles = [
        'bg-magic-check', 'sfx-check', 'confetti-check', 
        'bounce-check', 'stars-check', 'nav-lock-check', 
        'lock-check', 'autoplay-check'
    ];

    toggles.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Restore saved state
            const saved = localStorage.getItem(`rajshree_${id}`);
            if (saved !== null) el.checked = saved === 'true';

            el.addEventListener('change', (e) => {
                const val = e.target.checked;
                localStorage.setItem(`rajshree_${id}`, val);
                if (window.parent) {
                    window.parent.postMessage({ action: 'toggle-change', name: id, value: val }, '*');
                }
            });
        }
    });

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

    // ─── PARENT: Language Selection ──────────────────────────────────
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        const savedLang = localStorage.getItem('rajshree_lang') || 'hi';
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => {
            localStorage.setItem('rajshree_lang', e.target.value);
            if (window.parent) {
                window.parent.postMessage({ action: 'lang-change', value: e.target.value }, '*');
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
