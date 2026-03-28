/**
 * map_data.js — Audit Hub Static Data Layer
 * Provides log history, system metrics and sector intel for the Map HUD.
 */

// ── AUDIT LOG HISTORY ─────────────────────────────────
window.AUDIT_LOG_HISTORY = [
    { ts: '2026-03-26 02:07:12', type: 'threat',  event: '#799', text: 'Unauthorized access vector detected.',            loc: 'Lat 77.8 N  Lon 84.0 E' },
    { ts: '2026-03-26 01:55:40', type: 'threat',  event: '#798', text: 'External intercept attempt — neural pathway.',     loc: 'Sector 06 / Fidelity Core' },
    { ts: '2026-03-26 01:44:03', type: 'warning', event: '#797', text: 'Heuristic variance +5.2% flagged in Sector 08.', loc: 'Protocol X Extension' },
    { ts: '2026-03-26 01:33:18', type: 'info',    event: '#796', text: 'Auto-sync cycle #403 complete. 100% integrity.', loc: 'Core Neural Path / Sector 00' },
    { ts: '2026-03-26 01:19:55', type: 'info',    event: '#795', text: 'Resource map updated — 52 artifacts indexed.',    loc: 'Domain 06 — Memory Registry' },
    { ts: '2026-03-26 01:08:32', type: 'warning', event: '#794', text: 'Drift +3.1% on Sector 02 topic index.',           loc: 'Research & Knowledge Node' },
    { ts: '2026-03-26 00:57:44', type: 'info',    event: '#793', text: 'Dashboard sync: 12 domains reporting nominal.',   loc: 'Frontier Hub v2.0' },
    { ts: '2026-03-26 00:44:17', type: 'info',    event: '#792', text: 'Audio pipeline validation passed — 505 files.',   loc: 'Domain 09 — Audio Script' },
    { ts: '2026-03-25 23:58:01', type: 'threat',  event: '#791', text: 'Sector G Node G-14: DATA EXFIL pattern locked.',  loc: 'Lat 10.0 N  Lon -20.0 E' },
    { ts: '2026-03-25 23:40:29', type: 'info',    event: '#790', text: 'Settings sync verified — postMessage OK.',        loc: 'Shared / Settings Engine' },
    { ts: '2026-03-25 23:22:13', type: 'warning', event: '#789', text: 'Lint residue in backdrop-filter order.',          loc: 'settings.css — Line 44' },
    { ts: '2026-03-25 23:05:47', type: 'info',    event: '#788', text: 'Project directory restructured (frontend/backend).', loc: 'Filesystem — Root Level' },
];

