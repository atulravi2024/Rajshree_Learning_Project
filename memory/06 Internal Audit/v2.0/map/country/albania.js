// ── ALBANIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["albania"] = { "Tirana": { "tirana": { lat: 41.327, lon: 19.818 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["albania"]) { const cities = window.LOCATION_DATA["albania"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
