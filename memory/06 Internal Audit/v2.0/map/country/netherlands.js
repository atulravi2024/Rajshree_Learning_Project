// ── NETHERLANDS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["netherlands"] = { "North Holland": { "amsterdam": { lat: 52.370, lon: 4.895 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["netherlands"]) { const cities = window.LOCATION_DATA["netherlands"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
