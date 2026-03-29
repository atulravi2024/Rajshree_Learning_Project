// ── COTE D'IVOIRE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["cote_divoire"] = { "Yamoussoukro": { "yamoussoukro": { lat: 6.816, lon: -5.273 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["cote_divoire"]) { const cities = window.LOCATION_DATA["cote_divoire"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
