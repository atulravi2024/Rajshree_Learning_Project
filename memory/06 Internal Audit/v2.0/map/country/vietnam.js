// ── VIETNAM: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["vietnam"] = { "Hanoi": { "hanoi": { lat: 21.028, lon: 105.834 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["vietnam"]) { const cities = window.LOCATION_DATA["vietnam"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
