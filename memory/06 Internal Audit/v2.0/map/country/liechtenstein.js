// ── LIECHTENSTEIN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["liechtenstein"] = { "Vaduz": { "vaduz": { lat: 47.141, lon: 9.521 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["liechtenstein"]) { const cities = window.LOCATION_DATA["liechtenstein"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
