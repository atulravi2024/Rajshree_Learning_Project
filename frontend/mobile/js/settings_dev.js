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

        const dPinVis = document.getElementById('dev-pin-visible');
        if (dPinVis) {
            dPinVis.addEventListener('change', (e) => {
                localStorage.setItem('mobile_dev_pin_visible', e.target.checked);
            });
        }

        const dPinReq = document.getElementById('dev-pin-required');
        if (dPinReq) {
            dPinReq.addEventListener('change', (e) => {
                localStorage.setItem('mobile_dev_pin_required', e.target.checked);
            });
        }

        // Independent PIN Setup for Dev
        window.setupDevPin = () => {
            window.SettingsCore.showPinModal('setup', (success) => {
                if (success) {
                    window.SettingsCore.showToast(window.SettingsCore.getTranslation('pin_success'));
                }
            }, { 
                targetKey: 'mobile_dev_pin', 
                visibilityKey: 'mobile_dev_pin_visible',
                categoryName: 'Developer'
            });
        };
    }
};
