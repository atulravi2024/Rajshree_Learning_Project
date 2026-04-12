/**
 * Rajshree Learning - Ultimate Mobile Settings Logic
 * =================================================
 * Full persistence for 16+ categories and 30+ parameters.
 * Optimized for high-fidelity interactive demo.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Ultimate Settings Loaded!");
    // Special handling for Speech Speed Badge
    const speedInput = document.getElementById('mobile-speed');
    const speedBadge = document.getElementById('mobile-speed-badge');
    if (speedInput && speedBadge) {
        speedInput.addEventListener('input', (e) => {
            speedBadge.textContent = e.target.value + 'x';
        });
    }

    // Initialize all accordions
    loadSettings();
    initAccordion();
    initCategoryTabs(); // New horizontal navigation logic
    initDraggableTabs(); // Touch and hold scroll logic
    initVerticalDraggable(); // Vertical touch and hold logic
    initSwipeToClose(); // Gesture to close settings
    attachEvents();
});

// Vertical Drag to Scroll Logic
const initVerticalDraggable = () => {
    const el = document.documentElement;
    let isDown = false;
    let startY;
    let scrollTop;
    let rafId = null;
    let isDragging = false; 
    const THRESHOLD = 7; // Pixels to move before starting drag

    const startAction = (e) => {
        const interactiveTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'];
        if (interactiveTags.includes(e.target.tagName)) return;
        if (e.target.closest('.range-container') || e.target.closest('.slider')) return;
        
        isDown = true;
        isDragging = false;
        startY = (e.clientY || e.touches[0].clientY);
        scrollTop = window.pageYOffset || el.scrollTop;
        
        // Disable global smooth scroll immediately
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
        
        const y = (e.clientY || e.touches[0].clientY);
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
};

// Drag to Scroll Logic (Slider Effect)
const initDraggableTabs = () => {
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
        startX = (e.clientX || e.touches[0].clientX);
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
        
        const x = (e.clientX || e.touches[0].clientX);
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
};

// Category Tab Switching Logic
const initCategoryTabs = () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.category-view');
    
    // Recovery of last active tab (optional persistence)
    const lastTab = sessionStorage.getItem('activeSettingsTab') || 'cat-kids';
    
    const performSwitch = (targetId) => {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
        views.forEach(v => v.classList.toggle('active', v.id === targetId));
        sessionStorage.setItem('activeSettingsTab', targetId);
    };

    const switchTab = (targetId) => {
        const isLocked = localStorage.getItem('mobile_child_lock') === 'true';
        if (isLocked && targetId !== 'cat-kids') {
            showPinModal('verify', (success) => {
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
};

// Accordion Logic (Exclusive Expansion)
const initAccordion = () => {
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
                
                // Trigger Highlight Focus effect
                block.classList.add('focused');
                setTimeout(() => block.classList.remove('focused'), 1200);

                // Auto-Focus & Auto-Scroll (Synchronized)
                setTimeout(() => {
                    syncScrollFocus(block);
                }, 100); 
            }
        });
    });
};

/** Synchronized Scroll Focus Helper */
const syncScrollFocus = (el) => {
    if (!el) return;
    el.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
};

