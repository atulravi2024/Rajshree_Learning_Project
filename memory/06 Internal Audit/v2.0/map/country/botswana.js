// ── BOTSWANA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["botswana"] = { "South East District": { "gaborone": { lat: -24.658, lon: 25.912 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["botswana"]) { const cities = window.LOCATION_DATA["botswana"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
