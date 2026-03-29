// ── CENTRAL AFRICAN REPUBLIC: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["central_african_republic"] = { "Bangui": { "bangui": { lat: 4.367, lon: 18.583 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["central_african_republic"]) { const cities = window.LOCATION_DATA["central_african_republic"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
