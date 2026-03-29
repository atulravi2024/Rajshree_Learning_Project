// ── IRELAND: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["ireland"] = { "Leinster": { "dublin": { lat: 53.349, lon: -6.260 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["ireland"]) { const cities = window.LOCATION_DATA["ireland"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
