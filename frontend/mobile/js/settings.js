/**
 * Rajshree Learning - Ultimate Mobile Settings (Main Entry Point)
 * =============================================================
 * This file orchestrates the initialization of various settings modules.
 * Architecture:
 * - settings_core.js: Shared infrastructure, persistence, and common UI logic.
 * - settings_kids.js: Content specifically for the Kids category.
 * - settings_parent.js: Safety, Learning, and parent-specific controls.
 * - settings_admin.js: Versioning, Updates, and Device Management.
 * - settings_dev.js: Developer tools and debug logging.
 */

window.addEventListener('error', (e) => {
    console.error("🚫 Global Error:", e.message, "at", e.filename, ":", e.lineno);
    if (window.SettingsCore && window.SettingsCore.showToast) {
        window.SettingsCore.showToast(`Error: ${e.message}`);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Custom Settings Ecosystem Initializing...");

    try {
        // 1. Initialize Core Infrastructure (Persistence, Navigation, Security)
        if (window.SettingsCore) {
            window.SettingsCore.init();
        }

        // 2. Initialize Category Modules
        if (window.SettingsKids) window.SettingsKids.init();
        if (window.SettingsParent) window.SettingsParent.init();
        if (window.SettingsAdmin) window.SettingsAdmin.init();
        if (window.SettingsDev) window.SettingsDev.init();
        
        console.log("💎 All Modules Loaded.");
    } catch (e) {
        console.error("💥 Critical Init Failure:", e);
        if (window.SettingsCore && window.SettingsCore.showToast) {
            window.SettingsCore.showToast("Init Failed! Check Console.");
        }
    }
});
