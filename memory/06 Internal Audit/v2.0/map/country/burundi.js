// ── BURUNDI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["burundi"] = { "Bujumbura Mairie": { "bujumbura": { lat: -3.383, lon: 29.367 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["burundi"]) { const cities = window.LOCATION_DATA["burundi"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
