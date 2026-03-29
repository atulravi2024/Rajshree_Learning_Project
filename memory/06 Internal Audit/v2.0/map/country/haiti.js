// ── HAITI: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["haiti"] = { "Ouest Department": { "port-au-prince": { lat: 18.539, lon: -72.335 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["haiti"]) { const cities = window.LOCATION_DATA["haiti"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
