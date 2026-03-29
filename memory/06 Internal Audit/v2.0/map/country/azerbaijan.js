// ── AZERBAIJAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["azerbaijan"] = { "Baku": { "baku": { lat: 40.409, lon: 49.867 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["azerbaijan"]) { const cities = window.LOCATION_DATA["azerbaijan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
