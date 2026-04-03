/**
 * map_point_toggle.js
 * Simple toggle for map markers (start, end, checkpoints).
 */

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('btn-toggle-points');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        // Toggle global state
        window.MAP_POINTS_VISIBLE = !window.MAP_POINTS_VISIBLE;

        // Update UI
        toggleBtn.classList.toggle('active', window.MAP_POINTS_VISIBLE);
        
        // Update existing markers in the current path
        if (window._currentPathObj) {
            window._currentPathObj.children.forEach(child => {
                if (child.userData && child.userData.isMapPoint) {
                    child.visible = !!window.MAP_POINTS_VISIBLE;
                }
            });
        }

        // Optional sound effect if available
        if (window.playSound) {
            window.playSound(window.MAP_POINTS_VISIBLE ? 'UI_ON' : 'UI_OFF');
        }

        console.log(`[Map Visuals] Points Visibility: ${window.MAP_POINTS_VISIBLE ? 'ON' : 'OFF'}`);
    });
});
