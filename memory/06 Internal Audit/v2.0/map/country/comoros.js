// ── COMOROS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["comoros"] = { "Grande Comore": { "moroni": { lat: -11.697, lon: 43.255 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["comoros"]) { const cities = window.LOCATION_DATA["comoros"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
