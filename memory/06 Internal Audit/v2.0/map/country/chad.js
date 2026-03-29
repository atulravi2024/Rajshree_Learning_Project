// ── CHAD: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["chad"] = { "N'Djamena": { "n'djamena": { lat: 12.113, lon: 15.049 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["chad"]) { const cities = window.LOCATION_DATA["chad"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
