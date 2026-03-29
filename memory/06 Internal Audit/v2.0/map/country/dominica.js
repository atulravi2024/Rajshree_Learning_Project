// ── DOMINICA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["dominica"] = { "Saint George": { "roseau": { lat: 15.301, lon: -61.388 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["dominica"]) { const cities = window.LOCATION_DATA["dominica"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