// Load all settings from localStorage
const loadSettings = () => {
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
    
    // 3. Learning
    const difficulty = s('mobile_difficulty', 'intermediate');
    const dailyGoal = s('mobile_daily_goal', '20');

    // 4. Safety & Time
    const timer = s('mobile_timer', '30');
    const breakToggle = b('mobile_break', true);
    const childLock = b('mobile_child_lock', false);
    
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
    setVal('mobile-ui-lang', uiLang);
    setVal('mobile-speed', speed);
    setCheck('mobile-bg-music', bgMusic);
    setCheck('mobile-sfx', sfx);
    setCheck('mobile-large-text', largeText);
    setCheck('mobile-contrast', contrast);
    setCheck('mobile-lock', childLock);
    setCheck('mobile-break', breakToggle);
    setCheck('mobile-autoplay', autoplay);
    setCheck('mobile-bg-pattern', bgPattern);
    setCheck('mobile-glow-effect', glowEffect);
    setCheck('mobile-auto-dark', autoDark);
    const speedBadge = document.getElementById('mobile-speed-badge');
    if (speedBadge) speedBadge.textContent = speed + 'x';
    
    syncDarkModeUI();
    
    setVal('mobile-anim-quality', animQuality);
    setVal('mobile-delay', delay);
    setVal('mobile-timer', timer);
    setVal('mobile-difficulty', difficulty);
    setVal('mobile-daily-goal', dailyGoal);

    setCheck('mobile-bg-music', bgMusic);
    setCheck('mobile-sfx', sfx);

    setVal('mobile-vol-master', volMaster);
    setVal('mobile-vol-music', volMusic);
    setVal('mobile-vol-sfx', volSFX);
    setVal('mobile-vol-content', volContent);

    const updateBadge = (id, val, unit) => {
        const el = document.getElementById(id + '-badge');
        if (el) el.textContent = val + unit;
    };
    updateBadge('mobile-vol-master', volMaster, '%');
    updateBadge('mobile-vol-music', volMusic, '%');
    updateBadge('mobile-vol-sfx', volSFX, '%');
    updateBadge('mobile-vol-content', volContent, '%');
    setCheck('mobile-break', breakToggle);
    setCheck('mobile-large-text', largeText);
    setCheck('mobile-contrast', contrast);
    setCheck('mobile-lock', childLock);
    
    // Safety Locks UI Sync
    setCheck('mobile-master-lock', masterLock);
    setCheck('mobile-lock-nav', lockNav);
    setCheck('mobile-lock-home', lockHome);
    setCheck('mobile-lock-settings', lockSettings);
    setCheck('mobile-lock-menu', lockMenu);
    setCheck('mobile-lock-vol', lockVol);
    setCheck('mobile-lock-text', lockText);
    setCheck('mobile-lock-hold', lockHold);
    setCheck('mobile-lock-context', lockContext);
    setCheck('mobile-lock-fullscreen', lockFullscreen);
    setCheck('mobile-lock-back', lockBack);
    
    setCheck('mobile-master-audio', masterAudio);
    setCheck('mobile-master-global', masterGlobal);
    
    setCheck('mobile-lock-autoplay', lockAutoplay);
    setCheck('mobile-lock-card', lockCard);
    
    setCheck('mobile-autoplay', autoplay);
    setCheck('mobile-dark-mode', darkMode);

    // Grids
    updateGridSelection('.voice-card', 'voice', voice);
    updateGridSelection('.color-circle', 'theme', theme);

    // Apply translations on load via external module
    if (window.RAJSHREE_I18N) window.RAJSHREE_I18N.applyUI(uiLang);
};

// --- MULTILINGUAL LOGIC DELEGATED TO i18n.js ---

