// ── MARSHALL ISLANDS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["marshall_islands"] = { "Majuro": { "majuro": { lat: 7.100, lon: 171.383 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["marshall_islands"]) { const cities = window.LOCATION_DATA["marshall_islands"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
