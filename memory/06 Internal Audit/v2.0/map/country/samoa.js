// ── SAMOA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["samoa"] = { "Tuamasaga": { "apia": { lat: -13.833, lon: -171.767 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["samoa"]) { const cities = window.LOCATION_DATA["samoa"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
