/**
 * SHARED NAVBAR LOGIC
 * Handles navigation, active states, and global component triggers.
 */

function initNavbar() {
    // Set active link based on current page
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    const links = {
        'dashboard.html': 'nav-dashboard',
        'global.html': 'nav-terminal',
        'map.html': 'nav-map',
        'assets.html': 'nav-assets'
    };

    const activeId = links[page];
    if (activeId) {
        const activeLink = document.getElementById(activeId);
        if (activeLink) activeLink.classList.add('active');
    }

    // Bind Settings Button
    const settingsBtn = document.getElementById('nav-settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            if (window.showSettingsMenu) window.showSettingsMenu();
        });
    }

    // Lucide Icons initialization is usually handled by the module's main JS,
    // but we can trigger it here if needed for newly injected content.
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Automatically Initialize on DOM Ready if the navbar exists
document.addEventListener('DOMContentLoaded', initNavbar);
