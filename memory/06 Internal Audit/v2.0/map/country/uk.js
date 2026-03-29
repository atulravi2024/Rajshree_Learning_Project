// ── UK: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["uk"] = { "Greater London": { "london": { lat: 51.507, lon: -0.127 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["uk"]) { const cities = window.LOCATION_DATA["uk"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
