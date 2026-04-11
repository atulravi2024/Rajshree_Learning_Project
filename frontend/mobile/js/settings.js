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
        el.classList.add('v-dragging'); // Added to html tag
        el.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
    };

    const endAction = () => {
        isDown = false;
        isDragging = false;
        document.body.classList.remove('v-dragging');
        el.classList.remove('v-dragging'); // Removed from html tag
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
    
    const switchTab = (targetId) => {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
        views.forEach(v => v.classList.toggle('active', v.id === targetId));
        sessionStorage.setItem('activeSettingsTab', targetId);
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.target);
            // Ensure the clicked tab is visible in the scrollable bar
            tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            // Close any open accordions when switching categories for a clean view
            document.querySelectorAll('.category-block').forEach(b => b.classList.remove('expanded'));
        });
    });

    // Initial activation
    switchTab(lastTab);
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

                // Auto-Focus & Auto-Scroll
                setTimeout(() => {
                    block.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100); 
            }
        });
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
    
    // 2. Visuals
    const theme = s('mobile_theme_primary', 'pink');
    const animQuality = s('mobile_anim_quality', 'high');
    const delay = s('mobile_autoplay_delay', '3');
    const autoplay = b('mobile_autoplay', false);
    
    // 3. Learning
    const difficulty = s('mobile_difficulty', 'intermediate');
    const dailyGoal = s('mobile_daily_goal', '20');

    // 4. Safety & Time
    const timer = s('mobile_timer', '30');
    const breakToggle = b('mobile_break', true);
    const childLock = b('mobile_child_lock', false);

    // 5. Accessibility
    const largeText = b('mobile_large_text', false);
    const contrast = b('mobile_contrast', false);

    // Sync UI
    setVal('mobile-speed', speed);
    const speedBadge = document.getElementById('mobile-speed-badge');
    if (speedBadge) speedBadge.textContent = speed + 'x';
    
    setVal('mobile-anim-quality', animQuality);
    setVal('mobile-delay', delay);
    setVal('mobile-timer', timer);
    setVal('mobile-difficulty', difficulty);
    setVal('mobile-daily-goal', dailyGoal);

    setCheck('mobile-bg-music', bgMusic);
    setCheck('mobile-sfx', sfx);
    setCheck('mobile-break', breakToggle);
    setCheck('mobile-large-text', largeText);
    setCheck('mobile-contrast', contrast);
    setCheck('mobile-lock', childLock);
    setCheck('mobile-autoplay', autoplay);

    // Grids
    updateGridSelection('.voice-card', 'voice', voice);
    updateGridSelection('.color-circle', 'theme', theme);
};

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
        { id: 'mobile-autoplay', key: 'mobile_autoplay', label: 'ऑटो-प्ले' }
    ];

    toggles.forEach(t => {
        const el = document.getElementById(t.id);
        if (el) el.addEventListener('change', (e) => {
            localStorage.setItem(t.key, e.target.checked);
            showToast(`${t.label} ${e.target.checked ? 'शुरू' : 'बंद'}`);
        });
    });

    // 2. Sliders & Selects
    const inputs = [
        { id: 'mobile-speed', key: 'mobile_playback_speed' },
        { id: 'mobile-anim-quality', key: 'mobile_anim_quality', label: 'एनिमेशन' },
        { id: 'mobile-delay', key: 'mobile_autoplay_delay' },
        { id: 'mobile-timer', key: 'mobile_timer', label: 'समय सीमा' },
        { id: 'mobile-difficulty', key: 'mobile_difficulty', label: 'कठिनाई' },
        { id: 'mobile-daily-goal', key: 'mobile_daily_goal', label: 'डेली लक्ष्य' }
    ];

    inputs.forEach(i => {
        const el = document.getElementById(i.id);
        if (el) el.addEventListener('input', (e) => {
            localStorage.setItem(i.key, e.target.value);
            if (i.label) showToast(`${i.label}: ${e.target.value}`);
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
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast-msg';
    Object.assign(t.style, {
        position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(26,26,46,0.95)', color: 'white', padding: '12px 30px',
        borderRadius: '40px', zIndex: '999', fontSize: '14px', fontWeight: 'bold'
    });
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 1500);
};
