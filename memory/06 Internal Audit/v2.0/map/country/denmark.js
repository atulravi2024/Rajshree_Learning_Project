// ── DENMARK: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["denmark"] = { "Capital Region": { "copenhagen": { lat: 55.676, lon: 12.568 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["denmark"]) { const cities = window.LOCATION_DATA["denmark"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
