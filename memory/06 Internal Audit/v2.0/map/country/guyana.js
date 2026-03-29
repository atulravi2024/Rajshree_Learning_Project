// ── GUYANA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["guyana"] = { "Demerara-Mahaica": { "georgetown": { lat: 6.801, lon: -58.155 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["guyana"]) { const cities = window.LOCATION_DATA["guyana"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
