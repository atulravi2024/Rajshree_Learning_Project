// ── ANDORRA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["andorra"] = { "Andorra la Vella": { "andorra la vella": { lat: 42.506, lon: 1.521 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["andorra"]) { const cities = window.LOCATION_DATA["andorra"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
