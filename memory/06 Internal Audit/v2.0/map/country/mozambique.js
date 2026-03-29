// ── MOZAMBIQUE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["mozambique"] = { "Maputo": { "maputo": { lat: -25.967, lon: 32.583 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["mozambique"]) { const cities = window.LOCATION_DATA["mozambique"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
