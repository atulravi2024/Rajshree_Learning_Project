// ── BOLIVIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["bolivia"] = { "Chuquisaca": { "sucre": { lat: -19.033, lon: -65.262 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["bolivia"]) { const cities = window.LOCATION_DATA["bolivia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
