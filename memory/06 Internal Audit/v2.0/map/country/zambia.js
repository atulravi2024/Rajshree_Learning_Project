// ── ZAMBIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["zambia"] = { "Lusaka Province": { "lusaka": { lat: -15.417, lon: 28.283 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["zambia"]) { const cities = window.LOCATION_DATA["zambia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
