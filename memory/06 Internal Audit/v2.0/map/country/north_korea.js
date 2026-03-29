// ── NORTH KOREA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["north_korea"] = { "Pyongyang": { "pyongyang": { lat: 39.039, lon: 125.762 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["north_korea"]) { const cities = window.LOCATION_DATA["north_korea"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
