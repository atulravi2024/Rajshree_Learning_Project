// ── SLOVAKIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["slovakia"] = { "Bratislava": { "bratislava": { lat: 48.148, lon: 17.107 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["slovakia"]) { const cities = window.LOCATION_DATA["slovakia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
