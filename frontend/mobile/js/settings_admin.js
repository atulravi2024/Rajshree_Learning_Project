/**
 * Rajshree Learning - Admin Category Settings
 * Event handlers for Updates, Feedback, and Device Data.
 */

window.SettingsAdmin = {
    init: function() {
        console.log("🛠️ Settings Admin: Start Boot...");
        try {
            this.attachEvents();
            this.renderDiagnostics();
            this.syncNavigationControl(null, null, true); // Initial sync on load
            console.log("🛠️ Settings Admin: Boot Complete.");
        } catch (e) {
            console.error("❌ Settings Admin Boot Failed:", e);
        }
    },

    /**
     * Managed Navigation Control Logic
     * Handles Master Switch, Exclusive Home/Menu pair, and UI feedback.
     */
    syncNavigationControl: function(triggerId, value, isInit = false) {
        const masterEl = document.getElementById('mobile-master-nav');
        if (!masterEl) return;

        const container = document.getElementById('nav-sub-controls');
        const homeEl = document.getElementById('mobile-show-home');
        const menuEl = document.getElementById('mobile-show-menu');
        const navEl = document.getElementById('mobile-show-nav');
        const settingsEl = document.getElementById('mobile-show-settings');

        const isMasterEnabled = masterEl.checked;

        // 1. Handle Master Switch Impact (Targets specific set: Home, Nav, Settings)
        if (triggerId === 'mobile-master-nav' && !isInit) {
            const targets = [
                { el: homeEl, val: value, key: 'mobile_show_home' },
                { el: navEl, val: value, key: 'mobile_show_nav' },
                { el: settingsEl, val: value, key: 'mobile_show_settings' }
            ];

            targets.forEach(item => {
                if (item.el) {
                    item.el.checked = item.val;
                    localStorage.setItem(item.key, item.val);
                }
            });

            // Enforce Exclusive Pair upon Master ON (Home wins)
            if (value === true && menuEl && menuEl.checked) {
                menuEl.checked = false;
                localStorage.setItem('mobile_show_menu', false);
            }
        }

        // 2. Handle Exclusive Pair Logic (Home vs Menu Only)
        if (!isInit) {
            if (triggerId === 'mobile-show-home' && value === true) {
                if (menuEl && menuEl.checked) {
                    menuEl.checked = false;
                    localStorage.setItem('mobile_show_menu', false);
                }
            } else if (triggerId === 'mobile-show-menu' && value === true) {
                if (homeEl && homeEl.checked) {
                    homeEl.checked = false;
                    localStorage.setItem('mobile_show_home', false);
                }
            }
        }

        // 3. Independent feedback for other toggles (Nav & Settings) 
        // No hard-linking exists for mobile-show-nav or mobile-show-settings.
        // Toggling them manually only triggers the storage save in the main listener.

        // 3. UI Feedback Layer
        if (container) {
            container.style.opacity = isMasterEnabled ? '1' : '0.5';
            container.style.pointerEvents = isMasterEnabled ? 'auto' : 'none';
            container.classList.toggle('nav-locked', !isMasterEnabled);
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
            { id: 'mobile-pin-visible', key: 'mobile_pin_visible', i18n: 'lbl_pin_visible' },
            { id: 'parent-pin-visible', key: 'mobile_pin_visible', i18n: 'lbl_pin_visible' },
            { id: 'dev-pin-visible', key: 'mobile_pin_visible', i18n: 'lbl_pin_visible' },
            { id: 'mobile-auto-update', key: 'mobile_auto_update', i18n: 'lbl_auto_update' },
            { id: 'mobile-beta-program', key: 'mobile_beta_program', i18n: 'lbl_beta_prog' },
            { id: 'mobile-show-home', key: 'mobile_show_home', i18n: 'lbl_show_home' },
            { id: 'mobile-show-nav', key: 'mobile_show_nav', i18n: 'lbl_show_nav' },
            { id: 'mobile-show-settings', key: 'mobile_show_settings', i18n: 'lbl_show_settings' },
            { id: 'mobile-show-menu', key: 'mobile_show_menu', i18n: 'lbl_show_menu' },
            { id: 'mobile-master-nav', key: 'mobile_master_nav', i18n: 'lbl_master_nav' }
        ];

        adminToggles.forEach(t => {
            const el = document.getElementById(t.id);
            if (el) el.addEventListener('change', (e) => {
                const val = e.target.checked;

                // --- CHILD LOCK TOGGLE INTERCEPTION ---
                if (t.key === 'mobile_child_lock' && !val) {
                    e.target.checked = true; // Revert UI
                    window.SettingsCore.showPinModal('verify', (success) => {
                        if (success) {
                            e.target.checked = false;
                            localStorage.setItem(t.key, false);
                            window.SettingsCore.showToast(window.SettingsCore.getTranslation('child_lock_off'));
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
                    window.SettingsCore.showToast(`${label}: ${status}`);
                }

                // Handle Navigation Control logic (Master/Sub/Exclusive)
                const isNavControl = t.id.startsWith('mobile-show-') || t.id === 'mobile-master-nav';
                if (isNavControl) {
                    window.SettingsAdmin.syncNavigationControl(t.id, val);
                }
            });
        });
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

        // PIN Setup Global
        window.setupParentPin = () => {
            window.SettingsCore.showPinModal('setup', (success) => {
                if (success) {
                    window.SettingsCore.showToast(window.SettingsCore.getTranslation('pin_success'));
                }
            });
        };
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
        if (fill) fill.style.width = `${percent}%`;
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
