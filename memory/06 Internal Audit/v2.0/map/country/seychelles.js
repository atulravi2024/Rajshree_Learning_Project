// ── SEYCHELLES: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["seychelles"] = { "Victoria": { "victoria": { lat: -4.617, lon: 55.450 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["seychelles"]) { const cities = window.LOCATION_DATA["seychelles"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
