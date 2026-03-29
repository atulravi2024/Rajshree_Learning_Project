// ── PERU: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["peru"] = { "Lima Province": { "lima": { lat: -12.046, lon: -77.042 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["peru"]) { const cities = window.LOCATION_DATA["peru"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
