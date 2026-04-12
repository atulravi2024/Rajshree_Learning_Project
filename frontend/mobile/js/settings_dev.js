/**
 * Rajshree Learning - Developer Category Settings
 * Event handlers for Debug Tools.
 */

window.SettingsDev = {
    init: function() {
        console.log("💻 Settings Developer Initializing...");
        this.attachEvents();
    },

    attachEvents: function() {
        const dLogs = document.getElementById('dev-logs');
        if (dLogs) {
            dLogs.addEventListener('change', (e) => {
                const val = e.target.checked;
                localStorage.setItem('mobile_dev_logs', val);
                window.SettingsCore.showToast(`Debug Logs: ${val ? 'Enabled' : 'Disabled'}`);
            });
        }
    }
};
