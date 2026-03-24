document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNotifications();

    const searchInput = document.getElementById('asset-search');
    const cards = document.querySelectorAll('.asset-card');

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        cards.forEach(card => {
            const name = card.querySelector('.asset-name').textContent.toLowerCase();
            const meta = card.querySelector('.asset-meta').textContent.toLowerCase();
            
            if (name.includes(term) || meta.includes(term)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Mock Asset Click
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('.asset-name').textContent;
            alert(`Accessing Asset: ${name}`);
        });
    });
});
