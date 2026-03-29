// ── ARGENTINA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["argentina"] = { "Buenos Aires": { "buenos aires": { lat: -34.603, lon: -58.381 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["argentina"]) { const cities = window.LOCATION_DATA["argentina"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
