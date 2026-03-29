// ── MALAWI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["malawi"] = { "Lilongwe": { "lilongwe": { lat: -13.983, lon: 33.783 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["malawi"]) { const cities = window.LOCATION_DATA["malawi"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
