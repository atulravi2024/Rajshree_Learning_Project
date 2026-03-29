// ── SOLOMON ISLANDS: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["solomon_islands"] = { "Guadalcanal Province": { "honiara": { lat: -9.433, lon: 159.950 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["solomon_islands"]) { const cities = window.LOCATION_DATA["solomon_islands"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
