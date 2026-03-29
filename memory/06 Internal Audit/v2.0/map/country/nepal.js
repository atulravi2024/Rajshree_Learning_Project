// ── NEPAL: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["nepal"] = { "Bagmati Province": { "kathmandu": { lat: 27.717, lon: 85.324 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["nepal"]) { const cities = window.LOCATION_DATA["nepal"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
