// ── MALAYSIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["malaysia"] = { "Federal Territory of Kuala Lumpur": { "kuala lumpur": { lat: 3.140, lon: 101.691 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["malaysia"]) { const cities = window.LOCATION_DATA["malaysia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
