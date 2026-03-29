// ── CANADA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["canada"] = { "Ontario": { "toronto": { lat: 43.653, lon: -79.383 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["canada"]) { const cities = window.LOCATION_DATA["canada"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
