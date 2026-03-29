// ── SPAIN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["spain"] = { "Madrid": { "madrid": { lat: 40.416, lon: -3.703 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["spain"]) { const cities = window.LOCATION_DATA["spain"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
