// Indian States and Cities Data
window.LOCATION_DATA = window.LOCATION_DATA || {};

window.LOCATION_DATA["india"] = {
    "Maharashtra": {
        "mumbai": { lat: 19.076, lon: 72.877 },
        "pune": { lat: 18.520, lon: 73.856 },
        "nagpur": { lat: 21.145, lon: 79.088 },
        "thane": { lat: 19.218, lon: 72.978 },
        "pimpri-chinchwad": { lat: 18.629, lon: 73.799 },
        "nashik": { lat: 19.997, lon: 73.789 },
        "kalyan-dombivli": { lat: 19.235, lon: 73.129 },
        "vasai-virar": { lat: 19.391, lon: 72.839 },
        "aurangabad": { lat: 19.876, lon: 75.343 },
        "navi mumbai": { lat: 19.033, lon: 73.029 },
        "solapur": { lat: 17.659, lon: 75.906 },
        "mira-bhayandar": { lat: 19.283, lon: 72.855 },
        "bhiwandi": { lat: 19.296, lon: 73.059 },
        "amravati": { lat: 20.931, lon: 77.752 },
        "nanded": { lat: 19.143, lon: 77.307 },
        "kolhapur": { lat: 16.700, lon: 74.243 },
        "ulhasnagar": { lat: 19.221, lon: 73.164 },
        "sangli": { lat: 16.852, lon: 74.581 },
        "malegaon": { lat: 20.550, lon: 74.530 },
        "jalgaon": { lat: 21.007, lon: 75.562 },
        "akola": { lat: 20.700, lon: 77.008 },
        "latur": { lat: 18.408, lon: 76.560 },
        "dhule": { lat: 20.904, lon: 74.774 },
        "ahmednagar": { lat: 19.094, lon: 74.747 },
        "chandrapur": { lat: 19.961, lon: 79.296 }
    },
    "Delhi": {
        "delhi": { lat: 28.704, lon: 77.102 },
        "new delhi": { lat: 28.613, lon: 77.209 }
    },
    "Uttar Pradesh": {
        "lucknow": { lat: 26.846, lon: 80.946 },
        "kanpur": { lat: 26.449, lon: 80.331 },
        "ghaziabad": { lat: 28.669, lon: 77.453 },
        "agra": { lat: 27.176, lon: 78.008 },
        "noida": { lat: 28.535, lon: 77.391 }
    },
    "Haryana": {
        "gurgaon": { lat: 28.459, lon: 77.026 }
    },
    "Karnataka": {
        "bangalore": { lat: 12.971, lon: 77.594 },
        "bengaluru": { lat: 12.971, lon: 77.594 },
        "mysore": { lat: 12.295, lon: 76.639 }
    },
    "Telangana": {
        "hyderabad": { lat: 17.385, lon: 78.486 },
        "warangal": { lat: 17.968, lon: 79.594 }
    },
    "Tamil Nadu": {
        "chennai": { lat: 13.082, lon: 80.270 },
        "coimbatore": { lat: 11.016, lon: 76.955 },
        "madurai": { lat: 9.925, lon: 78.119 }
    },
    "Gujarat": {
        "ahmedabad": { lat: 23.022, lon: 72.571 },
        "surat": { lat: 21.170, lon: 72.831 },
        "vadodara": { lat: 22.307, lon: 73.181 }
    },
    "Rajasthan": {
        "jaipur": { lat: 26.912, lon: 75.787 },
        "jodhpur": { lat: 26.238, lon: 73.024 }
    },
    "Bihar": {
        "patna": { lat: 25.594, lon: 85.137 },
        "gaya": { lat: 24.791, lon: 85.000 }
    },
    "Punjab": {
        "ludhiana": { lat: 30.900, lon: 75.857 },
        "amritsar": { lat: 31.634, lon: 74.872 }
    },
    "Madhya Pradesh": {
        "indore": { lat: 22.719, lon: 75.857 },
        "bhopal": { lat: 23.259, lon: 77.412 },
        "jabalpur": { lat: 23.181, lon: 79.986 }
    }
};

// Flatten to global dictionary for search compatibility
if (window.LOCATION_COORDS) {
    for (const state in window.LOCATION_DATA["india"]) {
        const cities = window.LOCATION_DATA["india"][state];
        for (const city in cities) {
            window.LOCATION_COORDS[city.toLowerCase()] = cities[city];
        }
        // Also add the state itself if needed, although state coords are not defined here
    }
}
