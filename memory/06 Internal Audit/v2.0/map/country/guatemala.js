// ── GUATEMALA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["guatemala"] = { "Guatemala Department": { "guatemala city": { lat: 14.635, lon: -90.513 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["guatemala"]) { const cities = window.LOCATION_DATA["guatemala"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
