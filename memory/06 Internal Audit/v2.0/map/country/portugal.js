// ── PORTUGAL: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["portugal"] = { "Lisbon": { "lisbon": { lat: 38.722, lon: -9.139 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["portugal"]) { const cities = window.LOCATION_DATA["portugal"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
