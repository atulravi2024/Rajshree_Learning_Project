// map_core.js - Core Three.js Engine and Scene Management

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
    window._mapGridMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.45 // Increased for better default visibility
    });
    const wireframeMat = window._mapGridMat;
    const wireframeGlobe = new THREE.Mesh(wireframeGeo, wireframeMat);
    wireframeGlobe.visible = false; // Explicitly hidden
    globeGroup.add(wireframeGlobe);
    window._mapGlobeWireframe = wireframeGlobe;

    // ── SIMPLE GLOBE GLOW EFFECT ────────────────────────────
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

    window._mapGlobe = { globeGroup, camera, scene, renderer };

    // Initialize Sub-Systems
    const nodes = initMapElements(globeGroup, camera);
    window._mapGlobe.nodes = nodes;
    
    initMapControls(container, camera, renderer, nodes);
    initOrbitalSystem(scene, camera, renderer);

    // Initial Zoom Slider Sync
    const zSlider = document.getElementById('globe-zoom-slider');
    if (zSlider) {
        zSlider.value = mapZToSlider(camera.position.length());
    }

    // ── ANIMATION LOOP ───────────────────────────────────────
    function animate() {
        if (window.controls) window.controls.update();
        const now = Date.now();

        // Slowly drift the cloud layer
        if (window._mapCloudMesh) {
            window._mapCloudMesh.rotation.y += 0.00008;
        }

        // Interpolate camera zoom
        if (typeof window._mapTargetCameraZ === 'number') {
            const currentDist = camera.position.length();
            const targetDist = window._mapTargetCameraZ;
            if (Math.abs(currentDist - targetDist) > 0.5) {
                const newDist = currentDist + (targetDist - currentDist) * 0.08;
                camera.position.setLength(newDist);
            } else {
                window._mapTargetCameraZ = null;
            }
        }

        if (typeof updateLOD === 'function') updateLOD(camera.position.length());

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

        // Orbital Ring Rotation
        if (window._mapOrbitalGroup && window._mapOrbitalGroup.visible) {
            updateOrbitalAnimation(now);
        }

        // Node pulses
        if (window._mapGlobe.nodes) {
            const cameraPos = camera.position;
            window._mapGlobe.nodes.forEach(n => {
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
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
    console.log("Holographic Map: THREE.js Render Loop RE-INITIALIZED [OK]");
}

function focusGlobeOnStartup(globeGroup) {
    const INDIA_COORDS = { lat: 20.59, lon: 78.96 };
    const criticalNode = (window.NODE_DATA || []).find(n => n.status === 'critical');
    const targetCoords = criticalNode ? { lat: criticalNode.lat, lon: criticalNode.lon } : INDIA_COORDS;
    const targetRot = calculateRotationForCoords(targetCoords.lat, targetCoords.lon);

    console.log(`Globe Orientation: ${criticalNode ? 'Critical Threat' : 'Default India'} [Lat: ${targetCoords.lat}, Lon: ${targetCoords.lon}]`);

    globeGroup.rotation.x = targetRot.x;
    gsap_like_rotate(globeGroup, targetRot.y, 1800);
}
