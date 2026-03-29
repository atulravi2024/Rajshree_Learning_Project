// ── LAOS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["laos"] = { "Vientiane Prefecture": { "vientiane": { lat: 17.975, lon: 102.633 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["laos"]) { const cities = window.LOCATION_DATA["laos"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
