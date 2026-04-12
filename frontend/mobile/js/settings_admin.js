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

        // Generic handlers for demo buttons (usually alerts)
        // These can be expanded if real admin logic is added.
    }
};
