// ── SAINT VINCENT AND THE GRENADINES: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["st_vincent"] = { "Saint George": { "kingstown": { lat: 13.158, lon: -61.225 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["st_vincent"]) { const cities = window.LOCATION_DATA["st_vincent"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
