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

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    if (typeof initNotifications === 'function') initNotifications();

    if (typeof THREE !== 'undefined') {
        initGlobe();
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
    camera.position.z = 260;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Initial resize to ensure correct bounds
    setTimeout(() => {
        if(container.clientWidth > 0 && container.clientHeight > 0) {
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

    // GLOBE GROUP
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // CORE SPHERE (Holographic base)
    const sphereGeo = new THREE.SphereGeometry(90, 48, 48);
    
    // Wireframe material (Cyan mesh)
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const globe = new THREE.Mesh(sphereGeo, wireMat);
    globeGroup.add(globe);

    // Inner glow
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x005577,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const innerGlobe = new THREE.Mesh(new THREE.SphereGeometry(88, 32, 32), innerMat);
    globeGroup.add(innerGlobe);

    // Atmospheric outer glow
    const outerGlowGeo = new THREE.SphereGeometry(95, 32, 32);
    const outerGlowMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });
    const outerGlobe = new THREE.Mesh(outerGlowGeo, outerGlowMat);
    globeGroup.add(outerGlobe);

    // ADD NODES (from map_data.js)
    const nodes = [];
    const nodeData = window.NODE_DATA || [];

    // Connect lines group
    const linesGroup = new THREE.Group();
    globeGroup.add(linesGroup);

    nodeData.forEach(data => {
        // Convert lat/lon to sphere position
        const phi = (90 - data.lat) * (Math.PI / 180);
        const theta = (data.lon + 180) * (Math.PI / 180);

        const r = 90;
        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));

        let color = 0x22c55e; // Green
        let size = 1.5;
        if (data.status === 'warning') {
            color = 0xfacc15; // Yellow
            size = 2;
        } else if (data.status === 'critical') {
            color = 0xff3e3e; // Red
            size = 4;
            
            // Show the critical HTML callout near this visual node
            const callout = document.getElementById('breach-callout');
            if (callout) callout.classList.remove('hidden');
        }

        // Inner solid core
        const nodeGeo = new THREE.SphereGeometry(size, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({ color: color });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        
        // Glow sprite
        const glowMaterial = new THREE.SpriteMaterial({
            map: createGlowTexture(color),
            color: color,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.set(size * 5, size * 5, 1);
        node.add(glow);

        node.position.set(x, y, z);
        node.userData = data;
        globeGroup.add(node);
        nodes.push(node);
    });

    // Create connections (lines between nodes)
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.3 });
    const lineMatDim = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.1 });
    const redLineMat = new THREE.LineBasicMaterial({ color: 0xff3e3e, transparent: true, opacity: 0.5 });
    
    // Add some random connection web to the critical node
    const criticalNode = nodes.find(n => n.userData.threat);

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            // Favor connecting nearby nodes
            const dist = nodes[i].position.distanceTo(nodes[j].position);
            
            if (dist < 100 || (nodes[i].userData.threat || nodes[j].userData.threat)) {
                
                // Add some randomness to drawing the line
                if(Math.random() > 0.3) {
                    const points = [];
                    points.push(nodes[i].position);
                    
                    // Arc computation for lines (curve along sphere)
                    const midPoint = new THREE.Vector3().addVectors(nodes[i].position, nodes[j].position).multiplyScalar(0.5);
                    midPoint.normalize().multiplyScalar(100); // pull outwards
                    
                    const curve = new THREE.QuadraticBezierCurve3(
                        nodes[i].position,
                        midPoint,
                        nodes[j].position
                    );
                    
                    const curvePoints = curve.getPoints(10);
                    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
                    
                    let activeMat = lineMatDim;
                    if (dist < 60) activeMat = lineMat;
                    if (nodes[i].userData.threat || nodes[j].userData.threat) activeMat = redLineMat;

                    const line = new THREE.Line(lineGeo, activeMat);
                    linesGroup.add(line);
                }
            }
        }
    }

    globeGroup.rotation.y = 1.5; // Initial orientation
    globeGroup.rotation.x = 0.2;

    // ORBIT CONTROLS
    window.controls = new THREE.OrbitControls(camera, renderer.domElement);
    window.controls.enableDamping = true;
    window.controls.dampingFactor = 0.05;
    window.controls.rotateSpeed = 0.8;
    window.controls.enableZoom = false; // Keep it focused
    window.controls.autoRotate = true;
    window.controls.autoRotateSpeed = 0.5;

    // INTERACTION: Precise Click Detection (Distinguish from Drag)
    container.addEventListener('pointerdown', (e) => {
        window._pointerStart.x = e.clientX;
        window._pointerStart.y = e.clientY;
    });

    container.addEventListener('pointerup', (e) => {
        const deltaX = Math.abs(e.clientX - window._pointerStart.x);
        const deltaY = Math.abs(e.clientY - window._pointerStart.y);

        // If moved less than 5px, it's a click/tap
        if (deltaX < 5 && deltaY < 5) {
            const rect = renderer.domElement.getBoundingClientRect();
            window.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            window.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            window.raycaster.setFromCamera(window.mouse, camera);
            const intersects = window.raycaster.intersectObjects(nodes);

            if (intersects.length > 0) {
                const clickedNode = intersects[0].object;
                const nodeId = clickedNode.userData.id;
                
                if (window.selectedNodeId === nodeId) {
                    window.selectedNodeId = null; // Deselect
                } else {
                    window.selectedNodeId = nodeId; // Select
                }
                updateSidebarForSelection();
            } else {
                // Clicking empty space deselects
                if (window.selectedNodeId) {
                    window.selectedNodeId = null;
                    updateSidebarForSelection();
                }
            }
        }
    });

    // Disable auto-rotate when user actually drags
    window.controls.addEventListener('start', () => {
        window.controls.autoRotate = false;
    });

    // Re-enable auto-rotate after some idle time (optional, but requested simple manual)
    // For now, let's just keep it manual once moved.


    // ANIMATION LOOP
    function animate() {
        requestAnimationFrame(animate);

        if (window.controls) window.controls.update();
        
        // Visual pulses and feedback
        nodes.forEach(n => {
            const isSelected = window.selectedNodeId === n.userData.id;
            
            if (n.userData.status === 'critical' || isSelected) {
                const freq = isSelected ? 0.008 : 0.004;
                const baseS = isSelected ? 2.0 : 1.0;
                const s = (baseS + Math.sin(Date.now() * freq) * 0.5);
                n.scale.set(s, s, s);
                
                // Increase glow for selected
                if (n.children[0]) {
                    n.children[0].scale.set(s * 8, s * 8, 1);
                }
            } else {
                n.scale.set(1, 1, 1);
                if (n.children[0]) n.children[0].scale.set(n.userData.status === 'warning' ? 10 : 7.5, n.userData.status === 'warning' ? 10 : 7.5, 1);
            }

            // Make glow face camera
            if(n.children.length > 0) {
                 n.children[0].quaternion.copy(camera.quaternion);
            }
        });

        renderer.render(scene, camera);
    }
    animate();

    // Expose globe internals for tab controls
    window._mapGlobe = { globeGroup, camera, renderer, scene, nodes };

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Helper for glow texture
    function createGlowTexture(colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        
        let hexStr = colorHex.toString(16);
        while (hexStr.length < 6) hexStr = '0' + hexStr;
        const r = parseInt(hexStr.substring(0,2), 16);
        const g = parseInt(hexStr.substring(2,4), 16);
        const b = parseInt(hexStr.substring(4,6), 16);
        
        gradient.addColorStop(0, `rgba(${r},${g},${b}, 1)`);
        gradient.addColorStop(0.2, `rgba(${r},${g},${b}, 0.8)`);
        gradient.addColorStop(1, `rgba(${r},${g},${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        return new THREE.CanvasTexture(canvas);
    }
}

function initMockDataFeeds() {
    // 1. Metric Bars simulation (still purely visual)
    const barsContainer = document.getElementById('metric-bars-container');
    if (barsContainer) {
        for(let i=0; i<12; i++) {
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
    const scanHeader     = document.querySelector('.widget-network-scan .sidebar-toggle-label');
    if (overviewHeader) overviewHeader.textContent = data ? `NODE ${nodeId} INTEL` : 'AUDIT OVERVIEW';
    if (scanHeader)     scanHeader.textContent     = data ? `NODE ${nodeId} FEED`  : 'NETWORK SCAN';

    // ── 2. Audit Overview Stats ──────────────────────────────────────
    setText('stat-active-audits',  data ? data.audits           : globalData.activeAudits);
    setText('stat-net-integrity',  data ? data.integrity        : globalData.netIntegrity);
    setText('stat-active-threats', (data ? data.threats : globalData.activeThreats) + ' ');
    setText('stat-sector-status',  data ? data.status           : globalData.sectorStatus);

    // ── 3. Network Scan Stats ────────────────────────────────────────
    setText('stat-latency',   data ? data.latency  : globalData.latency);
    setText('stat-data-flow', data ? data.flow      : globalData.dataFlow);

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
        setText('threat-title',  threat.title);
        setText('threat-type',   threat.type);
        setText('threat-source', threat.source);
    }

    // ── 6. System Metrics ────────────────────────────────────────────
    const metrics = data ? data.metrics : { activeNodes: globalData.activeNodes, systemLoad: globalData.systemLoad };
    if (metrics) {
        setText('metric-active-nodes', metrics.activeNodes);
        setText('metric-system-load',  metrics.systemLoad);
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
        { delay: 0,    cls: 'warn', text: '> Initiating Quarantine Protocol…' },
        { delay: 600,  cls: 'ok',   text: '  [OK] Isolating Node G-14 from Sector G mesh…' },
        { delay: 1300, cls: 'ok',   text: '  [OK] Neural pathway override: CMDR-77X applied.' },
        { delay: 2100, cls: 'warn', text: '  [~]  Scrubbing exfil packet queue…' },
        { delay: 3000, cls: 'ok',   text: '  [OK] 847 anomalous packets discarded.' },
        { delay: 3800, cls: 'ok',   text: '  [OK] Node G-14 sealed in sandbox layer.' },
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

