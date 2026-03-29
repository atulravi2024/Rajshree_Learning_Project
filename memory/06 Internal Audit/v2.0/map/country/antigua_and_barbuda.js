// ── ANTIGUA AND BARBUDA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["antigua_and_barbuda"] = { "Saint John": { "st john's": { lat: 17.118, lon: -61.845 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["antigua_and_barbuda"]) { const cities = window.LOCATION_DATA["antigua_and_barbuda"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
