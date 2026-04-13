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
        indigo: {
            '--primary-color': '#6366F1',
            '--primary-gradient': 'linear-gradient(135deg, #6366F1, #818CF8, #E0E7FF)',
            '--accent-color': '#818CF8',
            '--light-bg': '#E0E7FF',
            '--bg-gradient': 'linear-gradient(135deg, #E0E7FF 0%, #FFFFFF 50%, #EEF2FF 100%)',
            '--glow-color': 'rgba(99, 102, 241, 0.4)'
        },
        sunflower: {
            '--primary-color': '#FFB300',
            '--primary-gradient': 'linear-gradient(135deg, #FFB300, #FFD54F, #FFF176)',
            '--accent-color': '#FFD54F',
            '--light-bg': '#FFF9C4',
            '--bg-gradient': 'linear-gradient(135deg, #FFF9C4 0%, #FFFFFF 50%, #FFFDE7 100%)',
            '--glow-color': 'rgba(255, 179, 0, 0.4)'
        },
        rose: {
            '--primary-color': '#E91E63',
            '--primary-gradient': 'linear-gradient(135deg, #E91E63, #F06292, #F8BBD0)',
            '--accent-color': '#F06292',
            '--light-bg': '#FCE4EC',
            '--bg-gradient': 'linear-gradient(135deg, #FCE4EC 0%, #FFFFFF 50%, #F8BBD0 100%)',
            '--glow-color': 'rgba(233, 30, 99, 0.4)'
        },
        turquoise: {
            '--primary-color': '#00ACC1',
            '--primary-gradient': 'linear-gradient(135deg, #00ACC1, #4DD0E1, #B2EBF2)',
            '--accent-color': '#4DD0E1',
            '--light-bg': '#E0F7FA',
            '--bg-gradient': 'linear-gradient(135deg, #E0F7FA 0%, #FFFFFF 50%, #B2EBF2 100%)',
            '--glow-color': 'rgba(0, 172, 193, 0.4)'
        },
        lavender: {
            '--primary-color': '#673AB7',
            '--primary-gradient': 'linear-gradient(135deg, #673AB7, #9575CD, #D1C4E9)',
            '--accent-color': '#9575CD',
            '--light-bg': '#EDE7F6',
            '--bg-gradient': 'linear-gradient(135deg, #EDE7F6 0%, #FFFFFF 50%, #D1C4E9 100%)',
            '--glow-color': 'rgba(103, 58, 183, 0.4)'
        },
        midnight: {
            '--primary-color': '#212121',
            '--primary-gradient': 'linear-gradient(135deg, #212121, #424242, #757575)',
            '--accent-color': '#424242',
            '--light-bg': '#F5F5F5',
            '--bg-gradient': 'linear-gradient(135deg, #EEEEEE 0%, #FFFFFF 50%, #BDBDBD 100%)',
            '--glow-color': 'rgba(33, 33, 33, 0.4)'
        },
        golden: {
            '--primary-color': '#D4AF37',
            '--primary-gradient': 'linear-gradient(135deg, #D4AF37, #C5A028, #F9E272)',
            '--accent-color': '#C5A028',
            '--light-bg': '#FFF8E1',
            '--bg-gradient': 'linear-gradient(135deg, #FFF8E1 0%, #FFFFFF 50%, #FFECB3 100%)',
            '--glow-color': 'rgba(212, 175, 55, 0.4)'
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

    const applyReduceMotion = (isActive) => {
        const root = document.documentElement;
        if (isActive) {
            root.classList.add('reduce-motion-master');
        } else {
            root.classList.remove('reduce-motion-master');
        }
        localStorage.setItem('mobile_reduce_motion', isActive);
        console.log(`⚡ Reduce Motion Master: ${isActive ? 'ON' : 'OFF'}`);
    };

    const applyFontStyle = (style) => {
        const root = document.documentElement;
        // Remove existing font classes
        root.classList.remove('font-style-playful', 'font-style-clean', 'font-style-classic');
        root.classList.add(`font-style-${style}`);
        localStorage.setItem('mobile_font_style', style);
        console.log(`✍️ Font Style: ${style}`);
    };

    const applyGlassmorphism = (quality) => {
        const root = document.documentElement;
        root.classList.remove('glass-low', 'glass-high');
        root.classList.add(`glass-${quality}`);
        localStorage.setItem('mobile_glass_quality', quality);
    };

    const applyAnimationSpeed = (speed) => {
        const root = document.documentElement;
        root.style.setProperty('--anim-speed-factor', speed);
        localStorage.setItem('mobile_anim_speed_factor', speed);
    };

    const applyGradientVibrancy = (vibrancy) => {
        const root = document.documentElement;
        root.classList.remove('vibrancy-natural', 'vibrancy-vivid', 'vibrancy-ultra');
        root.classList.add(`vibrancy-${vibrancy}`);
        localStorage.setItem('mobile_gradient_vibrancy', vibrancy);
    };

    const applyInteractiveShadows = (isActive) => {
        const root = document.documentElement;
        if (isActive) {
            root.classList.add('interactive-shadows');
        } else {
            root.classList.remove('interactive-shadows');
        }
        localStorage.setItem('mobile_interactive_shadows', isActive);
    };

    const applyParticleEffects = (isActive) => {
        const root = document.documentElement;
        if (isActive) {
            root.classList.add('particle-effects-enabled');
        } else {
            root.classList.remove('particle-effects-enabled');
        }
        localStorage.setItem('mobile_particle_effects', isActive);
    };

    const applyHDImages = (isActive) => {
        const root = document.documentElement;
        if (isActive) {
            root.classList.add('hd-images-enabled');
        } else {
            root.classList.remove('hd-images-enabled');
        }
        localStorage.setItem('mobile_hd_images', isActive);
        console.log(`🖼️ HD Images: ${isActive ? 'ON' : 'OFF'}`);
    };

    // Persistent reference for system dark mode listener
    let autoDarkListener = null;

    const applyAutoDarkMode = (isActive) => {
        localStorage.setItem('mobile_auto_dark', isActive);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            if (localStorage.getItem('mobile_auto_dark') === 'true') {
                console.log(`🌓 Auto Dark Mode: System change detected (${e.matches ? 'Dark' : 'Light'})`);
                applyDarkMode(e.matches);
                // Update checkbox UI if Core is ready
                if (window.SettingsCore && window.SettingsCore.syncDarkModeUI) {
                    window.SettingsCore.syncDarkModeUI();
                }
            }
        };

        if (isActive) {
            console.log("🌓 Auto Dark Mode Enabled: Syncing with system...");
            applyDarkMode(mediaQuery.matches);
            
            if (autoDarkListener) mediaQuery.removeEventListener('change', autoDarkListener);
            autoDarkListener = handleChange;
            mediaQuery.addEventListener('change', autoDarkListener);
        } else {
            console.log("🌓 Auto Dark Mode Disabled.");
            if (autoDarkListener) {
                mediaQuery.removeEventListener('change', autoDarkListener);
                autoDarkListener = null;
            }
            const manualDark = localStorage.getItem('mobile_dark_mode') === 'true';
            applyDarkMode(manualDark);
        }
    };

    const init = () => {
        console.log("🎨 Theme Engine: Start Boot...");
        try {
            const savedTheme = localStorage.getItem('mobile_theme_primary') || 'pink';
            const savedDarkMode = localStorage.getItem('mobile_dark_mode') === 'true';
            const savedLargeText = localStorage.getItem('mobile_large_text') === 'true';
            const savedContrast = localStorage.getItem('mobile_contrast') === 'true';
            const savedGlow = localStorage.getItem('mobile_glow_effect') !== 'false';
            const savedPattern = localStorage.getItem('mobile_bg_pattern') !== 'false';
            const savedAutoDark = localStorage.getItem('mobile_auto_dark') === 'true';
            const savedReduceMotion = localStorage.getItem('mobile_reduce_motion') === 'true';
            const savedFontStyle = localStorage.getItem('mobile_font_style') || 'clean';
            
            // New settings
            const savedGlass = localStorage.getItem('mobile_glass_quality') || 'high';
            const savedAnimSpeed = localStorage.getItem('mobile_anim_speed_factor') || '1';
            const savedVibrancy = localStorage.getItem('mobile_gradient_vibrancy') || 'natural';
            const savedShadows = localStorage.getItem('mobile_interactive_shadows') !== 'false'; // Default true
            const savedParticles = localStorage.getItem('mobile_particle_effects') === 'true'; // Default false for performance (User's feedback)
            const savedHDImages = localStorage.getItem('mobile_hd_images') !== 'false'; // Default true

            // Smart Default for Anim Quality
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
            applyReduceMotion(savedReduceMotion);
            applyFontStyle(savedFontStyle);
            
            applyGlassmorphism(savedGlass);
            applyAnimationSpeed(savedAnimSpeed);
            applyGradientVibrancy(savedVibrancy);
            applyInteractiveShadows(savedShadows);
            applyParticleEffects(savedParticles);
            applyHDImages(savedHDImages);

            if (savedAutoDark) applyAutoDarkMode(true);
            console.log("🎨 Theme Engine: Boot Complete.");
        } catch (e) {
            console.error("❌ Theme Engine Boot Failed:", e);
        }
    };

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
        applyReduceMotion,
        applyFontStyle,
        applyGlassmorphism,
        applyAnimationSpeed,
        applyGradientVibrancy,
        applyInteractiveShadows,
        applyParticleEffects,
        applyHDImages,
        init
    };
})();

window.ThemeEngine = ThemeEngine;
