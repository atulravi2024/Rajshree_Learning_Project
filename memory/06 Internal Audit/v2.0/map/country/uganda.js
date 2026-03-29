// ── UGANDA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["uganda"] = { "Central Region": { "kampala": { lat: 0.316, lon: 32.581 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["uganda"]) { const cities = window.LOCATION_DATA["uganda"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
