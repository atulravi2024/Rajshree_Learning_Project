// ── ANGOLA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["angola"] = { "Luanda": { "luanda": { lat: -8.839, lon: 13.235 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["angola"]) { const cities = window.LOCATION_DATA["angola"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
