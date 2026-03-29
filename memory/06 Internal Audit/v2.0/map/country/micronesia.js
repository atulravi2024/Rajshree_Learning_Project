// ── MICRONESIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["micronesia"] = { "Pohnpei": { "palikir": { lat: 6.917, lon: 158.183 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["micronesia"]) { const cities = window.LOCATION_DATA["micronesia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
