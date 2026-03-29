// ── TONGA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["tonga"] = { "Tongatapu": { "nuku'alofa": { lat: -21.139, lon: -175.204 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["tonga"]) { const cities = window.LOCATION_DATA["tonga"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
