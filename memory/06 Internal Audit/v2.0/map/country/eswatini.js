// ── ESWATINI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["eswatini"] = { "Hhohho Region": { "mbabane": { lat: -26.317, lon: 31.133 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["eswatini"]) { const cities = window.LOCATION_DATA["eswatini"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
