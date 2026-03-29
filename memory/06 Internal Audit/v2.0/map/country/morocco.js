// ── MOROCCO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["morocco"] = { "Casablanca-Settat": { "casablanca": { lat: 33.573, lon: -7.589 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["morocco"]) { const cities = window.LOCATION_DATA["morocco"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
