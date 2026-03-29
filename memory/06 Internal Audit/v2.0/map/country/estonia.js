// ── ESTONIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["estonia"] = { "Harju County": { "tallinn": { lat: 59.437, lon: 24.753 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["estonia"]) { const cities = window.LOCATION_DATA["estonia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
