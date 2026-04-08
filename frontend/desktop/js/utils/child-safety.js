/**
 * Child Safety Lock Utility
 * Handles anti-spam, interaction locking, and disabling browser defaults.
 */

window.ChildSafetyLock = {
    isLocked: false,
    isSafetyEnabled: true,
    lastClickTime: 0,
    spamThreshold: 400, // ms
    hasPlayedFirstAudio: false,
    lastNavTime: 0,
    navThrottle: 1000, // 1 second

    init() {
        console.log("Child Safety Lock Initializing...");
        
        // Check for dev mode in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('dev') === 'true') {
            this.isSafetyEnabled = false;
            console.log("Child Safety Lock: Disabled via URL parameter.");
        }

        this.setupEventListeners();
        this.setupZoomLock();
        this.applyGlobalStyles();

        // Full-Screen Gesture Listener: Browsers require a user gesture to enter full-screen
        document.body.addEventListener('click', () => {
            if (this.isSafetyEnabled) this.enterFullscreen();
        }, { once: false });
    },

    setupEventListeners() {
        // Disable Right-Click
        window.addEventListener('contextmenu', (e) => {
            if (this.isSafetyEnabled) {
                e.preventDefault();
                return false;
            }
        });

        // Developer Key Blocking & Bypass
        window.addEventListener('keydown', (e) => {
            // Bypass Check: Ctrl + Alt + Shift + D
            const isBypass = e.ctrlKey && e.altKey && e.shiftKey && (e.key.toLowerCase() === 'd' || e.code === 'KeyD');
            
            if (isBypass) {
                e.preventDefault();
                e.stopPropagation();
                this.isSafetyEnabled = !this.isSafetyEnabled;
                this.applyGlobalStyles();
                if (!this.isSafetyEnabled) this.exitFullscreen();
                console.log(`Child Safety Lock: ${this.isSafetyEnabled ? 'ENABLED' : 'DISABLED'}`);
                alert(`Child Safety Lock: ${this.isSafetyEnabled ? 'Enabled (Full Volume)' : 'Disabled (Developer Mode, 25% Volume)'}`);
                return;
            }

            if (!this.isSafetyEnabled) return;

            // Block common dev keys
            const blockedKeys = ['F12'];
            const ctrlKeys = ['i', 'j', 'c', 'u', 's', 'p'];
            
            if (blockedKeys.includes(e.key) || (e.ctrlKey && ctrlKeys.includes(e.key.toLowerCase()))) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    },

    setupZoomLock() {
        // Desktop: Ctrl + Wheel
        window.addEventListener('wheel', (e) => {
            if (this.isSafetyEnabled && e.ctrlKey) {
                e.preventDefault();
            }
        }, { passive: false });

        // Desktop: Zoom Keys (Ctrl + / Ctrl - / Ctrl 0)
        window.addEventListener('keydown', (e) => {
            if (this.isSafetyEnabled && e.ctrlKey && ['+', '-', '=', '0'].includes(e.key)) {
                e.preventDefault();
            }
        });

        // Mobile: Prevent pinch-to-zoom
        window.addEventListener('touchstart', (e) => {
            if (this.isSafetyEnabled && e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Block double-tap to zoom on mobile
        let lastTouch = 0;
        window.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (this.isSafetyEnabled && now - lastTouch <= 300) {
                e.preventDefault();
            }
            lastTouch = now;
        }, { passive: false });
    },

    /**
     * Parental Gate: Requires a 3-second hold to trigger a callback
     */
    setupParentalGate(element, callback) {
        if (!element) return;
        
        let holdTimer = null;
        let progress = 0;
        
        const startHold = (e) => {
            if (!this.isSafetyEnabled) {
                callback();
                return;
            }

            // Special Case: Slideshow one-click START
            if (element.id === 'nav-slideshow' && !window.isSlideshowActive) {
                callback();
                return;
            }
            
            element.classList.add('holding');
            progress = 0;
            holdTimer = setInterval(() => {
                progress += 10;
                element.style.setProperty('--hold-progress', `${progress}%`);
                if (progress >= 100) {
                    clearInterval(holdTimer);
                    element.classList.remove('holding');
                    callback();
                }
            }, 300); // 3000ms / 10 intervals = 300ms per 10%
        };

        const cancelHold = () => {
            if (holdTimer) clearInterval(holdTimer);
            element.classList.remove('holding');
            element.style.setProperty('--hold-progress', `0%`);
        };

        element.addEventListener('mousedown', startHold);
        element.addEventListener('touchstart', startHold);
        window.addEventListener('mouseup', cancelHold);
        window.addEventListener('touchend', cancelHold);
    },

    applyGlobalStyles() {
        const value = this.isSafetyEnabled ? 'none' : 'auto';
        document.body.style.userSelect = value;
        document.body.style.webkitUserSelect = value;
        document.body.style.msUserSelect = value;
        document.body.style.mozUserSelect = value;
        
        if (!this.isSafetyEnabled) {
            document.body.classList.remove('interaction-locked');
        } else {
            // Auto Full-Screen in Kids Mode
            this.enterFullscreen();
        }

        // Mode-Based Volume Control
        let targetVolume = this.isSafetyEnabled ? 1.0 : 0.25;
        
        // Initial "Welcome" audio should be at 75% if safety is on
        if (this.isSafetyEnabled && !this.hasPlayedFirstAudio) {
            targetVolume = 0.75;
        }

        window.globalVolume = targetVolume;

        // Sync with UI
        const volSlider = document.getElementById('volume-control');
        const volIcon = document.querySelector('#nav-volume .hi');
        
        if (volSlider) {
            // If safety is enabled and first audio played, bump to 100%
            // Otherwise stick to the target (0.75 for start, 0.25 for dev)
            volSlider.value = targetVolume;
        }
        
        if (volIcon) {
            if (targetVolume == 0) volIcon.innerText = '🔇';
            else if (targetVolume < 0.5) volIcon.innerText = '🔉';
            else volIcon.innerText = '🔊';
        }

        console.log(`Volume set to ${targetVolume} (${this.isSafetyEnabled ? 'Child' : 'Dev'} Mode)`);
    },

    enterFullscreen() {
        const doc = window.document;
        const docEl = doc.documentElement;

        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            if (requestFullScreen) {
                requestFullScreen.call(docEl).catch(err => {
                    console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            }
        }
    },

    exitFullscreen() {
        const doc = window.document;
        const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement) {
            if (cancelFullScreen) cancelFullScreen.call(doc);
        }
    },

    /**
     * Checks if a click is allowed (not locked and not spam)
     */
    canInteract() {
        if (!this.isSafetyEnabled) return true;
        if (this.isLocked) return false;

        const now = Date.now();
        if (now - this.lastClickTime < this.spamThreshold) {
            console.log("Interaction blocked: Spam detection");
            return false;
        }

        this.lastClickTime = now;
        return true;
    },

    lock() {
        if (!this.isSafetyEnabled) return;
        this.isLocked = true;
        document.body.classList.add('interaction-locked');
        console.log("UI Locked");
    },

    unlock() {
        this.isLocked = false;
        document.body.classList.remove('interaction-locked');
        console.log("UI Unlocked");
    },

    /**
     * Navigation Throttle: Prevents rapid skipping of cards in Kids Mode
     */
    canNavigate() {
        if (!this.isSafetyEnabled) return true;
        
        const now = Date.now();
        if (now - this.lastNavTime < this.navThrottle) {
            console.log("Navigation blocked: Throttling (1s)");
            return false;
        }

        this.lastNavTime = now;
        return true;
    }
};
