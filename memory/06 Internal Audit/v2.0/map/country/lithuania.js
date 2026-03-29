// ── LITHUANIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["lithuania"] = { "Vilnius County": { "vilnius": { lat: 54.687, lon: 25.279 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["lithuania"]) { const cities = window.LOCATION_DATA["lithuania"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
