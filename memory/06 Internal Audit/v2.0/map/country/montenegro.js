// ── MONTENEGRO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["montenegro"] = { "Podgorica": { "podgorica": { lat: 42.430, lon: 19.259 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["montenegro"]) { const cities = window.LOCATION_DATA["montenegro"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
