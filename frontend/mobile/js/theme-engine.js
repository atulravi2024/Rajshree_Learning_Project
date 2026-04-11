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
        } else {
            root.classList.remove('reduced-motion');
        }
        localStorage.setItem('mobile_anim_quality', quality);
    };

    const init = () => {
        const savedTheme = localStorage.getItem('mobile_theme_primary') || 'pink';
        const savedDarkMode = localStorage.getItem('mobile_dark_mode') === 'true';
        const savedAnim = localStorage.getItem('mobile_anim_quality') || 'high';

        applyTheme(savedTheme);
        applyDarkMode(savedDarkMode);
        applyAnimQuality(savedAnim);
    };

    // Run immediately to prevent FOUC
    init();

    return {
        applyTheme,
        applyDarkMode,
        applyAnimQuality,
        init
    };
})();

// Export to window for global access
window.ThemeEngine = ThemeEngine;
