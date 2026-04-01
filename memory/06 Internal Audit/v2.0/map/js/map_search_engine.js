// Search Aliases for common variations
window.MAP_SEARCH_ALIASES = {
    "bangalore": "bengaluru",
    "bombay": "mumbai",
    "madras": "chennai",
    "calcutta": "kolkata",
    "banaras": "varanasi",
    "pondy": "puducherry",
    "trichy": "tiruchirappalli",
    "baroda": "vadodara",
    "cochin": "kochi"
};

/**
 * Searches through all available datasets for location coordinates.
 * Robust implementation as per "Anyway from Anyway" directive.
 */
function searchDeepLocation(name) {
    if (!name) return null;
    let q = name.toLowerCase().trim();

    // 1. Alias/Synonym redirection
    if (window.MAP_SEARCH_ALIASES[q]) {
        console.log(`[Search] Redirecting Alias: ${q} -> ${window.MAP_SEARCH_ALIASES[q]}`);
        q = window.MAP_SEARCH_ALIASES[q];
    }

    // 2. Check flat master list
    if (window.LOCATION_COORDS && window.LOCATION_COORDS[q]) return window.LOCATION_COORDS[q];

    // 3. Search in deep country data
    if (window.LOCATION_DATA) {
        // Collect potential fuzzy matches
        let fuzzyResults = [];

        for (const country in window.LOCATION_DATA) {
            const cData = window.LOCATION_DATA[country];
            
            // Country match
            if (country.toLowerCase() === q) return findNestedCoords(cData);

            for (const state in cData) {
                const sData = cData[state];
                
                // State match (Check for city with same name inside state first)
                if (state.toLowerCase() === q) {
                    if (sData[q]) return sData[q]; 
                    return findNestedCoords(sData);
                }

                if (typeof sData === 'object') {
                    for (const city in sData) {
                        const lowCity = city.toLowerCase();
                        
                        // Exact city match
                        if (lowCity === q) return sData[city];
                        
                        // Collect for fuzzy if exact fail
                        if (lowCity.includes(q) || q.includes(lowCity)) {
                            fuzzyResults.push(sData[city]);
                        }
                    }
                }
            }
        }

        // 4. Return first fuzzy match if no exact match found
        if (fuzzyResults.length > 0) {
            console.log(`[Search] No exact match for "${name}". Returning best fuzzy match.`);
            return fuzzyResults[0];
        }
    }
    
    console.warn(`[Search] Location NOT found: ${name}`);
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

// ── AUTO-COMPLETE ENGINE (LOCAL ONLY) ──────────────────

window.SUGGESTIONS_ENABLED = true;
let _suggestionDebounceTimer = null;

function initAutocomplete(fromInput, viaInput, toInput) {
    const suggestionsContainer = document.getElementById('map-search-suggestions');
    const toggleBtn = document.getElementById('btn-suggestion-toggle');

    if (!fromInput || !toInput || !suggestionsContainer) return;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            window.SUGGESTIONS_ENABLED = !window.SUGGESTIONS_ENABLED;
            toggleBtn.classList.toggle('active', window.SUGGESTIONS_ENABLED);
            if (!window.SUGGESTIONS_ENABLED) hideSuggestions();
            if (window.playSound) window.playSound('UI_GENERIC_TAP');
        });
    }

    const handleInput = (e) => {
        if (!window.SUGGESTIONS_ENABLED) return;
        const query = e.target.value.trim();

        clearTimeout(_suggestionDebounceTimer);
        if (query.length < 3) {
            hideSuggestions();
            return;
        }

        _suggestionDebounceTimer = setTimeout(() => {
            const results = findSuggestionsRecursive(query);
            if (results.length > 0) {
                renderSuggestionsUI(results, e.target);
            } else {
                hideSuggestions();
            }
        }, 300);
    };

    fromInput.addEventListener('input', handleInput);
    if (viaInput) viaInput.addEventListener('input', handleInput);
    toInput.addEventListener('input', handleInput);

    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== fromInput && (viaInput ? e.target !== viaInput : true) && e.target !== toInput) {
            hideSuggestions();
        }
    });
}

function findSuggestionsRecursive(query) {
    const q = query.toLowerCase();
    const results = [];
    const data = window.LOCATION_DATA;
    if (!data) return [];

    for (const country in data) {
        const states = data[country];
        for (const state in states) {
            const cities = states[state];
            if (typeof cities === 'object') {
                for (const city in cities) {
                    if (city.toLowerCase().includes(q)) {
                        results.push({
                            city: city.charAt(0).toUpperCase() + city.slice(1),
                            state: state,
                            country: country.charAt(0).toUpperCase() + country.slice(1),
                            coords: cities[city]
                        });
                        if (results.length >= 5) return results; // TOP 5 LIMIT
                    }
                }
            }
        }
    }
    return results;
}

function renderSuggestionsUI(results, inputRef) {
    const container = document.getElementById('map-search-suggestions');
    if (!container) return;

    container.innerHTML = '';
    results.forEach(res => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <i data-lucide="map-pin" style="width:12px; height:12px; opacity:0.7;"></i>
            <div class="suggestion-text">
                <span class="city-name">${res.city}</span>
                <span class="state-country">${res.state}, ${res.country}</span>
            </div>
        `;
        item.onclick = () => {
            inputRef.value = res.city;
            hideSuggestions();
            if (window.rotateGlobeToCoords) window.rotateGlobeToCoords(res.coords.lat, res.coords.lon);
            if (window.playSound) window.playSound('UI_CLICK');
        };
        container.appendChild(item);
    });

    if (window.lucide) window.lucide.createIcons({ scope: container });
    container.classList.add('active');
}

function hideSuggestions() {
    const container = document.getElementById('map-search-suggestions');
    if (container) container.classList.remove('active');
}
