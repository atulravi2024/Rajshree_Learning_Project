// ── LATVIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["latvia"] = { "Riga": { "riga": { lat: 56.949, lon: 24.105 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["latvia"]) { const cities = window.LOCATION_DATA["latvia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
