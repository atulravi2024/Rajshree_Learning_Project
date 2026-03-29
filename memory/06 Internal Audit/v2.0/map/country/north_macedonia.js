// ── NORTH MACEDONIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["north_macedonia"] = { "Skopje": { "skopje": { lat: 41.997, lon: 21.428 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["north_macedonia"]) { const cities = window.LOCATION_DATA["north_macedonia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
