/**
 * Rajshree Learning - Settings Core Infrastructure
 * Logic for UI persistence, navigation, and security components.
 */

window.SettingsCore = {
    init: function() {
        console.log("⚙️ Settings Core: Start Boot...");
        try {
            this.loadSettings();
            this.initAccordion();
            this.initCategoryTabs();
            this.initStickyEffects();
            this.initDraggableTabs();
            this.initVerticalDraggable();
            this.initPinPad();
            this.initSwitches();
            this.initCompactLocks();
            console.log("⚙️ Settings Core: Boot Complete.");
        } catch (e) {
            console.error("❌ Settings Core Boot Failed:", e);
        }
    },

    initStickyEffects: function() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.settings-header');
            const tabs = document.querySelector('.category-tabs');
            const isScrolled = window.scrollY > 10;
            if (header) header.classList.toggle('scrolled', isScrolled);
            if (tabs) tabs.classList.toggle('scrolled', isScrolled);
        });
    },

    // --- PERSISTENCE ---
    loadSettings: function() {
        const s = (key, def) => localStorage.getItem(key) || def;
        const b = (key, def) => {
            const val = localStorage.getItem(key);
            return val === null ? def : val === 'true';
        };

        // 1. Audio
        const voice = s('mobile_voice_profile', 'neerja');
        const speed = s('mobile_playback_speed', '1.0');
        const bgMusic = b('mobile_bg_music', true);
        const sfx = b('mobile_sfx', true);
        const volMaster = s('mobile_vol_master', '80');
        const volMusic = s('mobile_vol_music', '5');
        const volSFX = s('mobile_vol_sfx', '50');
        const volContent = s('mobile_vol_content', '100');
        
        // 2. Visuals
        const theme = s('mobile_theme_primary', 'pink');
        const darkMode = b('mobile_dark_mode', false);
        const animQuality = s('mobile_anim_quality', 'high');
        const delay = s('mobile_autoplay_delay', '3');
        const bgPattern = b('mobile_bg_pattern', true);
        const glowEffect = b('mobile_glow_effect', true);
        const autoDark = b('mobile_auto_dark', false);
        const autoplay = b('mobile_autoplay', false);
        const reduceMotion = b('mobile_reduce_motion', false);
        const fastLoad = b('mobile_fast_load', true);
        const fontStyle = s('mobile_font_style', 'clean');
        const hdImages = b('mobile_hd_images', true);
        const fullscreen = b('mobile_fullscreen', false);
        const activeProfile = s('rajshree_active_profile', 'rajshree');
        
        // 3. Learning
        const difficulty = s('mobile_difficulty', 'intermediate');
        const dailyGoal = s('mobile_daily_goal', '20');

        // 4. Safety & Time
        const timer = s('mobile_timer', '30');
        const breakToggle = b('mobile_break', true);
        const childLock = b('mobile_child_lock', false);
        const lockAlerts = b('mobile_lock_alerts', true);
        const intrusionShield = b('mobile_intrusion_shield', false);
        const edgeProtection = b('mobile_edge_protection', false);
        const pinVisible = b('mobile_pin_visible', false);
        
        // Safety Locks
        const masterLock = b('mobile_master_lock', false);
        const lockNav = b('mobile_lock_nav', false);
        const lockHome = b('mobile_lock_home', false);
        const lockSettings = b('mobile_lock_settings', false);
        const lockMenu = b('mobile_lock_menu', false);
        const lockVol = b('mobile_lock_vol', false);
        const lockText = b('mobile_lock_text', false);
        const lockHold = b('mobile_lock_hold', false);
        const lockContext = b('mobile_lock_context', false);
        const lockFullscreen = b('mobile_lock_fullscreen', false);
        const lockBack = b('mobile_lock_back', false);
        
        // Master Toggles
        const masterAudio = b('mobile_master_audio', false);
        const masterGlobal = b('mobile_master_global', false);
        
        const lockAutoplay = b('mobile_lock_autoplay', false);
        const lockCard = b('mobile_lock_card', false);

        // Layout & View
        const viewMode = s('mobile_view_mode', 'flashcard');
        const flashcardNavDir = s('mobile_flashcard_nav_dir', 'horizontal');
        const gridNavDir = s('mobile_grid_nav_dir', 'horizontal');
        const showBottomNav = b('mobile_show_bottom_nav', true);
        const autoHideNav = b('mobile_autohide_nav', false);
        const showHome = b('mobile_show_home', true);
        const showNav = b('mobile_show_nav', true);
        const showSettings = b('mobile_show_settings', true);
        const showAutoplayNav = b('mobile_show_autoplay_nav', true);
        const masterNav = b('mobile_master_nav', true);

        // 5. Accessibility
        const largeText = b('mobile_large_text', false);
        const contrast = b('mobile_contrast', false);

        // 6. UI Language
        const uiLang = s('mobile_ui_language', 'hi');

        // Sync UI
        this.setVal('mobile-ui-lang', uiLang);
        this.setVal('mobile-playback-speed', speed);
        this.setCheck('mobile-bg-music', bgMusic);
        this.setCheck('mobile-sfx', sfx);
        this.setCheck('mobile-large-text', largeText);
        this.setCheck('mobile-contrast', contrast);
        this.setCheck('mobile-lock', childLock);
        this.setCheck('mobile-lock-alerts', lockAlerts);
        this.setCheck('mobile-intrusion-shield', intrusionShield);
        this.setCheck('mobile-edge-protection', edgeProtection);
        this.setCheck('parent-pin-visible', b('mobile_parent_pin_visible', false));
        this.setCheck('parent-pin-required', b('mobile_parent_pin_required', false));
        this.setCheck('admin-pin-visible', b('mobile_admin_pin_visible', false));
        this.setCheck('admin-pin-required', b('mobile_admin_pin_required', false));
        this.setCheck('dev-pin-visible', b('mobile_dev_pin_visible', false));
        this.setCheck('dev-pin-required', b('mobile_dev_pin_required', false));
        this.setCheck('designer-pin-visible', b('mobile_designer_pin_visible', false));
        this.setCheck('designer-pin-required', b('mobile_designer_pin_required', false));
        this.setCheck('mobile-break', breakToggle);
        this.setCheck('mobile-auto-dark', autoDark);
        this.setCheck('mobile-reduce-motion', reduceMotion);
        this.setCheck('mobile-fast-load', fastLoad);
        this.setVal('mobile-font-style', fontStyle);
        this.setCheck('mobile-autoplay', autoplay);
        this.setCheck('mobile-bg-pattern', bgPattern);
        this.setCheck('mobile-glow-effect', glowEffect);
        this.setCheck('mobile-hd-images', hdImages);
        this.setCheck('mobile-fullscreen', fullscreen);

        this.setCheck('mobile-show-home', showHome);
        this.setCheck('mobile-show-nav', showNav);
        this.setCheck('mobile-show-settings', showSettings);
        this.setCheck('mobile-show-autoplay-nav', showAutoplayNav);
        this.setCheck('mobile-master-nav', masterNav);

        const threeNavDir = localStorage.getItem('mobile_three_nav_dir') || 'horizontal';

        this.setSegmentedValue('mobile-view-mode', viewMode);
        this.setSegmentedValue('mobile-three-nav-dir', threeNavDir);
        this.setSegmentedValue('mobile-flashcard-nav-dir', flashcardNavDir);
        this.setSegmentedValue('mobile-grid-nav-dir', gridNavDir);
        this.setSegmentedValue('mobile-menu-style', localStorage.getItem('mobile_menu_style') || 'classic');
        this.setCheck('mobile-show-bottom-nav', showBottomNav);
        this.setCheck('mobile-autohide-nav', autoHideNav);

        const speedBadge = document.getElementById('mobile-speed-badge');
        if (speedBadge) speedBadge.textContent = speed + 'x';
        
        this.syncDarkModeUI();
        
        this.setVal('mobile-anim-quality', animQuality);
        this.setVal('mobile-delay', delay);
        this.setVal('mobile-timer', timer);
        this.setVal('mobile-difficulty', difficulty);
        this.setVal('mobile-daily-goal', dailyGoal);

        this.setVal('mobile-vol-master', volMaster);
        this.setVal('mobile-vol-music', volMusic);
        this.setVal('mobile-vol-sfx', volSFX);
        this.setVal('mobile-vol-content', volContent);

        const updateBadge = (id, val, unit) => {
            const el = document.getElementById(id + '-badge');
            if (el) el.textContent = val + unit;
        };
        updateBadge('mobile-vol-master', volMaster, '%');
        updateBadge('mobile-vol-music', volMusic, '%');
        updateBadge('mobile-vol-sfx', volSFX, '%');
        updateBadge('mobile-vol-content', volContent, '%');
        
        // Safety Locks UI Sync
        this.setCheck('mobile-master-lock', masterLock);
        this.setCheck('mobile-lock-nav', lockNav);
        this.setCheck('mobile-lock-home', lockHome);
        this.setCheck('mobile-lock-settings', lockSettings);
        this.setCheck('mobile-lock-menu', lockMenu);
        this.setCheck('mobile-lock-vol', lockVol);
        this.setCheck('mobile-lock-text', lockText);
        this.setCheck('mobile-lock-hold', lockHold);
        this.setCheck('mobile-lock-context', lockContext);
        this.setCheck('mobile-lock-fullscreen', lockFullscreen);
        this.setCheck('mobile-lock-back', lockBack);
        
        this.setCheck('mobile-master-audio', masterAudio);
        this.setCheck('mobile-master-global', masterGlobal);
        
        // Manual Dark Mode checkbox should reflect current state
        const effectiveDarkMode = autoDark ? window.matchMedia('(prefers-color-scheme: dark)').matches : darkMode;
        this.setCheck('mobile-dark-mode', effectiveDarkMode);

        // Apply visual classes immediately via ThemeEngine
        if (window.ThemeEngine) {
            if (window.ThemeEngine.applyReduceMotion) window.ThemeEngine.applyReduceMotion(reduceMotion);
            if (window.ThemeEngine.applyFontStyle) window.ThemeEngine.applyFontStyle(fontStyle);
        }

        // Grids
        this.updateGridSelection('.voice-card', 'voice', voice);
        this.updateGridSelection('.color-circle', 'theme', theme);
        this.updateGridSelection('#cat-parent .voice-card', 'profile', activeProfile);

        // Apply translations on load via external module
        if (window.RAJSHREE_I18N) {
            console.log("🌐 Applying UI Localization...");
            window.RAJSHREE_I18N.applyUI(uiLang);
        }
        
        console.log("✅ Load Settings Synchronized.");
    },



    initDraggableTabs: function() {
        const slider = document.querySelector('.category-tabs');
        if (!slider) return;

        let isDown = false;
        let isDragging = false;
        let startX;
        let scrollLeft;
        let rafId = null;
        const THRESHOLD = 7;

        const startAction = (e) => {
            isDown = true;
            isDragging = false;
            slider.style.scrollBehavior = 'auto';
            startX = (e.clientX || (e.touches && e.touches[0].clientX));
            scrollLeft = slider.scrollLeft;
        };

        const endAction = () => {
            isDown = false;
            isDragging = false;
            slider.classList.remove('dragging');
            slider.style.scrollBehavior = '';
            if (rafId) cancelAnimationFrame(rafId);
        };

        const moveAction = (e) => {
            if (!isDown) return;
            
            const x = (e.clientX || (e.touches && e.touches[0].clientX));
            const dist = Math.abs(x - startX);

            if (!isDragging && dist > THRESHOLD) {
                isDragging = true;
                slider.classList.add('dragging');
            }

            if (isDragging) {
                if (e.cancelable) e.preventDefault();
                const walk = (x - startX) * 2;
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    slider.scrollLeft = scrollLeft - walk;
                });
            }
        };

        slider.addEventListener('mousedown', startAction);
        slider.addEventListener('mouseleave', endAction);
        slider.addEventListener('mouseup', endAction);
        slider.addEventListener('mousemove', moveAction);

        slider.addEventListener('touchstart', startAction, { passive: false });
        slider.addEventListener('touchend', endAction);
        slider.addEventListener('touchmove', moveAction, { passive: false });
    },

    initCategoryTabs: function() {
        const tabs = document.querySelectorAll('.tab-btn');
        const views = document.querySelectorAll('.category-view');
        
        const lastTab = sessionStorage.getItem('activeSettingsTab') || 'cat-kids';
        
        const performSwitch = (targetId) => {
            tabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
            views.forEach(v => v.classList.toggle('active', v.id === targetId));
            sessionStorage.setItem('activeSettingsTab', targetId);
            document.body.classList.remove('tabs-hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const switchTab = (targetId) => {
            const isLocked = localStorage.getItem('mobile_child_lock') === 'true';
            if (isLocked && targetId !== 'cat-kids') {
                this.showPinModal('verify', (success) => {
                    if (success) {
                        performSwitch(targetId);
                    }
                });
                return;
            }
            performSwitch(targetId);
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.dataset.target);
                tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                document.querySelectorAll('.category-block').forEach(b => b.classList.remove('expanded'));
            });
        });

        const isLocked = localStorage.getItem('mobile_child_lock') === 'true';
        const initialTab = (isLocked && lastTab !== 'cat-kids') ? 'cat-kids' : lastTab;
        performSwitch(initialTab);
    },

    initAccordion: function() {
        const headers = document.querySelectorAll('.section-header');
        headers.forEach(header => {
            const toggle = () => {
                const block = header.parentElement;
                const isExpanded = block.classList.contains('expanded');
                
                // Collapse others
                document.querySelectorAll('.category-block').forEach(b => {
                    if (b !== block) b.classList.remove('expanded');
                });
                
                // Toggle current
                if (!isExpanded) {
                    block.classList.add('expanded');
                    block.classList.add('focused');
                    document.body.classList.add('tabs-hidden');
                    setTimeout(() => block.classList.remove('focused'), 1200);

                    setTimeout(() => {
                        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300); 
                } else {
                    block.classList.remove('expanded');
                    document.body.classList.remove('tabs-hidden');
                }
            };

            header.addEventListener('pointerdown', (e) => {
                // 1. Isolate the event: prevent window-level drag logic from seeing this touch
                e.stopPropagation();
                e.stopImmediatePropagation();

                // 2. Ignore right clicks
                if (e.button !== 0 && e.pointerType !== 'touch') return;
                
                // 3. Instant Toggle: Don't wait for pointerup to feel faster
                toggle();
            }, { capture: true }); // Use capture to win against other listeners
            
            // Prevent default click/tap behaviors to avoid double-processing
            header.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
            });

            // Accessibility Support
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        });
    },



    // --- SECURITY & PIN MODAL ---
    pinData: {
        buffer: '',
        callback: null,
        purpose: 'verify',
        tempNewPin: '',
        targetKey: 'mobile_parent_pin',
        visibilityKey: 'mobile_pin_visible',
        categoryName: 'Parent'
    },

    initPinPad: function() {
        document.querySelectorAll('.pin-keypad .key').forEach(btn => {
            if (btn.id === 'pin-cancel') {
                btn.addEventListener('click', () => this.hidePinModal(false));
            } else if (btn.id === 'pin-backspace') {
                btn.addEventListener('click', () => {
                    this.pinData.buffer = this.pinData.buffer.slice(0, -1);
                    this.updatePinDots();
                });
            } else {
                btn.addEventListener('click', () => this.handlePinKey(btn.textContent));
            }
        });
    },

    showPinModal: function(purpose, callback, config = {}) {
        const modal = document.getElementById('pin-modal');
        if (!modal) return;
        
        this.pinData.purpose = purpose;
        this.pinData.callback = callback;
        this.pinData.buffer = '';
        this.pinData.targetKey = config.targetKey || 'mobile_parent_pin';
        this.pinData.visibilityKey = config.visibilityKey || 'mobile_pin_visible';
        this.pinData.categoryName = config.categoryName || 'Parent';
        
        this.updatePinDots();
        
        const title = document.getElementById('pin-modal-title');
        const msg = document.getElementById('pin-modal-msg');
        if (msg) msg.textContent = '';
        
        if (title) {
            const baseTitle = this.getTranslation(purpose === 'setup' ? 'pin_title_setup' : 'pin_title_verify');
            title.textContent = `${baseTitle} (${this.pinData.categoryName})`;
        }
        modal.classList.add('active');
    },

    hidePinModal: function(success = false) {
        const modal = document.getElementById('pin-modal');
        if (modal) modal.classList.remove('active');
        if (this.pinData.callback) this.pinData.callback(success);
        this.pinData.callback = null;
    },

    updatePinDots: function() {
        const dots = document.querySelectorAll('.pin-dot');
        const showDigits = localStorage.getItem(this.pinData.visibilityKey) === 'true';
        dots.forEach((dot, index) => {
            const isFilled = index < this.pinData.buffer.length;
            dot.classList.toggle('filled', isFilled);
            if (showDigits && isFilled) {
                dot.textContent = this.pinData.buffer[index];
                dot.style.display = 'flex';
                dot.style.alignItems = 'center';
                dot.style.justifyContent = 'center';
                dot.style.fontSize = '1.2rem';
                dot.style.fontWeight = 'bold';
                dot.style.color = 'var(--text-primary)';
            } else {
                dot.textContent = '';
            }
        });
    },

    handlePinKey: function(key) {
        if (this.pinData.buffer.length < 4) {
            this.pinData.buffer += key;
            this.updatePinDots();
            if (this.pinData.buffer.length === 4) {
                setTimeout(() => this.validatePin(), 250);
            }
        }
    },

    validatePin: function() {
        const storedPin = localStorage.getItem(this.pinData.targetKey) || '1234';
        
        if (this.pinData.purpose === 'verify') {
            if (this.pinData.buffer === storedPin) {
                this.hidePinModal(true);
            } else {
                this.handlePinError();
            }
        } else if (this.pinData.purpose === 'setup') {
            this.pinData.tempNewPin = this.pinData.buffer;
            this.pinData.purpose = 'setup-confirm';
            this.pinData.buffer = '';
            this.updatePinDots();
            const title = document.getElementById('pin-modal-title');
            if (title) title.textContent = `${this.getTranslation('btn_confirm')} (${this.pinData.categoryName})`;
        } else if (this.pinData.purpose === 'setup-confirm') {
            if (this.pinData.buffer === this.pinData.tempNewPin) {
                localStorage.setItem(this.pinData.targetKey, this.pinData.buffer);
                this.hidePinModal(true);
            } else {
                this.handlePinError();
                setTimeout(() => {
                    this.pinData.purpose = 'setup';
                    this.pinData.buffer = '';
                    this.updatePinDots();
                    const title = document.getElementById('pin-modal-title');
                    if (title) title.textContent = `${this.getTranslation('pin_title_setup')} (${this.pinData.categoryName})`;
                }, 500);
            }
        }
    },

    handlePinError: function() {
        const modalContent = document.querySelector('.pin-modal-content');
        const msg = document.getElementById('pin-modal-msg');
        if (modalContent) {
            modalContent.classList.add('shake');
            setTimeout(() => modalContent.classList.remove('shake'), 400);
        }
        if (msg) msg.textContent = this.getTranslation('pin_wrong');
        this.pinData.buffer = '';
        this.updatePinDots();
    },

    initVerticalDraggable: function() {
        const slider = document.querySelector('.settings-container') || document.body;
        let isDown = false;
        let isDragging = false;
        let startY;
        let scrollTop;
        let rafId = null;
        const THRESHOLD = 7; // Minimal movement before hijacking scroll

        const start = (e) => {
            if (e.target.closest('button, input, select, .voice-card, .color-circle, .key, .switch, .slider, .toggle-row, .lock-card-compact, .master-lock-group, .standalone-lock-row')) return;
            isDown = true;
            isDragging = false;
            startY = (e.clientY || (e.touches && e.touches[0].clientY));
            scrollTop = window.scrollY;
            document.documentElement.style.scrollBehavior = 'auto';
        };

        const end = () => {
            isDown = false;
            isDragging = false;
            document.body.classList.remove('v-dragging');
            document.documentElement.style.scrollBehavior = '';
            if (rafId) cancelAnimationFrame(rafId);
        };

        const move = (e) => {
            if (!isDown) return;
            
            const y = (e.clientY || (e.touches && e.touches[0].clientY));
            const dist = Math.abs(y - startY);

            if (!isDragging && dist > THRESHOLD) {
                isDragging = true;
                document.body.classList.add('v-dragging');
            }

            if (isDragging) {
                if (e.cancelable) e.preventDefault();
                const walk = (y - startY) * 1.5;
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    window.scrollTo(0, scrollTop - walk);
                });
            }
        };

        window.addEventListener('mousedown', start);
        window.addEventListener('mouseleave', end);
        window.addEventListener('mouseup', end);
        window.addEventListener('mousemove', move);

        window.addEventListener('touchstart', start, { passive: false });
        window.addEventListener('touchend', end);
        window.addEventListener('touchmove', move, { passive: false });
    },

    getTranslation: function(key) {
        const lang = localStorage.getItem('mobile_ui_language') || 'hi';
        return (window.RAJSHREE_I18N && window.RAJSHREE_I18N.translations[lang][key]) || key;
    },

    // --- HELPERS ---
    setVal: function(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    },

    setSegmentedValue: function(containerId, activeValue) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const buttons = container.querySelectorAll('.seg-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-value') === activeValue);
        });
    },

    setCheck: (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; },

    updateGridSelection: function(selector, dataAttr, currentVal) {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.toggle('active', el.dataset[dataAttr] === currentVal);
        });
    },

    showToast: function(message) {
        const t = document.createElement('div');
        t.className = 'toast-msg';
        t.textContent = message;
        document.body.appendChild(t);
        setTimeout(() => { 
            t.style.opacity = '0'; 
            setTimeout(() => t.remove(), 400); 
        }, 1500);
    },

    syncDarkModeUI: function() {
        const autoDark = localStorage.getItem('mobile_auto_dark') === 'true';
        const manualGroup = document.getElementById('manual-dark-group');
        const manualInput = document.getElementById('mobile-dark-mode');
        
        if (manualGroup && manualInput) {
            if (autoDark) {
                manualGroup.classList.add('is-disabled');
                manualInput.disabled = true;
            } else {
                manualGroup.classList.remove('is-disabled');
                manualInput.disabled = false;
            }
        }
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
                if (checkbox && !checkbox.disabled) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => card.style.transform = '', 100);
                }
            });
        });
    },

    initSwitches: function() {
        document.querySelectorAll('.switch').forEach(sw => {
            if (sw.tagName === 'SPAN') {
                sw.style.cursor = 'pointer';
                sw.addEventListener('click', (e) => {
                    // Prevent double toggle if the switch is managed by a parent container script
                    if (sw.closest('.lock-card-compact, .master-lock-group, .standalone-lock-row')) return;

                    // Prevent double triggering if clicked directly on input or handled by a parent container
                    if (e.target.tagName === 'INPUT' || document.activeElement === sw.querySelector('input')) return;
                    
                    const checkbox = sw.querySelector('input[type="checkbox"]');
                    if (checkbox && !checkbox.disabled) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            }
        });
    }
};
