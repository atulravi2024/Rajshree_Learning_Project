// ── SRI LANKA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["sri_lanka"] = { "Western Province": { "colombo": { lat: 6.927, lon: 79.861 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["sri_lanka"]) { const cities = window.LOCATION_DATA["sri_lanka"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
