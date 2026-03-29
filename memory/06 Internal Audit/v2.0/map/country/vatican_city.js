// ── VATICAN CITY: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["vatican_city"] = { "Vatican City": { "vatican city": { lat: 41.902, lon: 12.453 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["vatican_city"]) { const cities = window.LOCATION_DATA["vatican_city"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
