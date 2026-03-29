// ── NAMIBIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["namibia"] = { "Khomas": { "windhoek": { lat: -22.567, lon: 17.083 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["namibia"]) { const cities = window.LOCATION_DATA["namibia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
