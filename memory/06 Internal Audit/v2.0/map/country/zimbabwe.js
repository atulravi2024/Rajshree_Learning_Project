// ── ZIMBABWE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["zimbabwe"] = { "Harare Province": { "harare": { lat: -17.829, lon: 31.052 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["zimbabwe"]) { const cities = window.LOCATION_DATA["zimbabwe"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
