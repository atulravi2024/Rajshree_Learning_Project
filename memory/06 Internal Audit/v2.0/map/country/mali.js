// ── MALI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["mali"] = { "Bamako": { "bamako": { lat: 12.639, lon: -8.003 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["mali"]) { const cities = window.LOCATION_DATA["mali"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
