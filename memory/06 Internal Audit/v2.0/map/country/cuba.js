// ── CUBA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["cuba"] = { "Havana": { "havana": { lat: 23.113, lon: -82.366 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["cuba"]) { const cities = window.LOCATION_DATA["cuba"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
