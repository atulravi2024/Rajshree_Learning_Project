// ── NICARAGUA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["nicaragua"] = { "Managua": { "managua": { lat: 12.136, lon: -86.251 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["nicaragua"]) { const cities = window.LOCATION_DATA["nicaragua"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
