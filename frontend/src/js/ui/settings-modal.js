/**
 * Settings Modal Logic
 * Uses a template string to inject the modal structure.
 * This ensures compatibility if the project is opened as a local file (CORS restriction).
 */

const SETTINGS_MODAL_HTML = `
<div id="settings-modal-overlay" class="modal-overlay hidden">
    <div class="modal-container">
        <div class="modal-header">
            <div class="modal-title">
                <span class="hi">सेटिंग्स</span>
                <span class="en">Settings</span>
            </div>
            <button class="modal-close-btn" onclick="closeSettingsModal()" title="Close">
                ❌
            </button>
        </div>
        <div id="settings-modal-content" class="modal-content">
            <!-- Settings will be added here later -->
            <p class="settings-placeholder">
                जल्द आ रहा है... / Coming Soon...
            </p>
        </div>
    </div>
</div>
`;

function initSettingsModal() {
    const mountPoint = document.getElementById('settings-modal-mount');
    if (!mountPoint) return;

    mountPoint.innerHTML = SETTINGS_MODAL_HTML;
    console.log('✅ Settings Modal injected via template.');
    
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
document.addEventListener('DOMContentLoaded', initSettingsModal);
