// ── GERMANY: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["germany"] = { "Berlin": { "berlin": { lat: 52.520, lon: 13.405 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["germany"]) { const cities = window.LOCATION_DATA["germany"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
