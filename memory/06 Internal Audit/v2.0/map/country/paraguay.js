// ── PARAGUAY: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["paraguay"] = { "Capital District": { "asuncion": { lat: -25.263, lon: -57.575 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["paraguay"]) { const cities = window.LOCATION_DATA["paraguay"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
