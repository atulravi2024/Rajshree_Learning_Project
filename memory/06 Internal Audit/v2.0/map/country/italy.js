// ── ITALY: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["italy"] = { "Lazio": { "rome": { lat: 41.902, lon: 12.496 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["italy"]) { const cities = window.LOCATION_DATA["italy"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
