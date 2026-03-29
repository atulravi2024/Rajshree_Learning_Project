// ── SERBIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["serbia"] = { "Belgrade": { "belgrade": { lat: 44.786, lon: 20.448 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["serbia"]) { const cities = window.LOCATION_DATA["serbia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
