// ── GEORGIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["georgia"] = { "Tbilisi": { "tbilisi": { lat: 41.715, lon: 44.827 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["georgia"]) { const cities = window.LOCATION_DATA["georgia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
