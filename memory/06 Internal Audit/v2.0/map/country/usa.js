// US States and Cities Data
window.LOCATION_DATA = window.LOCATION_DATA || {};

window.LOCATION_DATA["usa"] = {
    "New York": {
        "new york": { lat: 40.712, lon: -74.006 }
    },
    "California": {
        "los angeles": { lat: 34.052, lon: -118.243 },
        "san diego": { lat: 32.715, lon: -117.161 },
        "san jose": { lat: 37.338, lon: -121.886 }
    },
    "Illinois": {
        "chicago": { lat: 41.878, lon: -87.629 }
    },
    "Texas": {
        "houston": { lat: 29.760, lon: -95.369 },
        "san antonio": { lat: 29.424, lon: -98.493 },
        "dallas": { lat: 32.776, lon: -96.797 },
        "austin": { lat: 30.267, lon: -97.743 }
    },
    "Arizona": {
        "phoenix": { lat: 33.448, lon: -112.074 }
    },
    "Pennsylvania": {
        "philadelphia": { lat: 39.952, lon: -75.165 }
    },
    "Washington": {
        "seattle": { lat: 47.606, lon: -122.332 }
    },
    "Colorado": {
        "denver": { lat: 39.739, lon: -104.990 }
    },
    "Florida": {
        "miami": { lat: 25.761, lon: -80.191 }
    },
    "Massachusetts": {
        "boston": { lat: 42.360, lon: -71.058 }
    },
    "Georgia": {
        "atlanta": { lat: 33.749, lon: -84.388 }
    },
    "Tennessee": {
        "nashville": { lat: 36.162, lon: -86.781 }
    },
    "Michigan": {
        "detroit": { lat: 42.331, lon: -83.045 }
    }
};

// Flatten to global dictionary for search compatibility
if (window.LOCATION_COORDS) {
    for (const state in window.LOCATION_DATA["usa"]) {
        const cities = window.LOCATION_DATA["usa"][state];
        for (const city in cities) {
            window.LOCATION_COORDS[city.toLowerCase()] = cities[city];
        }
    }
}
