// ── TUVALU: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["tuvalu"] = { "Funafuti": { "funafuti": { lat: -8.517, lon: 179.217 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["tuvalu"]) { const cities = window.LOCATION_DATA["tuvalu"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
