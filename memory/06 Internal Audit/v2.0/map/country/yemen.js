// ── YEMEN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["yemen"] = { "Sanaa": { "sanaa": { lat: 15.369, lon: 44.204 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["yemen"]) { const cities = window.LOCATION_DATA["yemen"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
