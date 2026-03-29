// ── GREECE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["greece"] = { "Attica": { "athens": { lat: 37.983, lon: 23.727 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["greece"]) { const cities = window.LOCATION_DATA["greece"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
