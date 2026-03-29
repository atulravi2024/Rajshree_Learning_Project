// ── TRINIDAD AND TOBAGO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["trinidad_and_tobago"] = { "Port of Spain": { "port of spain": { lat: 10.667, lon: -61.517 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["trinidad_and_tobago"]) { const cities = window.LOCATION_DATA["trinidad_and_tobago"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
