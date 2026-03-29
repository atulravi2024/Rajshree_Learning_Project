// ── MAURITANIA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["mauritania"] = { "Nouakchott": { "nouakchott": { lat: 18.086, lon: -15.973 } } };
if (window.LOCATION_COORDS) for (const state in window.LOCATION_DATA["mauritania"]) { const cities = window.LOCATION_DATA["mauritania"][state]; for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city]; }
