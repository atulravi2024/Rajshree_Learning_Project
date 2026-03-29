// ── PAPUA NEW GUINEA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["papua_new_guinea"] = { "National Capital District": { "port moresby": { lat: -9.444, lon: 147.189 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["papua_new_guinea"]) { const cities = window.LOCATION_DATA["papua_new_guinea"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
