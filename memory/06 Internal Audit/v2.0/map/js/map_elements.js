// map_elements.js - 3D Elements and Pathfinding Logic

function initMapElements(globeGroup, camera) {
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

    // ── LOD LAYERS ──
    window._mapRegionGroup = new THREE.Group();
    window._mapCityGroup = new THREE.Group();
    globeGroup.add(window._mapRegionGroup);
    globeGroup.add(window._mapCityGroup);
    
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
            
            const dotGeo = new THREE.SphereGeometry(0.6, 8, 8);
            const dotMat = new THREE.MeshBasicMaterial({ color: color.replace('0.9)', '1)'), transparent: true, opacity: 0 });
            const dot = new THREE.Mesh(dotGeo, dotMat);
            dot.position.set(x * (90/91.5), y * (90/91.5), z * (90/91.5));
            dot.userData = { isCityDot: true };
            window._mapCityGroup.add(dot);
            window._mapCityGroup.add(sprite);
        });
    }

    focusGlobeOnStartup(globeGroup);
    return nodes;
}

/**
 * HIGH-VISIBILITY PATHFINDING
 */
async function drawQuantumPath(coordsFrom, coordsTo) {
    if (!window._mapGlobe || !window._mapGlobe.globeGroup) return;
    const { globeGroup, camera } = window._mapGlobe;
    
    const getPos = (c) => {
        const phi = (90 - c.lat) * (Math.PI / 180);
        const theta = (c.lon + 180) * (Math.PI / 180);
        const r = 90.2; 
        return new THREE.Vector3(
            -(r * Math.sin(phi) * Math.cos(theta)),
            (r * Math.cos(phi)),
            (r * Math.sin(phi) * Math.sin(theta))
        );
    };

    const vStart = getPos(coordsFrom);
    const vEnd = getPos(coordsTo);
    
    // Clear previous
    if (window._currentPathObj) {
        globeGroup.remove(window._currentPathObj);
        window._currentPathObj.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    }
    if (window._pathAnimId) cancelAnimationFrame(window._pathAnimId);

    const distance = vStart.distanceTo(vEnd);
    if (distance < 2) return;

    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const p = new THREE.Vector3().lerpVectors(vStart, vEnd, t);
        const minH = 15;
        const h = 90 + Math.max(minH, Math.sin(Math.PI * t) * (distance * 0.5 + 20));
        p.normalize().multiplyScalar(h);
        points.push(p);
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
    const material = new THREE.LineDashedMaterial({ 
        color: 0x00f0ff,
        dashSize: 3,
        gapSize: 2,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    
    const glowLineMat = new THREE.LineBasicMaterial({ 
        color: 0x00f0ff, 
        transparent: true, 
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const glowLine = new THREE.Line(geometry, glowLineMat);
    
    // Create particle using helper
    const particle = await createPathParticle();
    
    const pathGroup = new THREE.Group();
    pathGroup.add(line);
    pathGroup.add(glowLine);
    pathGroup.add(particle);
    
    window._currentPathObj = pathGroup;
    globeGroup.add(pathGroup);

    let progress = 0;
    const animatePath = () => {
        progress += 0.006;
        if (progress > 1) progress = 0;
        
        const pos = curve.getPoint(progress);
        const p = pathGroup.children.find(c => c.userData.isPathParticle);
        if (p) {
            p.position.copy(pos);
            
            // Dynamic rotation for vehicle pointers using real-time screen-space tangents
            if (camera && window.SELECTED_POINTER_ICON && window.SELECTED_POINTER_ICON !== 'circle') {
                const limit = Math.min(progress + 0.01, 1.0);
                if (limit > progress) {
                    const nextPos = curve.getPoint(limit);
                    const vec1 = pos.clone().project(camera);
                    const vec2 = nextPos.clone().project(camera);
                    
                    const dx = vec2.x - vec1.x;
                    const dy = vec2.y - vec1.y;
                    
                    // Lucide transport icons typically point Top-Right by default (45 deg angle)
                    // Subtract Math.PI / 4 to align the nose of the icon with the travel vector
                    const angle = Math.atan2(dy, dx) - (Math.PI / 4);
                    
                    p.children.forEach(child => {
                        if (child.isSprite && child.material) {
                            child.material.rotation = angle;
                        }
                    });
                }
            }
        }

        material.dashOffset -= 0.25;
        window._pathAnimId = requestAnimationFrame(animatePath);
    };
    animatePath();
}

/**
 * Creates the animated particle based on selection
 */
async function createPathParticle() {
    let particle;
    const mode = (window.TRAVEL_MODES || []).find(m => m.id === window.SELECTED_POINTER_ICON);
    const iconName = mode ? mode.icon : 'navigation';

    if (!window.SELECTED_POINTER_ICON || window.SELECTED_POINTER_ICON === 'circle') {
        particle = createDefaultSphere();
    } else {
        // Safe texture fetch
        const tex = window.createIconTexture ? await window.createIconTexture(iconName) : null;
        
        if (tex) {
            particle = new THREE.Group();
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: tex,
                transparent: true,
                opacity: 1.0,
                blending: THREE.AdditiveBlending
            }));
            sprite.scale.set(16, 16, 1);
            particle.add(sprite);
        } else {
            console.log('Falling back to default dot pointer...');
            particle = createDefaultSphere();
        }
    }
    particle.userData.isPathParticle = true;
    return particle;
}

/**
 * Fallback particle generator
 */
function createDefaultSphere() {
    const pGeo = new THREE.SphereGeometry(2.0, 12, 12);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1.0 });
    const mesh = new THREE.Mesh(pGeo, pMat);
    
    const pGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: createGlowTexture(0x00f0ff),
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    }));
    pGlow.scale.set(25, 25, 1);
    mesh.add(pGlow);
    return mesh;
}

/**
 * Updates the active pointer on the fly with Atomic Swap
 */
async function updateCurrentPathPointer() {
    if (!window._currentPathObj) return;
    const pathGroup = window._currentPathObj;
    const oldP = pathGroup.children.find(c => c.userData.isPathParticle);
    
    // ATOMIC SWAP: Load new first to prevent "hidden" state
    const newP = await createPathParticle();
    
    if (oldP) {
        newP.position.copy(oldP.position);
        pathGroup.remove(oldP);
        
        // Clean memory
        oldP.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    }
    pathGroup.add(newP);
}
