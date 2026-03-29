// ── UZBEKISTAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["uzbekistan"] = { "Tashkent": { "tashkent": { lat: 41.299, lon: 69.240 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["uzbekistan"]) { const cities = window.LOCATION_DATA["uzbekistan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
