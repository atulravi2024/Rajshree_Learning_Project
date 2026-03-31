// map_search.js - Location Search Engine for the Holographic Map

/**
 * Searches through all available datasets for location coordinates.
 */
function searchDeepLocation(name) {
    if (!name) return null;
    const q = name.toLowerCase().trim();

    // 1. Check flat master list
    if (window.LOCATION_COORDS && window.LOCATION_COORDS[q]) return window.LOCATION_COORDS[q];

    // 2. Search deep in country data
    if (window.LOCATION_DATA) {
        for (const country in window.LOCATION_DATA) {
            const cData = window.LOCATION_DATA[country];
            if (country.toLowerCase() === q) return findNestedCoords(cData);

            for (const state in cData) {
                const sData = cData[state];
                if (state.toLowerCase() === q) return findNestedCoords(sData);

                if (typeof sData === 'object') {
                    for (const city in sData) {
                        if (city.toLowerCase() === q) return sData[city];
                    }
                }
            }
        }
    }
    return null;
}

function findNestedCoords(obj) {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.lat && obj.lon) return obj;
    for (const key in obj) {
        const res = findNestedCoords(obj[key]);
        if (res) return res;
    }
    return null;
}

function initGlobalSearch() {
    const fromInput = document.getElementById('map-search-from');
    const toInput = document.getElementById('map-search-to');
    const runBtn = document.getElementById('btn-run-search');
    const container = document.getElementById('global-search-container');

    if (!fromInput || !toInput || !runBtn) return;

    if (window.lucide) window.lucide.createIcons();

    function executeSearch() {
        const from = fromInput.value.trim();
        const to = toInput.value.trim();
        
        console.log(`Pathfinding Request: ${from} -> ${to}`);

        const fromCoords = searchDeepLocation(from);
        const toCoords = searchDeepLocation(to);

        if (fromCoords && toCoords) {
            drawQuantumPath(fromCoords, toCoords);
            window.rotateGlobeToCoords(toCoords.lat, toCoords.lon);
            runBtn.style.transform = 'scale(0.9)';
            setTimeout(() => runBtn.style.transform = '', 100);
            if (window.playSound) window.playSound('UI_QUANTUM_LOCK');
        } else if (toCoords) {
            window.rotateGlobeToCoords(toCoords.lat, toCoords.lon);
        } else if (fromCoords) {
            window.rotateGlobeToCoords(fromCoords.lat, fromCoords.lon);
        } else {
            container.classList.add('error-shake');
            setTimeout(() => container.classList.remove('error-shake'), 400);
            if (window.playSound) window.playSound('UI_ERROR');
        }
    }

    fromInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeSearch(); });
    toInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') executeSearch(); });
    runBtn.addEventListener('click', executeSearch);

    // Initial check (delay to allow datasets to load)
    setTimeout(() => {
        if (fromInput.value && toInput.value) executeSearch();
    }, 2000);
}
