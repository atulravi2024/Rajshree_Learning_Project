// ── NORWAY: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["norway"] = { "Oslo": { "oslo": { lat: 59.913, lon: 10.752 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["norway"]) { const cities = window.LOCATION_DATA["norway"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
