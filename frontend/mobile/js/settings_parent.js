/**
 * Rajshree Learning - Parent Category Settings
 * Event handlers for Profile, Learning, Safety, and Storage.
 */

window.SettingsParent = {
    init: function() {
        console.log("👨‍👩‍👧 Settings Parent: Start Boot...");
        try {
            this.attachEvents();
            this.initSafetyLocks();
            this.initCompactLocks();
            console.log("👨‍👩‍👧 Settings Parent: Boot Complete.");
        } catch (e) {
            console.error("❌ Settings Parent Boot Failed:", e);
        }
    },

    attachEvents: function() {
        // 1. Toggles (Parent Category)
        const parentToggles = [
            { id: 'mobile-break', key: 'mobile_break', i18n: 'lbl_break_reminder' },
            { id: 'mobile-lock-nav', key: 'mobile_lock_nav', i18n: 'lbl_lock_nav' },
            { id: 'mobile-lock-home', key: 'mobile_lock_home', i18n: 'lbl_lock_home' },
            { id: 'mobile-lock-settings', key: 'mobile_lock_settings', i18n: 'lbl_lock_settings' },
            { id: 'mobile-lock-menu', key: 'mobile_lock_menu', i18n: 'lbl_lock_menu' },
            { id: 'mobile-lock-vol', key: 'mobile_lock_vol', i18n: 'lbl_lock_vol' },
            { id: 'mobile-lock-text', key: 'mobile_lock_text', i18n: 'lbl_lock_text' },
            { id: 'mobile-lock-hold', key: 'mobile_lock_hold', i18n: 'lbl_lock_hold' },
            { id: 'mobile-lock-context', key: 'mobile_lock_context', i18n: 'lbl_lock_context' },
            { id: 'mobile-lock-fullscreen', key: 'mobile_lock_fullscreen', i18n: 'lbl_lock_fullscreen' },
            { id: 'mobile-lock-back', key: 'mobile_lock_back', i18n: 'lbl_lock_back' },
            { id: 'mobile-master-audio', key: 'mobile_master_audio', i18n: 'lbl_master_lock' },
            { id: 'mobile-master-global', key: 'mobile_master_global', i18n: 'lbl_master_lock' },
            { id: 'mobile-lock-autoplay', key: 'mobile_lock_autoplay', i18n: 'lbl_lock_autoplay' },
            { id: 'mobile-lock-card', key: 'mobile_lock_card', i18n: 'lbl_lock_card' }
        ];

        parentToggles.forEach(t => {
            const el = document.getElementById(t.id);
            if (el) el.addEventListener('change', (e) => {
                const val = e.target.checked;
                localStorage.setItem(t.key, val);
                const label = window.SettingsCore.getTranslation(t.i18n);
                const status = window.SettingsCore.getTranslation(val ? 'status_on' : 'status_off');
                window.SettingsCore.showToast(`${label}: ${status}`);
            });
        });

        // 2. Sliders & Selects (Parent Category)
        const parentInputs = [
            { id: 'mobile-timer', key: 'mobile_timer', label: 'समय सीमा' },
            { id: 'mobile-difficulty', key: 'mobile_difficulty', label: 'कठिनाई' },
            { id: 'mobile-daily-goal', key: 'mobile_daily_goal', label: 'डेली लक्ष्य' },
            { id: 'mobile-ui-lang', key: 'mobile_ui_language', label: 'भाषा' }
        ];

        parentInputs.forEach(i => {
            const el = document.getElementById(i.id);
            if (el) el.addEventListener('input', (e) => {
                const val = e.target.value;
                localStorage.setItem(i.key, val);
                
                // Handle UI Language Change
                if (i.key === 'mobile_ui_language') {
                    if (window.RAJSHREE_I18N) {
                        window.RAJSHREE_I18N.applyUI(val);
                        const toastMsg = window.RAJSHREE_I18N.translations[val].toast_lang_update;
                        window.SettingsCore.showToast(toastMsg);
                    }
                    return;
                }

                if (i.label) window.SettingsCore.showToast(`${i.label}: ${val}`);
            });
        });

        // 3. Profile Selection
        document.querySelectorAll('#cat-parent .voice-card').forEach(card => {
            if (card.dataset.profile) {
                card.addEventListener('click', () => {
                    const profile = card.dataset.profile;
                    localStorage.setItem('rajshree_active_profile', profile);
                    window.SettingsCore.updateGridSelection('#cat-parent .voice-card', 'profile', profile);
                    window.SettingsCore.showToast(`Active Profile: ${profile}`);
                });
            }
        });
    },

    initSafetyLocks: function() {
        this.initMasterLockLogic('mobile-master-audio', '.audio-lock');
        this.initMasterLockLogic('mobile-master-global', '.global-lock');
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

    initCompactLocks: function() {
        const targets = '.lock-card-compact, .master-lock-group, .standalone-lock-row';
        document.querySelectorAll(targets).forEach(card => {
            // Prevent wrapper elements with multiple toggles from hijacking clicks
            const checkboxes = card.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length !== 1) return;

            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;
                
                // Prevent bubbling up to any potential parent targets
                e.stopPropagation();

                const checkbox = checkboxes[0];
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => card.style.transform = '', 100);
                }
            });
        });
    }
};
