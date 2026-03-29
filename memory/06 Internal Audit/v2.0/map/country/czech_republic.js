// ── CZECH REPUBLIC: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["czech_republic"] = { "Prague": { "prague": { lat: 50.075, lon: 14.437 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["czech_republic"]) { const cities = window.LOCATION_DATA["czech_republic"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
