// ── CHINA: States and Cities ──
window.LOCATION_DATA = window.LOCATION_DATA || {};
window.LOCATION_DATA["china"] = {
    "Beijing": {
        "beijing": { lat: 39.904, lon: 116.407 }
    },
    "Shanghai": {
        "shanghai": { lat: 31.230, lon: 121.473 }
    }
};

if (window.LOCATION_COORDS) {
    for (const state in window.LOCATION_DATA["china"]) {
        const cities = window.LOCATION_DATA["china"][state];
        for (const city in cities) window.LOCATION_COORDS[city.toLowerCase()] = cities[city];
    }
}
