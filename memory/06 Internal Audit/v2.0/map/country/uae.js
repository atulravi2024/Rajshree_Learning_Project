// ── UAE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["uae"] = { "Dubai": { "dubai": { lat: 25.204, lon: 55.270 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["uae"]) { const cities = window.LOCATION_DATA["uae"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
