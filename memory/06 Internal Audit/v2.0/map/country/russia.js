// ── RUSSIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["russia"] = { "Moscow": { "moscow": { lat: 55.755, lon: 37.617 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["russia"]) { const cities = window.LOCATION_DATA["russia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
