// ── AUSTRALIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["australia"] = { "New South Wales": { "sydney": { lat: -33.868, lon: 151.209 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["australia"]) { const cities = window.LOCATION_DATA["australia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
