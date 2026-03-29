// ── FRANCE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["france"] = { "Île-de-France": { "paris": { lat: 48.856, lon: 2.352 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["france"]) { const cities = window.LOCATION_DATA["france"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
