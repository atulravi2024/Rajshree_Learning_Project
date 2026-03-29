// ── BANGLADESH: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["bangladesh"] = { "Dhaka": { "dhaka": { lat: 23.811, lon: 90.412 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["bangladesh"]) { const cities = window.LOCATION_DATA["bangladesh"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
