// ── THAILAND: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["thailand"] = { "Bangkok": { "bangkok": { lat: 13.756, lon: 100.501 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["thailand"]) { const cities = window.LOCATION_DATA["thailand"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
