// ── SYRIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["syria"] = { "Damascus": { "damascus": { lat: 33.513, lon: 36.291 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["syria"]) { const cities = window.LOCATION_DATA["syria"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
