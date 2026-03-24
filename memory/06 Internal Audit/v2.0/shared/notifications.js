/**
 * GLOBAL NOTIFICATION ENGINE
 */

const NOTIFICATIONS = [
    {
        id: 1,
        type: 'AUDITS',
        title: 'System Drift Detected',
        desc: 'Minor variance in Sector 08 (Protocol X) requires verification. Current deviation: +5.2%.',
        time: '2 mins ago',
        icon: 'alert-triangle',
        unread: true
    },
    {
        id: 2,
        type: 'SECURITY',
        title: 'Leaked Credential Alert',
        desc: 'Potential compromise in Sector 02 portal access restricted. Lead Auditor review required.',
        time: '45 mins ago',
        icon: 'shield-alert',
        unread: true
    },
    {
        id: 3,
        type: 'REPORTS',
        title: 'Q1 Audit Report Ready',
        desc: 'Consolidated report for Sector 09 (Cultural Matra) generated. Ready for executive review.',
        time: '1 hour ago',
        icon: 'file-text',
        unread: true
    },
    {
        id: 4,
        type: 'MIGRATIONS',
        title: 'Data Sync Complete',
        desc: 'Migration of Sector 11 (Hindi Matra) artifacts to Frontier Hub finalized. Integrity check: PASS.',
        time: '2 hours ago',
        icon: 'database',
        unread: false
    },
    {
        id: 5,
        type: 'SYSTEM',
        title: 'Core Protocol Upgrade',
        desc: 'Frontier Hub v2.1 deployment pending. System stability: 99.8%. Check log #409.',
        time: '3 hours ago',
        icon: 'cpu',
        unread: false
    },
    {
        id: 6,
        type: 'ANALYTICS',
        title: 'Anomalous Traffic Spike',
        desc: 'Data throughput spike detected in Sector 05. Pattern mismatch with baseline. Investigating...',
        time: '5 hours ago',
        icon: 'activity',
        unread: false
    },
    {
        id: 7,
        type: 'REPORTS',
        title: 'Compliance Summary Extracted',
        desc: 'Export of "System & Guardrails" compliance data completed. Files stored in secure vault.',
        time: '7 hours ago',
        icon: 'save',
        unread: false
    },
    {
        id: 8,
        type: 'AUDITS',
        title: 'Audit Log Sealed: Sector 00',
        desc: 'All sector reports verified for Lead Auditor review. Fidelity: 100%. Protocol engaged.',
        time: '8 hours ago',
        icon: 'check-circle',
        unread: false
    },
    {
        id: 9,
        type: 'MIGRATIONS',
        title: 'Legacy Data Archive',
        desc: 'Sector 01 legacy records re-indexed for deep-audit compliance. Storage optimized.',
        time: '12 hours ago',
        icon: 'archive',
        unread: false
    },
    {
        id: 10,
        type: 'SYSTEM',
        title: 'Network Latency Shift',
        desc: 'Sector 05 node response > 20ms detected. Automatic relay rerouting active.',
        time: '1 day ago',
        icon: 'wifi-off',
        unread: false
    },
    {
        id: 11,
        type: 'SECURITY',
        title: 'New Access Pattern',
        desc: 'Lead Auditor verified access from secure relay 10.0.8.2. Session logged.',
        time: '2 days ago',
        icon: 'key',
        unread: false
    }
];

