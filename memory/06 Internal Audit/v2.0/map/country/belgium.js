// ── BELGIUM: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["belgium"] = { "Brussels": { "brussels": { lat: 50.850, lon: 4.352 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["belgium"]) { const cities = window.LOCATION_DATA["belgium"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
