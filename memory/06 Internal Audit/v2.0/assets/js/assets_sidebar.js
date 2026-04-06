// Sidebar Category Switching
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Update State & Gallery
        currentCategory = item.getAttribute('data-filter');
        updateGallery();

        // Filter change should NOT force expansion (Persistent Icon View)
        hideDetails(false);
    });
});

// Sidebar Toggle Logic
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// Sidebar Tooltip Logic (Global Portal)
let sidebarTooltip = null;

function initSidebarTooltips() {
    // Create global tooltip if it doesn't exist
    sidebarTooltip = document.createElement('div');
    sidebarTooltip.className = 'sidebar-floating-tooltip';
    document.body.appendChild(sidebarTooltip);

    const items = document.querySelectorAll('.category-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar || !sidebar.classList.contains('collapsed')) return;

            const rect = item.getBoundingClientRect();
            const text = item.getAttribute('data-tooltip');
            
            if (sidebarTooltip) {
                sidebarTooltip.textContent = text;
                sidebarTooltip.style.top = `${rect.top + rect.height / 2}px`;
                sidebarTooltip.style.left = `${rect.right + 10}px`;
                sidebarTooltip.style.transform = 'translateY(-50%)';
                sidebarTooltip.classList.add('visible');
            }
        });

        item.addEventListener('mouseleave', () => {
            if (sidebarTooltip) sidebarTooltip.classList.remove('visible');
        });
        
        // Hide tooltip on click as well for better UX
        item.addEventListener('click', () => {
            if (sidebarTooltip) sidebarTooltip.classList.remove('visible');
        });
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarTooltips);
} else {
    initSidebarTooltips();
}
