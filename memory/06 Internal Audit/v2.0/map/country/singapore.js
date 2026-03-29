// ── SINGAPORE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["singapore"] = { "Singapore": { "singapore": { lat: 1.352, lon: 103.819 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["singapore"]) { const cities = window.LOCATION_DATA["singapore"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
