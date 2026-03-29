// ── IRAQ: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["iraq"] = { "Baghdad": { "baghdad": { lat: 33.315, lon: 44.366 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["iraq"]) { const cities = window.LOCATION_DATA["iraq"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
