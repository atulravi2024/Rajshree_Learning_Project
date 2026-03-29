// ── MYANMAR: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["myanmar"] = { "Naypyidaw Union Territory": { "naypyidaw": { lat: 19.763, lon: 96.078 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["myanmar"]) { const cities = window.LOCATION_DATA["myanmar"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
