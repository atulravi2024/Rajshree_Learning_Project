// ── ROMANIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["romania"] = { "Bucharest": { "bucharest": { lat: 44.426, lon: 26.102 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["romania"]) { const cities = window.LOCATION_DATA["romania"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
