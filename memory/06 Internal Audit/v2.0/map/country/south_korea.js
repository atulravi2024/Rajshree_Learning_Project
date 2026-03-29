// ── SOUTH KOREA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["south_korea"] = { "Seoul": { "seoul": { lat: 37.566, lon: 126.978 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["south_korea"]) { const cities = window.LOCATION_DATA["south_korea"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
