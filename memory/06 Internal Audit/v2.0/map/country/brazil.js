// ── BRAZIL: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["brazil"] = {
    "Sao Paulo": {
        "sao paulo": { lat: -23.550, lon: -46.633 }
    },
    "Rio de Janeiro": {
        "rio de janeiro": { lat: -22.906, lon: -43.172 }
    }
};

if (window.LOCATION_COORDS) {
    for (const state in window.LOCATION_DATA["brazil"]) {
        const cities = window.LOCATION_DATA["brazil"][state];
        for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city];
    }
}
