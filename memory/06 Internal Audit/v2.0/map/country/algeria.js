// ── ALGERIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["algeria"] = { "Algiers": { "algiers": { lat: 36.753, lon: 3.058 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["algeria"]) { const cities = window.LOCATION_DATA["algeria"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
