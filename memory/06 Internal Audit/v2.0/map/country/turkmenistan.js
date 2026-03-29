// ── TURKMENISTAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["turkmenistan"] = { "Ashgabat": { "ashgabat": { lat: 37.950, lon: 58.383 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["turkmenistan"]) { const cities = window.LOCATION_DATA["turkmenistan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
