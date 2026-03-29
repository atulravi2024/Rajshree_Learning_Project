// ── PALESTINE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["palestine"] = { "Jerusalem Governorate": { "east jerusalem": { lat: 31.768, lon: 35.213 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["palestine"]) { const cities = window.LOCATION_DATA["palestine"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
