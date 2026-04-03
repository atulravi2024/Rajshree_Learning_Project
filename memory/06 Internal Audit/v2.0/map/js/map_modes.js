/**
 * map_modes.js — Globe Texture & Mode Management
 * Handles Satellite/Map switching, Light/Dark themes, and stylized Network Road rendering.
 */

window._mapViewMode = 'satellite'; // 'satellite' | 'map'
window._mapThemeMode = 'dark'; // 'light' | 'dark'
window._mapRoadsGroup = null;

const TEXTURE_URLS = {
    satellite_light: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
    satellite_dark: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg',
    map_light: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
    map_dark: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-dark.jpg'
};

const cachedTextures = {};

function initMapModes() {
    const loader = new THREE.TextureLoader();
    
    // Initial caching (lazy loading will handle others)
    cachedTextures.satellite_light = loader.load(TEXTURE_URLS.satellite_light);
    cachedTextures.satellite_dark = loader.load(TEXTURE_URLS.satellite_dark);
}

/**
 * Main switch function
 */
function setGlobeMode(mapType, theme) {
    if (!window._mapGlobeMat) return;
    
    window._mapViewMode = mapType || window._mapViewMode;
    window._mapThemeMode = theme || window._mapThemeMode;
    
    const modeKey = `${window._mapViewMode}_${window._mapThemeMode}`;
    const loader = new THREE.TextureLoader();
    
    // 1. Load texture if not cached
    if (!cachedTextures[modeKey]) {
        cachedTextures[modeKey] = loader.load(TEXTURE_URLS[modeKey]);
    }
    
    const targetTex = cachedTextures[modeKey];
    const mat = window._mapGlobeMat;
    
    // 2. Apply Texture & Tweak Material
    if (window._mapViewMode === 'satellite') {
        mat.map = targetTex;
        mat.bumpMap = targetTex;
        mat.bumpScale = 0.4;
        mat.emissiveIntensity = window._mapThemeMode === 'dark' ? 0.7 : 0.1;
        mat.color.setHex(window._mapThemeMode === 'dark' ? 0x0a1122 : 0xffffff);
        mat.shininess = 25;
        
        // Hide clouds in map mode? No, but maybe in Dark Map.
        if (window._mapCloudMesh) window._mapCloudMesh.visible = (window._mapThemeMode === 'light');
    } else {
        // Map / Atlas mode
        mat.map = targetTex;
        mat.bumpMap = null; // Flatter look for Atlas
        mat.emissiveIntensity = window._mapThemeMode === 'dark' ? 0.3 : 0.05;
        mat.color.setHex(window._mapThemeMode === 'dark' ? 0x112233 : 0xeeeeee);
        mat.shininess = 5;
        
        if (window._mapCloudMesh) window._mapCloudMesh.visible = false;
    }
    
    mat.needsUpdate = true;
    
    // 3. Toggle stylized Network Roads and Borders
    updateRoadNetwork();
    
    if (window.loadGeoBorders) {
        window.loadGeoBorders();
        if (window._mapBordersGroup) {
            window._mapBordersGroup.visible = (window._mapViewMode === 'map');
        }
    }
    
    // 4. Update Visual Boost if active
    if (typeof window.applyVisualBoostState === 'function') {
        window.applyVisualBoostState();
    }
}

/**
 * Generate stylized glowing spline lines between city nodes (simulating high-density data roads)
 */
function updateRoadNetwork() {
    if (!window._mapGlobe || !window.CITY_LABELS) return;
    
    const scene = window._mapGlobe.globeGroup;
    const isMapMode = window._mapViewMode === 'map';
    
    // Ensure group exists
    if (!window._mapRoadsGroup) {
        window._mapRoadsGroup = new THREE.Group();
        scene.add(window._mapRoadsGroup);
    }
    
    // Toggle visibility
    window._mapRoadsGroup.visible = isMapMode;
    
    if (isMapMode && window._mapRoadsGroup.children.length === 0) {
        // Create road network if first time
        generateRoads();
    }
}

function generateRoads() {
    const cities = window.CITY_LABELS;
    const roadColor = 0x00f0ff; // "Glowing Cyan" matching the theme
    const globeRadius = 90.3; // slightly above surface
    
    // Draw some stylized network connections (Roads)
    for (let i = 0; i < cities.length; i++) {
        // Connect each city to its next two neighbors in the list
        for (let j = 1; j <= 2; j++) {
            const nextIdx = (i + j) % cities.length;
            const startNode = cities[i];
            const endNode = cities[nextIdx];
            
            // Limit distance to keep road network local/sensible
            const dist = getLatLonDistance(startNode.lat, startNode.lon, endNode.lat, endNode.lon);
            if (dist < 4000) { // arbitrary sensible "local" distance
                const spline = createStylizedRoad(startNode, endNode, globeRadius, roadColor);
                window._mapRoadsGroup.add(spline);
            }
        }
    }
}

function createStylizedRoad(p1, p2, r, color) {
    const startVec = latLonToVec3(p1.lat, p1.lon, r);
    const endVec = latLonToVec3(p2.lat, p2.lon, r);
    
    // For "roads" on a globe, a simple parabolic arc works well
    const midVec = startVec.clone().lerp(endVec, 0.5).normalize().multiplyScalar(r + 0.5);
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(12));
    
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });
    
    return new THREE.Line(geometry, material);
}

// ── BORDERS GENERATION ────────────────────────────────────
window._mapBordersGroup = null;

