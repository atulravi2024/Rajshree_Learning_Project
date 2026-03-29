// ── LUXEMBOURG: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["luxembourg"] = { "Luxembourg": { "luxembourg": { lat: 49.611, lon: 6.132 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["luxembourg"]) { const cities = window.LOCATION_DATA["luxembourg"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