// ── NODE-SPECIFIC DATA (Interactive Globe) ──────────
window.NODE_DATA = [
    { id: 'G-01', lat: 30,  lon: 45,   status: 'stable',   latency: '3.1 ms', flow: '1.2 TB/s', audits: 12,  integrity: '98%', threats: 0,
      analysis: { alert: 'Nominal', alertClass: 'green-alert', breach: 'No anomalies', status: 'STABLE', statusClass: 'text-cyan' },
      threatProfile: { title: 'No Active Threat', type: 'NONE', source: 'CLEAR' },
      metrics: { activeNodes: 142, systemLoad: '38%' } },
    { id: 'G-02', lat: -20, lon: -60,  status: 'stable',   latency: '4.5 ms', flow: '0.9 TB/s', audits: 8,   integrity: '94%', threats: 0,
      analysis: { alert: 'Nominal', alertClass: 'green-alert', breach: 'Routine scan clear', status: 'STABLE', statusClass: 'text-cyan' },
      threatProfile: { title: 'No Active Threat', type: 'NONE', source: 'CLEAR' },
      metrics: { activeNodes: 98, systemLoad: '41%' } },
    { id: 'G-05', lat: 60,  lon: 120,  status: 'warning',  latency: '8.2 ms', flow: '2.4 TB/s', audits: 24,  integrity: '82%', threats: 0,
      analysis: { alert: 'Yellow Alert', alertClass: 'yellow-alert', breach: 'Heuristic variance', status: 'WARNING', statusClass: 'text-yellow' },
      threatProfile: { title: 'Anomaly Detected', type: 'HEURISTIC', source: 'INTERNAL' },
      metrics: { activeNodes: 201, systemLoad: '67%' } },
    { id: 'G-08', lat: -40, lon: 90,   status: 'warning',  latency: '12.0 ms', flow: '1.8 TB/s', audits: 18,  integrity: '79%', threats: 0,
      analysis: { alert: 'Yellow Alert', alertClass: 'yellow-alert', breach: 'Topic drift +3.1%', status: 'WARNING', statusClass: 'text-yellow' },
      threatProfile: { title: 'Drift Warning', type: 'TOPOLOGY', source: 'INTERNAL' },
      metrics: { activeNodes: 175, systemLoad: '72%' } },
    { id: 'G-14', lat: 10,  lon: -20,  status: 'critical', latency: '45.8 ms', flow: '5.2 TB/s', audits: 142, integrity: '24%', threats: 1, threat: true,
      analysis: { alert: 'Red Alert', alertClass: 'red-alert', breach: 'System Breach / DATA EXFIL', status: 'CRITICAL', statusClass: 'text-red' },
      threatProfile: { title: 'G-14 Breach', type: 'DATA EXFIL', source: 'UNKNOWN' },
      metrics: { activeNodes: 1, systemLoad: '98%' } },
    { id: 'G-15', lat: 15,  lon: 30,   status: 'stable',   latency: '2.9 ms', flow: '1.4 TB/s', audits: 10,  integrity: '99%', threats: 0,
      analysis: { alert: 'Nominal', alertClass: 'green-alert', breach: 'All clear', status: 'STABLE', statusClass: 'text-cyan' },
      threatProfile: { title: 'No Active Threat', type: 'NONE', source: 'CLEAR' },
      metrics: { activeNodes: 158, systemLoad: '29%' } },
    { id: 'G-22', lat: -10, lon: -110, status: 'stable',   latency: '5.1 ms', flow: '0.8 TB/s', audits: 7,   integrity: '92%', threats: 0,
      analysis: { alert: 'Nominal', alertClass: 'green-alert', breach: 'Routine scan clear', status: 'STABLE', statusClass: 'text-cyan' },
      threatProfile: { title: 'No Active Threat', type: 'NONE', source: 'CLEAR' },
      metrics: { activeNodes: 87, systemLoad: '44%' } },
    { id: 'G-30', lat: 50,  lon: -140, status: 'stable',   latency: '3.8 ms', flow: '1.1 TB/s', audits: 15,  integrity: '96%', threats: 0,
      analysis: { alert: 'Nominal', alertClass: 'green-alert', breach: 'No anomalies', status: 'STABLE', statusClass: 'text-cyan' },
      threatProfile: { title: 'No Active Threat', type: 'NONE', source: 'CLEAR' },
      metrics: { activeNodes: 211, systemLoad: '52%' } },
    { id: 'G-35', lat: -50, lon: 10,   status: 'stable',   latency: '4.2 ms', flow: '1.0 TB/s', audits: 12,  integrity: '95%', threats: 0,
      analysis: { alert: 'Nominal', alertClass: 'green-alert', breach: 'No anomalies', status: 'STABLE', statusClass: 'text-cyan' },
      threatProfile: { title: 'No Active Threat', type: 'NONE', source: 'CLEAR' },
      metrics: { activeNodes: 120, systemLoad: '47%' } }
];

// ── SYSTEM METRICS ────────────────────────────────────
window.DEFAULT_GLOBAL_METRICS = {
    activeAudits: 135,
    netIntegrity: '96%',
    activeThreats: '1',
    sectorStatus: '2 warn',
    latency: '4.2 ms',
    dataFlow: '1.8 TB/s',
    activeNodes: 1342,
    systemLoad: '64%',
    analysis: { alert: 'Red Alert', alertClass: 'red-alert', breach: 'System Breach / DATA EXFIL', status: 'CRITICAL', statusClass: 'text-red' },
    threatProfile: { title: 'G-14 Breach', type: 'DATA EXFIL', source: 'UNKNOWN' },
};

window.SYSTEM_METRICS = [
    { label: 'Node Health',        value: () => (92 + Math.floor(Math.random() * 5)) + '%',  status: 'nominal' },
    { label: 'Fidelity Score',     value: () => (9.4 + Math.random() * 0.5).toFixed(1) + '/10', status: 'nominal' },
    { label: 'Active Threats',     value: () => '1',                                           status: 'critical' },
    { label: 'Integrity Checks',   value: () => '#' + (400 + Math.floor(Math.random() * 10)), status: 'nominal' },
    { label: 'Network Latency',    value: () => (3 + Math.random() * 2).toFixed(1) + ' ms',   status: 'nominal' },
    { label: 'Data Flow',          value: () => (1.5 + Math.random() * 0.6).toFixed(1) + ' TB/s', status: 'nominal' },
    { label: 'Artifact Index',     value: () => '52',                                          status: 'nominal' },
    { label: 'Audio Pipeline',     value: () => '505 files',                                   status: 'nominal' },
    { label: 'Memory Map',         value: () => 'LOADED',                                      status: 'nominal' },
    { label: 'Quarantine Status',  value: () => window._threatQuarantined ? 'SEALED' : 'OPEN', status: () => window._threatQuarantined ? 'nominal' : 'critical' },
];

