// ── LIBERIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["liberia"] = { "Montserrado": { "monrovia": { lat: 6.301, lon: -10.797 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["liberia"]) { const cities = window.LOCATION_DATA["liberia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
