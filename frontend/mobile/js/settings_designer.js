/**
 * settings_designer.js - Design & UI Prototyping Module
 * Facilitates live design tweaks, navigation controls, and layout preferences.
 * Moved from Admin to provide a dedicated premium design canvas.
 */

window.SettingsDesigner = {
    init: function() {
        console.log("🎨 Settings Designer: Initializing Canvas...");
        try {
            this.attachEvents();
            this.syncNavigationControl(null, null, true); // Initial sync on load
            this.initializeMockupGallery();
            console.log("🎨 Settings Designer: Boot Complete.");
        } catch (e) {
            console.error("❌ Settings Designer Boot Failed:", e);
        }
    },

    /**
     * Managed Navigation Control Logic
     * Handles Master Switch and UI feedback.
     */
    syncNavigationControl: function(triggerId, value, isInit = false) {
        const masterEl = document.getElementById('mobile-master-nav');
        if (!masterEl) return;

        const container = document.getElementById('nav-sub-controls');
        const homeEl = document.getElementById('mobile-show-home');
        const navEl = document.getElementById('mobile-show-nav');
        const settingsEl = document.getElementById('mobile-show-settings');

        const isMasterEnabled = masterEl.checked;

        // 1. Handle Master Switch Impact (Targets all buttons uniformly)
        if (triggerId === 'mobile-master-nav' && !isInit) {
            const targets = [
                { el: homeEl, val: value, key: 'mobile_show_home' },
                { el: navEl, val: value, key: 'mobile_show_nav' },
                { el: settingsEl, val: value, key: 'mobile_show_settings' },
                { el: document.getElementById('mobile-show-autoplay-nav'), val: value, key: 'mobile_show_autoplay_nav' },
                { el: document.getElementById('mobile-show-bottom-nav'), val: value, key: 'mobile_show_bottom_nav' },
                { el: document.getElementById('mobile-autohide-nav'), val: value, key: 'mobile_autohide_nav' }
            ];

            targets.forEach(item => {
                if (item.el) {
                    item.el.checked = item.val;
                    localStorage.setItem(item.key, item.val);
                }
            });
        }

        // 2. UI Feedback Layer
        if (container) {
            container.classList.toggle('nav-locked', !isMasterEnabled);
        }
    },

    attachEvents: function() {
        // 1. Navigation Toggles
        const navToggles = [
            { id: 'mobile-show-home', key: 'mobile_show_home', i18n: 'lbl_show_home' },
            { id: 'mobile-show-nav', key: 'mobile_show_nav', i18n: 'lbl_show_nav' },
            { id: 'mobile-show-settings', key: 'mobile_show_settings', i18n: 'lbl_show_settings' },
            { id: 'mobile-show-autoplay-nav', key: 'mobile_show_autoplay_nav', i18n: 'lbl_show_autoplay_nav' },
            { id: 'mobile-show-bottom-nav', key: 'mobile_show_bottom_nav', i18n: 'lbl_show_bottom_nav' },
            { id: 'mobile-autohide-nav', key: 'mobile_autohide_nav', i18n: 'lbl_autohide_nav' },
            { id: 'mobile-master-nav', key: 'mobile_master_nav', i18n: 'lbl_master_nav' }
        ];

        navToggles.forEach(t => {
            const el = document.getElementById(t.id);
            if (el) el.addEventListener('change', (e) => {
                const val = e.target.checked;
                localStorage.setItem(t.key, val);

                if (t.i18n) {
                    const label = window.SettingsCore.getTranslation(t.i18n);
                    const status = window.SettingsCore.getTranslation(val ? 'status_on' : 'status_off');
                    window.SettingsCore.showToast(`${label}: ${status}`);
                }

                // Handle Navigation Control logic (Master/Sub)
                this.syncNavigationControl(t.id, val);
            });
        });

        // 2. Layout & View Mode (Segmented Controls)
        const segmentedControls = [
            { id: 'mobile-flashcard-nav-dir', key: 'mobile_flashcard_nav_dir' },
            { id: 'mobile-grid-nav-dir', key: 'mobile_grid_nav_dir' },
            { id: 'mobile-view-mode', key: 'mobile_view_mode' },
            { id: 'mobile-three-nav-dir', key: 'mobile_three_nav_dir' },
            { id: 'mobile-menu-style', key: 'mobile_menu_style' }
        ];

        const updateAlignmentVisibility = () => {
            const viewMode = localStorage.getItem('mobile_view_mode') || 'flashcard';
            const group = document.getElementById('three-alignment-group');
            if (group) {
                group.classList.toggle('hidden', viewMode !== 'three');
            }
        };

        // Initialize visibility
        updateAlignmentVisibility();

        segmentedControls.forEach(ctrl => {
            const container = document.getElementById(ctrl.id);
            if (container) {
                container.addEventListener('click', (e) => {
                    const btn = e.target.closest('.seg-btn');
                    if (!btn) return;

                    const val = btn.getAttribute('data-value');
                    localStorage.setItem(ctrl.key, val);

                    // Update UI via SettingsCore helper
                    window.SettingsCore.setSegmentedValue(ctrl.id, val);
                    
                    let labelKey = 'lbl_view_mode';
                    if (ctrl.id.includes('flashcard')) labelKey = 'lbl_flashcard_nav';
                    if (ctrl.id.includes('grid')) labelKey = 'lbl_grid_nav';
                    if (ctrl.id.includes('three-nav')) labelKey = 'lbl_three_nav';
                    if (ctrl.id.includes('menu-style')) labelKey = 'lbl_menu_demo';

                    // Dynamic visibility toggle if View Mode changed
                    if (ctrl.id === 'mobile-view-mode') {
                        updateAlignmentVisibility();
                    }

                    const label = window.SettingsCore.getTranslation(labelKey);
                    window.SettingsCore.showToast(`${label}: ${val}`);
                });
            }
        });
    },

    /**
     * Handles the Mockup Gallery style selection.
     */
    initializeMockupGallery: function() {
        const gallery = document.getElementById('mobile-flashcard-style-gallery');
        if (!gallery) return;

        const currentStyle = localStorage.getItem('mobile_flashcard_style') || 'classic';
        
        // Mark active in UI
        const cards = gallery.querySelectorAll('.mockup-card');
        cards.forEach(card => {
            const val = card.getAttribute('data-value');
            if (val === currentStyle) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }

            // Enhanced click handler with persistence
            card.addEventListener('click', () => {
                const newStyle = card.getAttribute('data-value');
                localStorage.setItem('mobile_flashcard_style', newStyle);
                
                // Toast notification
                const label = card.querySelector('.mockup-label').textContent;
                window.SettingsCore.showToast(`${window.SettingsCore.getTranslation('lbl_flashcard_style_demo')}: ${label}`);
            });
        });
        // 5. Designer PIN Events
        const desPinVis = document.getElementById('designer-pin-visible');
        if (desPinVis) {
            desPinVis.addEventListener('change', (e) => {
                localStorage.setItem('mobile_designer_pin_visible', e.target.checked);
            });
        }

        const desPinReq = document.getElementById('designer-pin-required');
        if (desPinReq) {
            desPinReq.addEventListener('change', (e) => {
                localStorage.setItem('mobile_designer_pin_required', e.target.checked);
            });
        }

        // Independent PIN Setup for Designer
        window.setupDesignerPin = () => {
            window.SettingsCore.showPinModal('setup', (success) => {
                if (success) {
                    window.SettingsCore.showToast(window.SettingsCore.getTranslation('pin_success'));
                }
            }, { 
                targetKey: 'mobile_designer_pin', 
                visibilityKey: 'mobile_designer_pin_visible',
                categoryName: 'Designer'
            });
        };
    }
};

// Initialized via settings.js
