// ── MONGOLIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["mongolia"] = { "Ulaanbaatar": { "ulaanbaatar": { lat: 47.886, lon: 106.905 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["mongolia"]) { const cities = window.LOCATION_DATA["mongolia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
