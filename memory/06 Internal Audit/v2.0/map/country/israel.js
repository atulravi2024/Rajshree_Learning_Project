// ── ISRAEL: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["israel"] = { "Jerusalem": { "jerusalem": { lat: 31.768, lon: 35.214 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["israel"]) { const cities = window.LOCATION_DATA["israel"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
