// ── EQUATORIAL GUINEA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["equatorial_guinea"] = { "Bioko Norte": { "malabo": { lat: 3.750, lon: 8.783 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["equatorial_guinea"]) { const cities = window.LOCATION_DATA["equatorial_guinea"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
