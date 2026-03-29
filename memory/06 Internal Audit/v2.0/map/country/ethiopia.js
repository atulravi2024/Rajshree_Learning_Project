// ── ETHIOPIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["ethiopia"] = { "Addis Ababa": { "addis ababa": { lat: 9.030, lon: 38.740 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["ethiopia"]) { const cities = window.LOCATION_DATA["ethiopia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
