// ── KAZAKHSTAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["kazakhstan"] = { "Astana": { "astana": { lat: 51.169, lon: 71.449 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["kazakhstan"]) { const cities = window.LOCATION_DATA["kazakhstan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
