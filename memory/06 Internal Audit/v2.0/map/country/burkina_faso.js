// ── BURKINA FASO: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["burkina_faso"] = { "Centre": { "ouagadougou": { lat: 12.367, lon: -1.533 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["burkina_faso"]) { const cities = window.LOCATION_DATA["burkina_faso"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
