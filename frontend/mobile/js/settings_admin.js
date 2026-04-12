/**
 * Rajshree Learning - Admin Category Settings
 * Event handlers for Updates, Feedback, and Device Data.
 */

window.SettingsAdmin = {
    init: function() {
        console.log("🛠️ Settings Admin Initializing...");
        this.attachEvents();
    },

    attachEvents: function() {
        const resetBtn = document.getElementById('reset-app');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm("Reset everything?")) {
                    localStorage.clear();
                    location.reload();
                }
            });
        }

        // Performance & Motion Toggles
        const adminToggles = [
            { id: 'mobile-reduce-motion', key: 'mobile_reduce_motion', label: 'मोशन कम करें' },
            { id: 'mobile-fast-load', key: 'mobile_fast_load', label: 'फास्ट लोडिंग' }
        ];

        adminToggles.forEach(t => {
            const el = document.getElementById(t.id);
            if (el) el.addEventListener('change', (e) => {
                const val = e.target.checked;
                localStorage.setItem(t.key, val);
                if (window.ThemeEngine) {
                    if (t.key === 'mobile_reduce_motion') window.ThemeEngine.applyReduceMotion(val);
                }
                window.SettingsCore.showToast(`${t.label} ${val ? 'शुरू' : 'बंद'}`);
            });
        });

        // Performance Selects
        const adminInputs = [
            { id: 'mobile-anim-quality', key: 'mobile_anim_quality', label: 'एनिमेशन' }
        ];

        adminInputs.forEach(i => {
            const el = document.getElementById(i.id);
            if (el) el.addEventListener('input', (e) => {
                const val = e.target.value;
                localStorage.setItem(i.key, val);
                if (i.key === 'mobile_anim_quality' && window.ThemeEngine) {
                    window.ThemeEngine.applyAnimQuality(val);
                }
                if (i.label) window.SettingsCore.showToast(`${i.label}: ${val}`);
            });
        });
    }
};
