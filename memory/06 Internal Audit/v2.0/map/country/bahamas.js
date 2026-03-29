// ── BAHAMAS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["bahamas"] = { "New Providence": { "nassau": { lat: 25.044, lon: -77.350 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["bahamas"]) { const cities = window.LOCATION_DATA["bahamas"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
