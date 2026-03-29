// ── MALDIVES: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["maldives"] = { "Male": { "male": { lat: 4.175, lon: 73.509 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["maldives"]) { const cities = window.LOCATION_DATA["maldives"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