// ── SECTOR G DETAIL ──────────────────────────────────
window.SECTOR_G_INTEL = {
    name:     'Sector G — Neural Perimeter',
    nodes:    9,
    critical: 1,
    warning:  2,
    stable:   6,
    breach:   'Node G-14 · DATA EXFIL · Source: UNKNOWN',
    coords:   'Lat 10.0 N, Lon -20.0 E',
    protocol: 'Mandatory Quarantine Sequence — Override Code: CMDR-77X',
};

// ── COMPLIANCE INDEX DATA ─────────────────────────────
window.COMPLIANCE_DATA = [
    { sector: 'Sec 00', score: 100, tier: 's-high' },
    { sector: 'Sec 02', score: 83,  tier: 's-mid'  },
    { sector: 'Sec 06', score: 96,  tier: 's-high' },
    { sector: 'Sec 07', score: 79,  tier: 's-mid'  },
    { sector: 'Sec 08', score: 68,  tier: 's-mid'  },
    { sector: 'Sec G',  score: 24,  tier: 's-low'  },
];

// ── RESOURCE ALLOCATION (%) ───────────────────────────
window.RESOURCE_DATA = [
    { label: 'Audio Engine',  pct: 34, color: '#00f0ff' },
    { label: 'Visual Layer',  pct: 28, color: '#a78bfa' },
    { label: 'Database I/O',  pct: 22, color: '#facc15' },
    { label: 'Net Overhead',  pct: 16, color: '#ff3e3e' },
];

// ── ADMIN ACTIVITY LOG ────────────────────────────────
window.ADMIN_ACTIVITY = [
    { time: '02:07', who: 'A.VERMA',  msg: 'Queried Node G-14 threat vector.' },
    { time: '01:55', who: 'SYSTEM',   msg: 'Auto-rotation cycle completed.' },
    { time: '01:33', who: 'A.VERMA',  msg: 'Integrity check #403 approved.' },
    { time: '00:57', who: 'SYSTEM',   msg: 'Dashboard sync refresh triggered.' },
    { time: '00:44', who: 'A.VERMA',  msg: 'Audio pipeline 505 files validated.' },
];

// ── USER SESSIONS ─────────────────────────────────────
window.SESSION_DATA = [
    { user: 'A.VERMA',    node: 'Frontier Hub',  ping: '2ms',   active: true  },
    { user: 'SYS:AUDIT',  node: 'Sector G',      ping: '11ms',  active: true  },
    { user: 'SYS:SYNC',   node: 'Core Path 00',  ping: '4ms',   active: false },
    { user: 'SYS:BACKUP', node: 'Domain 06',     ping: '8ms',   active: false },
];

// ── HARDWARE METRICS ──────────────────────────────────
window.HARDWARE_METRICS = [
    { label: 'CPU Core',    base: 52, variance: 15 },
    { label: 'Mem Matrix',  base: 68, variance: 8  },
    { label: 'Net Fabric',  base: 44, variance: 12 },
    { label: 'I/O Buffer',  base: 31, variance: 20 },
];

// ── LATENCY MATRIX DATA ───────────────────────────────
window.LATENCY_MATRIX_DATA = [
    { id: 'S0', val: 2 },  { id: 'S1', val: 5 },  { id: 'S2', val: 12 }, { id: 'S3', val: 4 },  { id: 'S4', val: 3 },  { id: 'S5', val: 21 },
    { id: 'S6', val: 3 },  { id: 'S7', val: 8 },  { id: 'S8', val: 32 }, { id: 'S9', val: 6 },  { id: 'S10', val: 4 }, { id: 'S11', val: 2 },
    { id: 'G1', val: 45 }, { id: 'G2', val: 38 }, { id: 'G3', val: 52 }, { id: 'G4', val: 41 }, { id: 'G5', val: 12 }, { id: 'G6', val: 7 }
];

// ── INTEGRITY SEALS ───────────────────────────────────
window.INTEGRITY_SEAL_DATA = [
    { name: 'Core',   status: 'locked' },
    { name: 'Memory', status: 'locked' },
    { name: 'Sector G', status: 'unlocked' },
    { name: 'Assets', status: 'locked' }
];

