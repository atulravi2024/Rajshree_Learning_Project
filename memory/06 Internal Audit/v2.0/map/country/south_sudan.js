// ── SOUTH SUDAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["south_sudan"] = { "Juba": { "juba": { lat: 4.851, lon: 31.571 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["south_sudan"]) { const cities = window.LOCATION_DATA["south_sudan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
