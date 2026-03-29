// ── TAIWAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["taiwan"] = { "Taipei City": { "taipei": { lat: 25.033, lon: 121.565 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["taiwan"]) { const cities = window.LOCATION_DATA["taiwan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
