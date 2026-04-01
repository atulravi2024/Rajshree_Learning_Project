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
window.updateNavbarMetrics = function(fromCoords, toCoords, viaCoords = null) {
    const metricsBar = document.getElementById('distance-metrics-bar');
    if (!metricsBar) return;
    
    if (!fromCoords || !toCoords) {
        metricsBar.classList.add('hidden');
        return;
    }
    
    let gDist = 0;
    if (viaCoords) {
        const d1 = calculateGlobeDistance(fromCoords.lat, fromCoords.lon, viaCoords.lat, viaCoords.lon);
        const d2 = calculateGlobeDistance(viaCoords.lat, viaCoords.lon, toCoords.lat, toCoords.lon);
        gDist = d1 + d2;
    } else {
        gDist = calculateGlobeDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
    }
    
    // Get current UI states
    const pathType = window.SELECTED_PATH_TYPE || 'curve';
    const pointerId = window.SELECTED_POINTER_ICON || 'circle';
    
    const aDist = calculateActualDistance(gDist, pathType);
    const tTime = calculateTravelTime(aDist, pointerId);
    const delta = calculateRouteDelta(aDist, pointerId);
    
    const elActual = document.getElementById('metric-actual');
    const elGlobe = document.getElementById('metric-globe-popup');
    const elTime = document.getElementById('metric-time');
    const elDelta = document.getElementById('metric-delta-popup');
    const elSpeed = document.getElementById('metric-speed');
    const elSignal = document.getElementById('metric-signal');
    
    if (elActual) elActual.innerText = aDist.toLocaleString() + ' KM';
    if (elGlobe) elGlobe.innerText = gDist.toLocaleString() + ' KM';
    if (elTime) elTime.innerText = tTime;
    if (elDelta) elDelta.innerHTML = delta;

    if (elSpeed) {
        const speeds = { 'plane': 900, 'jet': 3500, 'rocket': 27000, 'helicopter': 250, 'drone': 150, 'satellite': 28000, 'train': 450, 'bus': 100, 'car': 120, 'motorcycle': 150, 'bicycle': 25, 'walking': 5, 'ship': 45, 'submarine': 70, 'circle': 1000 };
        const speed = speeds[pointerId] || 1000;
        elSpeed.innerText = speed.toLocaleString() + ' KM/H';
    }
    if (elSignal) {
        const strength = Math.random() > 0.1 ? 'OPTIMAL' : 'INTERFERENCE';
        elSignal.innerText = strength;
        elSignal.className = strength === 'OPTIMAL' ? 'text-bright' : 'text-yellow';
    }

    // ── EFFICIENCY ANALYSIS LOGIC ──
    const speedsRes = { 'plane': 900, 'jet': 3500, 'rocket': 27000, 'helicopter': 250, 'drone': 150, 'satellite': 28000, 'train': 450, 'bus': 100, 'car': 120, 'motorcycle': 150, 'bicycle': 25, 'walking': 5, 'ship': 45, 'submarine': 70, 'circle': 1000 };
    const fastestSpeed = 28000;
    const currentSpeed = speedsRes[pointerId] || 1000;
    
    const fastestHours = aDist / fastestSpeed;
    const currentHours = aDist / currentSpeed;
    const diffHours = currentHours - fastestHours;
    
    let gapText = '--';
    if (diffHours <= 0.01) {
        gapText = 'OPTIMAL';
    } else if (diffHours < 1) {
        gapText = `+${Math.round(diffHours * 60)}M LOSS`;
    } else {
        const h = Math.floor(diffHours);
        const m = Math.round((diffHours - h) * 60);
        gapText = `+${h}H ${m}M LOSS`;
    }

    const elEffGap = document.getElementById('eff-gap-value');
    const elEffBarCurrent = document.getElementById('eff-bar-current');
    const elEffBarFastest = document.getElementById('eff-bar-fastest');
    const elEffCurrentName = document.getElementById('eff-current-name');
    const elEffCurrentIcon = document.getElementById('eff-current-icon');
    const elEffRecText = document.getElementById('eff-recommendation-text');

    if (elEffGap) {
        elEffGap.innerText = gapText;
        elEffGap.className = gapText === 'OPTIMAL' ? 'text-cyan' : 'text-red';
    }
    
    if (elEffBarFastest) elEffBarFastest.style.width = '100%';
    if (elEffBarCurrent) {
        const ratio = (currentSpeed / fastestSpeed) * 100;
        elEffBarCurrent.style.width = Math.max(2, Math.min(100, ratio)) + '%';
    }

    if (elEffCurrentName) elEffCurrentName.innerText = (pointerId || 'CIRCLE').toUpperCase();
    if (elEffCurrentIcon) {
        elEffCurrentIcon.setAttribute('data-lucide', pointerId || 'circle');
        if (window.lucide) window.lucide.createIcons({ scope: document.getElementById('eff-current-container') });
    }

    if (elEffRecText) {
        if (currentSpeed >= fastestSpeed) {
            elEffRecText.innerText = 'PEAK EFFICIENCY ACHIEVED.';
        } else if (currentSpeed < 500) {
            elEffRecText.innerText = 'CRITICAL DELAY: SWITCH TO JET/ROCKET.';
        } else if (currentSpeed < 5000) {
            elEffRecText.innerText = 'OPTIMIZATION POSSIBLE: USE ORBITAL PATH.';
        } else {
            elEffRecText.innerText = 'MINOR LATENCY: ASSESS FUEL PROTOCOLS.';
        }
    }
    
    // Show only if Search bar is active
    if (window._manualSearchToggle) {
        metricsBar.classList.remove('hidden');
        // Animate the values to draw attention
        metricsBar.classList.add('pulse-light');
        setTimeout(() => metricsBar.classList.remove('pulse-light'), 600);
        if (window.lucide) window.lucide.createIcons({ scope: metricsBar });
    } else {
        metricsBar.classList.add('hidden');
    }
};
