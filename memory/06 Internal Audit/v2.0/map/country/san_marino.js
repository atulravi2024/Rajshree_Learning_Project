// ── SAN MARINO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["san_marino"] = { "San Marino": { "san marino": { lat: 43.942, lon: 12.457 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["san_marino"]) { const cities = window.LOCATION_DATA["san_marino"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
