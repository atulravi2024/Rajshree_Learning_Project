// map_distance.js - Real-time distance and time calculations for routes

/**
 * Calculates the Great Circle distance (Globe Distance) in kilometers
 * using the Haversine formula.
 */
function calculateGlobeDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
}

/**
 * Calculates actual distance based on route alignment type.
 */
function calculateActualDistance(globeDistance, pathType) {
    // Curve adds 15%, Straight is 1:1, Orbital adds 30% wrapper distance
    let factor = 1.0;
    if (pathType === 'curve') factor = 1.15;
    else if (pathType === 'circle') factor = 1.30;
    
    return Math.round(globeDistance * factor);
}

/**
 * Calculates the travel time based on vehicle speed in km/h.
 */
function calculateTravelTime(distanceKm, pointerId) {
    const speeds = {
        'plane': 900,
        'jet': 3500,
        'rocket': 27000,
        'helicopter': 250,
        'drone': 150,
        'satellite': 28000,
        'train': 450,
        'bus': 100,
        'car': 120,
        'motorcycle': 150,
        'bicycle': 25,
        'walking': 5,
        'ship': 45,
        'submarine': 70,
        'circle': 1000 // Default dot
    };
    
    const speed = speeds[pointerId] || 1000;
    const hours = distanceKm / speed;
    
    if (hours < 1) {
        return Math.round(hours * 60) + ' min';
    } else {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return h + 'h ' + (m > 0 ? m + 'm' : '');
    }
}

/**
 * Computes Delta compared to the fastest possible route (Rocket/Satellite).
 */
function calculateRouteDelta(distanceKm, pointerId) {
    const maxSpeed = 28000; // Satellite max speed
    const currentSpeedTable = {
        'plane': 900, 'jet': 3500, 'rocket': 27000, 'helicopter': 250,
        'drone': 150, 'satellite': 28000, 'train': 450, 'bus': 100,
        'car': 120, 'motorcycle': 150, 'bicycle': 25, 'walking': 5,
        'ship': 45, 'submarine': 70, 'circle': 1000
    };
    
    const speed = currentSpeedTable[pointerId] || 1000;
    
    if (speed >= maxSpeed) return `<span class="text-cyan">OPTIMAL</span>`;
    
    const bestHours = distanceKm / maxSpeed;
    const currentHours = distanceKm / speed;
    
    const diffHours = currentHours - bestHours;
    
    if (diffHours < 1) {
        return `<span class="text-red">+${Math.round(diffHours * 60)}m</span>`;
    } else {
        const h = Math.floor(diffHours);
        const m = Math.round((diffHours - h) * 60);
        return `<span class="text-red">+${h}h ${m}m</span>`;
    }
}

/**
 * Hook to update the Distance Metrics UI on the bottom navbar.
 */
window.updateNavbarMetrics = function(fromCoords, toCoords) {
    const metricsBar = document.getElementById('distance-metrics-bar');
    if (!metricsBar) return;
    
    if (!fromCoords || !toCoords) {
        metricsBar.classList.add('hidden');
        return;
    }
    
    const gDist = calculateGlobeDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
    
    // Get current UI states
    const pathType = window.SELECTED_PATH_TYPE || 'curve';
    const pointerId = window.SELECTED_POINTER_ICON || 'circle';
    
    const aDist = calculateActualDistance(gDist, pathType);
    const tTime = calculateTravelTime(aDist, pointerId);
    const delta = calculateRouteDelta(aDist, pointerId);
    
    const elActual = document.getElementById('metric-actual');
    const elGlobe = document.getElementById('metric-globe');
    const elTime = document.getElementById('metric-time');
    const elDelta = document.getElementById('metric-delta');
    
    if (elActual) elActual.innerText = aDist.toLocaleString() + ' KM';
    if (elGlobe) elGlobe.innerText = gDist.toLocaleString() + ' KM';
    if (elTime) elTime.innerText = tTime;
    if (elDelta) elDelta.innerHTML = delta;
    
    metricsBar.classList.remove('hidden');
    
    // Animate the values to draw attention
    metricsBar.classList.add('pulse-light');
    setTimeout(() => metricsBar.classList.remove('pulse-light'), 600);
    if (window.lucide) window.lucide.createIcons({ scope: metricsBar });
};
