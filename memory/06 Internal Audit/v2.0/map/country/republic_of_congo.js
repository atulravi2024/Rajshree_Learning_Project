// ── REPUBLIC OF THE CONGO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["republic_of_congo"] = { "Brazzaville": { "brazzaville": { lat: -4.267, lon: 15.283 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["republic_of_congo"]) { const cities = window.LOCATION_DATA["republic_of_congo"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
