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
// Global defaults when no node is selected
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
