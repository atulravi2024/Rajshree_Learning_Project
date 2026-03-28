// map.js

// Exposed globe state for tab controls
window._mapGlobe = null; // Will hold { globeGroup, camera, scene, renderer, nodes }
window._mapScanInterval = null;
window._mapTabState = 'sector-g';
window.selectedNodeId = null;
window.controls = null;
window.raycaster = new THREE.Raycaster();
window.mouse = new THREE.Vector2();
window._pointerStart = { x: 0, y: 0 };
window._mapGlobeDesign = 'high-fidelity';


document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    if (typeof initNotifications === 'function') initNotifications();

    if (typeof THREE !== 'undefined') {
        initGlobe();
        if (typeof initMapModes === 'function') initMapModes();
    } else {
        console.error("Three.js is requested but not loaded.");
    }

    initMockDataFeeds();
    initRealDataFeeds();
    initCardCollapsibility();
    initBottomBar();
});

function initGlobe() {
    const container = document.getElementById('threejs-container');
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 250;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Initial resize to ensure correct bounds
    setTimeout(() => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }, 100);

    // Responsive window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // ── GLOBE GROUP ─────────────────────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);


    // ── REAL EARTH TEXTURES (loaded from CDN) ───────────────────
    const loader = new THREE.TextureLoader();

    // NASA Blue Marble day texture
    const earthDayTex = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg');
    // NASA night-lights texture
    const earthNightTex = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg');
    // Specular water map
    const earthSpecTex = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png');
    // Cloud layer
    const cloudTex = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-clouds.png');

    window._mapTextures = {
        day: earthDayTex,
        night: earthNightTex,
        spec: earthSpecTex,
        clouds: cloudTex
    };

    // Main High-Fidelity Geography Mesh
    const hfSphereGeo = new THREE.SphereGeometry(90, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
        map: earthDayTex,
        bumpMap: earthDayTex,
        bumpScale: 0.4,
        emissiveMap: earthNightTex,
        emissive: new THREE.Color(0xffc860),
        emissiveIntensity: 0.6,
        specularMap: earthSpecTex,
        specular: new THREE.Color(0x336699),
        shininess: 25,
        wireframe: false, // Explicitly disabled
        color: 0x112233   // Fallback dark blue/cyan
    });


    const hfGlobe = new THREE.Mesh(hfSphereGeo, globeMat);
    hfGlobe.visible = true; // Explicitly visible
    globeGroup.add(hfGlobe);
    window._mapGlobeHF = hfGlobe;
    window._mapGlobeMat = globeMat;

    // Main Simplified Wireframe Mesh (Holographic Grid)
    const wireframeGeo = new THREE.SphereGeometry(90.1, 64, 48); // Denser, high-tech grid
    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35 // Lowered opacity due to increased density
    });
    const wireframeGlobe = new THREE.Mesh(wireframeGeo, wireframeMat);
    wireframeGlobe.visible = false; // Explicitly hidden
    globeGroup.add(wireframeGlobe);
    window._mapGlobeWireframe = wireframeGlobe;

    // ── SIMPLE GLOBE GLOW EFFECT ────────────────────────────
    // Radial glow sprite that surrounds the globe
    const globeGlowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: createGlowTexture(0x00f0ff),
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    globeGlowSprite.scale.set(240, 240, 1);
    globeGlowSprite.position.set(0, 0, -10); // Slightly behind to not block nodes
    globeGroup.add(globeGlowSprite);
    window._mapGlobeGlow = globeGlowSprite;

    // Cloud layer (slightly larger sphere, transparent)
    const cloudMesh = new THREE.Mesh(
        new THREE.SphereGeometry(91.5, 48, 48),
        new THREE.MeshPhongMaterial({
            map: cloudTex,
            transparent: true,
            opacity: 0.6,
            blending: THREE.NormalBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            color: 0xffffff // Fallback white
        })

    );
    globeGroup.add(cloudMesh);
    window._mapCloudMesh = cloudMesh;

    // ── NATURAL ATMOSPHERIC GLOW ──
    const atmoMesh = new THREE.Mesh(
        new THREE.SphereGeometry(93, 48, 48),
        new THREE.MeshLambertMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide
        })
    );
    globeGroup.add(atmoMesh);

    const atmo2Mesh = new THREE.Mesh(
        new THREE.SphereGeometry(100, 48, 48),
        new THREE.MeshLambertMaterial({
            color: 0x4488ff,
            transparent: true,
            opacity: 0.06,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide
        })
    );
    globeGroup.add(atmo2Mesh);
    window._mapAtmosphere = [atmoMesh, atmo2Mesh];

    // Scene lighting — sun from the right
    const ambientLight = new THREE.AmbientLight(0x223344, 0.25);
    scene.add(ambientLight);
    window._mapAmbientLight = ambientLight;
    const sunLight = new THREE.DirectionalLight(0xffeedd, 0.8);
    sunLight.position.set(250, 80, 150);
    scene.add(sunLight);
    window._mapSunLight = sunLight;
    // Subtle fill from opposite side
    const fillLight = new THREE.DirectionalLight(0x112244, 0.15);
    fillLight.position.set(-200, -80, -150);
    scene.add(fillLight);
    window._mapFillLight = fillLight;

    window._satSpeedMultiplier = 1.0;

    // ADD NODES (from map_data.js)
    const nodes = [];
    const nodeData = window.NODE_DATA || [];

    // Connect lines group
    const linesGroup = new THREE.Group();
    globeGroup.add(linesGroup);

    nodeData.forEach(data => {
        const phi = (90 - data.lat) * (Math.PI / 180);
        const theta = (data.lon + 180) * (Math.PI / 180);
        const r = 90;
        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));

        let color = 0x22c55e;
        let size = 1.5;
        if (data.status === 'warning') { color = 0xfacc15; size = 2; }
        else if (data.status === 'critical') {
            color = 0xff3e3e; size = 4;
            const callout = document.getElementById('breach-callout');
            if (callout) callout.classList.remove('hidden');
        }

        const nodeGeo = new THREE.SphereGeometry(size, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({ color });
        const node = new THREE.Mesh(nodeGeo, nodeMat);

        const glowMaterial = new THREE.SpriteMaterial({
            map: createGlowTexture(color),
            color,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.set(size * 5, size * 5, 1);
        node.add(glow);

        node.position.set(x, y, z);
        node.userData = data;
        globeGroup.add(node);
        nodes.push(node);
    });

    // Create arc connections
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.3 });
    const lineMatDim = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.1 });
    const redLineMat = new THREE.LineBasicMaterial({ color: 0xff3e3e, transparent: true, opacity: 0.5 });

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dist = nodes[i].position.distanceTo(nodes[j].position);
            if (dist < 100 || (nodes[i].userData.threat || nodes[j].userData.threat)) {
                if (Math.random() > 0.3) {
                    const midPoint = new THREE.Vector3().addVectors(nodes[i].position, nodes[j].position).multiplyScalar(0.5);
                    midPoint.normalize().multiplyScalar(100);
                    const curve = new THREE.QuadraticBezierCurve3(nodes[i].position, midPoint, nodes[j].position);
                    const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(10));
                    let mat = lineMatDim;
                    if (dist < 60) mat = lineMat;
                    if (nodes[i].userData.threat || nodes[j].userData.threat) mat = redLineMat;
                    linesGroup.add(new THREE.Line(lineGeo, mat));
                }
            }
        }
    }

    // ── INITIAL ORIENTATION ──
    const INDIA_COORDS = { lat: 20.59, lon: 78.96 };

    function calculateRotationForCoords(lat, lon) {
        // Based on the spherical mapping: theta = (lon + 180) * (PI/180)
        // To bring a 'theta' to the front center (facing camera), we solve for world Y rotation.
        // theta = PI/2 is front. So (lon + 180) * (PI/180) + rotY = PI/2
        // rotY = PI/2 - (lon + 180) * (PI/180) = (90 - lon - 180) * (PI/180) = -(lon + 90) * (PI/180)
        const targetY = -(lon + 90) * (Math.PI / 180);
        // For X (latitude), we simple tilt the globe.
        const targetX = (lat) * (Math.PI / 180);
        return { x: targetX, y: targetY };
    }

    function focusGlobeOnStartup() {
        const criticalNode = (window.NODE_DATA || []).find(n => n.status === 'critical');
        const targetCoords = criticalNode ? { lat: criticalNode.lat, lon: criticalNode.lon } : INDIA_COORDS;
        const targetRot = calculateRotationForCoords(targetCoords.lat, targetCoords.lon);

        console.log(`Globe Orientation: ${criticalNode ? 'Critical Threat' : 'Default India'} [Lat: ${targetCoords.lat}, Lon: ${targetCoords.lon}]`);

        // Perform a smooth "lock-on" transition
        globeGroup.rotation.x = targetRot.x;
        gsap_like_rotate(globeGroup, targetRot.y, 1800);
    }

    focusGlobeOnStartup();

    // ── ORBITAL RING SYSTEM ─────────────────────────────────
    // This group holds all orbital elements; hidden by default
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);
    orbitalGroup.visible = false;
    window._mapOrbitalGroup = orbitalGroup;

    function createRingMesh(radius, tube, color, opacity) {
        const geo = new THREE.TorusGeometry(radius, tube, 2, 120);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending });
        return new THREE.Mesh(geo, mat);
    }

    // Ring 1 — equatorial
    const ring1 = createRingMesh(118, 0.5, 0x00f0ff, 0.6);
    orbitalGroup.add(ring1);

    // Ring 2 — tilted 30°
    const ring2 = createRingMesh(130, 0.4, 0xfacc15, 0.4);
    ring2.rotation.x = Math.PI / 6;
    ring2.rotation.z = Math.PI / 10;
    orbitalGroup.add(ring2);

    // Ring 3 — tilted 60° (faint connector)
    const ring3 = createRingMesh(143, 0.3, 0x00f0ff, 0.2);
    ring3.rotation.x = Math.PI / 3;
    ring3.rotation.y = Math.PI / 8;
    orbitalGroup.add(ring3);

    // ── SATELLITES ──────────────────────────────────────────
    const SATELLITE_DEFS = [
        { id: 'system-ops',        label: 'SYSTEM OPS',        color: 0x00f0ff, icon: '⚙', angle: 0,               ring: ring1, radius: 118, panel: 'panel-system-ops' },
        { id: 'visual-protocol',   label: 'VISUAL PROTOCOL',   color: 0xa78bfa, icon: '🖥', angle: Math.PI * 2/5,   ring: ring1, radius: 118, panel: 'panel-visual-protocol' },
        { id: 'user-gateway',      label: 'USER GATEWAY',      color: 0x22c55e, icon: '👤', angle: Math.PI * 4/5,   ring: ring2, radius: 130, panel: 'panel-user-gateway' },
        { id: 'neural-audio',      label: 'NEURAL AUDIO',      color: 0xfacc15, icon: '🔊', angle: Math.PI * 6/5,   ring: ring2, radius: 130, panel: 'panel-neural-audio' },
        { id: 'security-guardrails',label: 'SECURITY GUARDRAILS',color: 0xff3e3e, icon: '🛡', angle: Math.PI * 8/5,   ring: ring3, radius: 143, panel: 'panel-security-guardrails' },
    ];

    const satellites = [];    // { mesh, sprite, def, angle }
    const satHtmlLabels = []; // { el, def }

    SATELLITE_DEFS.forEach(def => {
        // Satellite ball
        const sGeo = new THREE.SphereGeometry(3.5, 12, 12);
        const sMat = new THREE.MeshBasicMaterial({ color: def.color });
        const sMesh = new THREE.Mesh(sGeo, sMat);
        sMesh.userData = { satelliteId: def.id, def };

        // Satellite glow sprite
        const sSprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: createGlowTexture(def.color),
            color: def.color,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        }));
        sSprite.scale.set(30, 30, 1);
        sMesh.add(sSprite);

        orbitalGroup.add(sMesh);
        satellites.push({ mesh: sMesh, def, angle: def.angle });
    });

    // HTML labels for satellites (CSS-based, projected)
    const mapViewport = document.getElementById('threejs-container');
    SATELLITE_DEFS.forEach(def => {
        const el = document.createElement('div');
        el.className = 'sat-label';
        el.dataset.satId = def.id;
        el.innerHTML = `<span class="sat-icon">${def.icon}</span><span class="sat-text">${def.label}</span>`;
        el.style.display = 'none';
        mapViewport.appendChild(el);
        satHtmlLabels.push({ el, def });

        // Click → open panel
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            openOrbitalPanel(def.id);
        });
        // Also allow clicking the 3D mesh via raycasting (handled in pointerup)
    });

    // Store satellites globally for raycaster
    window._mapSatellites = satellites;

    // ── ORBIT CONTROLS ────────────────────────────────────────
    window.controls = new THREE.OrbitControls(camera, renderer.domElement);
    window.controls.enableDamping = true;
    window.controls.dampingFactor = 0.05;
    window.controls.rotateSpeed = 0.8;
    window.controls.enableZoom = true;
    window.controls.minDistance = 50;
    window.controls.maxDistance = 500;
    window.controls.autoRotate = true;
    window.controls.autoRotateSpeed = 0.5;

    // INTERACTION: Precise Click Detection
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

            // Check satellites first
            const satMeshes = (window._mapSatellites || []).map(s => s.mesh);
            const satHits = window.raycaster.intersectObjects(satMeshes, false);
            if (satHits.length > 0) {
                openOrbitalPanel(satHits[0].object.userData.satelliteId);
                return;
            }

            // Then check data nodes
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
            const dist = camera.position.length();
            const pct = 100 - ((dist - 50) / (500 - 50)) * 100;
            slider.value = pct;
        }
    });

    const zSlider = document.getElementById('globe-zoom-slider');
    if (zSlider) {
        zSlider.addEventListener('input', (e) => {
            const pct = e.target.value;
            const targetDist = 450 - (pct / 100) * (450 - 110);
            window._mapTargetCameraZ = targetDist;
        });
    }

    // ── LOD LAYERS ──────────────────────────────────────────
    window._mapRegionGroup = new THREE.Group();
    window._mapCityGroup = new THREE.Group();
    globeGroup.add(window._mapRegionGroup);
    globeGroup.add(window._mapCityGroup);
    
    function createTextSprite(message, color, sizeMultiplier = 1) {
        const fontface = "Fira Code";
        const fontsize = 32;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128; // wider for longer labels
        context.font = "bold " + fontsize + "px " + fontface;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.shadowColor = color;
        context.shadowBlur = 12;
        context.fillStyle = color;
        context.fillText(message, canvas.width/2, canvas.height/2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0, depthWrite: false });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(sizeMultiplier * 48, sizeMultiplier * 12, 1);
        return sprite;
    }

    if (window.REGION_LABELS) {
        window.REGION_LABELS.forEach(r => {
            const phi = (90 - r.lat) * (Math.PI / 180);
            const theta = (r.lon + 180) * (Math.PI / 180);
            const r_globe = 92; 
            const x = -(r_globe * Math.sin(phi) * Math.cos(theta));
            const z = (r_globe * Math.sin(phi) * Math.sin(theta));
            const y = (r_globe * Math.cos(phi));
            
            const sprite = createTextSprite(r.label, "rgba(0, 240, 255, 0.6)", 1.2);
            sprite.position.set(x, y, z);
            window._mapRegionGroup.add(sprite);
        });
    }

    if (window.CITY_LABELS) {
        window.CITY_LABELS.forEach(c => {
            const phi = (90 - c.lat) * (Math.PI / 180);
            const theta = (c.lon + 180) * (Math.PI / 180);
            const r_globe = 91.5; 
            const x = -(r_globe * Math.sin(phi) * Math.cos(theta));
            const z = (r_globe * Math.sin(phi) * Math.sin(theta));
            const y = (r_globe * Math.cos(phi));
            
            let color = "rgba(34, 197, 94, 0.9)"; // stable
            if (c.status === 'warning') color = "rgba(250, 204, 21, 0.9)";
            if (c.status === 'critical') color = "rgba(255, 62, 62, 0.9)";
            
            const sprite = createTextSprite(c.label, color, 0.65);
            sprite.position.set(x, y, z);
            
            // Add a tiny dot
            const dotGeo = new THREE.SphereGeometry(0.6, 8, 8);
            const dotMat = new THREE.MeshBasicMaterial({ color: color.replace('0.9)', '1)'), transparent: true, opacity: 0 });
            const dot = new THREE.Mesh(dotGeo, dotMat);
            dot.position.set(x * (90/91.5), y * (90/91.5), z * (90/91.5));
            dot.userData = { isCityDot: true };
            window._mapCityGroup.add(dot);
            window._mapCityGroup.add(sprite);
        });
    }



    window._mapGlobe = { globeGroup, camera, scene, renderer };

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

        window._mapRegionGroup.children.forEach(c => {
            if (c.material) c.material.opacity = regionOpacity;
        });
        
        window._mapCityGroup.children.forEach(c => {
            if (c.type === 'Sprite') {
                if (c.material) c.material.opacity = cityOpacity;
            } else if (c.userData.isCityDot) {
                if (c.material) c.material.opacity = cityOpacity;
            }
        });


    }

    // ── ANIMATION LOOP ───────────────────────────────────────
    const _ringRotSpeeds = [0.002, -0.0015, 0.001];
    const _satOrbitSpeeds = [0.005, 0.005, -0.004, -0.004, 0.003];

    function animate() {
        if (window.controls) window.controls.update();

        const now = Date.now();

        // Slowly drift the cloud layer
        if (window._mapCloudMesh) {
            window._mapCloudMesh.rotation.y += 0.00008;
        }

        // Interpolate camera zoom (Orbital distance)
        if (typeof window._mapTargetCameraZ === 'number') {
            const currentDist = camera.position.length();
            const targetDist = window._mapTargetCameraZ;
            if (Math.abs(currentDist - targetDist) > 0.5) {
                const newDist = currentDist + (targetDist - currentDist) * 0.08;
                camera.position.setLength(newDist);
            } else {
                window._mapTargetCameraZ = null; // Clear it to allow scroll again
            }
        }

        updateLOD(camera.position.length());

        // Interpolate globe scale
        if (window._mapGlobe && window._mapGlobe.globeGroup) {
            const targetScale = window._mapTargetGlobeScale || 1.0;
            const currentScale = window._mapGlobe.globeGroup.scale.x;
            const newScale = currentScale + (targetScale - currentScale) * 0.1;
            window._mapGlobe.globeGroup.scale.set(newScale, newScale, newScale);
            if (window._mapOrbitalGroup) {
                window._mapOrbitalGroup.scale.set(newScale, newScale, newScale);
            }
        }



        // Rotate orbital rings independently
        if (orbitalGroup.visible) {
            const mult = (typeof window._satSpeedMultiplier === 'number') ? window._satSpeedMultiplier : 1.0;

            ring1.rotation.z += _ringRotSpeeds[0] * mult;
            ring2.rotation.y += _ringRotSpeeds[1] * mult;
            ring3.rotation.x += _ringRotSpeeds[2] * mult;

            // Orbit satellites along their rings
            satellites.forEach((sat, idx) => {
                sat.angle += _satOrbitSpeeds[idx] * mult;
                const r = sat.def.radius;
                // Compute position on the ring in its local orientation
                const localPos = new THREE.Vector3(
                    r * Math.cos(sat.angle),
                    r * Math.sin(sat.angle),
                    0
                );
                // Apply ring's world quaternion to position
                const ringWorld = new THREE.Quaternion();
                sat.def.ring.getWorldQuaternion(ringWorld);
                localPos.applyQuaternion(ringWorld);
                sat.mesh.position.copy(localPos);

                // Pulse scale
                const pulse = 1 + 0.25 * Math.sin(now * 0.003 + idx);
                sat.mesh.scale.set(pulse, pulse, pulse);

                // Project to screen for HTML label
                const satLabel = satHtmlLabels[idx];
                if (satLabel && satLabel.el.style.display !== 'none') {
                    const worldPos = new THREE.Vector3();
                    sat.mesh.getWorldPosition(worldPos);
                    const screenPos = worldPos.project(camera);
                    const rect = renderer.domElement.getBoundingClientRect();
                    const sx = (screenPos.x * 0.5 + 0.5) * rect.width + rect.left;
                    const sy = (-(screenPos.y * 0.5) + 0.5) * rect.height + rect.top;
                    satLabel.el.style.left = sx + 'px';
                    satLabel.el.style.top = sy + 'px';
                }
            });
        }

        // Node pulses
        nodes.forEach(n => {
            const isSelected = window.selectedNodeId === n.userData.id;
            if (n.userData.status === 'critical' || isSelected) {
                const freq = isSelected ? 0.008 : 0.004;
                const baseS = isSelected ? 2.0 : 1.0;
                const s = baseS + Math.sin(now * freq) * 0.5;
                n.scale.set(s, s, s);
                if (n.children[0]) n.children[0].scale.set(s * 8, s * 8, 1);
            } else {
                n.scale.set(1, 1, 1);
                if (n.children[0]) n.children[0].scale.set(n.userData.status === 'warning' ? 10 : 7.5, n.userData.status === 'warning' ? 10 : 7.5, 1);
            }
            if (n.children.length > 0) n.children[0].quaternion.copy(camera.quaternion);
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
    console.log("Holographic Map: THREE.js Render Loop RE-INITIALIZED [OK]");

    window._mapGlobe = { globeGroup, camera, renderer, scene, nodes };

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Helper: radial glow texture
    function createGlowTexture(colorHex) {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        const ctx = c.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        let hexStr = colorHex.toString(16).padStart(6, '0');
        const r = parseInt(hexStr.substring(0, 2), 16);
        const g = parseInt(hexStr.substring(2, 4), 16);
        const b = parseInt(hexStr.substring(4, 6), 16);
        gradient.addColorStop(0, `rgba(${r},${g},${b}, 1)`);
        gradient.addColorStop(0.2, `rgba(${r},${g},${b}, 0.8)`);
        gradient.addColorStop(1, `rgba(${r},${g},${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }

    // Wire up orbital settings system
    initOrbitalSettingsSystem(satHtmlLabels);
    initOrbitalPanelListeners();
}

// ─────────────────────────────────────────────────
// ORBITAL SETTINGS SYSTEM
// ─────────────────────────────────────────────────
function initOrbitalSettingsSystem(satHtmlLabels) {
    // Override window.showSettingsMenu so navbar.js's button calls our orbital toggle.
    // Use setTimeout(0) to guarantee we run AFTER settings.js's DOMContentLoaded sets it.
    setTimeout(() => {
        window.showSettingsMenu = function () { toggleOrbitalSettings(); };
    }, 0);

    // Disable click-outside-to-close behavior so it only closes via the toggle button
}

function toggleOrbitalSettings() {
    const orbitalGroup = window._mapOrbitalGroup;
    const isActive = orbitalGroup && orbitalGroup.visible;

    if (isActive) {
        closeOrbitalSettings();
    } else {
        openOrbitalSettings();
    }
}

function openOrbitalSettings() {
    // 0. Scale down the globe and rings to fit without overlapping bottom nav
    window._mapTargetGlobeScale = 0.65;

    // 1. Show orbital rings + satellites
    if (window._mapOrbitalGroup) {
        window._mapOrbitalGroup.visible = true;
    }

    // 2. Show satellite HTML labels
    document.querySelectorAll('.sat-label').forEach(el => {
        el.style.display = 'flex';
        setTimeout(() => el.classList.add('visible'), 50);
    });

    // 3. Show the outer overlay (for status indicator)
    const overlay = document.getElementById('orbital-settings-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }

    // 4. Close any legacy settings
    const legacyOverlay = document.querySelector('.settings-global-overlay');
    if (legacyOverlay) legacyOverlay.removeAttribute('data-mode');
}

function closeOrbitalSettings() {
    // 0. Restore globe scale
    window._mapTargetGlobeScale = 1.0;

    // 1. Hide orbital rings
    if (window._mapOrbitalGroup) window._mapOrbitalGroup.visible = false;

    // 2. Hide satellite HTML labels
    document.querySelectorAll('.sat-label').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.style.display = 'none', 300);
    });

    // 3. Hide all orbital sub-panels
    document.querySelectorAll('.orbital-panel').forEach(p => p.classList.remove('active'));

    // 4. Hide overlay
    const overlay = document.getElementById('orbital-settings-overlay');
    if (overlay) overlay.classList.remove('active');
}

function openOrbitalPanel(satelliteId) {
    // Hide any open panels
    document.querySelectorAll('.orbital-panel').forEach(p => p.classList.remove('active'));

    // Show the mapped panel
    const panelId = `orbital-panel-${satelliteId}`;
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.add('active');
        // Re-create lucide icons inside the panel
        if (window.lucide) lucide.createIcons({ scope: panel });
    }
}

function initOrbitalPanelListeners() {
    const root = document.documentElement;

    // 1. Helper to bind sliders
    const bindOrbitalSlider = (id, effectId, valId, suffix = '') => {
        const slider = document.getElementById(id);
        const display = document.getElementById(valId);
        if (!slider) return;

        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (display) display.textContent = val + suffix;
            
            // Map to Shared Settings Engine
            if (window.applySettingEffect) window.applySettingEffect(effectId, val);
            
            // Map specific Three.js overrides
            if (effectId === 'glow' && window._mapAtmosphere) {
                window._mapAtmosphere[0].material.opacity = 0.25 * (val / 100);
                window._mapAtmosphere[1].material.opacity = 0.1 * (val / 100);
            }
            if (effectId === 'scanline') {
                root.style.setProperty('--scanline-opacity', (val / 100) * 0.15);
            }
            if (effectId === 'glare') {
                root.style.setProperty('--glare-opacity', (val / 100) * 0.8);
            }
        });
    };

    const bindOrbitalToggle = (id, effectId) => {
        const tg = document.getElementById(id);
        if (!tg) return;
        tg.addEventListener('change', (e) => {
            if (window.applySettingEffect) window.applySettingEffect(effectId, e.target.checked);
            
            // Map specific overrides
            if (effectId === 'grid') {
                const gridOverlay = document.querySelector('.map-grid-overlay');
                if (gridOverlay) gridOverlay.style.opacity = e.target.checked ? '1' : '0';
            }
            if (id === 'tg-cloud-map') {
                if (window._mapCloudMesh) window._mapCloudMesh.visible = e.target.checked;
            }
        });
    };

    // SYSTEM OPS
    bindOrbitalSlider('sl-refresh-map', 'refresh', 'val-refresh-map', 's');
    bindOrbitalToggle('tg-sync-map', 'sync');

    // VISUAL PROTOCOL
    bindOrbitalSlider('sl-glow-map', 'glow', 'val-glow-map', '%');
    bindOrbitalSlider('sl-scan-map', 'scanline', 'val-scan-map', '%');
    bindOrbitalSlider('sl-glare-map', 'glare', 'val-glare-map', '%');
    bindOrbitalToggle('tg-grid-map', 'grid');
    bindOrbitalToggle('tg-cloud-map', 'cloud-layer');

    // USER GATEWAY
    const auditorInput = document.getElementById('in-auditor-map');
    if (auditorInput) {
        auditorInput.addEventListener('input', (e) => {
            if (window.applySettingEffect) window.applySettingEffect('auditor-name', e.target.value);
        });
    }
    document.getElementById('btn-activity-logs-map')?.addEventListener('click', () => {
        document.getElementById('btn-view-logs')?.click();
    });

    // NEURAL AUDIO
    bindOrbitalSlider('sl-vol-map', 'volume', 'val-vol-map', '%');
    bindOrbitalToggle('tg-bleeps-map', 'bleeps');

    // SECURITY GUARDRAILS
    bindOrbitalToggle('tg-mask-map', 'masking');
    bindOrbitalToggle('tg-lock-map', 'lock');

    // CONNECTIVITY: Latency / Session Updates
    const startT = Date.now();
    setInterval(() => {
        const lat = document.getElementById('conn-latency');
        if (lat) lat.textContent = (24 + Math.floor(Math.random() * 12)) + ' ms';

        const ses = document.getElementById('profile-session-time');
        if (ses) {
            const diff = Math.floor((Date.now() - startTime) / 1000);
            const m = Math.floor(diff / 60).toString().padStart(2, '0');
            const s = (diff % 60).toString().padStart(2, '0');
            ses.textContent = `00:${m}:${s}`;
        }
    }, 1000);
}

function initMockDataFeeds() {
    // 1. Metric Bars simulation (still purely visual)
    const barsContainer = document.getElementById('metric-bars-container');
    if (barsContainer) {
        for (let i = 0; i < 12; i++) {
            const bar = document.createElement('div');
            bar.className = `metric-bar ${Math.random() > 0.5 ? 'level-high' : 'level-low'}`;
            bar.style.height = `${Math.floor(Math.random() * 80 + 20)}%`;
            barsContainer.appendChild(bar);
        }
        setInterval(() => {
            Array.from(barsContainer.children).forEach(bar => {
                bar.style.height = `${Math.floor(Math.random() * 80 + 20)}%`;
                bar.className = `metric-bar ${Math.random() > 0.6 ? 'level-high' : 'level-low'}`;
            });
        }, 1500);
    }

    // 2. Phase-2 Widgets
    renderComplianceWidget();
    renderDonutChart();
    renderAdminActivity();
    renderSessions();
    renderHardwareGauges();
    initAnomalyScanner();

    // ── NEW PHASE-2 (B) WIDGETS ──────────────────────
    renderLatencyMatrix();
    renderIntegritySeals();
    renderSectorFlow();
    renderIncidents();
    renderBackups();
    renderCredentialGauge();
    renderTopology();
    renderThreatVectors();
    renderGeoLogs();
    renderQuarantineList();
    renderUptime();
    renderMemoryMatrix();
    renderSignalInterference();

    // Live-update intervals
    setInterval(renderHardwareGauges, 2000);
    setInterval(renderSessions, 3000);
    setInterval(renderLatencyMatrix, 2500);
    setInterval(renderMemoryMatrix, 5000);
    setInterval(renderSignalInterference, 3200);
}

// ─────────────────────────────────────────────────
// REAL DATA FEEDS — Driven by map_data.js
// ─────────────────────────────────────────────────
function initRealDataFeeds() {
    // ── Audit Trail (from AUDIT_LOG_HISTORY) ──────────────────────────
    const logContainer = document.getElementById('audit-trail-log');
    if (logContainer && window.AUDIT_LOG_HISTORY) {
        syncAuditTrail();

        // Simulate new entries streaming in
        setInterval(() => {
            if (window._mapTabState === 'monitoring') {
                const pool = window.AUDIT_LOG_HISTORY;
                const entry = pool[Math.floor(Math.random() * pool.length)];
                addAuditTrailEntry(entry);
            }
        }, 4000);
    }

    updateSidebarForSelection();
    setInterval(updateSidebarForSelection, 2000);
}

function syncAuditTrail() {
    const logContainer = document.getElementById('audit-trail-log');
    if (!logContainer || !window.AUDIT_LOG_HISTORY) return;

    logContainer.innerHTML = '';
    const recent = window.AUDIT_LOG_HISTORY.slice(0, 6);
    recent.forEach(log => addAuditTrailEntry(log, false));
}

function addAuditTrailEntry(log, prepend = true) {
    const logContainer = document.getElementById('audit-trail-log');
    if (!logContainer) return;

    const el = document.createElement('div');
    el.className = `log-entry ${log.type === 'threat' ? 'threat-log' : ''}`;
    el.innerHTML = `
        <div class="dot"></div>
        <div class="log-text"><span class="${log.type === 'threat' ? 'highlight' : 'text-dim'}">${log.event}</span><br/>${log.text}<br/><span style="font-size:0.65rem;color:var(--text-dim)">${log.loc}</span></div>
    `;
    if (prepend) {
        logContainer.prepend(el);
        if (logContainer.children.length > 8) logContainer.lastElementChild.remove();
    } else {
        logContainer.appendChild(el);
    }
}

function updateSidebarForSelection() {
    const nodeId = window.selectedNodeId;
    const globalData = window.DEFAULT_GLOBAL_METRICS;
    const selectedNode = (window.NODE_DATA || []).find(n => n.id === nodeId);
    const data = (nodeId && selectedNode) ? selectedNode : null;
    const baseData = data || globalData; // Use node data or global fallback

    // ── 1. Widget Headers ────────────────────────────────────────────
    const overviewHeader = document.querySelector('.widget-overview .sidebar-toggle-label');
    const scanHeader = document.querySelector('.widget-network-scan .sidebar-toggle-label');
    if (overviewHeader) overviewHeader.textContent = data ? `NODE ${nodeId} INTEL` : 'AUDIT OVERVIEW';
    if (scanHeader) scanHeader.textContent = data ? `NODE ${nodeId} FEED` : 'NETWORK SCAN';

    // ── 2. Audit Overview Stats ──────────────────────────────────────
    setText('stat-active-audits', data ? data.audits : globalData.activeAudits);
    setText('stat-net-integrity', data ? data.integrity : globalData.netIntegrity);
    setText('stat-active-threats', (data ? data.threats : globalData.activeThreats) + ' ');
    setText('stat-sector-status', data ? data.status : globalData.sectorStatus);

    // ── 3. Network Scan Stats ────────────────────────────────────────
    setText('stat-latency', data ? data.latency : globalData.latency);
    setText('stat-data-flow', data ? data.flow : globalData.dataFlow);

    // ── 4. Sector Analysis ───────────────────────────────────────────
    const analysis = baseData.analysis;
    if (analysis) {
        const banner = document.getElementById('sel-alert-banner');
        const alertText = document.getElementById('sel-alert-text');
        if (banner) {
            banner.className = 'alert-banner ' + analysis.alertClass;
        }
        if (alertText) alertText.textContent = analysis.alert;

        const nodeName = document.getElementById('sel-node-name');
        if (nodeName) nodeName.textContent = data ? `Node ${nodeId}` : 'Sector G';

        const breachType = document.getElementById('sel-breach-type');
        if (breachType) breachType.textContent = analysis.breach;

        const nodeStatus = document.getElementById('sel-node-status');
        if (nodeStatus) {
            nodeStatus.textContent = analysis.status;
            nodeStatus.className = analysis.statusClass;
        }
    }

    // ── 5. Threat Profiles ───────────────────────────────────────────
    const threat = baseData.threatProfile;
    if (threat) {
        setText('threat-title', threat.title);
        setText('threat-type', threat.type);
        setText('threat-source', threat.source);
    }

    // ── 6. System Metrics ────────────────────────────────────────────
    const metrics = data ? data.metrics : { activeNodes: globalData.activeNodes, systemLoad: globalData.systemLoad };
    if (metrics) {
        setText('metric-active-nodes', metrics.activeNodes);
        setText('metric-system-load', metrics.systemLoad);
    }
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    // If element has a non-text first child (like an icon), only update text nodes
    const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3);
    if (textNode) {
        textNode.textContent = val;
    } else if (el.childNodes.length === 0 || (el.childNodes.length === 1 && el.firstChild.nodeType === 3)) {
        el.textContent = val;
    } else {
        // Fallback: try to update the first text-like child element
        const span = el.querySelector('span') || el.firstElementChild;
        if (span) span.textContent = val;
        else el.textContent = val;
    }
}

// Keep backward compat alias (for any code that might call updateStat)
function updateStat(id, val) { setText(id, val); }

// ─────────────────────────────────────────────────
// CARD COLLAPSE / ACCORDION ENGINE
// ─────────────────────────────────────────────────
function initCardCollapsibility() {
    const headers = document.querySelectorAll('.widget-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const widget = header.closest('.holo-widget');
            if (widget) {
                widget.classList.toggle('collapsed');
            }
        });
    });
}



function initBottomBar() {
    const tabGroup = document.getElementById('bottom-tab-group');
    if (tabGroup) {
        tabGroup.addEventListener('click', (e) => {
            const tab = e.target.closest('.nav-tab');
            if (!tab) return;
            tabGroup.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activateMapMode(tab.dataset.tab);
        });
    }

    // ── ATMOSPHERE TOGGLE ──
    const btnAtmosphere = document.getElementById('btn-atmosphere');
    if (btnAtmosphere) {
        btnAtmosphere.addEventListener('click', () => {
            const isActive = btnAtmosphere.classList.toggle('active');
            if (window._mapGlobeMat) {
                window._mapGlobeMat.emissiveIntensity = isActive ? 0.6 : 0.0;
            }
            if (window._mapAtmosphere) {
                window._mapAtmosphere[0].visible = isActive;
                window._mapAtmosphere[1].visible = isActive;
            }
        });
    }

    // ── SUNLIGHT (TORCH) TOGGLE ──
    const btnSpotlight = document.getElementById('btn-spotlight');
    if (btnSpotlight) {
        btnSpotlight.addEventListener('click', () => {
            const isActive = btnSpotlight.classList.toggle('active');
            if (window._mapSunLight) {
                window._mapSunLight.visible = isActive;
            }
            if (window._mapAmbientLight) {
                if (isActive) {
                    window._mapAmbientLight.color.setHex(0x223344);
                    window._mapAmbientLight.intensity = 0.5;
                } else {
                    window._mapAmbientLight.color.setHex(0xffffff);
                    window._mapAmbientLight.intensity = 1.25;
                }
            }
        });
    }

    // ── SATELLITE SPEED ──
    const satSpeedSlider = document.getElementById('sat-speed-slider');
    if (satSpeedSlider) {
        satSpeedSlider.addEventListener('input', (e) => {
            window._satSpeedMultiplier = parseFloat(e.target.value);
        });
    }

    // ── ZOOM CONTROLS ──
    const ZOOM_MIN = 50; // Max zoom in (closer)
    const ZOOM_MAX = 500; // Max zoom out (further)

    function mapSliderToZ(val) {
        return ZOOM_MAX - (val / 100) * (ZOOM_MAX - ZOOM_MIN);
    }

    function mapZToSlider(z) {
        const clampedZ = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
        const p = (ZOOM_MAX - clampedZ) / (ZOOM_MAX - ZOOM_MIN);
        return Math.round(p * 100);
    }

    window._mapTargetCameraZ = 250; // default startup Z (Scale 250)
    const zoomSlider = document.getElementById('globe-zoom-slider');
    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            window._mapTargetCameraZ = mapSliderToZ(parseFloat(e.target.value));
        });

        // Icon Button functionality (using event delegation to circumvent Lucide SVG swaps)
        const zoomSliderWrapper = document.querySelector('.zoom-control-wrap');
        if (zoomSliderWrapper) {
            zoomSliderWrapper.addEventListener('click', (e) => {
                if (e.target.closest('#btn-zoom-in-icon')) {
                    let val = parseFloat(zoomSlider.value);
                    val = Math.min(100, val + 15);
                    zoomSlider.value = val;
                    zoomSlider.dispatchEvent(new Event('input'));
                } else if (e.target.closest('#btn-zoom-out-icon')) {
                    let val = parseFloat(zoomSlider.value);
                    val = Math.max(0, val - 15);
                    zoomSlider.value = val;
                    zoomSlider.dispatchEvent(new Event('input'));
                }
            });
        }
    }

    // ── UI MINIMIZE TOGGLE ──────────────────────────────────────────
    const uiToggleBtn = document.getElementById('btn-ui-toggle');
    if (uiToggleBtn) {
        uiToggleBtn.addEventListener('click', () => {
            const isMinimized = document.body.classList.toggle('ui-minimized');

            // Toggle eye icon
            const icon = uiToggleBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', isMinimized ? 'eye-off' : 'eye');
                lucide.createIcons();
            }

            // Update zoom target directly (animate loop will handle tweening)
            const globe = window._mapGlobe;
            const zSlider = document.getElementById('globe-zoom-slider');
            if (globe) {
                const targetZ = isMinimized ? 150 : 250; // 250 = default scale, 150 = close focus
                window._mapTargetCameraZ = targetZ;
                if (zSlider) zSlider.value = mapZToSlider(targetZ);
            }

            // Allow layout to settle, then fire resize to re-fit the canvas
            setTimeout(() => window.dispatchEvent(new Event('resize')), 520);
        });
    }

    // ── VISUAL BOOST TOGGLE ───────────────────────────────────────────
    window._isVisualBoostActive = false;
    
    window.applyVisualBoostState = function() {
        if (!window._isVisualBoostActive) {
            document.body.classList.remove('visual-boost-hf', 'visual-boost-wire');
            // Reset to defaults
            if (window._mapSunLight) window._mapSunLight.intensity = 0.8;
            if (window._mapAmbientLight) window._mapAmbientLight.intensity = window._mapGlobeDesign === 'wireframe' ? 0.8 : 0.25;
            if (window._mapGlobeMat) window._mapGlobeMat.emissiveIntensity = 0.6;
            if (window._mapGlobeWireframe) window._mapGlobeWireframe.material.opacity = 0.35;
            if (window._mapGlobeGlow) window._mapGlobeGlow.material.opacity = window._mapGlobeDesign === 'wireframe' ? 0.4 : 0.15;
            return;
        }

        const isHF = window._mapGlobeDesign === 'high-fidelity';
        
        // CSS Filters (Canvas strictly via CSS)
        document.body.classList.toggle('visual-boost-hf', isHF);
        document.body.classList.toggle('visual-boost-wire', !isHF);

        // Three.js Material Tuning
        if (isHF) {
            if (window._mapSunLight) window._mapSunLight.intensity = 1.35;
            if (window._mapGlobeMat) window._mapGlobeMat.emissiveIntensity = 0.9;
        } else {
            if (window._mapGlobeWireframe) window._mapGlobeWireframe.material.opacity = 0.8;
            if (window._mapGlobeGlow) window._mapGlobeGlow.material.opacity = 0.7;
        }
    };

    const visualBoostBtn = document.getElementById('btn-visual-boost');
    if (visualBoostBtn) {
        visualBoostBtn.addEventListener('click', () => {
            window._isVisualBoostActive = !window._isVisualBoostActive;
            visualBoostBtn.classList.toggle('active', window._isVisualBoostActive);
            if (typeof window.applyVisualBoostState === 'function') window.applyVisualBoostState();
        });
    }

    // ── VIEW LOGS BUTTON: opens full Audit Log modal ──────────────────
    const logsBtn = document.getElementById('btn-view-logs');
    const logsModal = document.getElementById('modal-audit-logs');
    const closeLogsBtn = document.getElementById('close-logs-modal');

    if (logsBtn && logsModal) {
        logsBtn.addEventListener('click', () => {
            populateLogsModal();
            logsModal.classList.add('open');
            lucide.createIcons();
        });
        closeLogsBtn?.addEventListener('click', () => logsModal.classList.remove('open'));
        logsModal.addEventListener('click', (e) => { if (e.target === logsModal) logsModal.classList.remove('open'); });
    }

    // ── INFO BUTTON: opens live System Status modal ───────────────────
    const infoBtn = document.getElementById('btn-view-info');
    const infoModal = document.getElementById('modal-system-info');
    const closeInfoBtn = document.getElementById('close-info-modal');

    if (infoBtn && infoModal) {
        infoBtn.addEventListener('click', () => {
            populateInfoModal();
            infoModal.classList.add('open');
            lucide.createIcons();
            // Start live-updating the values every 1.5s
            _infoModalInterval = setInterval(populateInfoModal, 1500);
        });
        const closeInfo = () => {
            infoModal.classList.remove('open');
            clearInterval(_infoModalInterval);
            _infoModalInterval = null;
        };
        closeInfoBtn?.addEventListener('click', closeInfo);
        infoModal.addEventListener('click', (e) => { if (e.target === infoModal) closeInfo(); });
    }

    // ── THREAT PANEL DISMISS ──────────────────────────────────────────
    document.getElementById('close-threat-panel')?.addEventListener('click', () => {
        document.getElementById('panel-threat-action')?.classList.add('hidden');
    });

    // ── QUARANTINE BUTTON ─────────────────────────────────────────────
    document.getElementById('btn-quarantine')?.addEventListener('click', runQuarantineSequence);

    // ── DEEP SCAN BUTTON ─────────────────────────────────────────────
    const deepScanBtn = document.getElementById('btn-deep-scan');
    if (deepScanBtn) {
        deepScanBtn.addEventListener('click', () => {
            // Trigger the scan tab mode
            document.querySelector('[data-tab="scan"]')?.click();
            // Flash all widgets
            document.querySelectorAll('.holo-widget').forEach((w, i) => {
                setTimeout(() => {
                    w.classList.add('scanning-flash');
                    setTimeout(() => w.classList.remove('scanning-flash'), 800);
                }, i * 80);
            });
            // Spin the deep scan icon
            const icon = deepScanBtn.querySelector('svg');
            if (icon) {
                icon.style.transition = 'transform 0.6s ease';
                icon.style.transform = 'rotate(360deg)';
                setTimeout(() => { icon.style.transform = ''; }, 700);
            }
        });
    }

    // ── SYSTEM LOCKDOWN BUTTON ────────────────────────────────────────
    const lockdownBtn = document.getElementById('btn-lockdown');
    if (lockdownBtn) {
        lockdownBtn.addEventListener('click', () => {
            const isLocked = document.body.classList.toggle('lockdown-active');
            lockdownBtn.classList.toggle('active', isLocked);
            const titleEl = document.getElementById('bottom-title-text');
            if (titleEl) {
                titleEl.textContent = isLocked ? '⚠ SYSTEM LOCKDOWN ACTIVE' : 'INTERNAL AUDIT HUB';
            }
            // Flash anomaly result
            const anomalyEl = document.getElementById('anomaly-result');
            if (anomalyEl) {
                anomalyEl.textContent = isLocked ? 'LOCKDOWN ENGAGED' : 'SCANNING…';
                anomalyEl.classList.toggle('threat', isLocked);
            }
        });
    }

    // ── GLOBE DESIGN TOGGLE BUTTON ───────────────────────────────────
    const globeDesignBtn = document.getElementById('btn-globe-design');
    if (globeDesignBtn) {
        globeDesignBtn.addEventListener('click', () => {
            toggleGlobeDesign();
        });
    }

    // ── HISTORY BUTTON (opens audit log) ─────────────────────────────
    document.getElementById('btn-history')?.addEventListener('click', () => {
        document.getElementById('btn-view-logs')?.click();
    });

    // ── MAP MODE TOGGLE (Satellite / Atlas) ───────────────────────────
    document.getElementById('btn-map-mode-toggle')?.addEventListener('click', () => {
        if (typeof window.toggleGlobeMapView === 'function') window.toggleGlobeMapView();
    });

    // ── THEME TOGGLE (Light / Dark) ──────────────────────────────────
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
        if (typeof window.toggleGlobeTheme === 'function') window.toggleGlobeTheme();
    });

    // Default UI Brightness: Full
    document.documentElement.style.setProperty('--theme-accent-glow', `rgba(0, 240, 255, 0.75)`);
    const app = document.querySelector('.holo-app-container');
    if (app) app.style.filter = 'contrast(1.05) brightness(1.1)';

    // ── EXPORT BUTTON ────────────────────────────────────────────────
    document.getElementById('btn-export')?.addEventListener('click', () => {
        const title = document.getElementById('bottom-title-text');
        if (title) {
            const original = title.textContent;
            title.textContent = '⭳ GENERATING REPORT...';
            title.style.color = 'var(--theme-accent)';
            setTimeout(() => {
                title.textContent = '✓ REPORT EXPORTED (PDF)';
                setTimeout(() => {
                    title.textContent = original;
                    title.style.color = '';
                }, 2000);
            }, 1500);
        }
    });
    // ── SETTINGS MODAL BACKDROP CLICK DISMISS ──────────────────────────
    const settingsOverlay = document.querySelector('.settings-global-overlay');
    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay && window.showSettingsMenu) {
                window.showSettingsMenu();
            }
        });
    }
}

function toggleGlobeDesign() {

    const isHF = window._mapGlobeDesign === 'high-fidelity';
    window._mapGlobeDesign = isHF ? 'wireframe' : 'high-fidelity';

    const btn = document.getElementById('btn-globe-design');
    if (btn) {
        btn.classList.toggle('active', !isHF);
        const icon = btn.querySelector('i') || btn.querySelector('svg');
        if (icon) {
            icon.setAttribute('data-lucide', isHF ? 'monitor' : 'globe');
            if (window.lucide) lucide.createIcons();
        }
    }

    const hfGlobe = window._mapGlobeHF;
    const wireframeGlobe = window._mapGlobeWireframe;
    const cloudMesh = window._mapCloudMesh;
    const atmosphere = window._mapAtmosphere;
    const globeGlow = window._mapGlobeGlow;

    if (window._mapGlobeDesign === 'wireframe') {
        // ── SIMPLE WIREFRAME MODE ──
        if (hfGlobe) hfGlobe.visible = false;
        if (wireframeGlobe) wireframeGlobe.visible = true;
        if (cloudMesh) cloudMesh.visible = false;
        if (atmosphere) atmosphere.forEach(m => m.visible = false);
        if (globeGlow) {
            globeGlow.visible = true;
            globeGlow.material.color.setHex(0x00f0ff);
            globeGlow.material.opacity = 0.4;
        }

        // Simpler light logic: Hide directional lights
        if (window._mapSunLight) window._mapSunLight.visible = false;
        if (window._mapFillLight) window._mapFillLight.visible = false;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = 0.8;

        // Sync UI Buttons
        const btnSpotlight = document.getElementById('btn-spotlight');
        if (btnSpotlight) btnSpotlight.classList.remove('active');
    } else {
        // ── HIGH FIDELITY MODE ──
        if (hfGlobe) hfGlobe.visible = true;
        if (wireframeGlobe) wireframeGlobe.visible = false;
        if (cloudMesh) cloudMesh.visible = true;
        
        if (globeGlow) {
            globeGlow.visible = true;
            globeGlow.material.color.setHex(0xffffff);
            globeGlow.material.opacity = 0.15; // Faint white glow for HF
        }

        // Restore lights
        if (window._mapSunLight) window._mapSunLight.visible = true;
        if (window._mapFillLight) window._mapFillLight.visible = true;
        if (window._mapAmbientLight) window._mapAmbientLight.intensity = 0.25;

        // Sync UI Buttons
        const btnSpotlight = document.getElementById('btn-spotlight');
        if (btnSpotlight) btnSpotlight.classList.add('active');
        
        // Atmosphere visibility depends on atmospheric button state
        const btnAtmo = document.getElementById('btn-atmosphere');
        if (atmosphere && (!btnAtmo || btnAtmo.classList.contains('active'))) {
            atmosphere.forEach(m => m.visible = true);
        }
    }
    
    // Maintain visual boost synchronicity across mode switches
    if (typeof window.applyVisualBoostState === 'function') {
        window.applyVisualBoostState();
    }
}


// ── POPULATE LOGS MODAL ───────────────────────────────────────────────
function populateLogsModal() {
    const body = document.getElementById('logs-modal-body');
    if (!body || !window.AUDIT_LOG_HISTORY) return;

    body.innerHTML = window.AUDIT_LOG_HISTORY.map(log => `
        <div class="log-row">
            <span class="log-ts">${log.ts}</span>
            <span class="log-badge ${log.type}">${log.type.toUpperCase()}</span>
            <div>
                <div class="log-content">
                    <span class="log-event">${log.event}</span>${log.text}
                </div>
                <div class="log-loc">↳ ${log.loc}</div>
            </div>
        </div>
    `).join('');
}

// ── POPULATE SYSTEM INFO MODAL ────────────────────────────────────────
function populateInfoModal() {
    const body = document.getElementById('info-modal-body');
    if (!body || !window.SYSTEM_METRICS) return;

    body.innerHTML = window.SYSTEM_METRICS.map(m => {
        const val = typeof m.value === 'function' ? m.value() : m.value;
        const statusKey = typeof m.status === 'function' ? m.status() : m.status;
        const cls = statusKey === 'critical' ? 'critical' : (val === 'SEALED' ? 'sealed' : '');
        return `
            <div class="metric-row">
                <span class="m-label">${m.label}</span>
                <span class="m-value ${cls}">${val}</span>
            </div>`;
    }).join('');
}

// ── QUARANTINE SEQUENCE ───────────────────────────────────────────────
function runQuarantineSequence() {
    const btn = document.getElementById('btn-quarantine');
    const log = document.getElementById('threat-action-log');
    if (!btn || !log || window._threatQuarantined) return;

    btn.disabled = true;

    const steps = [
        { delay: 0, cls: 'warn', text: '> Initiating Quarantine Protocol…' },
        { delay: 600, cls: 'ok', text: '  [OK] Isolating Node G-14 from Sector G mesh…' },
        { delay: 1300, cls: 'ok', text: '  [OK] Neural pathway override: CMDR-77X applied.' },
        { delay: 2100, cls: 'warn', text: '  [~]  Scrubbing exfil packet queue…' },
        { delay: 3000, cls: 'ok', text: '  [OK] 847 anomalous packets discarded.' },
        { delay: 3800, cls: 'ok', text: '  [OK] Node G-14 sealed in sandbox layer.' },
        { delay: 4600, cls: 'done', text: '  ✓ QUARANTINE COMPLETE — Sector G integrity restored.' },
    ];

    log.innerHTML = '';
    steps.forEach(s => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = `threat-log-line ${s.cls}`;
            line.textContent = s.text;
            log.appendChild(line);
            log.scrollTop = log.scrollHeight;
        }, s.delay);
    });

    // After all steps: visually resolve the threat
    setTimeout(() => {
        window._threatQuarantined = true;
        btn.textContent = '✓ QUARANTINE SEALED';

        // Clear breach visual from map
        const callout = document.getElementById('breach-callout');
        if (callout) {
            callout.style.transition = 'opacity 1s';
            callout.style.opacity = '0';
            setTimeout(() => callout.classList.add('hidden'), 1000);
        }

        // Resolve critical node to green on globe
        const globe = window._mapGlobe;
        if (globe) {
            globe.nodes.forEach(n => {
                if (n.userData.status === 'critical') {
                    n.userData.status = 'resolved';
                    n.material.color.setHex(0x22c55e); // Turn green
                    n.scale.set(1, 1, 1);
                }
            });
        }

        // Update left sidebar alert banner
        const alertBanner = document.querySelector('.red-alert');
        if (alertBanner) {
            alertBanner.style.transition = 'all 0.8s';
            alertBanner.style.background = 'rgba(34, 197, 94, 0.15)';
            alertBanner.style.borderColor = 'rgba(34, 197, 94, 0.4)';
            alertBanner.style.color = '#22c55e';
            alertBanner.innerHTML = '<i data-lucide="shield-check"></i> Quarantine Sealed';
            lucide.createIcons();
        }
    }, steps[steps.length - 1].delay + 800);
}

// ── MAP MODE ACTIVATOR ────────────────────────────────────────────────
function activateMapMode(mode) {
    const globe = window._mapGlobe;
    const breachCallout = document.getElementById('breach-callout');

    // Clear any running scan intervals
    if (window._mapScanInterval) {
        clearInterval(window._mapScanInterval);
        window._mapScanInterval = null;
    }

    window._mapTabState = mode;

    // Close any open threat panel on mode switch (except threat mode)
    if (mode !== 'threat') {
        document.getElementById('panel-threat-action')?.classList.add('hidden');
    }

    switch (mode) {
        case 'monitoring': {
            // Steady orbit — reset everything
            if (globe) gsap_like_rotate(globe.globeGroup, 1.6, 900);
            if (breachCallout && !window._threatQuarantined) breachCallout.classList.add('hidden');

            // Inject a new "monitoring started" entry into the live log
            const logEl = document.getElementById('audit-trail-log');
            if (logEl) {
                const el = document.createElement('div');
                el.className = 'log-entry';
                el.innerHTML = `<div class="dot"></div><div class="log-text"><span class="text-dim">Active Monitoring resumed</span><br/>Orbit nominal · All sectors scanned.</div>`;
                logEl.prepend(el);
                if (logEl.children.length > 8) logEl.lastElementChild.remove();
            }
            break;
        }

        case 'sector-g': {
            // Rotate to critical node facing front
            if (globe) gsap_like_rotate(globe.globeGroup, 1.8, 1000);
            if (breachCallout && !window._threatQuarantined) breachCallout.classList.remove('hidden');

            // Show sector intel callout in the center bottom title
            const intel = window.SECTOR_G_INTEL;
            const centerTitle = document.querySelector('.bottom-center-title');
            if (centerTitle && intel) {
                const original = centerTitle.innerHTML;
                centerTitle.innerHTML = `<span style="color:var(--theme-accent);font-size:0.72rem;font-family:var(--font-mono)">
                    ${intel.name} · ${intel.critical} CRITICAL · ${intel.warning} WARN · ${intel.stable} CLEAR
                </span>`;
                setTimeout(() => { centerTitle.innerHTML = original; }, 5000);
            }
            break;
        }

        case 'scan': {
            // Fast-spin globe for 4s then settle
            if (globe) {
                const start = Date.now();
                window._mapScanInterval = setInterval(() => {
                    const elapsed = Date.now() - start;
                    globe.globeGroup.rotation.y -= 0.018;
                    if (elapsed > 4000) {
                        clearInterval(window._mapScanInterval);
                        window._mapScanInterval = null;
                        gsap_like_rotate(globe.globeGroup, globe.globeGroup.rotation.y % (2 * Math.PI), 600);
                    }
                }, 16);
            }

            // Cascade-flash all widgets as "scanned"
            document.querySelectorAll('.holo-widget').forEach((w, i) => {
                setTimeout(() => {
                    w.style.transition = 'border-color 0.25s';
                    w.style.borderColor = 'rgba(0, 240, 255, 0.85)';
                    setTimeout(() => { w.style.borderColor = ''; }, 350);
                }, i * 100);
            });

            // Add scan events to the audit trail
            const scanEvents = [
                { type: 'info', text: `Scan Area initiated · ${new Date().toLocaleTimeString()}` },
                { type: 'info', text: 'All 9 sector nodes queried · 0 new anomalies.' },
            ];
            const logEl = document.getElementById('audit-trail-log');
            if (logEl) {
                scanEvents.forEach((ev, i) => {
                    setTimeout(() => {
                        const el = document.createElement('div');
                        el.className = 'log-entry';
                        el.innerHTML = `<div class="dot"></div><div class="log-text">${ev.text}</div>`;
                        logEl.prepend(el);
                        if (logEl.children.length > 8) logEl.lastElementChild.remove();
                    }, i * 700);
                });
            }
            if (breachCallout) breachCallout.classList.add('hidden');
            break;
        }

        case 'threat': {
            // Rotate to threat node and open the Threat Response panel
            if (globe) {
                gsap_like_rotate(globe.globeGroup, 1.0, 800);
                globe.nodes.forEach(n => {
                    if (n.userData.status === 'critical') {
                        const pulse = () => {
                            n.scale.set(2.2, 2.2, 2.2);
                            setTimeout(() => { n.scale.set(1, 1, 1); }, 350);
                        };
                        pulse();
                        setTimeout(pulse, 800);
                    }
                });
            }

            if (breachCallout && !window._threatQuarantined) {
                breachCallout.classList.remove('hidden');
                breachCallout.style.transition = 'box-shadow 0.3s';
                breachCallout.style.boxShadow = '0 0 35px rgba(255, 62, 62, 0.95)';
                setTimeout(() => { breachCallout.style.boxShadow = ''; }, 2200);
            }

            // Open the threat response panel if not already quarantined
            const panel = document.getElementById('panel-threat-action');
            const actionLog = document.getElementById('threat-action-log');
            if (panel && !window._threatQuarantined) {
                panel.classList.remove('hidden');
                lucide.createIcons();
                if (actionLog) {
                    const intel = window.SECTOR_G_INTEL;
                    actionLog.innerHTML = `
                        <div class="threat-log-line err">BREACH DETECTED: ${intel?.breach || 'Node G-14 DATA EXFIL'}</div>
                        <div class="threat-log-line warn">Location: ${intel?.coords || 'Lat 10.0 N, Lon -20.0 E'}</div>
                        <div class="threat-log-line warn">Protocol: ${intel?.protocol || 'Mandatory Quarantine Required'}</div>
                        <div class="threat-log-line">Awaiting Lead Auditor override command…</div>
                    `;
                }
            }

            // Flash threat widget border
            const sectorWidget = document.querySelector('.widget-sector-analysis');
            if (sectorWidget) {
                sectorWidget.style.transition = 'border-color 0.3s';
                sectorWidget.style.borderColor = 'rgba(255, 62, 62, 0.9)';
                setTimeout(() => { sectorWidget.style.borderColor = ''; }, 2200);
            }
            break;
        }
    }
}

/**
 * Lightweight Y-axis rotation helper (no external dep).
 */
function gsap_like_rotate(obj, targetY, durationMs) {
    const startY = obj.rotation.y;
    const diff = targetY - startY;
    const startTime = Date.now();
    function step() {
        const t = Math.min(1, (Date.now() - startTime) / durationMs);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        obj.rotation.y = startY + diff * ease;
        if (t < 1) requestAnimationFrame(step);
    }
    step();
}

// ═══════════════════════════════════════════════════════
// PHASE-2 WIDGET RENDERERS
// ═══════════════════════════════════════════════════════

// ── COMPLIANCE INDEX ──────────────────────────────────
function renderComplianceWidget() {
    const container = document.getElementById('compliance-list');
    if (!container || !window.COMPLIANCE_DATA) return;
    container.innerHTML = window.COMPLIANCE_DATA.map(item => `
        <div class="compliance-row">
            <span style="color:var(--text-mid);font-size:0.72rem;min-width:50px">${item.sector}</span>
            <div class="compliance-bar-wrap">
                <div class="compliance-bar ${item.tier}" style="width:${item.score}%"></div>
            </div>
            <span class="compliance-pct">${item.score}%</span>
        </div>
    `).join('');
}

// ── RESOURCE DONUT CHART (Canvas) ─────────────────────
function renderDonutChart() {
    const canvas = document.getElementById('resource-donut');
    const legend = document.getElementById('donut-legend');
    if (!canvas || !window.RESOURCE_DATA) return;

    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = cx - 4;
    const innerR = outerR * 0.55;
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    window.RESOURCE_DATA.forEach(item => {
        const sweep = (item.pct / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();

        // Gap between segments
        startAngle += sweep + 0.04;
    });

    // Donut hole
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(4, 14, 22, 0.95)';
    ctx.fill();

    // Center label
    ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.font = 'bold 9px Fira Code, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ALLOC', cx, cy - 5);
    ctx.fillText('%', cx, cy + 7);

    // Legend
    if (legend) {
        legend.innerHTML = window.RESOURCE_DATA.map(item => `
            <div class="donut-item">
                <div class="donut-dot" style="background:${item.color}"></div>
                <span>${item.label} <strong style="color:var(--text-bright)">${item.pct}%</strong></span>
            </div>
        `).join('');
    }
}

// ── ADMIN ACTIVITY ────────────────────────────────────
function renderAdminActivity() {
    const container = document.getElementById('admin-activity-log');
    if (!container || !window.ADMIN_ACTIVITY) return;
    container.innerHTML = window.ADMIN_ACTIVITY.map(e => `
        <div class="admin-entry">
            <div class="adot"></div>
            <span class="a-time">${e.time}</span>
            <span class="a-msg"><span class="a-who">${e.who}</span> — ${e.msg}</span>
        </div>
    `).join('');
}

// ── USER SESSIONS ─────────────────────────────────────
function renderSessions() {
    const container = document.getElementById('session-feed');
    if (!container || !window.SESSION_DATA) return;
    container.innerHTML = window.SESSION_DATA.map(s => {
        // Simulate slight ping fluctuation
        const pingBase = parseInt(s.ping);
        const jitter = Math.floor(Math.random() * 3);
        const displayPing = `${pingBase + jitter}ms`;
        return `
        <div class="session-row ${s.active ? 'active-session' : ''}">
            <div>
                <div class="session-user">${s.user}</div>
                <div class="session-node">${s.node}</div>
            </div>
            <div class="session-ping">${displayPing}</div>
        </div>`;
    }).join('');
}

// ── HARDWARE GAUGES ───────────────────────────────────
function renderHardwareGauges() {
    const container = document.getElementById('hw-gauges');
    if (!container || !window.HARDWARE_METRICS) return;
    container.innerHTML = window.HARDWARE_METRICS.map(m => {
        const val = Math.min(100, Math.max(10, m.base + Math.floor(Math.random() * m.variance * 2) - m.variance));
        const cls = val >= 80 ? 'hot' : val >= 55 ? 'warm' : 'cool';
        return `
        <div class="hw-gauge-item">
            <span class="hw-label">${m.label}</span>
            <div class="hw-track"><div class="hw-fill ${cls}" style="width:${val}%"></div></div>
            <span class="hw-value">${val}°C</span>
        </div>`;
    }).join('');
}

// ── ANOMALY SCANNER ───────────────────────────────────
function initAnomalyScanner() {
    const resultEl = document.getElementById('anomaly-result');
    if (!resultEl) return;

    const states = [
        { text: 'SCANNING…', cls: '' },
        { text: 'SCANNING…', cls: '' },
        { text: 'SCANNING…', cls: '' },
        { text: 'NO ANOMALY', cls: '' },
        { text: 'SCANNING…', cls: '' },
        { text: 'VARIANCE +2.1%', cls: '' },
        { text: 'SCANNING…', cls: '' },
    ];

    let idx = 0;
    setInterval(() => {
        if (document.body.classList.contains('lockdown-active')) return;
        const s = states[idx % states.length];
        resultEl.textContent = s.text;
        resultEl.className = `anomaly-result${s.cls ? ' ' + s.cls : ''}`;
        idx++;
    }, 3200);

    // After quarantine, resolve the scanner
    const origQuarantine = window._onQuarantineComplete;
    window._onQuarantineComplete = () => {
        if (resultEl) {
            resultEl.textContent = 'SECTOR CLEAR';
            resultEl.className = 'anomaly-result';
        }
        if (origQuarantine) origQuarantine();
    };
}

// ─────────────────────────────────────────────────
// NEW PHASE-2 (B) RENDER FUNCTIONS
// ─────────────────────────────────────────────────

function renderLatencyMatrix() {
    const grid = document.getElementById('latency-matrix-grid');
    if (!grid || !window.LATENCY_MATRIX_DATA) return;
    grid.innerHTML = window.LATENCY_MATRIX_DATA.map(d => {
        const jitter = Math.floor(Math.random() * 5);
        const finalVal = d.val + jitter;
        let cls = '';
        if (finalVal > 30) cls = 'high-latency';
        else if (finalVal < 10) cls = 'low-latency';
        return `<div class="latency-cell ${cls}">${finalVal}ms</div>`;
    }).join('');
}

function renderIntegritySeals() {
    const container = document.getElementById('seal-container');
    if (!container || !window.INTEGRITY_SEAL_DATA) return;
    container.innerHTML = window.INTEGRITY_SEAL_DATA.map(s => `
        <div class="seal-indicator ${s.status}">
            <i data-lucide="${s.status === 'locked' ? 'lock' : 'unlock'}"></i>
            <span style="font-size:0.6rem;margin-top:2px;">${s.name}</span>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderSectorFlow() {
    const canvas = document.getElementById('sector-flow-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    for (let i = 0; i < w; i += 10) {
        ctx.lineTo(i, h / 2 + Math.sin(i / 20 + Date.now() / 500) * 15);
    }
    ctx.stroke();
    requestAnimationFrame(renderSectorFlow);
}

function renderIncidents() {
    const feed = document.getElementById('incident-list');
    if (!feed || !window.INCIDENT_DATA) return;
    feed.innerHTML = window.INCIDENT_DATA.map(i => `
        <div class="incident-entry">
            <span class="incident-code">${i.code}</span>
            <span class="incident-msg">${i.msg}</span>
            <span class="incident-loc">${i.loc}</span>
        </div>
    `).join('');
}

function renderBackups() {
    const grid = document.getElementById('backup-list');
    if (!grid || !window.BACKUP_DATA) return;
    grid.innerHTML = window.BACKUP_DATA.map(b => `
        <div class="backup-snap">
            <span class="snap-label">${b.label}</span>
            <span class="snap-item">${b.time}</span>
            <span class="snap-item" style="color:${b.integrity === '100%' ? '#22c55e' : '#ff3e3e'}">${b.integrity}</span>
        </div>
    `).join('');
}

function renderCredentialGauge() {
    const container = document.getElementById('credential-gauge');
    if (!container || !window.CREDENTIAL_LEVEL) return;
    container.innerHTML = `
        <div class="cred-meter">
            <div class="cred-fill" style="width: ${window.CREDENTIAL_LEVEL.access}%"></div>
        </div>
        <div style="font-size:0.6rem;color:var(--text-dim);margin-top:5px;font-family:var(--font-mono)">
            ${window.CREDENTIAL_LEVEL.tier} // ACCESS ${window.CREDENTIAL_LEVEL.access}%
        </div>
    `;
}

function renderTopology() {
    const wrap = document.getElementById('topology-map');
    if (!wrap) return;
    wrap.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--text-dim);font-family:var(--font-mono)">MAP RECON [OK]</div>';
}

function renderThreatVectors() {
    const map = document.getElementById('threat-vector-map');
    if (!map || !window.THREAT_VECTOR_DATA) return;
    let dots = '';
    for (let i = 0; i < 60; i++) {
        const isAlert = window.THREAT_VECTOR_DATA.some(v => v.id === i && v.alert);
        dots += `<div class="vector-dot ${isAlert ? 'alert' : ''}"></div>`;
    }
    map.innerHTML = dots;
}

function renderGeoLogs() {
    const feed = document.getElementById('geo-log-list');
    if (!feed || !window.GEO_LOG_DATA) return;
    feed.innerHTML = window.GEO_LOG_DATA.map(l => `
        <div class="geo-entry">
            <span class="geo-coord">${l.coord}</span>
            <span class="geo-label">${l.label}</span>
        </div>
    `).join('');
}

function renderQuarantineList() {
    const feed = document.getElementById('quarantine-list');
    if (!feed || !window.QUARANTINE_DATA) return;
    feed.innerHTML = window.QUARANTINE_DATA.map(q => `
        <div class="quarantine-item"><i data-lucide="skull"></i> ${q}</div>
    `).join('');
    lucide.createIcons();
}

function renderUptime() {
    const grid = document.getElementById('uptime-stats');
    if (!grid || !window.UPTIME_DATA) return;
    grid.innerHTML = window.UPTIME_DATA.map(u => `
        <div class="uptime-box">
            <div class="uptime-label">${u.label}</div>
            <div class="uptime-val">${u.val}</div>
        </div>
    `).join('');
}

function renderMemoryMatrix() {
    const grid = document.getElementById('memory-matrix-grid');
    if (!grid || !window.MEMORY_MATRIX_DATA) return;
    grid.innerHTML = window.MEMORY_MATRIX_DATA.map(pixel => `
        <div class="mem-pixel ${pixel === 1 ? 'filled' : ''}"></div>
    `).join('');
}

function renderSignalInterference() {
    const val = document.getElementById('noise-value');
    if (val) val.textContent = (Math.random() * 5).toFixed(1) + '%';

    const canvas = document.getElementById('noise-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#facc15';
    for (let i = 0; i < 50; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
    setTimeout(renderSignalInterference, 100);
}

