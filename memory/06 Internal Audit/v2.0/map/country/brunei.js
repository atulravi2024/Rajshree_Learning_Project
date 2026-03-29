// ── BRUNEI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["brunei"] = { "Brunei-Muara": { "bandar seri begawan": { lat: 4.890, lon: 114.940 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["brunei"]) { const cities = window.LOCATION_DATA["brunei"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
