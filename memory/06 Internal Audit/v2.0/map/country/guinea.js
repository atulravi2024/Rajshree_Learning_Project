// ── GUINEA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["guinea"] = { "Conakry": { "conakry": { lat: 9.537, lon: -13.677 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["guinea"]) { const cities = window.LOCATION_DATA["guinea"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
