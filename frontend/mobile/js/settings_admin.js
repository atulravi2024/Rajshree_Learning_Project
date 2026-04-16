/**
 * Rajshree Learning - Admin Category Settings
 * Event handlers for Updates, Feedback, and Device Data.
 */

window.SettingsAdmin = {
    init: function() {
        console.log("🛠️ Settings Admin: Start Boot...");
        try {
            this.attachEvents();
            this.initSafetyLocks();
            this.renderDiagnostics();
            console.log("🛠️ Settings Admin: Boot Complete.");
        } catch (e) {
            console.error("❌ Settings Admin Boot Failed:", e);
        }
    },



    attachEvents: function() {
        const resetBtn = document.getElementById('reset-app');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const msg = window.SettingsCore.getTranslation('msg_reset_confirm');
                if (confirm(msg)) {
                    localStorage.clear();
                    location.reload();
                }
            });
        }

        // Toggles (Admin & Safety)
        const adminToggles = [
            { id: 'mobile-reduce-motion', key: 'mobile_reduce_motion', i18n: 'lbl_reduce_motion' },
            { id: 'mobile-fast-load', key: 'mobile_fast_load', i18n: 'lbl_fast_load' },
            { id: 'mobile-lock', key: 'mobile_child_lock', i18n: 'lbl_child_lock' },
            { id: 'mobile-lock-alerts', key: 'mobile_lock_alerts', i18n: 'lbl_lock_alerts' },
            { id: 'mobile-intrusion-shield', key: 'mobile_intrusion_shield', i18n: 'lbl_intrusion_shield' },
            { id: 'mobile-edge-protection', key: 'mobile_edge_protection', i18n: 'lbl_edge_protection' },
            
            // PIN Parent
            { id: 'mobile-master-pin-parent', key: 'mobile_master_pin_parent', i18n: 'lbl_master_lock' },
            { id: 'parent-pin-visible', key: 'mobile_parent_pin_visible', i18n: 'lbl_pin_visible' },
            { id: 'parent-pin-required', key: 'mobile_parent_pin_required', i18n: 'lbl_pin_required' },

            // PIN Admin
            { id: 'mobile-master-pin-admin', key: 'mobile_master_pin_admin', i18n: 'lbl_master_lock' },
            { id: 'admin-pin-visible', key: 'mobile_admin_pin_visible', i18n: 'lbl_pin_visible' },
            { id: 'admin-pin-required', key: 'mobile_admin_pin_required', i18n: 'lbl_pin_required' },
            
            // PIN Developer
            { id: 'mobile-master-pin-dev', key: 'mobile_master_pin_dev', i18n: 'lbl_master_lock' },
            { id: 'dev-pin-visible', key: 'mobile_dev_pin_visible', i18n: 'lbl_pin_visible' },
            { id: 'dev-pin-required', key: 'mobile_dev_pin_required', i18n: 'lbl_pin_required' },

            // PIN Designer
            { id: 'mobile-master-pin-designer', key: 'mobile_master_pin_designer', i18n: 'lbl_master_lock' },
            { id: 'designer-pin-visible', key: 'mobile_designer_pin_visible', i18n: 'lbl_pin_visible' },
            { id: 'designer-pin-required', key: 'mobile_designer_pin_required', i18n: 'lbl_pin_required' },

            // Safety Grid Sub-Masters
            { id: 'mobile-safety-kids-global', key: 'mobile_safety_kids_global', i18n: 'sec_kids_global' },
            { id: 'mobile-safety-kids-audio', key: 'mobile_safety_kids_audio', i18n: 'sec_kids_audio' },
            { id: 'mobile-safety-pin-parent', key: 'mobile_safety_pin_parent', i18n: 'sec_pin_parent' },
            { id: 'mobile-safety-pin-admin', key: 'mobile_safety_pin_admin', i18n: 'sec_pin_admin' },
            { id: 'mobile-safety-pin-dev', key: 'mobile_safety_pin_dev', i18n: 'sec_pin_developer' },
            { id: 'mobile-safety-pin-designer', key: 'mobile_safety_pin_designer', i18n: 'sec_pin_designer' },

            { id: 'mobile-auto-update', key: 'mobile_auto_update', i18n: 'lbl_auto_update' },
            { id: 'mobile-beta-program', key: 'mobile_beta_program', i18n: 'lbl_beta_prog' },
            { id: 'mobile-master-safety', key: 'mobile_master_safety', i18n: 'lbl_master_lock' }
        ];

        adminToggles.forEach(t => {
            const el = document.getElementById(t.id);
            if (el) el.addEventListener('change', (e) => {
                const val = e.target.checked;

                // --- CHILD LOCK TOGGLE INTERCEPTION (DISABLE ONLY) ---
                if (t.key === 'mobile_child_lock' && !val) {
                    e.target.checked = true; // Stay ON initially
                    window.SettingsCore.showMathModal((success) => {
                        if (success) {
                            e.target.checked = false;
                            localStorage.setItem(t.key, false);
                            window.SettingsCore.showToast(window.SettingsCore.getTranslation('child_lock_off'));
                        } else {
                            e.target.checked = true;
                        }
                    });
                    return;
                }

                localStorage.setItem(t.key, val);

                if (t.key === 'mobile_child_lock' && val) {
                    window.SettingsCore.showToast(window.SettingsCore.getTranslation('child_lock_on'));
                } else if (t.i18n) {
                    const label = window.SettingsCore.getTranslation(t.i18n);
                    const status = window.SettingsCore.getTranslation(val ? 'status_on' : 'status_off');
                }
            });
        });

        // Admin Selects
        const adminInputs = [
            { id: 'mobile-anim-quality', key: 'mobile_anim_quality', label: 'एनिमेशन' }
        ];

        adminInputs.forEach(i => {
            const el = document.getElementById(i.id);
            if (el) el.addEventListener('input', (e) => {
                const val = e.target.value;
                localStorage.setItem(i.key, val);
                if (i.key === 'mobile_anim_quality' && window.ThemeEngine) {
                    window.ThemeEngine.applyAnimQuality(val);
                }
                if (i.label) window.SettingsCore.showToast(`${i.label}: ${val}`);
            });
        });



        // Independent PIN Setup for Admin
        window.setupAdminPin = () => {
            window.SettingsCore.showPinModal('setup', (success) => {
                if (success) {
                    window.SettingsCore.showToast(window.SettingsCore.getTranslation('pin_success'));
                }
            }, { 
                targetKey: 'mobile_admin_pin', 
                visibilityKey: 'mobile_admin_pin_visible',
                categoryName: 'Admin'
            });
        };
    },
    
    initSafetyLocks: function() {
        // 1. Master Safety All -> Controls the entire grid
        this.initMasterLockLogic('mobile-master-safety', '.safety-all-lock');

        // 2. PIN Section Masters -> Controls their children
        this.initMasterLockLogic('mobile-master-pin-parent', '.pin-parent-lock');
        this.initMasterLockLogic('mobile-master-pin-admin', '.pin-admin-lock');
        this.initMasterLockLogic('mobile-master-pin-dev', '.pin-dev-lock');
        this.initMasterLockLogic('mobile-master-pin-designer', '.pin-designer-lock');

        // 3. Safety Grid Sub-Masters -> Sync with Section Masters (Master-of-Masters)
        this.syncTwoToggles('mobile-safety-kids-global', 'mobile-master-global');
        this.syncTwoToggles('mobile-safety-kids-audio', 'mobile-master-audio');
        this.syncTwoToggles('mobile-safety-pin-parent', 'mobile-master-pin-parent');
        this.syncTwoToggles('mobile-safety-pin-admin', 'mobile-master-pin-admin');
        this.syncTwoToggles('mobile-safety-pin-dev', 'mobile-master-pin-dev');
        this.syncTwoToggles('mobile-safety-pin-designer', 'mobile-master-pin-designer');
    },

    syncTwoToggles: function(sourceId, targetId) {
        const source = document.getElementById(sourceId);
        const target = document.getElementById(targetId);
        if (!source || !target) return;

        source.addEventListener('change', (e) => {
            if (target.checked !== e.target.checked) {
                target.checked = e.target.checked;
                target.dispatchEvent(new Event('change'));
            }
        });

        target.addEventListener('change', (e) => {
            if (source.checked !== e.target.checked) {
                source.checked = e.target.checked;
                // Don't save source directly here if it's already in adminToggles, 
                // it will be saved by its own change listener
            }
        });
    },

    initMasterLockLogic: function(masterId, slaveClass) {
        const master = document.getElementById(masterId);
        const slaves = document.querySelectorAll(slaveClass);
        if (!master) return;
        master.addEventListener('change', (e) => {
            const val = e.target.checked;
            slaves.forEach(s => {
                if (s.checked !== val) {
                    s.checked = val;
                    s.dispatchEvent(new Event('change'));
                }
            });
        });
    },

    renderDiagnostics: function() {
        // 1. Device Info
        const os = this.getOS();
        const browser = this.getBrowser();
        const res = `${window.screen.width}x${window.screen.height}`;

        const osEl = document.getElementById('diag-os');
        const browserEl = document.getElementById('diag-browser');
        const resEl = document.getElementById('diag-res');

        if (osEl) osEl.textContent = os;
        if (browserEl) browserEl.textContent = browser;
        if (resEl) resEl.textContent = res;

        // 2. Storage Stats
        this.updateStorageStats();
    },

    getOS: function() {
        const ua = navigator.userAgent;
        if (ua.indexOf("Win") !== -1) return "Windows";
        if (ua.indexOf("Mac") !== -1) return "macOS";
        if (ua.indexOf("Linux") !== -1) return "Linux";
        if (ua.indexOf("Android") !== -1) return "Android";
        if (ua.indexOf("like Mac") !== -1) return "iOS";
        return "Unknown";
    },

    getBrowser: function() {
        const ua = navigator.userAgent;
        if (ua.indexOf("Chrome") !== -1) return "Chrome";
        if (ua.indexOf("Firefox") !== -1) return "Firefox";
        if (ua.indexOf("Safari") !== -1) return "Safari";
        if (ua.indexOf("Edge") !== -1) return "Edge";
        return "Browser";
    },

    updateStorageStats: function() {
        let total = 0;
        for (let x in localStorage) {
            if (localStorage.hasOwnProperty(x)) {
                total += (localStorage[x].length + x.length) * 2; // Rough estimate in bytes (UTF-16)
            }
        }
        
        const kb = (total / 1024).toFixed(2);
        const limitKb = 5120; // Default 5MB
        const percent = Math.min((kb / limitKb) * 100, 100);

        const fill = document.getElementById('storage-fill');
        const used = document.getElementById('storage-used');
        const kbUsed = window.SettingsCore.getTranslation('lbl_kb_used') || 'KB Used';
        if (fill) fill.style.setProperty('--progress', `${percent}%`);
        if (used) used.textContent = `${kb} ${kbUsed}`;
    },

    exportData: function() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rajshree_settings_backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        window.SettingsCore.showToast(window.SettingsCore.getTranslation('msg_export_success'));
    },

    importData: function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const msg = window.SettingsCore.getTranslation('msg_import_confirm');
                if (confirm(msg)) {
                    localStorage.clear();
                    for (let key in data) {
                        localStorage.setItem(key, data[key]);
                    }
                    location.reload();
                }
            } catch (err) {
                alert(window.SettingsCore.getTranslation('msg_import_error'));
            }
        };
        reader.readAsText(file);
    },

    checkForUpdates: function() {
        const btn = document.getElementById('check-update-btn');
        if (!btn) return;

        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "...";

        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            alert(window.SettingsCore.getTranslation('msg_update_latest'));
        }, 1500);
    },

    showReleaseNotes: function() {
        const notes = [
            "v1.2.0: Added Admin Data Overhaul.",
            "v1.1.5: Improved PIN security.",
            "v1.1.0: Added Kids Safety Locks.",
            "v1.0.0: Initial Release."
        ].join("\n");
        const title = window.SettingsCore.getTranslation('msg_release_title');
        alert(`${title}:\n\n${notes}`);
    },

    sendFeedback: function() {
        const type = document.getElementById('feedback-type').value;
        const msg = window.SettingsCore.getTranslation('msg_feedback_confirm');
        if (confirm(msg)) {
            window.SettingsCore.showToast(window.SettingsCore.getTranslation('msg_feedback_success'));
        }
    },
    /**
     * Shows a demo alert for unimplemented features.
     */
    showDemoAlert: function(featureKey) {
        const title = window.SettingsCore.getTranslation('msg_demo_title') || 'Demo Mode';
        const feature = window.SettingsCore.getTranslation(featureKey) || featureKey;
        const desc = window.SettingsCore.getTranslation('msg_demo_desc') || 'This feature is currently available in Demo mode only.';
        alert(`${title}: ${feature}\n\n${desc}`);
    }
};
