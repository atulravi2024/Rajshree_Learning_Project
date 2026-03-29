// ── NEW ZEALAND: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["new_zealand"] = { "Wellington": { "wellington": { lat: -41.286, lon: 174.776 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["new_zealand"]) { const cities = window.LOCATION_DATA["new_zealand"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
