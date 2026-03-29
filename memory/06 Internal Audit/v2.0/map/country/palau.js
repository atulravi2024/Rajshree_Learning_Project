// ── PALAU: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["palau"] = { "Melekeok": { "ngerulmud": { lat: 7.500, lon: 134.633 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["palau"]) { const cities = window.LOCATION_DATA["palau"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
