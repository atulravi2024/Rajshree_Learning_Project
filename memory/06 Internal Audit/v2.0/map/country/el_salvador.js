// ── EL SALVADOR: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["el_salvador"] = { "San Salvador": { "san salvador": { lat: 13.693, lon: -89.215 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["el_salvador"]) { const cities = window.LOCATION_DATA["el_salvador"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
