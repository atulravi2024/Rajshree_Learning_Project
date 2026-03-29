// ── KOSOVO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["kosovo"] = { "Prishtina": { "prishtina": { lat: 42.662, lon: 21.165 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["kosovo"]) { const cities = window.LOCATION_DATA["kosovo"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
