// ── CAMEROON: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["cameroon"] = { "Centre": { "yaounde": { lat: 3.867, lon: 11.517 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["cameroon"]) { const cities = window.LOCATION_DATA["cameroon"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
