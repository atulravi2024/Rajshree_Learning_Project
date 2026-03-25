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
        const { action, value, name } = event.data || {};

        switch (action) {
            case 'close-modal':
                closeSettingsModal();
                break;

            case 'open-dashboard':
                window.location.href = '../../memory/06 Internal Audit/v2.0/dashboard/dashboard.html';
                break;

            case 'volume-change':
                window.globalVolume = parseFloat(value);
                // Update the navbar volume control if it exists
                const navVol = document.getElementById('volume-control');
                if (navVol) navVol.value = value;
                // Update current audio if playing
                if (window.currentAudio) window.currentAudio.volume = window.globalVolume;
                break;

            case 'theme-change':
                applyTheme(value);
                break;

            case 'avatar-change':
                window.appAvatar = value;
                updateAvatarUI(value);
                break;

            case 'music-change':
                handleMusicChange(value);
                break;

            case 'toggle-change':
                handleToggleChange(name, value);
                break;

            case 'lang-change':
                // Handle language change (e.g., reload or update text)
                location.reload(); 
                break;
        }
    });
});

function applyTheme(theme) {
    const root = document.documentElement;
    const themes = {
        pink:  { primary: '#FF1493', light: '#FFDEE9' },
        blue:  { primary: '#0284C7', light: '#E0F2FE' },
        gold:  { primary: '#D97706', light: '#FEF3C7' },
        green: { primary: '#059669', light: '#DCFCE7' },
        purple: { primary: '#7C3AED', light: '#F3E8FF' }
    };
    const colors = themes[theme] || themes.pink;
    root.style.setProperty('--primary-pink', colors.primary);
    root.style.setProperty('--light-pink', colors.light);
    // Update body background gradient if needed
    document.body.style.background = `linear-gradient(135deg, ${colors.light} 0%, #B5FFFC 100%)`;
}

function updateAvatarUI(avatar) {
    const babyIcon = document.querySelector('.baby-icon');
    if (babyIcon) {
        const avatarMap = { lion: '🦁', elephant: '🐘', panda: '🐼', monkey: '🐒', rabbit: '🐰' };
        babyIcon.innerText = avatarMap[avatar] || '👶';
    }
}

function handleMusicChange(track) {
    if (window.playBackgroundMusic) {
        window.playBackgroundMusic(track);
    }
}

function handleToggleChange(name, value) {
    console.log(`Toggle ${name} changed to ${value}`);
    if (name === 'bg-magic-check') {
        const bg = document.getElementById('bg-icons');
        if (bg) {
            bg.style.display = value ? 'block' : 'none';
            // Also update floating animation state if needed
            bg.classList.toggle('animation-paused', !value);
        }
    }
    if (name === 'autoplay-check') {
        window.isAutoplayEnabled = value;
    }
    if (name === 'nav-lock-check') {
        if (window.ChildSafetyLock) window.ChildSafetyLock.isNavLocked = value;
    }
    if (name === 'lock-check') {
        if (window.ChildSafetyLock) window.ChildSafetyLock.isSafetyEnabled = value;
    }
    // Set global flags for other effects (e.g., sfxEnabled, confettiEnabled)
    const flagName = name.replace('-check', 'Enabled').replace('bg-magic', 'bgMusic');
    window[flagName] = value;
}
