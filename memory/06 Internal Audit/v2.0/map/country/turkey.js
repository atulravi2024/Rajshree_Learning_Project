// ── TURKEY: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["turkey"] = { "Istanbul": { "istanbul": { lat: 41.008, lon: 28.978 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["turkey"]) { const cities = window.LOCATION_DATA["turkey"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
