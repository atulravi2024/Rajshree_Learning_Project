// ── UKRAINE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["ukraine"] = { "Kyiv": { "kyiv": { lat: 50.450, lon: 30.523 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["ukraine"]) { const cities = window.LOCATION_DATA["ukraine"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