function initNotifications() {
    // Inject Alerts Modal if it doesn't exist
    if (!document.getElementById('alerts-modal')) {
        const modalHTML = `
        <div class="alerts-modal-overlay" id="alerts-modal">
            <div class="alerts-modal-content">
                <div class="modal-header">
                    <div class="header-left">
                        <i data-lucide="bell-ring"></i>
                        <h2>CENTRAL ALERTS HUB</h2>
                    </div>
                    <button class="modal-close" id="close-alerts-modal" title="Close Hub">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-filter">
                    <button class="filter-btn active">ALL ALERTS</button>
                    <button class="filter-btn">SYSTEM</button>
                    <button class="filter-btn">SECURITY</button>
                    <button class="filter-btn">AUDITS</button>
                    <button class="filter-btn">REPORTS</button>
                    <button class="filter-btn">MIGRATIONS</button>
                </div>
                <div class="modal-body" id="modal-alerts-list">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        if (window.lucide) lucide.createIcons({ root: document.getElementById('alerts-modal') });
    }

    const bell = document.getElementById('notification-bell');
    
    // Inject Dropdown HTML if it doesn't exist
    if (bell && !document.getElementById('notification-dropdown')) {
        const dropdownHTML = `
            <div class="notification-dropdown" id="notification-dropdown">
                <div class="dropdown-header">
                    <span>NOTIFICATIONS</span>
                    <button class="mark-read">Mark all as read</button>
                </div>
                <div class="dropdown-body" id="notification-list">
                </div>
                <div class="dropdown-footer">
                    <a href="#">View all alerts</a>
                </div>
            </div>`;
        bell.insertAdjacentHTML('beforeend', dropdownHTML);
    }

    const dropdown = document.getElementById('notification-dropdown');
    const list = document.getElementById('notification-list');

    if (!bell || !dropdown || !list) return;

    // Toggle logic
    bell.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            renderNotifications();
        }
    });

    // Close on click outside
    window.addEventListener('click', () => {
        dropdown.classList.remove('active');
    });

    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Mark All Read
    const markAllBtn = dropdown.querySelector('.mark-read');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            NOTIFICATIONS.forEach(n => n.unread = false);
            renderNotifications();
            updateNotifBadge();
        });
    }

    // View All Alerts
    const viewAllBtn = dropdown.querySelector('.dropdown-footer a');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openAlertsModal();
            dropdown.classList.remove('active');
        });
    }

    // Modal Close
    const closeModalBtn = document.getElementById('close-alerts-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAlertsModal);
    }

    const modalOverlay = document.getElementById('alerts-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeAlertsModal();
        });
    }

    // Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderModalAlerts(btn.textContent);
        });
    });

    // Initial Badge State
    updateNotifBadge();
}

function openAlertsModal() {
    const modal = document.getElementById('alerts-modal');
    if (modal) {
        modal.classList.add('active');
        // Reset filter to ALL on open
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(b => b.classList.remove('active'));
        if (filterBtns[0]) filterBtns[0].classList.add('active');
        renderModalAlerts();
    }
}

function closeAlertsModal() {
    const modal = document.getElementById('alerts-modal');
    if (modal) modal.classList.remove('active');
}

function renderModalAlerts(filterType = 'ALL ALERTS') {
    const list = document.getElementById('modal-alerts-list');
    if (!list) return;

    const filtered = filterType === 'ALL ALERTS' 
        ? NOTIFICATIONS 
        : NOTIFICATIONS.filter(n => n.type === filterType.toUpperCase());

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-alerts">
                <i data-lucide="info"></i>
                <p>No alerts found in ${filterType} category.</p>
            </div>
        `;
    } else {
        list.innerHTML = filtered.map(n => `
            <div class="modal-alert-item ${n.unread ? 'unread' : ''}">
                <div class="alert-marker"></div>
                <div class="alert-icon"><i data-lucide="${n.icon}"></i></div>
                <div class="alert-info">
                    <h3>${n.title}</h3>
                    <p>${n.desc}</p>
                </div>
                <div class="alert-meta">
                    <span>${n.time}</span>
                    <button onclick="toggleRead(${n.id}); renderModalAlerts('${filterType}');">${n.unread ? 'MARK READ' : 'MARK UNREAD'}</button>
                </div>
            </div>
        `).join('');
    }

    if (window.lucide) lucide.createIcons();
}

function renderNotifications() {
    const list = document.getElementById('notification-list');
    if (!list) return;

    list.innerHTML = NOTIFICATIONS.map(n => `
        <div class="notification-item ${n.unread ? 'unread' : ''}" onclick="toggleRead(${n.id})">
            <div class="notif-icon">
                <i data-lucide="${n.icon}"></i>
            </div>
            <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-desc">${n.desc}</div>
                <span class="notif-time">${n.time}</span>
            </div>
        </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

function updateNotifBadge() {
    const badge = document.querySelector('#notification-bell .nav-badge');
    const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
    if (badge) {
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    }
}

function toggleRead(id) {
    const notif = NOTIFICATIONS.find(n => n.id === id);
    if (notif) {
        notif.unread = !notif.unread;
        renderNotifications();
        updateNotifBadge();
        
        // If modal is open, refresh it too
        const modal = document.getElementById('alerts-modal');
        if (modal && modal.classList.contains('active')) {
            // Find current active filter
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            const filterType = activeFilterBtn ? activeFilterBtn.textContent : 'ALL ALERTS';
            renderModalAlerts(filterType);
        }
    }
}
