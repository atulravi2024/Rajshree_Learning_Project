// ── SAINT LUCIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["st_lucia"] = { "Castries": { "castries": { lat: 14.010, lon: -60.987 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["st_lucia"]) { const cities = window.LOCATION_DATA["st_lucia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
