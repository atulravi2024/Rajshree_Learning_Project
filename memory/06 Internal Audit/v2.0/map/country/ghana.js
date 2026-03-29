// ── GHANA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["ghana"] = { "Greater Accra": { "accra": { lat: 5.604, lon: -0.187 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["ghana"]) { const cities = window.LOCATION_DATA["ghana"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
