// ── SAUDI ARABIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["saudi_arabia"] = { "Riyadh Province": { "riyadh": { lat: 24.713, lon: 46.675 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["saudi_arabia"]) { const cities = window.LOCATION_DATA["saudi_arabia"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
