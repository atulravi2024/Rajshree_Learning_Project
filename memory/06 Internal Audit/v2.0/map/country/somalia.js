// ── SOMALIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["somalia"] = { "Banaadir": { "mogadishu": { lat: 2.046, lon: 45.318 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["somalia"]) { const cities = window.LOCATION_DATA["somalia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