// Unified Event Handlers
const attachEvents = () => {
    // 1. Toggles
    const toggles = [
        { id: 'mobile-bg-music', key: 'mobile_bg_music', label: 'बैकग्राउंड म्यूजिक' },
        { id: 'mobile-sfx', key: 'mobile_sfx', label: 'साउंड इफेक्ट्स' },
        { id: 'mobile-break', key: 'mobile_break', label: 'ब्रेक रिमाइंडर' },
        { id: 'mobile-large-text', key: 'mobile_large_text', label: 'बड़ा टेक्स्ट' },
        { id: 'mobile-contrast', key: 'mobile_contrast', label: 'हाई कंट्रास्ट' },
        { id: 'mobile-lock', key: 'mobile_child_lock', label: 'चिल्ड लॉक' },
        { id: 'mobile-autoplay', key: 'mobile_autoplay', label: 'ऑटो-प्ले' },
        { id: 'mobile-dark-mode', key: 'mobile_dark_mode', label: 'डार्क मोड' },
        { id: 'mobile-bg-pattern', key: 'mobile_bg_pattern', label: 'बैकग्राउंड पैटर्न' },
        { id: 'mobile-auto-dark', key: 'mobile_auto_dark', label: 'ऑटो डार्क मोड' },
        { id: 'mobile-glow-effect', key: 'mobile_glow_effect', label: 'चमक इफेक्ट्स' },
        { id: 'mobile-master-lock', key: 'mobile_master_lock', label: 'मास्टर लॉक' },
        { id: 'mobile-lock-nav', key: 'mobile_lock_nav', label: 'अगला/पिछला लॉक' },
        { id: 'mobile-lock-home', key: 'mobile_lock_home', label: 'होम बटन लॉक' },
        { id: 'mobile-lock-settings', key: 'mobile_lock_settings', label: 'सेटिंग्स लॉक' },
        { id: 'mobile-lock-menu', key: 'mobile_lock_menu', label: 'मेन्यू लॉक' },
        { id: 'mobile-lock-vol', key: 'mobile_lock_vol', label: 'वॉल्यूम लॉक' },
        { id: 'mobile-lock-text', key: 'mobile_lock_text', label: 'टेक्स्ट लॉक' },
        { id: 'mobile-lock-hold', key: 'mobile_lock_hold', label: 'क्लिक लॉक' },
        { id: 'mobile-lock-context', key: 'mobile_lock_context', label: 'राइट क्लिक लॉक' },
        { id: 'mobile-lock-fullscreen', key: 'mobile_lock_fullscreen', label: 'फुल स्क्रीन लॉक' },
        { id: 'mobile-lock-back', key: 'mobile_lock_back', label: 'बैक बटन लॉक' },
        { id: 'mobile-master-audio', key: 'mobile_master_audio', label: 'मास्टर लॉक ऑडियो' },
        { id: 'mobile-master-global', key: 'mobile_master_global', label: 'मास्टर लॉक स्थायी' },
        { id: 'mobile-lock-autoplay', key: 'mobile_lock_autoplay', label: 'ऑटो-प्ले लॉक' },
        { id: 'mobile-lock-card', key: 'mobile_lock_card', label: 'कार्ड लॉक' }
    ];

    toggles.forEach(t => {
        const el = document.getElementById(t.id);
        if (el) el.addEventListener('change', (e) => {
            const val = e.target.checked;

            // --- CHILD LOCK TOGGLE INTERCEPTION ---
            if (t.key === 'mobile_child_lock' && !val) {
                e.target.checked = true; // Revert UI
                showPinModal('verify', (success) => {
                    if (success) {
                        e.target.checked = false;
                        localStorage.setItem(t.key, false);
                        showToast(getTranslation('child_lock_off'));
                    }
                });
                return;
            }

            localStorage.setItem(t.key, val);
            if (t.key === 'mobile_dark_mode' && window.ThemeEngine) {
                window.ThemeEngine.applyDarkMode(val);
            }
            if (t.key === 'mobile_large_text' && window.ThemeEngine) {
                window.ThemeEngine.applyLargeText(val);
            }
            if (t.key === 'mobile_contrast' && window.ThemeEngine) {
                window.ThemeEngine.applyContrast(val);
            }
            if (t.key === 'mobile_bg_pattern' && window.ThemeEngine) {
                window.ThemeEngine.applyBackgroundPattern(val);
            }
            if (t.key === 'mobile_auto_dark' && window.ThemeEngine) {
                window.ThemeEngine.applyAutoDarkMode(val);
                syncDarkModeUI();
            }
            if (t.key === 'mobile_glow_effect' && window.ThemeEngine) {
                window.ThemeEngine.applyGlowEffect(val);
            }
            
            if (t.key === 'mobile_child_lock' && val) {
                showToast(getTranslation('child_lock_on'));
            } else {
                showToast(`${t.label} ${val ? 'शुरू' : 'बंद'}`);
            }
        });
    });

    // 2. Sliders & Selects
    const inputs = [
        { id: 'mobile-speed', key: 'mobile_playback_speed' },
        { id: 'mobile-anim-quality', key: 'mobile_anim_quality', label: 'एनिमेशन' },
        { id: 'mobile-delay', key: 'mobile_autoplay_delay' },
        { id: 'mobile-timer', key: 'mobile_timer', label: 'समय सीमा' },
        { id: 'mobile-difficulty', key: 'mobile_difficulty', label: 'कठिनाई' },
        { id: 'mobile-daily-goal', key: 'mobile_daily_goal', label: 'डेली लक्ष्य' },
        { id: 'mobile-ui-lang', key: 'mobile_ui_language', label: 'भाषा' },
        { id: 'mobile-vol-master', key: 'mobile_vol_master', label: 'मास्टर आवाज़', unit: '%' },
        { id: 'mobile-vol-music', key: 'mobile_vol_music', label: 'संगीत', unit: '%' },
        { id: 'mobile-vol-sfx', key: 'mobile_vol_sfx', label: 'साउंड इफेक्ट्स', unit: '%' },
        { id: 'mobile-vol-content', key: 'mobile_vol_content', label: 'सामग्री', unit: '%' }
    ];

    inputs.forEach(i => {
        const el = document.getElementById(i.id);
        if (el) el.addEventListener('input', (e) => {
            const val = e.target.value;
            localStorage.setItem(i.key, val);
            
            // Update Volume Badge if exists
            const badge = document.getElementById(`${i.id}-badge`);
            if (badge) badge.textContent = val + (i.unit || '');
            
            // Handle UI Language Change
            if (i.key === 'mobile_ui_language') {
                if (window.RAJSHREE_I18N) {
                    window.RAJSHREE_I18N.applyUI(val);
                    const toastMsg = window.RAJSHREE_I18N.translations[val].toast_lang_update;
                    showToast(toastMsg);
                }
                return;
            }

            if (i.key === 'mobile_anim_quality' && window.ThemeEngine) {
                window.ThemeEngine.applyAnimQuality(val);
            }
            if (i.label) showToast(`${i.label}: ${val}`);
        });
    });

    // 3. Choice Grids
    document.querySelectorAll('.voice-card').forEach(card => {
        if (card.dataset.voice) {
            card.addEventListener('click', () => {
                const voice = card.dataset.voice;
                localStorage.setItem('mobile_voice_profile', voice);
                updateGridSelection('.voice-card', 'voice', voice);
                showToast(`आवाज़: ${voice}`);
            });
        }
    });

    document.querySelectorAll('.color-circle').forEach(circle => {
            circle.addEventListener('click', () => {
                const theme = circle.dataset.theme;
                localStorage.setItem('mobile_theme_primary', theme);
                if (window.ThemeEngine) window.ThemeEngine.applyTheme(theme);
                updateGridSelection('.color-circle', 'theme', theme);
                showToast(`थीम अपडेट!`);
            });
    });

    // 4. Reset
    const resetBtn = document.getElementById('reset-app');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Reset everything?")) {
                localStorage.clear();
                location.reload();
            }
        });
    }

    // 5. Master Lock Logic
    initMasterLock('mobile-master-audio', '.audio-lock');
    initMasterLock('mobile-master-global', '.global-lock');
};

