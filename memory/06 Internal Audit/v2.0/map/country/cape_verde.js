// ── CAPE VERDE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["cape_verde"] = { "Praia": { "praia": { lat: 14.917, lon: -23.517 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["cape_verde"]) { const cities = window.LOCATION_DATA["cape_verde"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
