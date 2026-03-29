// ── DOMINICAN REPUBLIC: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["dominican_republic"] = { "Distrito Nacional": { "santo domingo": { lat: 18.486, lon: -69.931 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["dominican_republic"]) { const cities = window.LOCATION_DATA["dominican_republic"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
