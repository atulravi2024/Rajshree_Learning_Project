// ── NIGER: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["niger"] = { "Niamey": { "niamey": { lat: 13.511, lon: 2.125 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["niger"]) { const cities = window.LOCATION_DATA["niger"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
