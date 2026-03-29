// ── CROATIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["croatia"] = { "Zagreb": { "zagreb": { lat: 45.815, lon: 15.982 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["croatia"]) { const cities = window.LOCATION_DATA["croatia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
