// ── HUNGARY: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["hungary"] = { "Budapest": { "budapest": { lat: 47.497, lon: 19.040 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["hungary"]) { const cities = window.LOCATION_DATA["hungary"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
