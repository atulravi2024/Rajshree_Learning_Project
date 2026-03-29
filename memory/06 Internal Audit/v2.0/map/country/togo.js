// ── TOGO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["togo"] = { "Maritime Region": { "lome": { lat: 6.137, lon: 1.222 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["togo"]) { const cities = window.LOCATION_DATA["togo"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
