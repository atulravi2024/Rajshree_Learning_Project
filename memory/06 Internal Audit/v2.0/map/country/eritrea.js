// ── ERITREA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["eritrea"] = { "Maekel": { "asmara": { lat: 15.333, lon: 38.933 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["eritrea"]) { const cities = window.LOCATION_DATA["eritrea"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