// ── ACTIVE INCIDENTS ──────────────────────────────────
window.INCIDENT_DATA = [
    { code: 'W-902', msg: 'Heuristic drift', loc: 'Sec 02' },
    { code: 'T-77X', msg: 'Data Exfil',      loc: 'Node G-14' },
    { code: 'I-104', msg: 'Sync delay',      loc: 'Sec 08' }
];

// ── BACKUP SNAPSHOTS ──────────────────────────────────
window.BACKUP_DATA = [
    { label: 'Cloud A', time: '12m ago', integrity: '100%' },
    { label: 'Local B', time: '4m ago',  integrity: '98%' },
    { label: 'Offsite', time: '1h ago',  integrity: '100%' },
    { label: 'Node Snap', time: 'Active', integrity: '24%' }
];

// ── CREDENTIAL LEVEL ──────────────────────────────────
window.CREDENTIAL_LEVEL = { tier: 'LEAD AUDITOR', access: 92 };

// ── THREAT VECTORS ────────────────────────────────────
window.THREAT_VECTOR_DATA = [
    { id: 4,  alert: false }, { id: 12, alert: true  }, { id: 25, alert: false },
    { id: 44, alert: true  }, { id: 67, alert: false }, { id: 82, alert: false }
];

// ── GEOGRAPHIC LOGS ────────────────────────────────────
window.GEO_LOG_DATA = [
    { coord: '77.8 N, 84.0 E', label: 'Inbound Sync' },
    { coord: '10.0 N, 20.0 W', label: 'Breach Point' },
    { coord: '34.2 S, 18.4 E', label: 'Backup Node' }
];

// ── QUARANTINE LIST ────────────────────────────────────
window.QUARANTINE_DATA = [ 'Node G-14', 'Node G-05', 'Node G-08' ];

// ── SYSTEM UPTIME ─────────────────────────────────────
window.UPTIME_DATA = [
    { label: 'Core',   val: '142:22:05' },
    { label: 'Neural', val: '48:12:11' },
    { label: 'Audit',  val: '12:05:55' },
    { label: 'Auth',   val: '1342:10:02' }
];

// ── MEMORY MATRIX ─────────────────────────────────────
window.MEMORY_MATRIX_DATA = [
    1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1,
    0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
    1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1
];

// ── LEVEL OF DETAIL (LOD) DATA ────────────────────────
// Mid-level zoom labels (Regions)
window.REGION_LABELS = [
    { id: 'R-NA', lat: 45, lon: -100, label: 'SECTOR-ALPHA (NA)', type: 'region' },
    { id: 'R-SA', lat: -15, lon: -60, label: 'SECTOR-BETA (SA)', type: 'region' },
    { id: 'R-EU', lat: 50, lon: 15, label: 'SECTOR-GAMMA (EU)', type: 'region' },
    { id: 'R-AS', lat: 35, lon: 90, label: 'SECTOR-DELTA (AS)', type: 'region' },
    { id: 'R-AF', lat: 5, lon: 20, label: 'SECTOR-EPSILON (AF)', type: 'region' },
    { id: 'R-OC', lat: -25, lon: 135, label: 'SECTOR-ZETA (OC)', type: 'region' }
];

// High-level zoom labels (Cities / Sub-Nodes)
window.CITY_LABELS = [
    { lat: 40.71, lon: -74.00, label: 'NY-CORE', status: 'stable' },
    { lat: 34.05, lon: -118.24, label: 'LA-UPLINK', status: 'warning' },
    { lat: 51.50, lon: -0.12, label: 'LDN-HUB', status: 'stable' },
    { lat: 48.85, lon: 2.35, label: 'PAR-SYNC', status: 'stable' },
    { lat: 35.68, lon: 139.76, label: 'TYO-DATA', status: 'critical' },
    { lat: 1.35, lon: 103.81, label: 'SGP-ROUTER', status: 'stable' },
    { lat: -33.86, lon: 151.20, label: 'SYD-MEM', status: 'stable' },
    { lat: 19.07, lon: 72.87, label: 'BOM-GATE', status: 'stable' },
    { lat: -23.55, lon: -46.63, label: 'GRU-ARCHIVE', status: 'stable' },
    { lat: 55.75, lon: 37.61, label: 'MOW-PROXY', status: 'warning' },
    // A little cluster around the breach point G-14 (Lat 10, Lon -20 is off west coast of Africa)
    { lat: 12.5, lon: -18.0, label: 'G14-RELAY-1', status: 'critical' },
    { lat: 8.0, lon: -22.5, label: 'G14-RELAY-2', status: 'critical' },
    { lat: 11.2, lon: -23.0, label: 'G14-PROXY', status: 'warning' }
];
