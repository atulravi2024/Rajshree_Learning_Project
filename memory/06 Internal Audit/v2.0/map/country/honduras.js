// ── HONDURAS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["honduras"] = { "Francisco Morazan": { "tegucigalpa": { lat: 14.072, lon: -87.192 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["honduras"]) { const cities = window.LOCATION_DATA["honduras"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
