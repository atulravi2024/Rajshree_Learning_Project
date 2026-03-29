// ── KIRIBATI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["kiribati"] = { "South Tarawa": { "tarawa": { lat: 1.333, lon: 173.000 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["kiribati"]) { const cities = window.LOCATION_DATA["kiribati"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
