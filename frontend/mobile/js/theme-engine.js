/**
 * Rajshree Learning - Theme Engine (Mobile)
 * =========================================
 * Manages premium gradients, dark mode, and animation quality settings globally.
 * Designed to prevent FOUC (Flash of Unstyled Content).
 */

const ThemeEngine = (() => {
    const themes = {
        pink: {
            '--primary-color': '#FF1493',
            '--primary-gradient': 'linear-gradient(135deg, #FF1493, #FF69B4, #FF8EBF)',
            '--accent-color': '#FF69B4',
            '--light-bg': '#FFDEE9',
            '--bg-gradient': 'linear-gradient(135deg, #FFDEE9 0%, #FFFFFF 50%, #e0f2fe 100%)',
            '--glow-color': 'rgba(255, 20, 147, 0.4)'
        },
        blue: {
            '--primary-color': '#1E90FF',
            '--primary-gradient': 'linear-gradient(135deg, #1E90FF, #00BFFF, #87CEFA)',
            '--accent-color': '#00BFFF',
            '--light-bg': '#E0F2FE',
            '--bg-gradient': 'linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 50%, #B5FFFC 100%)',
            '--glow-color': 'rgba(30, 144, 255, 0.4)'
        },
        purple: {
            '--primary-color': '#8B5CF6',
            '--primary-gradient': 'linear-gradient(135deg, #8B5CF6, #A78BFA, #C4B5FD)',
            '--accent-color': '#A78BFA',
            '--light-bg': '#EDE9FE',
            '--bg-gradient': 'linear-gradient(135deg, #EDE9FE 0%, #FFFFFF 50%, #E0F2FE 100%)',
            '--glow-color': 'rgba(139, 92, 246, 0.4)'
        },
        orange: {
            '--primary-color': '#F97316',
            '--primary-gradient': 'linear-gradient(135deg, #F97316, #FB923C, #FFB07C)',
            '--accent-color': '#FB923C',
            '--light-bg': '#FFEDD5',
            '--bg-gradient': 'linear-gradient(135deg, #FFEDD5 0%, #FFFFFF 50%, #B5FFFC 100%)',
            '--glow-color': 'rgba(249, 115, 22, 0.4)'
        },
        emerald: {
            '--primary-color': '#10B981',
            '--primary-gradient': 'linear-gradient(135deg, #10B981, #34D399, #D1FAE5)',
            '--accent-color': '#34D399',
            '--light-bg': '#D1FAE5',
            '--bg-gradient': 'linear-gradient(135deg, #D1FAE5 0%, #FFFFFF 50%, #F0FDF4 100%)',
            '--glow-color': 'rgba(16, 185, 129, 0.4)'
        },
        cyan: {
            '--primary-color': '#06B6D4',
            '--primary-gradient': 'linear-gradient(135deg, #06B6D4, #22D3EE, #CFFAFE)',
            '--accent-color': '#22D3EE',
            '--light-bg': '#CFFAFE',
            '--bg-gradient': 'linear-gradient(135deg, #CFFAFE 0%, #FFFFFF 50%, #ECFEFF 100%)',
            '--glow-color': 'rgba(6, 182, 212, 0.4)'
        },
        rose: {
            '--primary-color': '#F43F5E',
            '--primary-gradient': 'linear-gradient(135deg, #F43F5E, #FB7185, #FFE4E6)',
            '--accent-color': '#FB7185',
            '--light-bg': '#FFE4E6',
            '--bg-gradient': 'linear-gradient(135deg, #FFE4E6 0%, #FFFFFF 50%, #FFF1F2 100%)',
            '--glow-color': 'rgba(244, 63, 94, 0.4)'
        },
        amber: {
            '--primary-color': '#F59E0B',
            '--primary-gradient': 'linear-gradient(135deg, #F59E0B, #FBBF24, #FEF3C7)',
            '--accent-color': '#FBBF24',
            '--light-bg': '#FEF3C7',
            '--bg-gradient': 'linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 50%, #FFFBEB 100%)',
            '--glow-color': 'rgba(245, 158, 11, 0.4)'
        },
        indigo: {
            '--primary-color': '#6366F1',
            '--primary-gradient': 'linear-gradient(135deg, #6366F1, #818CF8, #E0E7FF)',
            '--accent-color': '#818CF8',
            '--light-bg': '#E0E7FF',
            '--bg-gradient': 'linear-gradient(135deg, #E0E7FF 0%, #FFFFFF 50%, #EEF2FF 100%)',
            '--glow-color': 'rgba(99, 102, 241, 0.4)'
        },
        lime: {
            '--primary-color': '#84CC16',
            '--primary-gradient': 'linear-gradient(135deg, #84CC16, #A3E635, #ECFCCB)',
            '--accent-color': '#A3E635',
            '--light-bg': '#ECFCCB',
            '--bg-gradient': 'linear-gradient(135deg, #ECFCCB 0%, #FFFFFF 50%, #F7FEE7 100%)',
            '--glow-color': 'rgba(132, 204, 22, 0.4)'
        }
    };

    const applyTheme = (themeName) => {
        const theme = themes[themeName] || themes.pink;
        const root = document.documentElement;
        
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        
        localStorage.setItem('mobile_theme_primary', themeName);
    };

    const applyDarkMode = (isDark) => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark-mode');
        } else {
            root.classList.remove('dark-mode');
        }
        localStorage.setItem('mobile_dark_mode', isDark);
    };

    const applyAnimQuality = (quality) => {
        const root = document.documentElement;
        if (quality === 'low') {
            root.classList.add('reduced-motion');
            console.log("⚡ Animation Quality: Optimized (Low Motion)");
        } else {
            root.classList.remove('reduced-motion');
            console.log("🎬 Animation Quality: High (Full Motion)");
        }
        localStorage.setItem('mobile_anim_quality', quality);
    };

    const applyLargeText = (isActive) => {
        const root = document.documentElement;
        if (isActive) {
            root.classList.add('large-text');
        } else {
            root.classList.remove('large-text');
        }
        localStorage.setItem('mobile_large_text', isActive);
        console.log(`♿ Large Text: ${isActive ? 'ON' : 'OFF'}`);
    };

    const applyContrast = (isActive) => {
        const root = document.documentElement;
        if (isActive) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
        localStorage.setItem('mobile_contrast', isActive);
        console.log(`👁️ High Contrast: ${isActive ? 'ON' : 'OFF'}`);
    };

    const applyGlowEffect = (isActive) => {
        const root = document.documentElement;
        if (isActive) {
            root.classList.remove('no-glow');
        } else {
            root.classList.add('no-glow');
        }
        localStorage.setItem('mobile_glow_effect', isActive);
    };

    const applyBackgroundPattern = (isActive) => {
        const root = document.documentElement;
        if (isActive) {
            root.classList.remove('no-pattern');
        } else {
            root.classList.add('no-pattern');
        }
        localStorage.setItem('mobile_bg_pattern', isActive);
    };

    const applyAutoDarkMode = (isActive) => {
        localStorage.setItem('mobile_auto_dark', isActive);
        if (isActive) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = e => {
                if (localStorage.getItem('mobile_auto_dark') === 'true') {
                    applyDarkMode(e.matches);
                }
            };
            
            // Apply immediately
            applyDarkMode(mediaQuery.matches);
            
            // Listen for system changes
            mediaQuery.removeEventListener('change', handleChange); // Prevent duplicates
            mediaQuery.addEventListener('change', handleChange);
        } else {
            // Revert to manual setting
            const manualDark = localStorage.getItem('mobile_dark_mode') === 'true';
            applyDarkMode(manualDark);
        }
    };

    const init = () => {
        const savedTheme = localStorage.getItem('mobile_theme_primary') || 'pink';
        const savedDarkMode = localStorage.getItem('mobile_dark_mode') === 'true';
        const savedLargeText = localStorage.getItem('mobile_large_text') === 'true';
        const savedContrast = localStorage.getItem('mobile_contrast') === 'true';
        const savedGlow = localStorage.getItem('mobile_glow_effect') !== 'false'; // Default TRUE
        const savedPattern = localStorage.getItem('mobile_bg_pattern') !== 'false'; // Default TRUE
        const savedAutoDark = localStorage.getItem('mobile_auto_dark') === 'true';
        
        // Smart Default: Respect OS preference if no user setting exists
        let savedAnim = localStorage.getItem('mobile_anim_quality');
        if (!savedAnim) {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            savedAnim = prefersReduced ? 'low' : 'high';
        }

        applyTheme(savedTheme);
        applyDarkMode(savedDarkMode);
        applyAnimQuality(savedAnim);
        applyLargeText(savedLargeText);
        applyContrast(savedContrast);
        applyGlowEffect(savedGlow);
        applyBackgroundPattern(savedPattern);
        
        if (savedAutoDark) applyAutoDarkMode(true);
    };

    // Run immediately to prevent FOUC
    init();

    return {
        applyTheme,
        applyDarkMode,
        applyAnimQuality,
        applyLargeText,
        applyContrast,
        applyGlowEffect,
        applyBackgroundPattern,
        applyAutoDarkMode,
        init
    };
})();

// Export to window for global access
window.ThemeEngine = ThemeEngine;
