// map_state.js - Global state for the Holographic Map
window.startTime = Date.now();

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
window._manualSearchToggle = false; // Track manual search bar visibility

// Textures & Layers
window._mapTextures = null;
window._mapGlobeHF = null;
window._mapGlobeMat = null;
window._mapGlobeWireframe = null;
window._mapGlobeGlow = null;
window._mapCloudMesh = null;
window._mapAtmosphere = null;
window._mapAmbientLight = null;
window._mapSunLight = null;
window._mapFillLight = null;
window._satSpeedMultiplier = 1.0;
window._mapOrbitalGroup = null;
window._mapSatellites = null;

// LOD Groups
window._mapRegionGroup = null;
window._mapCityGroup = null;

// Transition State
window._mapTargetCameraZ = null;
window._mapTargetGlobeScale = 1.0;
window._isVisualBoostActive = false;

// Path State
window._currentPathObj = null;
window._pathAnimId = null;

// Threat State
window._threatQuarantined = false;
