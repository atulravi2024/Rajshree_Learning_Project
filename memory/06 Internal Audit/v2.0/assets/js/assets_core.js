// Initialize Lucide Icons
lucide.createIcons();

function updateHeaderMode(isCompact) {
    const header = document.querySelector('.repo-header');
    const sidebar = document.getElementById('sidebar');
    
    if (header) {
        if (isCompact) {
            header.classList.add('compact-mode');
        } else {
            header.classList.remove('compact-mode');
        }
    }

    if (sidebar) {
        if (isCompact) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    }
}

function resetDetailSections() {
    lastActiveSectionId = 'section-preview'; // Reset for fresh asset load
    document.querySelectorAll('.details-section').forEach(section => {
        if (section.id === 'section-preview') {
            section.classList.remove('collapsed');
        } else {
            section.classList.add('collapsed');
        }
    });
    lucide.createIcons();
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (window.PROJECT_ASSETS) {
        renderAssets(window.PROJECT_ASSETS);
    }
    updateGallery();
});
