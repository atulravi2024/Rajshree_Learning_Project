// ── CHILE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["chile"] = { "Santiago Metropolitan Region": { "santiago": { lat: -33.448, lon: -70.669 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["chile"]) { const cities = window.LOCATION_DATA["chile"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
