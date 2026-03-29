// ── COLOMBIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["colombia"] = { "Bogota": { "bogota": { lat: 4.711, lon: -74.072 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["colombia"]) { const cities = window.LOCATION_DATA["colombia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
