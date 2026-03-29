// ── LIBYA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["libya"] = { "Tripoli District": { "tripoli": { lat: 32.887, lon: 13.191 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["libya"]) { const cities = window.LOCATION_DATA["libya"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
