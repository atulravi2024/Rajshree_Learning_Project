// ── BAHRAIN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["bahrain"] = { "Capital Governorate": { "manama": { lat: 26.228, lon: 50.586 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["bahrain"]) { const cities = window.LOCATION_DATA["bahrain"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
