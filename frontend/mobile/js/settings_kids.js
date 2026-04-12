/**
 * Rajshree Learning - Kids Category Settings
 * Event handlers for Audio, Visuals, Interaction, and Accessibility.
 */

window.SettingsKids = {
    init: function() {
        console.log("🧒 Settings Kids Initializing...");
        this.attachEvents();
    },

    attachEvents: function() {
        // 1. Toggles (Kids Category)
        const kidsToggles = [
            { id: 'mobile-bg-music', key: 'mobile_bg_music', label: 'बैकग्राउंड म्यूजिक' },
            { id: 'mobile-sfx', key: 'mobile_sfx', label: 'साउंड इफेक्ट्स' },
            { id: 'mobile-large-text', key: 'mobile_large_text', label: 'बड़ा टेक्स्ट' },
            { id: 'mobile-contrast', key: 'mobile_contrast', label: 'हाई कंट्रास्ट' },
            { id: 'mobile-autoplay', key: 'mobile_autoplay', label: 'ऑटो-प्ले' },
            { id: 'mobile-dark-mode', key: 'mobile_dark_mode', label: 'डार्क मोड' },
            { id: 'mobile-bg-pattern', key: 'mobile_bg_pattern', label: 'बैकग्राउंड पैटर्न' },
            { id: 'mobile-auto-dark', key: 'mobile_auto_dark', label: 'ऑटो डार्क मोड' },
            { id: 'mobile-glow-effect', key: 'mobile_glow_effect', label: 'चमक इफेक्ट्स' }
        ];

        kidsToggles.forEach(t => {
            const el = document.getElementById(t.id);
            if (el) el.addEventListener('change', (e) => {
                const val = e.target.checked;
                localStorage.setItem(t.key, val);

                // Call ThemeEngine if available
                if (window.ThemeEngine) {
                    if (t.key === 'mobile_dark_mode') window.ThemeEngine.applyDarkMode(val);
                    if (t.key === 'mobile_large_text') window.ThemeEngine.applyLargeText(val);
                    if (t.key === 'mobile_contrast') window.ThemeEngine.applyContrast(val);
                    if (t.key === 'mobile_bg_pattern') window.ThemeEngine.applyBackgroundPattern(val);
                    if (t.key === 'mobile_auto_dark') {
                        window.ThemeEngine.applyAutoDarkMode(val);
                        window.SettingsCore.syncDarkModeUI();
                    }
                    if (t.key === 'mobile_glow_effect') window.ThemeEngine.applyGlowEffect(val);
                }

                window.SettingsCore.showToast(`${t.label} ${val ? 'शुरू' : 'बंद'}`);
            });
        });

        // 2. Sliders & Selects (Kids Category)
        const kidsInputs = [
            { id: 'mobile-speed', key: 'mobile_playback_speed' },
            { id: 'mobile-delay', key: 'mobile_autoplay_delay' },
            { id: 'mobile-vol-master', key: 'mobile_vol_master', label: 'मास्टर आवाज़', unit: '%' },
            { id: 'mobile-vol-music', key: 'mobile_vol_music', label: 'संगीत', unit: '%' },
            { id: 'mobile-vol-sfx', key: 'mobile_vol_sfx', label: 'साउंड इफेक्ट्स', unit: '%' },
            { id: 'mobile-vol-content', key: 'mobile_vol_content', label: 'सामग्री', unit: '%' },
            { id: 'mobile-font-style', key: 'mobile_font_style', label: 'लिखावट स्टाइल' }
        ];

        kidsInputs.forEach(i => {
            const el = document.getElementById(i.id);
            if (el) el.addEventListener('input', (e) => {
                const val = e.target.value;
                localStorage.setItem(i.key, val);
                
                // Update Volume Badge if exists
                const badge = document.getElementById(`${i.id}-badge`);
                if (badge) badge.textContent = val + (i.unit || '');
                
                // Special handling for Speech Speed Badge
                if (i.id === 'mobile-speed') {
                    const speedBadge = document.getElementById('mobile-speed-badge');
                    if (speedBadge) speedBadge.textContent = val + 'x';
                }


                if (i.key === 'mobile_font_style' && window.ThemeEngine) {
                    window.ThemeEngine.applyFontStyle(val);
                }
                if (i.label) window.SettingsCore.showToast(`${i.label}: ${val}`);
            });
        });

        // 3. Choice Grids (Kids Category)
        document.querySelectorAll('.voice-card').forEach(card => {
            if (card.dataset.voice) {
                card.addEventListener('click', () => {
                    const voice = card.dataset.voice;
                    localStorage.setItem('mobile_voice_profile', voice);
                    window.SettingsCore.updateGridSelection('.voice-card', 'voice', voice);
                    window.SettingsCore.showToast(`आवाज़: ${voice}`);
                });
            }
        });

        document.querySelectorAll('.color-circle').forEach(circle => {
                circle.addEventListener('click', () => {
                    const theme = circle.dataset.theme;
                    localStorage.setItem('mobile_theme_primary', theme);
                    if (window.ThemeEngine) window.ThemeEngine.applyTheme(theme);
                    window.SettingsCore.updateGridSelection('.color-circle', 'theme', theme);
                    window.SettingsCore.showToast(`थीम अपडेट!`);
                });
        });
    }
};
