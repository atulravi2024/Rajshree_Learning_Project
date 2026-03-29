// ── MADAGASCAR: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["madagascar"] = { "Analamanga": { "antananarivo": { lat: -18.879, lon: 47.507 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["madagascar"]) { const cities = window.LOCATION_DATA["madagascar"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
