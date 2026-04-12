/**
 * Rajshree Learning - Settings Core Infrastructure
 * Logic for UI persistence, navigation, and security components.
 */

window.SettingsCore = {
    init: function() {
        console.log("⚙️ Settings Core Initializing...");
        this.loadSettings();
        this.initAccordion();
        this.initCategoryTabs();
        this.initStickyEffects();
        this.initDraggableTabs();
        this.initVerticalDraggable();
        this.initSwipeToClose();
        this.initPinPad();
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
        
        // 3. Learning
        const difficulty = s('mobile_difficulty', 'intermediate');
        const dailyGoal = s('mobile_daily_goal', '20');

        // 4. Safety & Time
        const timer = s('mobile_timer', '30');
        const breakToggle = b('mobile_break', true);
        const childLock = b('mobile_child_lock', false);
        const lockAlerts = b('mobile_lock_alerts', true);
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
        this.setCheck('mobile-pin-visible', pinVisible);
        this.setCheck('mobile-break', breakToggle);
        this.setCheck('mobile-auto-dark', autoDark);
        this.setCheck('mobile-reduce-motion', reduceMotion);
        this.setCheck('mobile-fast-load', fastLoad);
        this.setVal('mobile-font-style', fontStyle);
        this.setCheck('mobile-autoplay', autoplay);
        this.setCheck('mobile-bg-pattern', bgPattern);
        this.setCheck('mobile-glow-effect', glowEffect);
        this.setCheck('mobile-auto-dark', autoDark);
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
        
        this.setCheck('mobile-lock-autoplay', lockAutoplay);
        this.setCheck('mobile-lock-card', lockCard);
        
        this.setCheck('mobile-autoplay', autoplay);
        this.setCheck('mobile-dark-mode', darkMode);

        // Apply visual classes immediately via ThemeEngine
        if (window.ThemeEngine) {
            if (window.ThemeEngine.applyReduceMotion) window.ThemeEngine.applyReduceMotion(reduceMotion);
            if (window.ThemeEngine.applyFontStyle) window.ThemeEngine.applyFontStyle(fontStyle);
        }

        // Grids
        this.updateGridSelection('.voice-card', 'voice', voice);
        this.updateGridSelection('.color-circle', 'theme', theme);

        // Apply translations on load via external module
        if (window.RAJSHREE_I18N) window.RAJSHREE_I18N.applyUI(uiLang);
    },

    // --- UI NAVIGATION LOGIC ---
    initVerticalDraggable: function() {
        const el = document.documentElement;
        let isDown = false;
        let startY;
        let scrollTop;
        let rafId = null;
        let isDragging = false; 
        const THRESHOLD = 7;

        const startAction = (e) => {
            const interactiveTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'];
            if (interactiveTags.includes(e.target.tagName)) return;
            if (e.target.closest('.range-container') || e.target.closest('.slider')) return;
            
            isDown = true;
            isDragging = false;
            startY = (e.clientY || (e.touches && e.touches[0].clientY));
            scrollTop = window.pageYOffset || el.scrollTop;
            
            document.body.classList.add('v-dragging');
            el.classList.add('v-dragging');
            el.style.scrollBehavior = 'auto';
            document.body.style.scrollBehavior = 'auto';
        };

        const endAction = () => {
            isDown = false;
            isDragging = false;
            document.body.classList.remove('v-dragging');
            el.classList.remove('v-dragging');
            document.body.style.touchAction = '';
            el.style.scrollBehavior = '';
            document.body.style.scrollBehavior = '';
            if (rafId) cancelAnimationFrame(rafId);
        };

        const moveAction = (e) => {
            if (!isDown) return;
            
            const y = (e.clientY || (e.touches && e.touches[0].clientY));
            const dist = Math.abs(y - startY);

            if (!isDragging && dist > THRESHOLD) {
                isDragging = true;
                document.body.classList.add('v-dragging');
                document.body.style.touchAction = 'none';
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

        window.addEventListener('mousedown', startAction);
        window.addEventListener('mouseleave', endAction);
        window.addEventListener('mouseup', endAction);
        window.addEventListener('mousemove', moveAction);

        window.addEventListener('touchstart', startAction, { passive: false });
        window.addEventListener('touchend', endAction);
        window.addEventListener('touchmove', moveAction, { passive: false });
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
            header.addEventListener('click', () => {
                const block = header.parentElement;
                const isExpanded = block.classList.contains('expanded');
                
                document.querySelectorAll('.category-block').forEach(b => {
                    b.classList.remove('expanded');
                });
                
                if (!isExpanded) {
                    block.classList.add('expanded');
                    block.classList.add('focused');
                    document.body.classList.add('tabs-hidden');
                    setTimeout(() => block.classList.remove('focused'), 1200);

                    setTimeout(() => {
                        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 250); 
                } else {
                    document.body.classList.remove('tabs-hidden');
                }
            });
        });
    },

    initSwipeToClose: function() {
        let touchStartX = 0;
        let touchStartY = 0;
        const SWIPE_THRESHOLD = 80; 
        const VERTICAL_THRESHOLD = 100; 

        window.addEventListener('touchstart', (e) => {
            if (e.target.closest('.range-container') || e.target.closest('.category-tabs') || e.target.closest('.color-grid') || e.target.closest('.pin-modal-content')) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchStartX - touchEndX; 
            const deltaY = Math.abs(touchStartY - touchEndY);

            if (deltaX > SWIPE_THRESHOLD && deltaY < VERTICAL_THRESHOLD) {
                this.showToast("👋 नमस्ते!");
                setTimeout(() => {
                    const isLocked = localStorage.getItem('mobile_child_lock') === 'true';
                    if (isLocked) {
                        window.location.href = 'index.html';
                    } else if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 400);
            }
        }, { passive: true });
    },

    // --- SECURITY & PIN MODAL ---
    pinData: {
        buffer: '',
        callback: null,
        purpose: 'verify',
        tempNewPin: ''
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

    showPinModal: function(purpose, callback) {
        const modal = document.getElementById('pin-modal');
        if (!modal) return;
        
        this.pinData.purpose = purpose;
        this.pinData.callback = callback;
        this.pinData.buffer = '';
        this.updatePinDots();
        
        const title = document.getElementById('pin-modal-title');
        const msg = document.getElementById('pin-modal-msg');
        if (msg) msg.textContent = '';
        
        if (title) {
            title.textContent = this.getTranslation(purpose === 'setup' ? 'pin_title_setup' : 'pin_title_verify');
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
        const showDigits = localStorage.getItem('mobile_pin_visible') === 'true';
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
        const storedPin = localStorage.getItem('mobile_parent_pin') || '1234';
        
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
            if (title) title.textContent = this.getTranslation('btn_confirm');
        } else if (this.pinData.purpose === 'setup-confirm') {
            if (this.pinData.buffer === this.pinData.tempNewPin) {
                localStorage.setItem('mobile_parent_pin', this.pinData.buffer);
                this.hidePinModal(true);
            } else {
                this.handlePinError();
                setTimeout(() => {
                    this.pinData.purpose = 'setup';
                    this.pinData.buffer = '';
                    this.updatePinDots();
                    const title = document.getElementById('pin-modal-title');
                    if (title) title.textContent = this.getTranslation('pin_title_setup');
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

    getTranslation: function(key) {
        const lang = localStorage.getItem('mobile_ui_language') || 'hi';
        return (window.RAJSHREE_I18N && window.RAJSHREE_I18N.translations[lang][key]) || key;
    },

    // --- HELPERS ---
    setVal: (id, val) => { const el = document.getElementById(id); if (el) el.value = val; },
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
    }
};
