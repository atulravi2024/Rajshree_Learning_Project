// ── GUINEA-BISSAU: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["guinea_bissau"] = { "Bissau": { "bissau": { lat: 11.860, lon: -15.597 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["guinea_bissau"]) { const cities = window.LOCATION_DATA["guinea_bissau"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
