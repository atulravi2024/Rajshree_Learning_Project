// ── DEMOCRATIC REPUBLIC OF THE CONGO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["drc"] = { "Kinshasa": { "kinshasa": { lat: -4.441, lon: 15.266 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["drc"]) { const cities = window.LOCATION_DATA["drc"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
