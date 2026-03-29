// ── BARBADOS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["barbados"] = { "Saint Michael": { "bridgetown": { lat: 13.100, lon: -59.617 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["barbados"]) { const cities = window.LOCATION_DATA["barbados"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
