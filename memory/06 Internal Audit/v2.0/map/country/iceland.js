// ── ICELAND: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["iceland"] = { "Capital Region": { "reykjavik": { lat: 64.126, lon: -21.817 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["iceland"]) { const cities = window.LOCATION_DATA["iceland"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
