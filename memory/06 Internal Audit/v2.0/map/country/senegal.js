// ── SENEGAL: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["senegal"] = { "Dakar": { "dakar": { lat: 14.731, lon: -17.457 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["senegal"]) { const cities = window.LOCATION_DATA["senegal"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
