// ── CAMBODIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["cambodia"] = { "Phnom Penh": { "phnom penh": { lat: 11.556, lon: 104.928 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["cambodia"]) { const cities = window.LOCATION_DATA["cambodia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
