// ── POLAND: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["poland"] = { "Masovian Voivodeship": { "warsaw": { lat: 52.229, lon: 21.012 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["poland"]) { const cities = window.LOCATION_DATA["poland"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
