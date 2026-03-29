// ── FINLAND: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["finland"] = { "Uusimaa": { "helsinki": { lat: 60.169, lon: 24.935 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["finland"]) { const cities = window.LOCATION_DATA["finland"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
