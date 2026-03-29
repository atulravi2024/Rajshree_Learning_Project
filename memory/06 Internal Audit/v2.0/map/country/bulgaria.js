// ── BULGARIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["bulgaria"] = { "Sofia": { "sofia": { lat: 42.697, lon: 23.321 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["bulgaria"]) { const cities = window.LOCATION_DATA["bulgaria"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
