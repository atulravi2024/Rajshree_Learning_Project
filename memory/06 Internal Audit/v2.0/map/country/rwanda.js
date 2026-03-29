// ── RWANDA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["rwanda"] = { "Kigali": { "kigali": { lat: -1.944, lon: 30.062 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["rwanda"]) { const cities = window.LOCATION_DATA["rwanda"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
