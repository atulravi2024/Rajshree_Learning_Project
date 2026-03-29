// ── JORDAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["jordan"] = { "Amman Governorate": { "amman": { lat: 31.945, lon: 35.928 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["jordan"]) { const cities = window.LOCATION_DATA["jordan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
