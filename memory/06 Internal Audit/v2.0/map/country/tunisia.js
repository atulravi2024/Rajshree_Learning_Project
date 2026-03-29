// ── TUNISIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["tunisia"] = { "Tunis Governorate": { "tunis": { lat: 36.806, lon: 10.181 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["tunisia"]) { const cities = window.LOCATION_DATA["tunisia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
