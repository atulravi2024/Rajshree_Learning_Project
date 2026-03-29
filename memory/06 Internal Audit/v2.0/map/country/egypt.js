// ── EGYPT: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["egypt"] = { "Cairo": { "cairo": { lat: 30.044, lon: 31.235 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["egypt"]) { const cities = window.LOCATION_DATA["egypt"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
