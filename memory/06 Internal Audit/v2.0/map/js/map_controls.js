// map_controls.js - Interaction, Controls, and LOD Management

function initMapControls(container, camera, renderer, nodes) {
    window.controls = new THREE.OrbitControls(camera, renderer.domElement);
    window.controls.enableDamping = true;
    window.controls.dampingFactor = 0.05;
    window.controls.rotateSpeed = 0.8;
    window.controls.enableZoom = true;
    window.controls.minDistance = 50;
    window.controls.maxDistance = 500;
    window.controls.autoRotate = true;
    window.controls.autoRotateSpeed = 0.5;

    // Interaction Listeners
    container.addEventListener('pointerdown', (e) => {
        window._pointerStart.x = e.clientX;
        window._pointerStart.y = e.clientY;
    });

    container.addEventListener('pointerup', (e) => {
        const deltaX = Math.abs(e.clientX - window._pointerStart.x);
        const deltaY = Math.abs(e.clientY - window._pointerStart.y);

        if (deltaX < 5 && deltaY < 5) {
            const rect = renderer.domElement.getBoundingClientRect();
            window.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            window.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            window.raycaster.setFromCamera(window.mouse, camera);

            // Check satellites
            const satMeshes = (window._mapSatellites || []).map(s => s.mesh);
            const satHits = window.raycaster.intersectObjects(satMeshes, false);
            if (satHits.length > 0) {
                openOrbitalPanel(satHits[0].object.userData.satelliteId);
                return;
            }

            // Check data nodes
            const intersects = window.raycaster.intersectObjects(nodes);
            if (intersects.length > 0) {
                const clickedNode = intersects[0].object;
                const nodeId = clickedNode.userData.id;
                window.selectedNodeId = (window.selectedNodeId === nodeId) ? null : nodeId;
                updateSidebarForSelection();
            } else {
                if (window.selectedNodeId) {
                    window.selectedNodeId = null;
                    updateSidebarForSelection();
                }
            }
        }
    });

    window.controls.addEventListener('start', () => { window.controls.autoRotate = false; });

    // Sync slider with actual zoom
    window.controls.addEventListener('change', () => {
        const slider = document.getElementById('globe-zoom-slider');
        if (slider && typeof window._mapTargetCameraZ !== 'number') {
            slider.value = mapZToSlider(camera.position.length());
        }
    });
}

/**
 * Level of Detail visibility based on camera distance.
 */
function updateLOD(dist) {
    let regionOpacity = 0;
    if (dist > 180) {
        regionOpacity = Math.min(1, Math.max(0, (dist - 180) / 40));
    }
    
    let cityOpacity = 0;
    if (dist < 260 && dist > 120) {
        cityOpacity = Math.min(1, Math.max(0, (260 - dist) / 40));
        if (dist < 150) {
            cityOpacity = Math.min(cityOpacity, Math.max(0, (dist - 120) / 30));
        }
    }
    
    // Force fully visible labels in Map mode
    if (window._mapViewMode === 'map') {
        regionOpacity = 1;
        cityOpacity = 1;
    }

    if (window._mapRegionGroup) {
        window._mapRegionGroup.children.forEach(c => {
            if (c.material) c.material.opacity = regionOpacity;
        });
    }
    
    if (window._mapCityGroup) {
        window._mapCityGroup.children.forEach(c => {
            if (c.type === 'Sprite') {
                if (c.material) c.material.opacity = cityOpacity;
            } else if (c.userData.isCityDot) {
                if (c.material) c.material.opacity = cityOpacity;
            }
        });
    }
}

/**
 * Zoom mapping helpers.
 */
function mapSliderToZ(val) {
    const ZOOM_MIN = 50;
    const ZOOM_MAX = 500;
    return ZOOM_MAX - (val / 100) * (ZOOM_MAX - ZOOM_MIN);
}

function mapZToSlider(z) {
    const ZOOM_MIN = 50;
    const ZOOM_MAX = 500;
    const clampedZ = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
    const p = (ZOOM_MAX - clampedZ) / (ZOOM_MAX - ZOOM_MIN);
    return Math.round(p * 100);
}

/**
 * Public function to smoothly rotate the globe.
 */
window.rotateGlobeToCoords = function(lat, lon) {
    if (!window._mapGlobe || !window._mapGlobe.globeGroup) return;
    
    const targetY = -(lon + 90) * (Math.PI / 180);
    const targetX = (lat) * (Math.PI / 180);
    
    const globe = window._mapGlobe.globeGroup;
    const camera = window._mapGlobe.camera;

    globe.rotation.x = targetX; 
    gsap_like_rotate(globe, targetY, 1500); 
    
    if (window.controls) {
        const startPos = camera.position.clone();
        const currentDist = startPos.length();
        const targetPos = new THREE.Vector3(0, 0, currentDist);

        const startTime = Date.now();
        function cameraStep() {
            const t = Math.min(1, (Date.now() - startTime) / 1200);
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            camera.position.copy(startPos).lerp(targetPos, ease).setLength(currentDist);
            window.controls.update();
            if (t < 1) requestAnimationFrame(cameraStep);
        }
        cameraStep();
    }
    
    if (window.playSound) window.playSound('UI_GENERIC_TAP');
};
