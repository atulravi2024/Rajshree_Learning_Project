// ── AUSTRIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["austria"] = { "Vienna": { "vienna": { lat: 48.208, lon: 16.373 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["austria"]) { const cities = window.LOCATION_DATA["austria"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
