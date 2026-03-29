// ── JAMAICA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["jamaica"] = { "Kingston Parish": { "kingston": { lat: 17.971, lon: -76.793 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["jamaica"]) { const cities = window.LOCATION_DATA["jamaica"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
