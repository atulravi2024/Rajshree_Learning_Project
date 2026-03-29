// ── ECUADOR: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["ecuador"] = { "Pichincha": { "quito": { lat: -0.180, lon: -78.467 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["ecuador"]) { const cities = window.LOCATION_DATA["ecuador"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
