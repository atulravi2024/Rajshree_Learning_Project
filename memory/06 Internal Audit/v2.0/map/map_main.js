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
    if (typeof initCardCollapsibility === 'function') initCardCollapsibility();
    if (typeof initBottomBar === 'function') initBottomBar();
    if (typeof initGlobalSearch === 'function') initGlobalSearch();
    if (typeof initNavCollapsing === 'function') initNavCollapsing();
    
    console.log("Holographic Map: All modules initialized successfully.");
});
