// ── SWITZERLAND: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["switzerland"] = { "Canton of Bern": { "bern": { lat: 46.948, lon: 7.447 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["switzerland"]) { const cities = window.LOCATION_DATA["switzerland"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