const initMasterLock = (masterId, slaveClass) => {
    const master = document.getElementById(masterId);
    const slaves = document.querySelectorAll(slaveClass);
    
    if (!master) return;
    
    master.addEventListener('change', (e) => {
        const val = e.target.checked;
        slaves.forEach(s => {
            if (s.checked !== val) {
                s.checked = val;
                // Trigger change to save to localStorage
                s.dispatchEvent(new Event('change'));
            }
        });
    });
};

const syncDarkModeUI = () => {
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
};

/** HELPERS */
const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };

const updateGridSelection = (selector, dataAttr, currentVal) => {
    document.querySelectorAll(selector).forEach(el => {
        el.classList.toggle('active', el.dataset[dataAttr] === currentVal);
    });
};

const showToast = (message) => {
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => { 
        t.style.opacity = '0'; 
        setTimeout(() => t.remove(), 400); 
    }, 1500);
};

// --- SECURITY & CHILD LOCK LOGIC ---

let currentPinBuffer = '';
let pinModalCallback = null;
let pinModalPurpose = 'verify'; // 'verify', 'setup', 'setup-confirm'
let tempNewPin = '';

const getTranslation = (key) => {
    const lang = localStorage.getItem('mobile_ui_language') || 'hi';
    return window.RAJSHREE_I18N.translations[lang][key] || key;
};

