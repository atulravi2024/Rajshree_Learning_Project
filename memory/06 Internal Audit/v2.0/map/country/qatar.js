// ── QATAR: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["qatar"] = { "Ad-Dawhah": { "doha": { lat: 25.285, lon: 51.531 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["qatar"]) { const cities = window.LOCATION_DATA["qatar"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
