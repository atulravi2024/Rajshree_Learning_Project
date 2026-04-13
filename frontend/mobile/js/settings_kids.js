/**
 * Rajshree Learning - Kids Category Settings
 * Event handlers for Audio, Visuals, Interaction, and Accessibility.
 */

window.SettingsKids = {
    init: function() {
        console.log("🧒 Settings Kids: Start Boot...");
        try {
            this.attachEvents();
            console.log("🧒 Settings Kids: Boot Complete.");
        } catch (e) {
            console.error("❌ Settings Kids Boot Failed:", e);
        }
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
            { id: 'mobile-glow-effect', key: 'mobile_glow_effect', label: 'चमक इफेक्ट्स' },
            { id: 'mobile-interactive-shadows', key: 'mobile_interactive_shadows', label: '3D गहराई' },
            { id: 'mobile-particles', key: 'mobile_particle_effects', label: 'पार्टिकल इफेक्ट्स' },
            { id: 'mobile-hd-images', key: 'mobile_hd_images', label: 'HD इमेजेज़' },
            { id: 'mobile-fullscreen', key: 'mobile_fullscreen', label: 'फुल स्क्रीन' }
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
                    if (t.key === 'mobile_interactive_shadows') window.ThemeEngine.applyInteractiveShadows(val);
                    if (t.key === 'mobile_particle_effects') window.ThemeEngine.applyParticleEffects(val);
                    if (t.key === 'mobile_hd_images') window.ThemeEngine.applyHDImages(val);
                }

                if (t.key === 'mobile_fullscreen') {
                    if (val) {
                        const root = document.documentElement;
                        if (root.requestFullscreen) root.requestFullscreen();
                        else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
                    } else {
                        if (document.exitFullscreen) document.exitFullscreen();
                        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    }
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
            { id: 'mobile-font-style', key: 'mobile_font_style', label: 'लिखावट स्टाइल' },
            { id: 'mobile-glass-quality', key: 'mobile_glass_quality', label: 'कांच प्रभाव' },
            { id: 'mobile-vibrancy', key: 'mobile_gradient_vibrancy', label: 'रंग Vibrancy' },
            { id: 'mobile-anim-speed', key: 'mobile_anim_speed_factor', label: 'एनिमेशन गति' }
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

                if (window.ThemeEngine) {
                    if (i.key === 'mobile_font_style') window.ThemeEngine.applyFontStyle(val);
                    if (i.key === 'mobile_glass_quality') window.ThemeEngine.applyGlassmorphism(val);
                    if (i.key === 'mobile_gradient_vibrancy') window.ThemeEngine.applyGradientVibrancy(val);
                    if (i.key === 'mobile_anim_speed_factor') window.ThemeEngine.applyAnimationSpeed(val);
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

        // 4. Reset Handlers
        const resetAppearanceBtn = document.getElementById('reset-appearance-settings');
        if (resetAppearanceBtn) {
            resetAppearanceBtn.addEventListener('click', () => {
                const defaults = {
                    'mobile_auto_dark': 'false',
                    'mobile_dark_mode': 'false',
                    'mobile_glass_quality': 'high',
                    'mobile_gradient_vibrancy': 'natural'
                };
                Object.entries(defaults).forEach(([k, v]) => localStorage.setItem(k, v));
                if (window.ThemeEngine) window.ThemeEngine.init();
                window.location.reload(); // Refresh to sync UI state easily
            });
        }

        const resetVisualBtn = document.getElementById('reset-visual-settings');
        if (resetVisualBtn) {
            resetVisualBtn.addEventListener('click', () => {
                const defaults = {
                    'mobile_bg_pattern': 'true',
                    'mobile_glow_effect': 'true',
                    'mobile_font_style': 'clean',
                    'mobile_anim_speed_factor': '1',
                    'mobile_interactive_shadows': 'true',
                    'mobile_particle_effects': 'false',
                    'mobile_hd_images': 'true',
                    'mobile_fullscreen': 'false'
                };
                Object.entries(defaults).forEach(([k, v]) => localStorage.setItem(k, v));
                if (window.ThemeEngine) window.ThemeEngine.init();
                window.location.reload();
            });
        }
    }
};
