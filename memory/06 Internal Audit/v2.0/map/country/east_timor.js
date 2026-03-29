// ── EAST TIMOR: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["east_timor"] = { "Dili": { "dili": { lat: -8.557, lon: 125.574 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["east_timor"]) { const cities = window.LOCATION_DATA["east_timor"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
