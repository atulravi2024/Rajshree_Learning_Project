/**
 * nav_master.js - Master logic for the Frontier Map bottom nav bar.
 * Handles the toggle between 'Front' (Project Analysis) and 'Back' (Search/Location) states.
 */

window._manualSearchToggle = false; // Starts in Front Side (Analysis) mode

function initNavMaster() {
    const masterBtn = document.getElementById('btn-nav-toggle-all');
    if (masterBtn) {
        masterBtn.onclick = (e) => {
            e.stopPropagation();
            window._manualSearchToggle = !window._manualSearchToggle;
            
            // Apply mode logic
            updateNavModeVisibility();
            
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        };
    }

    // Initialize all common icons
    if (window.lucide) {
        lucide.createIcons();
    }

    updateNavModeVisibility();
}

/**
 * Sync visibility between Analysis Categories (Front) and Search (Back).
 */
function updateNavModeVisibility() {
    const searchContainer = document.getElementById('global-search-container');
    const allCategories = document.querySelectorAll('.navbar-category');
    const allSeparators = document.querySelectorAll('.nav-separator');
    const metricsBar = document.getElementById('distance-metrics-bar');

    if (window._manualSearchToggle) {
        // --- BACK SIDE: SEARCH & LOCATION MODE ---
        if (searchContainer) searchContainer.classList.add('active');
        
        // Hide Analysis Categories (Front)
        allCategories.forEach(cat => {
            const catId = cat.getAttribute('data-cat');
            // We keep SYS-UI because the toggle button is there (or we show the search settings)
            if (catId !== 'sys-ui' && catId !== 'search-settings') {
                cat.classList.add('hidden');
                cat.style.pointerEvents = 'none'; // Prevent hover leakage
            } else {
                cat.classList.remove('hidden');
                cat.style.pointerEvents = 'all';
            }
        });

        // Toggle visibility of specific separators
        allSeparators.forEach(sep => {
            if (sep.id === 'search-cfg-separator') sep.classList.remove('hidden');
            else sep.classList.add('hidden');
        });
        
        // Show distance metrics bar if a route is active (logic in nav_back.js)
        if (window._currentPathData && window._currentPathData.length > 0) {
            if (metricsBar) metricsBar.classList.remove('hidden');
        }

    } else {
        // --- FRONT SIDE: PROJECT ANALYSIS MODE ---
        if (searchContainer) searchContainer.classList.remove('active');
        
        // Show All Categories
        allCategories.forEach(cat => {
            const catId = cat.getAttribute('data-cat');
            if (catId !== 'search-settings') {
                cat.classList.remove('hidden');
                cat.style.pointerEvents = 'all';
            } else {
                cat.classList.add('hidden');
                cat.style.pointerEvents = 'none';
            }
        });

        // Restore Separators
        allSeparators.forEach(sep => {
            if (sep.id === 'search-cfg-separator') sep.classList.add('hidden');
            else sep.classList.remove('hidden');
        });

        // Hide search-related items
        if (metricsBar) metricsBar.classList.add('hidden');
    }
}

// Export for other scripts if needed
window.updateNavModeVisibility = updateNavModeVisibility;
