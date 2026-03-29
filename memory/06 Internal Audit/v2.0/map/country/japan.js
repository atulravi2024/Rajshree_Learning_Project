// ── JAPAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["japan"] = { "Tokyo": { "tokyo": { lat: 35.676, lon: 139.650 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["japan"]) { const cities = window.LOCATION_DATA["japan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
