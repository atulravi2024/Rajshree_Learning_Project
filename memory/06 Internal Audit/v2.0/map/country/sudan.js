// ── SUDAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["sudan"] = { "Khartoum": { "khartoum": { lat: 15.501, lon: 32.526 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["sudan"]) { const cities = window.LOCATION_DATA["sudan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
