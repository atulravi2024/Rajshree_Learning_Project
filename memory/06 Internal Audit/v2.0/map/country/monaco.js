// ── MONACO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["monaco"] = { "Monaco": { "monaco": { lat: 43.733, lon: 7.417 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["monaco"]) { const cities = window.LOCATION_DATA["monaco"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
