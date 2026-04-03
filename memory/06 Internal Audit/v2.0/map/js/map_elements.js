// map_elements.js - 3D Elements and Pathfinding Logic

function initMapElements(globeGroup, camera) {
    const nodes = [];
    const nodeData = window.NODE_DATA || [];

    // Connect lines group
    const linesGroup = new THREE.Group();
    window._mapLinesGroup = linesGroup;
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

        const dotGeo = new THREE.SphereGeometry(size, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color });
        const node = new THREE.Mesh(dotGeo, dotMat);
        node.userData = data;

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
        
        if (!window._mapStatusNodesGroup) {
            window._mapStatusNodesGroup = new THREE.Group();
            globeGroup.add(window._mapStatusNodesGroup);
        }
        window._mapStatusNodesGroup.add(node);
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
async function drawQuantumPath(coordinateArray) {
    if (!window._mapGlobe || !window._mapGlobe.globeGroup || !coordinateArray || coordinateArray.length < 2) return;
    const { globeGroup, camera } = window._mapGlobe;
    
    const getPos = (c) => {
        const phi = (90 - c.lat) * (Math.PI / 180);
        const theta = (c.lon + 180) * (Math.PI / 180);
        const r = 93.0; 
        return new THREE.Vector3(
            -(r * Math.sin(phi) * Math.cos(theta)),
            (r * Math.cos(phi)),
            (r * Math.sin(phi) * Math.sin(theta))
        );
    };

    clearQuantumPath();

    const pathType = window.SELECTED_PATH_TYPE || 'curve';
    const points = [];
    const segments = 64;

    let curve;
    const intermediatePoints = [];
    for (let i = 0; i < coordinateArray.length; i++) {
        intermediatePoints.push(getPos(coordinateArray[i]));
    }

    const baseGroundR = 92.0;
    if (pathType === 'straight') {
        const densePoints = [];
        for (let i = 0; i < intermediatePoints.length - 1; i++) {
            const p1 = intermediatePoints[i];
            const p2 = intermediatePoints[i+1];
            const startJ = (i === 0) ? 0 : 1;
            for (let j = startJ; j <= 20; j++) {
                const t = j / 20;
                const p = new THREE.Vector3().lerpVectors(p1, p2, t);
                
                const targetH = 93.5 + (window.ICON_ALTITUDE_LEVEL || 0);
                let ht = 1.0;
                if (t < 0.1) ht = t / 0.1;
                else if (t > 0.9) ht = (1.0 - t) / 0.1;
                const h = baseGroundR + (targetH - baseGroundR) * Math.sin(ht * Math.PI / 2);

                p.normalize().multiplyScalar(h);
                densePoints.push(p);
            }
        }
        curve = new THREE.CatmullRomCurve3(densePoints);
    } else if (pathType === 'circle') {
        const orbitalH = 94.5 + (window.ICON_ALTITUDE_LEVEL || 0); // Lowered from 100 to sit realistically above the globe
        const densePoints = [];
        for (let i = 0; i < intermediatePoints.length - 1; i++) {
            const p1 = intermediatePoints[i];
            const p2 = intermediatePoints[i+1];
            const startJ = (i === 0) ? 0 : 1;
            
            for (let j = startJ; j <= 48; j++) {
                const t = j / 48;
                const p = new THREE.Vector3().lerpVectors(p1, p2, t);
                
                let ht = 1.0;
                if (t < 0.1) ht = t / 0.1;
                else if (t > 0.9) ht = (1.0 - t) / 0.1;
                const h = baseGroundR + (orbitalH - baseGroundR) * Math.sin(ht * Math.PI / 2);

                p.normalize().multiplyScalar(h);
                densePoints.push(p);
            }
        }
        curve = new THREE.CatmullRomCurve3(densePoints);
    } else {
        // Default Curve (Arched)
        const densePoints = [];
        for (let i = 0; i < intermediatePoints.length - 1; i++) {
            const p1 = intermediatePoints[i];
            const p2 = intermediatePoints[i+1];
            const dist = p1.distanceTo(p2);
            const startJ = (i === 0) ? 0 : 1;
            for (let j = startJ; j <= 20; j++) {
                const t = j / 20;
                const p = new THREE.Vector3().lerpVectors(p1, p2, t);
                
                const curH = 93 + (window.ICON_ALTITUDE_LEVEL || 0) + Math.sin(Math.PI * t) * (dist * 0.06 + 3);
                let ht = 1.0;
                if (t < 0.15) ht = t / 0.15;
                else if (t > 0.85) ht = (1.0 - t) / 0.15;
                const h = baseGroundR + (curH - baseGroundR) * Math.sin(ht * Math.PI / 2);

                p.normalize().multiplyScalar(h);
                densePoints.push(p);
            }
        }
        curve = new THREE.CatmullRomCurve3(densePoints);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
    
    let material;
    const style = window.SELECTED_LINE_STYLE || 'pulsed';
    const pathColor = window.SELECTED_PATH_COLOR || 0x00f0ff;
    let dashSpeed = 0.25;
    
    if (style === 'solid') {
        material = new THREE.LineBasicMaterial({
            color: pathColor,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
    } else {
        let d = 3, g = 2;
        if (style === 'dotted') { d = 0.5; g = 3; dashSpeed = 0.15; }
        else if (style === 'hyper') { d = 1.0; g = 1.5; dashSpeed = 0.5; }
        else if (style === 'ghost') { d = 12; g = 15; dashSpeed = 0.08; }
        else if (style === 'spike') { d = 0.2; g = 8; dashSpeed = 0.4; }
        else if (style === 'field') { d = 25; g = 5; dashSpeed = 0.12; }
        
        material = new THREE.LineDashedMaterial({ 
            color: pathColor,
            dashSize: d,
            gapSize: g,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
    }
    
    const line = new THREE.Line(geometry, material);
    if (style !== 'solid') line.computeLineDistances();
    
    const glowLineMat = new THREE.LineBasicMaterial({ 
        color: pathColor, 
        transparent: true, 
        opacity: (style === 'ghost' ? 0.15 : 0.3),
        blending: THREE.AdditiveBlending
    });
    const glowLine = new THREE.Line(geometry, glowLineMat);
    
    // Create particle using helper
    const particle = await createPathParticle();
    
    const pathGroup = new THREE.Group();
    pathGroup.add(line);
    pathGroup.add(glowLine);
    pathGroup.add(particle);

    // ── INJECT ACCURATE GROUND MARKERS ──
    coordinateArray.forEach((coord) => {
        const phi = (90 - coord.lat) * (Math.PI / 180);
        const theta = (coord.lon + 180) * (Math.PI / 180);
        const r_globe = 92.0; 
        const x = -(r_globe * Math.sin(phi) * Math.cos(theta));
        const z = (r_globe * Math.sin(phi) * Math.sin(theta));
        const y = (r_globe * Math.cos(phi));

        const dotGeo = new THREE.SphereGeometry(0.8, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: pathColor });
        const marker = new THREE.Mesh(dotGeo, dotMat);
        marker.position.set(x, y, z);

        pathGroup.add(marker);
    });
    
    pathGroup.renderOrder = 100;
    line.renderOrder = 100;
    glowLine.renderOrder = 100;
    particle.renderOrder = 110; 

    window._currentPathObj = pathGroup;
    globeGroup.add(pathGroup);

    let progress = 0;
    const animatePath = () => {
        const speedMult = window.ICON_SPEED_MULTIPLIER || 1.0;
        progress += 0.006 * speedMult;
        if (progress > 1) progress = 0;
        
        const pos = curve.getPoint(progress);
        const p = pathGroup.children.find(c => c.userData.isPathParticle);
        if (p) {
            p.position.copy(pos);
            
            if (camera && window.SELECTED_POINTER_ICON && window.SELECTED_POINTER_ICON !== 'circle') {
                const limit = Math.min(progress + 0.01, 1.0);
                if (limit > progress) {
                    const nextPos = curve.getPoint(limit);
                    const worldPos = pos.clone();
                    pathGroup.localToWorld(worldPos);
                    const worldNextPos = nextPos.clone();
                    pathGroup.localToWorld(worldNextPos);

                    const vec1 = worldPos.project(camera);
                    const vec2 = worldNextPos.project(camera);
                    
                    const dx = vec2.x - vec1.x;
                    const dy = vec2.y - vec1.y;
                    
                    let iconOffset = 0;
                    let flipCorrection = false;
                    if (window.TRAVEL_MODES) {
                        const mode = window.TRAVEL_MODES.find(m => m.id === window.SELECTED_POINTER_ICON);
                        if (mode) {
                            if (typeof mode.angleOffset === 'number') iconOffset = mode.angleOffset;
                            if (mode.flipCorrection) flipCorrection = true;
                        }
                    }
                    
                    const angle = Math.atan2(dy, dx) - iconOffset;
                    
                    p.children.forEach(child => {
                        if (child.isSprite && child.material) {
                            child.material.rotation = angle;
                            if (flipCorrection) {
                                child.scale.y = (dx < 0) ? -Math.abs(child.scale.y) : Math.abs(child.scale.y);
                            } else {
                                child.scale.y = Math.abs(child.scale.y);
                            }
                        }
                    });
                }
            }
        }

        if (style !== 'solid') material.dashOffset -= dashSpeed * (window.ICON_SPEED_MULTIPLIER || 1.0);
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

    const iconColor = window.SELECTED_POINTER_COLOR || 0x00f0ff;

    if (!window.SELECTED_POINTER_ICON || window.SELECTED_POINTER_ICON === 'circle') {
        particle = createDefaultSphere(iconColor);
    } else {
        // Safe texture fetch
        const tex = window.createIconTexture ? await window.createIconTexture(iconName) : null;
        
        if (tex) {
            particle = new THREE.Group();
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: tex,
                color: iconColor,
                transparent: true,
                opacity: 1.0,
                blending: THREE.AdditiveBlending
            }));
            sprite.scale.set(16, 16, 1);
            particle.add(sprite);
        } else {
            console.log('Falling back to default dot pointer...');
            particle = createDefaultSphere(iconColor);
        }
    }
    particle.userData.isPathParticle = true;
    return particle;
}

/**
 * Fallback particle generator
 */
function createDefaultSphere(color) {
    const pGeo = new THREE.SphereGeometry(0.8, 12, 12);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1.0 });
    const mesh = new THREE.Mesh(pGeo, pMat);
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
window.clearQuantumPath = clearQuantumPath;
function clearQuantumPath() {
    if (!window._mapGlobe || !window._mapGlobe.globeGroup) return;
    const globeGroup = window._mapGlobe.globeGroup;

    if (window._currentPathObj) {
        globeGroup.remove(window._currentPathObj);
        window._currentPathObj.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        window._currentPathObj = null;
    }
    if (window._pathAnimId) {
        cancelAnimationFrame(window._pathAnimId);
        window._pathAnimId = null;
    }
}
