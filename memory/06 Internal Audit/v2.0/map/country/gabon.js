// ── GABON: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["gabon"] = { "Estuaire": { "libreville": { lat: 0.383, lon: 9.453 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["gabon"]) { const cities = window.LOCATION_DATA["gabon"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
