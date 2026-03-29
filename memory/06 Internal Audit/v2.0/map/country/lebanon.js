// ── LEBANON: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["lebanon"] = { "Beirut Governorate": { "beirut": { lat: 33.893, lon: 35.501 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["lebanon"]) { const cities = window.LOCATION_DATA["lebanon"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
