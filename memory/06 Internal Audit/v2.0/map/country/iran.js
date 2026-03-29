// ── IRAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["iran"] = { "Tehran": { "tehran": { lat: 35.689, lon: 51.389 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["iran"]) { const cities = window.LOCATION_DATA["iran"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
