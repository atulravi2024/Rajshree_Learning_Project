// ── GRENADA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["grenada"] = { "Saint George": { "st george's": { lat: 12.053, lon: -61.748 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["grenada"]) { const cities = window.LOCATION_DATA["grenada"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
