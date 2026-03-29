// ── SLOVENIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["slovenia"] = { "Ljubljana": { "ljubljana": { lat: 46.056, lon: 14.505 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["slovenia"]) { const cities = window.LOCATION_DATA["slovenia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