window.setupParentPin = () => {
    showPinModal('setup', (success) => {
        if (success) {
            showToast(getTranslation('pin_success'));
        }
    });
};

const showPinModal = (purpose, callback) => {
    const modal = document.getElementById('pin-modal');
    if (!modal) return;
    
    pinModalPurpose = purpose;
    pinModalCallback = callback;
    currentPinBuffer = '';
    updatePinDots();
    
    const title = document.getElementById('pin-modal-title');
    const msg = document.getElementById('pin-modal-msg');
    if (msg) msg.textContent = '';
    
    if (title) {
        title.textContent = getTranslation(purpose === 'setup' ? 'pin_title_setup' : 'pin_title_verify');
    }
    
    modal.classList.add('active');
};

const hidePinModal = (success = false) => {
    const modal = document.getElementById('pin-modal');
    if (modal) modal.classList.remove('active');
    if (pinModalCallback) pinModalCallback(success);
    pinModalCallback = null;
};

const updatePinDots = () => {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('filled', index < currentPinBuffer.length);
    });
};

const handleKeyClick = (key) => {
    if (currentPinBuffer.length < 4) {
        currentPinBuffer += key;
        updatePinDots();
        
        if (currentPinBuffer.length === 4) {
            setTimeout(validatePin, 250);
        }
    }
};

const validatePin = () => {
    const storedPin = localStorage.getItem('mobile_parent_pin') || '1234';
    const modalContent = document.querySelector('.pin-modal-content');
    
    if (pinModalPurpose === 'verify') {
        if (currentPinBuffer === storedPin) {
            hidePinModal(true);
        } else {
            handlePinError();
        }
    } else if (pinModalPurpose === 'setup') {
        tempNewPin = currentPinBuffer;
        pinModalPurpose = 'setup-confirm';
        currentPinBuffer = '';
        updatePinDots();
        const title = document.getElementById('pin-modal-title');
        if (title) title.textContent = getTranslation('btn_confirm');
    } else if (pinModalPurpose === 'setup-confirm') {
        if (currentPinBuffer === tempNewPin) {
            localStorage.setItem('mobile_parent_pin', currentPinBuffer);
            hidePinModal(true);
        } else {
            handlePinError();
            // Reset to setup phase
            setTimeout(() => {
                pinModalPurpose = 'setup';
                currentPinBuffer = '';
                updatePinDots();
                const title = document.getElementById('pin-modal-title');
                if (title) title.textContent = getTranslation('pin_title_setup');
            }, 500);
        }
    }
};

const handlePinError = () => {
    const modalContent = document.querySelector('.pin-modal-content');
    const msg = document.getElementById('pin-modal-msg');
    
    if (modalContent) {
        modalContent.classList.add('shake');
        setTimeout(() => modalContent.classList.remove('shake'), 400);
    }
    
    if (msg) msg.textContent = getTranslation('pin_wrong');
    
    currentPinBuffer = '';
    updatePinDots();
};

const initPinPad = () => {
    document.querySelectorAll('.pin-keypad .key').forEach(btn => {
        if (btn.id === 'pin-cancel') {
            btn.addEventListener('click', () => hidePinModal(false));
        } else if (btn.id === 'pin-backspace') {
            btn.addEventListener('click', () => {
                currentPinBuffer = currentPinBuffer.slice(0, -1);
                updatePinDots();
            });
        } else {
            btn.addEventListener('click', () => handleKeyClick(btn.textContent));
        }
    });
};

/** Swipe from Right to Left to Close */
const initSwipeToClose = () => {
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
            showToast("👋 नमस्ते!");
            
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
};

// Override DOMContentLoaded to init the new logic
const originalInit = () => {
    initPinPad();
};

// Hijack the load and initialization
const wrapInit = () => {
    const oldOnLoad = window.onload;
    window.onload = () => {
        if (oldOnLoad) oldOnLoad();
        initPinPad();
    };
};
wrapInit();
