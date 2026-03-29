// ── BELIZE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["belize"] = { "Cayo": { "belmopan": { lat: 17.252, lon: -88.767 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["belize"]) { const cities = window.LOCATION_DATA["belize"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
