// ── MALTA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["malta"] = { "Valletta": { "valletta": { lat: 35.899, lon: 14.515 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["malta"]) { const cities = window.LOCATION_DATA["malta"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
