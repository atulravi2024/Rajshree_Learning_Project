// ── SOUTH AFRICA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["south_africa"] = { "Western Cape": { "cape town": { lat: -33.924, lon: 18.423 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["south_africa"]) { const cities = window.LOCATION_DATA["south_africa"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
