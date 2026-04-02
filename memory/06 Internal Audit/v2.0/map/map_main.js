// map_main.js - Final entry point for the Holographic Map

document.addEventListener('DOMContentLoaded', () => {
    // Initial UI Icons
    lucide.createIcons();
    
    // Notifications (if present)
    if (typeof initNotifications === 'function') initNotifications();

    // Three.js Scene Initialization
    if (typeof THREE !== 'undefined') {
        if (typeof initGlobe === 'function') {
            initGlobe();
        }
        
        // Texture & Mode Management (from map_modes.js)
        if (typeof initMapModes === 'function') {
            initMapModes();
        }
    } else {
        console.error("Three.js is requested but not loaded.");
    }

    // Data Feeds & Widget Rendering
    if (typeof initMockDataFeeds === 'function') initMockDataFeeds();
    if (typeof initRealDataFeeds === 'function') initRealDataFeeds();
    
    // UI Interaction Initialization
    if (typeof initNavMaster === 'function') initNavMaster();
    if (typeof initNavFront === 'function') initNavFront();
    if (typeof initNavBack === 'function') initNavBack();
    
    // Legacy support (fallback)
    if (typeof initCardCollapsibility === 'function') initCardCollapsibility();
    
    console.log("Holographic Map: All modular systems initialized successfully.");
});

