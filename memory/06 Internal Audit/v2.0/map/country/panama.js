// ── PANAMA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["panama"] = { "Panama Province": { "panama city": { lat: 8.983, lon: -79.517 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["panama"]) { const cities = window.LOCATION_DATA["panama"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
