# Frontier Map: Dead Buttons

This document identifies buttons in the **DATA.FEED** and **SYS.OPS** categories that are visually present but currently lack any implementation or backend script.

---

## [1] btn-deep-scan

| Field | Detail |
| :--- | :--- |
| **Button ID** | `btn-deep-scan` |
| **Label/Icon** | Refresh Icon (<i data-lucide="refresh-cw"></i>) |
| **Purpose** | Intended for a high-intensity data refresh of city nodes and globe data. |
| **Intended Behavior** | Should trigger a global data reload, play a scanning animation (e.g., an overlaying grid scanner), and refresh all sidebars. |
| **Current Issue** | No backend logic or event listener exists. Clicking the button has zero effect. |

### How to Fix
Implement a `runDeepScan()` global function and wire it up:
```javascript
function runDeepScan() {
    // 1. Play scan animation (e.g., CSS scanline overlay)
    // 2. Fetch or mock-refresh LOCATION_DATA
    // 3. Update all widgets and map icons
    if (window.playSound) window.playSound('SCAN_INITIATE');
}
document.getElementById('btn-deep-scan')?.addEventListener('click', runDeepScan);
```

---

## [2] btn-history

| Field | Detail |
| :--- | :--- |
| **Button ID** | `btn-history` |
| **Label/Icon** | History Icon (<i data-lucide="history"></i>) |
| **Purpose** | View historical search patterns and previous audit routes. |
| **Intended Behavior** | Should open a dedicated "History Dashboard" modal with a list of previous source/destination searches. |
| **Current Issue** | No backend logic, modal target, or event listener exists. |

### How to Fix
Create a `modal-search-history` in HTML and implement the following:
```javascript
document.getElementById('btn-history')?.addEventListener('click', () => {
    document.getElementById('modal-search-history')?.classList.add('open');
    populateHistoryList();
});
```

---

## [3] btn-export

| Field | Detail |
| :--- | :--- |
| **Button ID** | `btn-export` |
| **Label/Icon** | Download Icon (<i data-lucide="download"></i>) |
| **Purpose** | Export the current audit report/map state as a downloadable file. |
| **Intended Behavior** | Should generate a JSON or CSV file containing current node statistics and path details. |
| **Current Issue** | No implementation exists. |

### How to Fix
```javascript
document.getElementById('btn-export')?.addEventListener('click', () => {
    const data = JSON.stringify(window.DEFAULT_GLOBAL_METRICS);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_report.json';
    a.click();
    if (window.playSound) window.playSound('UI_GENERIC_TAP');
});
```

---

## [4] btn-lockdown

| Field | Detail |
| :--- | :--- |
| **Button ID** | `btn-lockdown` |
| **Label/Icon** | Shield-Off Icon (<i data-lucide="shield-off"></i>) |
| **Purpose** | Emergency system isolation in case of data breach. |
| **Intended Behavior** | Should trigger "Lockdown Mode": red UI theme, alarm sound, and immediate clearing of active paths. |
| **Current Issue** | No implementation exists. |

### How to Fix
```javascript
document.getElementById('btn-lockdown')?.addEventListener('click', () => {
    document.body.classList.add('lockdown-active');
    triggerAlarmSystem(); // Should be a new function
    if (window.playSound) window.playSound('LOCKDOWN_ALARM');
});
```
