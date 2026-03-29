// ── GAMBIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["gambia"] = { "Banjul": { "banjul": { lat: 13.453, lon: -16.577 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["gambia"]) { const cities = window.LOCATION_DATA["gambia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
