// ── ARMENIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["armenia"] = { "Yerevan": { "yerevan": { lat: 40.177, lon: 44.513 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["armenia"]) { const cities = window.LOCATION_DATA["armenia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
