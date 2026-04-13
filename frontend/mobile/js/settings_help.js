/**
 * settings_help.js - Logic for the Help/Guide ecosystem.
 * Handles help-specific UI interactions and dynamic content initialization.
 */

window.SettingsHelp = {
    init: function() {
        console.log("❓ Settings Help: Initializing Guide...");
        // Reserved for future dynamic help features (e.g., search, deep-links)
    },

    /**
     * Optional: Jump to a specific help section from other tabs.
     * @param {string} sectionId - The ID of the help block to expand.
     */
    focusHelpSection: function(sectionId) {
        const tabBtn = document.querySelector('.tab-btn[data-target="cat-help"]');
        if (tabBtn) tabBtn.click();

        setTimeout(() => {
            const block = document.querySelector(`#${sectionId}`);
            if (block) {
                block.classList.add('expanded');
                block.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.SettingsHelp) window.SettingsHelp.init();
});
