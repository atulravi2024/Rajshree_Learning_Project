// ── BHUTAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["bhutan"] = { "Thimphu": { "thimphu": { lat: 27.472, lon: 89.636 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["bhutan"]) { const cities = window.LOCATION_DATA["bhutan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
