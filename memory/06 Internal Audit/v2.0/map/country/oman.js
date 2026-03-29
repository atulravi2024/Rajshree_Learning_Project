// ── OMAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["oman"] = { "Muscat Governorate": { "muscat": { lat: 23.585, lon: 58.405 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["oman"]) { const cities = window.LOCATION_DATA["oman"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
