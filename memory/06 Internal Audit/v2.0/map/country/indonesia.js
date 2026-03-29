// ── INDONESIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["indonesia"] = { "Jakarta": { "jakarta": { lat: -6.208, lon: 106.845 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["indonesia"]) { const cities = window.LOCATION_DATA["indonesia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
