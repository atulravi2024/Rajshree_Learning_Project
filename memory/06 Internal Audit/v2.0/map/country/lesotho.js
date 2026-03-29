// ── LESOTHO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["lesotho"] = { "Maseru District": { "maseru": { lat: -29.317, lon: 27.483 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["lesotho"]) { const cities = window.LOCATION_DATA["lesotho"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
