// ── TANZANIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["tanzania"] = { "Dodoma": { "dodoma": { lat: -6.173, lon: 35.748 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["tanzania"]) { const cities = window.LOCATION_DATA["tanzania"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
