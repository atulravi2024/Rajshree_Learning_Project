// ── KYRGYZSTAN: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["kyrgyzstan"] = { "Bishkek": { "bishkek": { lat: 42.871, lon: 74.592 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["kyrgyzstan"]) { const cities = window.LOCATION_DATA["kyrgyzstan"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
