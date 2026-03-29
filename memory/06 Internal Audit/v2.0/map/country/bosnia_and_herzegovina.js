// ── BOSNIA AND HERZEGOVINA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["bosnia_and_herzegovina"] = { "Sarajevo": { "sarajevo": { lat: 43.856, lon: 18.413 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["bosnia_and_herzegovina"]) { const cities = window.LOCATION_DATA["bosnia_and_herzegovina"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
