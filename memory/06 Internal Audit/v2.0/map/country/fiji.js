// ── FIJI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["fiji"] = { "Central Division": { "suva": { lat: -18.141, lon: 178.441 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["fiji"]) { const cities = window.LOCATION_DATA["fiji"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
