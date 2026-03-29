// ── URUGUAY: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["uruguay"] = { "Montevideo": { "montevideo": { lat: -34.901, lon: -56.167 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["uruguay"]) { const cities = window.LOCATION_DATA["uruguay"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
