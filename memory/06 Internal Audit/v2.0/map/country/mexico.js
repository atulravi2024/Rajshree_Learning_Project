// ── MEXICO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["mexico"] = { "Mexico City": { "mexico city": { lat: 19.432, lon: -99.133 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["mexico"]) { const cities = window.LOCATION_DATA["mexico"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
