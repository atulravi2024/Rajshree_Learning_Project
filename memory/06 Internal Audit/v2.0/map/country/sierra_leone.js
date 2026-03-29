// ── SIERRA LEONE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["sierra_leone"] = { "Western Area": { "freetown": { lat: 8.483, lon: -13.233 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["sierra_leone"]) { const cities = window.LOCATION_DATA["sierra_leone"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
