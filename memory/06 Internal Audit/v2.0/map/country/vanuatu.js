// ── VANUATU: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["vanuatu"] = { "Shefa": { "port vila": { lat: -17.733, lon: 168.327 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["vanuatu"]) { const cities = window.LOCATION_DATA["vanuatu"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
