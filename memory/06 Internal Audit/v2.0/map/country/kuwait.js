// ── KUWAIT: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["kuwait"] = { "Al Asimah Governorate": { "kuwait city": { lat: 29.375, lon: 47.977 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["kuwait"]) { const cities = window.LOCATION_DATA["kuwait"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
