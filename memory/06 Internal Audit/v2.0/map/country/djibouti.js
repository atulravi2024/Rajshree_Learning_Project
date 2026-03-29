// ── DJIBOUTI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["djibouti"] = { "Djibouti": { "djibouti city": { lat: 11.588, lon: 43.145 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["djibouti"]) { const cities = window.LOCATION_DATA["djibouti"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
