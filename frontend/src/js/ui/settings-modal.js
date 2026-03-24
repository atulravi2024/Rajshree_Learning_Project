/**
 * Settings Modal Logic
 * Uses a template string to inject the modal structure.
 * This ensures compatibility if the project is opened as a local file (CORS restriction).
 */

const SETTINGS_MODAL_HTML = `
<div id="settings-modal-overlay" class="modal-overlay hidden">
    <div class="modal-container-sidebar">
        <!-- Settings loaded via iframe for isolation -->
        <iframe src="settings/settings.html" id="settings-frame" class="settings-frame"></iframe>
    </div>
</div>
`;

function initSettingsModal() {
    const mountPoint = document.getElementById('settings-modal-mount');
    if (!mountPoint) return;

    // Use a cache-breaker for the settings iframe
    const cacheBreaker = Date.now();
    const modalHtml = SETTINGS_MODAL_HTML.replace('settings/settings.html', `settings/settings.html?v=${cacheBreaker}`);
    
    mountPoint.innerHTML = modalHtml;
    console.log('✅ Settings Modal injected with cache-breaker.');
    
    // Close on overlay click
    const overlay = document.getElementById('settings-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSettingsModal();
        });
    }
}

function openSettingsModal() {
    const overlay = document.getElementById('settings-modal-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        // Small delay to ensure the display transition works
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
        
        // Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
}

function closeSettingsModal() {
    const overlay = document.getElementById('settings-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        // Wait for the transition to finish before hiding
        setTimeout(() => {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }
}

// Automatically load the modal structure on page load
document.addEventListener('DOMContentLoaded', () => {
    initSettingsModal();

    // Listen for messages from the settings iframe
    window.addEventListener('message', (event) => {
        if (event.data && event.data.action === 'close-modal') {
            closeSettingsModal();
        }
        if (event.data && event.data.action === 'open-dashboard') {
            // Navigate the main window to the Audit Dashboard
            window.location.href = '../../memory/06 Internal Audit/v2.0/dashboard/dashboard.html';
        }
    });
});
