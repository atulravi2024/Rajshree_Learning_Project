// ── SAINT KITTS AND NEVIS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["st_kitts_and_nevis"] = { "Saint George Basseterre": { "basseterre": { lat: 17.296, lon: -62.726 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["st_kitts_and_nevis"]) { const cities = window.LOCATION_DATA["st_kitts_and_nevis"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
