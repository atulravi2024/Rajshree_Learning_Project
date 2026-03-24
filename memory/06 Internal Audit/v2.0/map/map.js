document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNotifications();

    const nodes = document.querySelectorAll('.node-point');
    const activeNodeDisplay = document.querySelector('.active-node');

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const name = node.getAttribute('data-name');
            activeNodeDisplay.innerHTML = `<strong>ACTIVE NODE:</strong> ${name.toUpperCase()}`;
            
            // Visual feedback
            nodes.forEach(n => n.classList.remove('selected'));
            node.classList.add('selected');
        });
    });

    // Mock Coords drift
    setInterval(() => {
        const coords = document.querySelector('.coords');
        const latBase = 28.6139;
        const lonBase = 77.2090;
        const drift = (Math.random() - 0.5) * 0.001;
        coords.textContent = `COORDS: ${(latBase + drift).toFixed(4)}° N, ${(lonBase - drift).toFixed(4)}° E`;
    }, 2000);
});
