// ── SURINAME: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["suriname"] = { "Paramaribo": { "paramaribo": { lat: 5.866, lon: -55.167 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["suriname"]) { const cities = window.LOCATION_DATA["suriname"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
