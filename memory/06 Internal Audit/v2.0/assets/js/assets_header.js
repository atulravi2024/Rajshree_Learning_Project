// Search Logic
const searchInput = document.querySelector('.search-input');
const searchClearBtn = document.getElementById('search-clear');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        
        // Toggle Clear Button Visibility
        if (searchClearBtn) {
            if (currentSearchTerm.length > 0) {
                searchClearBtn.classList.add('visible');
            } else {
                searchClearBtn.classList.remove('visible');
            }
        }
        
        updateGallery();
    });

    // Global Shortcut: Ctrl + K to focus search
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
            searchInput.value = '';
            currentSearchTerm = '';
            searchClearBtn.classList.remove('visible');
            updateGallery();
            searchInput.focus();
        }
    });
}

// --- MULTI-DROPDOWN LOGIC ---

// Toggle specific menu and close others
function toggleMenu(menuId) {
    const menus = ['audit-menu', 'dev-menu', 'life-menu'];
    menus.forEach(id => {
        const menu = document.getElementById(id);
        if (id === menuId) {
            const isVisible = menu.style.display === 'block';
            menu.style.display = isVisible ? 'none' : 'block';
        } else {
            menu.style.display = 'none';
        }
    });
}

// Handle Sort Option Selection
document.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', (e) => {
        const menu = option.closest('.sort-menu');
        const dropdownWrap = option.closest('.sort-dropdown-wrap');
        const btnText = dropdownWrap.querySelector('.btn-text');
        
        // Update Active State in this menu
        menu.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        // Update State
        currentSortCriteria = option.getAttribute('data-sort');
        
        // Update Button Label
        btnText.textContent = option.textContent;
        
        // Close Menu
        menu.style.display = 'none';
        
        // Professional "Processing" Feedback
        const grid = document.querySelector('.assets-grid');
        grid.style.opacity = '0.3';
        grid.style.filter = 'blur(4px)';
        
        setTimeout(() => {
            grid.style.opacity = '1';
            grid.style.filter = 'none';
            updateGallery();
        }, 300);
    });
});

// Global click to close menus
window.addEventListener('click', (e) => {
    if (!e.target.closest('.sort-dropdown-wrap')) {
        document.querySelectorAll('.sort-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});
