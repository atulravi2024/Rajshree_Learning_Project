// ── VENEZUELA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["venezuela"] = { "Capital District": { "caracas": { lat: 10.480, lon: -66.903 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["venezuela"]) { const cities = window.LOCATION_DATA["venezuela"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
