/**
 * Core Application State
 * Managed variables for global application behavior.
 */

window.selectedCategory = '';
window.currentLayout = '1'; 
window.currentIndex = 0;
window.activeCardsData = [];
window.globalVolume = 1;
window.currentAudio = null;

window.selectedTitle = '';
window.selectedMain = '';

function stopCurrentAudio() { 
    if (window.currentAudio) { 
        window.currentAudio.pause(); 
        window.currentAudio.currentTime = 0; 
    } 
}
