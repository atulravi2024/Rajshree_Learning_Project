// ── MAURITIUS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["mauritius"] = { "Port Louis": { "port louis": { lat: -20.165, lon: 57.502 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["mauritius"]) { const cities = window.LOCATION_DATA["mauritius"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
