// ── NIGERIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["nigeria"] = { "Lagos": { "lagos": { lat: 6.524, lon: 3.379 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["nigeria"]) { const cities = window.LOCATION_DATA["nigeria"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
