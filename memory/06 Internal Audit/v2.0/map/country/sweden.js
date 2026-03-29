// ── SWEDEN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["sweden"] = { "Stockholm County": { "stockholm": { lat: 59.329, lon: 18.068 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["sweden"]) { const cities = window.LOCATION_DATA["sweden"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
