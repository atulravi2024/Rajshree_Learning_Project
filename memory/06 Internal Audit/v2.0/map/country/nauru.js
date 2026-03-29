// ── NAURU: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["nauru"] = { "Yaren": { "yaren": { lat: -0.547, lon: 166.917 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["nauru"]) { const cities = window.LOCATION_DATA["nauru"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
