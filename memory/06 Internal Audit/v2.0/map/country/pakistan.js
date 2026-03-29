// ── PAKISTAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["pakistan"] = { "Sindh": { "karachi": { lat: 24.860, lon: 67.001 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["pakistan"]) { const cities = window.LOCATION_DATA["pakistan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
