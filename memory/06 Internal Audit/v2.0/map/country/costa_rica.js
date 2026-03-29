// ── COSTA RICA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["costa_rica"] = { "San Jose": { "san jose": { lat: 9.928, lon: -84.091 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["costa_rica"]) { const cities = window.LOCATION_DATA["costa_rica"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
