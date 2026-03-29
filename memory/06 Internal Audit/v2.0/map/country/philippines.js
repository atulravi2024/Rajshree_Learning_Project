// ── PHILIPPINES: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["philippines"] = { "Metro Manila": { "manila": { lat: 14.599, lon: 120.984 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["philippines"]) { const cities = window.LOCATION_DATA["philippines"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
