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
        
        // Professional feedback: briefly hide and show icons if needed, 
        // or just let CSS handles the smooth transition.
    }
}
