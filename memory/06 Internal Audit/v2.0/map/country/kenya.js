// ── KENYA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["kenya"] = { "Nairobi": { "nairobi": { lat: -1.292, lon: 36.821 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["kenya"]) { const cities = window.LOCATION_DATA["kenya"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
