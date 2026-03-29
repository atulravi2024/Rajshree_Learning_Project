// ── MOLDOVA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["moldova"] = { "Chisinau": { "chisinau": { lat: 47.010, lon: 28.863 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["moldova"]) { const cities = window.LOCATION_DATA["moldova"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
