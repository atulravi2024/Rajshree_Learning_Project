// ── TAJIKISTAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["tajikistan"] = { "Dushanbe": { "dushanbe": { lat: 38.536, lon: 68.784 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["tajikistan"]) { const cities = window.LOCATION_DATA["tajikistan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
