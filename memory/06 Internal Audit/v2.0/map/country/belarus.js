// ── BELARUS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["belarus"] = { "Minsk": { "minsk": { lat: 53.900, lon: 27.567 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["belarus"]) { const cities = window.LOCATION_DATA["belarus"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
