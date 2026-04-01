# Frontier Map: Bad Condition Buttons

This document identifies buttons in the **VIS.PROTO** category that are partially implemented but lack active event listeners in the current JavaScript architecture.

---

## [1] btn-map-mode-toggle

| Field | Detail |
| :--- | :--- |
| **Button ID** | `btn-map-mode-toggle` |
| **Label/Icon** | Map Icon (<i data-lucide="map"></i>) |
| **Purpose** | Toggles the globe surface between **Satellite** imagery and stylized **Map/Atlas** textures. |
| **Intended Behavior** | Should call `window.toggleGlobeMapView()`, switching the `_mapViewMode` state and updating the button icon to `image` (for satellite) or `map` (for atlas). |
| **Current Issue** | The logic is defined in `map_modes.js`, but no event listener is attached to the DOM element. The button is non-interactive. |

### How to Fix
Add the following listener to the `initBottomBar` function in `map_ui.js` or similar:
```javascript
document.getElementById('btn-map-mode-toggle')?.addEventListener('click', () => {
    if (typeof window.toggleGlobeMapView === 'function') {
        window.toggleGlobeMapView();
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
    }
});
```

---

## [2] btn-theme-toggle

| Field | Detail |
| :--- | :--- |
| **Button ID** | `btn-theme-toggle` |
| **Label/Icon** | Sun Icon (<i data-lucide="sun"></i>) |
| **Purpose** | Switches the globe between **Light** (Day) and **Dark** (Night) themes. |
| **Intended Behavior** | Should call `window.toggleGlobeTheme()`, switching `_mapThemeMode` and updating the button icon to `moon` (for light) or `sun` (for dark). |
| **Current Issue** | The logic is defined in `map_modes.js`, but no event listener is attached. The button is non-interactive. |

### How to Fix
Add the following listener to the initialization logic:
```javascript
document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    if (typeof window.toggleGlobeTheme === 'function') {
        window.toggleGlobeTheme();
        if (window.playSound) window.playSound('UI_GENERIC_TAP');
    }
});
```
