// ── CYPRUS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["cyprus"] = { "Nicosia District": { "nicosia": { lat: 35.185, lon: 33.382 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["cyprus"]) { const cities = window.LOCATION_DATA["cyprus"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
