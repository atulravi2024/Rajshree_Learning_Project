// ── SAO TOME AND PRINCIPE: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["sao_tome_and_principe"] = { "Sao Tome": { "sao tome": { lat: 0.333, lon: 6.733 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["sao_tome_and_principe"]) { const cities = window.LOCATION_DATA["sao_tome_and_principe"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
