// ── AFGHANISTAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["afghanistan"] = { "Kabul": { "kabul": { lat: 34.555, lon: 69.207 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["afghanistan"]) { const cities = window.LOCATION_DATA["afghanistan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