function createMapLabel(message, color, sizeMultiplier = 1) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    context.font = "bold 24px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = 'rgba(0,0,0,0.8)';
    context.shadowBlur = 6;
    context.fillStyle = color;
    context.fillText(message, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(sizeMultiplier * 40, sizeMultiplier * 10, 1);
    return sprite;
}

function createCityBorderObject(lat, lon, r_globe) {
    const pos = latLonToVec3(lat, lon, r_globe);
    // Ring represents the city's urban area boundaries on the globe
    const geo = new THREE.RingGeometry(0.2, 0.35, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(geo, mat);
    ring.position.copy(pos);
    ring.lookAt(new THREE.Vector3(0,0,0));
    return ring;
}

function getCentroid(coords) {
    let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
    const updateBounds = (ll) => {
        if(ll[0] < minLon) minLon = ll[0];
        if(ll[0] > maxLon) maxLon = ll[0];
        if(ll[1] < minLat) minLat = ll[1];
        if(ll[1] > maxLat) maxLat = ll[1];
    };
    const traverse = (arr) => {
        if (arr.length >= 2 && !isNaN(arr[0]) && !isNaN(arr[1])) {
            updateBounds(arr);
        } else {
            arr.forEach(child => traverse(child));
        }
    };
    traverse(coords);
    return [(minLon + maxLon)/2, (minLat + maxLat)/2];
}

window.loadGeoBorders = function() {
    if (!window._mapGlobe || window._mapBordersGroup) return;
    
    const scene = window._mapGlobe.globeGroup;
    window._mapBordersGroup = new THREE.Group();
    window._mapBordersGroup.visible = (window._mapViewMode === 'map');
    scene.add(window._mapBordersGroup);
    
    window._mapBorderMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.35, // Increased from 0.15 for better default visibility
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const borderMaterial = window._mapBorderMat;
    
    const parseGeoJSONFeatures = (data) => {
        const processCoords = (coords) => {
            const points = [];
            for (let i = 0; i < coords.length; i++) {
                // Ensure array index safety (some formats nest differently)
                if (coords[i].length >= 2 && !isNaN(coords[i][0])) {
                    points.push(latLonToVec3(coords[i][1], coords[i][0], 90.1));
                }
            }
            if (points.length > 0) {
                const geo = new THREE.BufferGeometry().setFromPoints(points);
                window._mapBordersGroup.add(new THREE.Line(geo, borderMaterial));
            }
        };

        data.features.forEach(feature => {
            let labelText = feature.properties ? (feature.properties.NAME || feature.properties.name) : null;
            let centerLngLat = null;
            
            if (feature.geometry.type === 'Point') {
                centerLngLat = feature.geometry.coordinates;
                // Add city area border ring
                const ring = createCityBorderObject(centerLngLat[1], centerLngLat[0], 90.15);
                window._mapBordersGroup.add(ring);
            } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
                centerLngLat = getCentroid(feature.geometry.coordinates);
            }

            // Draw lines for polygonal boundaries
            if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates.forEach(processCoords);
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach(poly => {
                    poly.forEach(processCoords);
                });
            } else if (feature.geometry.type === 'LineString') {
                 processCoords(feature.geometry.coordinates);
            }
            
            // Name the state and the country/continent rendering
            if (labelText && centerLngLat) {
                const isCity = feature.geometry.type === 'Point';
                
                // Skip labels for Cities (circles) from the GeoJSON layer to avoid clutter,
                // as city names are already handled by CITY_LABELS in map.js.
                if (isCity) return; 

                // states/countries use cyan
                const labelColor = "rgba(0, 240, 255, 0.55)";
                const sprite = createMapLabel(labelText, labelColor, 0.6);
                const pos = latLonToVec3(centerLngLat[1], centerLngLat[0], 90.3);
                sprite.position.copy(pos);
                window._mapBordersGroup.add(sprite);
            }
        });
    };

    const fetchGeoJSON = (url) => {
        fetch(url)
            .then(res => res.json())
            .then(parseGeoJSONFeatures)
            .catch(err => console.error("Could not load borders from:", url, err));
    };

    // Global Countries
    fetchGeoJSON('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
    // Global States & Provinces
    fetchGeoJSON('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson');
    // World Major Cities
    fetchGeoJSON('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_populated_places.geojson');
};

// Helpers
function latLonToVec3(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = (r * Math.sin(phi) * Math.sin(theta));
    const y = (r * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
}

function getLatLonDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Global UI wiring helpers
window.toggleGlobeMapView = () => {
    const target = window._mapViewMode === 'satellite' ? 'map' : 'satellite';
    setGlobeMode(target, null);
    
    // Update button icon (eye-ball/map)
    const btn = document.getElementById('btn-map-mode-toggle');
    if (btn) {
        const icon = btn.querySelector('i') || btn.querySelector('svg');
        if (icon) {
            icon.setAttribute('data-lucide', target === 'map' ? 'image' : 'map');
            if (window.lucide) lucide.createIcons();
        }
        btn.classList.toggle('active', target === 'map');
    }
};

window.toggleGlobeTheme = () => {
    const target = window._mapThemeMode === 'dark' ? 'light' : 'dark';
    setGlobeMode(null, target);
    
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
        const icon = btn.querySelector('i') || btn.querySelector('svg');
        if (icon) {
            icon.setAttribute('data-lucide', target === 'light' ? 'moon' : 'sun');
            if (window.lucide) lucide.createIcons();
        }
        btn.classList.toggle('active', target === 'light');
    }
};
