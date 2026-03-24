document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const header = document.getElementById('domain-header');
    const welcome = document.getElementById('welcome-message');
    const prompt = document.getElementById('terminal-prompt');
    const container = document.querySelector('.terminal-container');
    const broadcastBar = document.getElementById('broadcast-bar');
    const broadcastText = document.getElementById('broadcast-text');

    lucide.createIcons();

    // ── THEME RESTORE ──────────────────────────────────────────────────
    const savedTheme = localStorage.getItem('fp_theme') || 'frontier';
    document.body.className = `theme-${savedTheme}`;

    // ── CONTEXTUAL DETECTION ───────────────────────────────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const domainId = urlParams.get('domain') || 'INTERNAL AUDIT';
    const sectorName = domainId.toUpperCase();

    const DOMAINS = [
        { id: '00', name: 'System & Guardrails',    cards: 8,  audio: 24 },
        { id: '01', name: 'Current State',           cards: 12, audio: 36 },
        { id: '02', name: 'Research & Knowledge',    cards: 15, audio: 45 },
        { id: '03', name: 'Architecture & Planning', cards: 10, audio: 30 },
        { id: '04', name: 'Sandbox & Demos',         cards: 6,  audio: 18 },
        { id: '05', name: 'Infrastructure & Workflows', cards: 9, audio: 27 },
        { id: '06', name: 'Internal Audit',          cards: 14, audio: 42 },
        { id: '07', name: 'AI Training & Models',    cards: 11, audio: 33 },
        { id: '08', name: 'Protocol X',              cards: 7,  audio: 21 },
        { id: '09', name: 'Audio Script',            cards: 19, audio: 57 },
        { id: '10', name: 'MVP',                     cards: 5,  audio: 15 },
        { id: '11', name: 'Security & Ethics',       cards: 13, audio: 39 },
    ];

    const currentDomain = DOMAINS.find(d => d.name.toLowerCase() === domainId.toLowerCase()) || DOMAINS[6];

    const select = document.getElementById('domain-selector');
    if (select) {
        select.innerHTML = '';
        DOMAINS.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.name;
            opt.textContent = `${d.id} ${d.name.toUpperCase()}`;
            if (d.name.toLowerCase() === domainId.toLowerCase()) opt.selected = true;
            select.appendChild(opt);
        });
    }

    window.switchDomain = function(newDomain) {
        window.location.href = `domain.html?domain=${encodeURIComponent(newDomain)}`;
    };

    header.textContent = `DOMAIN CONSOLE // SECTOR: ${sectorName}`;
    prompt.textContent = `${sectorName}@FRONTIER:~$`;

    // Mutually exclusive highlighting: Dim Global, Highlight Sector
    const globalTab = document.querySelector('.tab-link[href="../global/global.html"]');
    if (globalTab) globalTab.classList.remove('active');

    const tabSectorLabel = document.getElementById('tab-sector-label');
    if (tabSectorLabel) {
        tabSectorLabel.textContent = `▸ ${sectorName.toUpperCase()}`;
        tabSectorLabel.classList.add('active');
    }

    // ── AUDIT DEPTH PERSISTENCE ────────────────────────────────────────
    const depthSel = document.getElementById('audit-depth-selector');
    if (depthSel) {
        depthSel.value = localStorage.getItem('fp_audit_depth') || 'meta';
        depthSel.addEventListener('change', () => {
            localStorage.setItem('fp_audit_depth', depthSel.value);
            const label = depthSel.options[depthSel.selectedIndex].text;
            appendLine(`[SYSTEM] Re-calibrating sector sensors... DEPTH → ${label}`, 'success');
            output.scrollTop = output.scrollHeight;
        });
    }

    // ── AUDIT PARAMS HELPER ────────────────────────────────────────────
    function getAuditParams() {
        const depth = depthSel ? depthSel.value : 'meta';
        return {
            meta:      { layers: 4,  speed: 280, label: 'META SCAN',           detail: false },
            deep:      { layers: 8,  speed: 200, label: 'DEEP SCAN',           detail: true  },
            integrity: { layers: 12, speed: 160, label: 'INTEGRITY CHECK',     detail: true  },
            full:      { layers: 16, speed: 120, label: 'FULL SYSTEM AUDIT',   detail: true  },
        }[depth] || { layers: 4, speed: 280, label: 'META SCAN', detail: false };
    }

    // ── AUDIO ENGINE (Synthesized) ─────────────────────────────────────
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }
    function playKeystroke() {
        try {
            const ctx = getAudioCtx(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.06, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.start(); osc.stop(ctx.currentTime + 0.05);
        } catch(e) {}
    }
    function playSuccess() {
        try {
            const ctx = getAudioCtx();
            [440, 660].forEach((freq, i) => {
                const osc = ctx.createOscillator(); const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
                gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
                osc.start(ctx.currentTime + i * 0.1); osc.stop(ctx.currentTime + i * 0.1 + 0.25);
            });
        } catch(e) {}
    }
    function playError() {
        try {
            const ctx = getAudioCtx(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.18, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        } catch(e) {}
    }
    input.addEventListener('keyup', (e) => {
        if (!['Enter','ArrowUp','ArrowDown','Tab'].includes(e.key)) playKeystroke();
    });

    // ── COMMAND HISTORY ────────────────────────────────────────────────
    const commandHistory = []; let historyIndex = -1;

    // ── MATRIX DECRYPT ─────────────────────────────────────────────────
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>/\\|{}[]';
    function matrixDecrypt(element, finalString, duration = 600) {
        let start = null; const len = finalString.length;
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const locked = Math.floor(progress * len);
            let result = '';
            for (let i = 0; i < len; i++) {
                if (i < locked || finalString[i] === ' ') result += finalString[i];
                else result += CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            element.textContent = result;
            if (progress < 1) requestAnimationFrame(step);
            else element.textContent = finalString;
        }
        requestAnimationFrame(step);
    }
    document.querySelectorAll('.terminal-line').forEach((el, i) => {
        const original = el.textContent;
        if (el.id === 'welcome-message') { el.textContent = `Sector ${sectorName} Diagnostics v2.0 READY. Connection: SECURE.`; return; }
        if (original.trim()) { el.textContent = ''; setTimeout(() => matrixDecrypt(el, original, 700), i * 200); }
    });
    setTimeout(() => matrixDecrypt(welcome, `Sector ${sectorName} Diagnostics v2.0 READY. Connection: SECURE.`, 800), 400);

    // ── HELPERS ─────────────────────────────────────────────────────────
    function appendLine(text, type = '') {
        const div = document.createElement('div');
        div.className = 'terminal-line' + (type ? ` ${type}` : '');
        div.innerText = text; output.appendChild(div);
    }
    function shakeTerminal() {
        container.classList.add('terminal-error-shake');
        setTimeout(() => container.classList.remove('terminal-error-shake'), 500);
    }
    function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    // ── PHASE 3 SECTOR COMMANDS (NEW) ──────────────────────────────────────
    function cmdAnalyzePattern() {
        const patterns = [
            { name: 'Temporal Clustering ', strength: rnd(71, 99), trend: 'RISING' },
            { name: 'Metadata Drift      ', strength: rnd(5,  25), trend: 'NOMINAL' },
            { name: 'Audio Density Skew  ', strength: rnd(55, 90), trend: 'STABLE' },
            { name: 'Cross-Ref Anomaly   ', strength: rnd(0,  15), trend: 'CLEAN' },
            { name: 'Neural Fingerprint  ', strength: rnd(80, 99), trend: 'STRONG' },
        ];
        appendLine(`[ PATTERN ANALYSIS // ${sectorName} ]`, 'success');
        patterns.forEach((p, i) => setTimeout(() => {
            const filled = Math.round((p.strength / 100) * 20);
            appendLine(`  ${p.name} [${'#'.repeat(filled)}${'.'.repeat(20-filled)}] ${p.strength}% — ${p.trend}`, p.strength > 70 ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 200));
        setTimeout(() => {
            appendLine(`PATTERN ANALYSIS COMPLETE. ${sectorName} data is within normal variance.`, 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, patterns.length * 200 + 150);
        return null;
    }

    function cmdIsolateNode() {
        const stages = [
            'INITIATING NODE ISOLATION SEQUENCE...',
            `  Severing cross-sector links to ${sectorName}...`,
            '  Closing inbound neural channels...',
            '  Suspending external sync requests...',
            '  [ISOLATION COMPLETE]',
            `  Sector ${sectorName} is now in ISOLATED mode.`,
            "  Run 'reboot-link' to restore connections.",
        ];
        stages.forEach((s, i) => setTimeout(() => {
            appendLine(s, s.includes('[ISOLATION') ? 'error' : s.startsWith('  [') ? 'error' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 280));
        setTimeout(() => { playError(); }, stages.length * 280 + 50);
        return null;
    }

    function cmdSyncStatus() {
        const latency = rnd(8, 30);
        return [
            `  SYNC STATUS // ${sectorName} → GLOBAL`,
            `  ─────────────────────────────────────`,
            `  Link State   : ACTIVE / ENCRYPTED`,
            `  Latency      : ${latency}ms ${latency < 15 ? '(EXCELLENT)' : '(GOOD)'}`,
            `  Sync Rate    : ${rnd(96,100)}%`,
            `  Last Sync    : ${new Date().toISOString().slice(0,16)}Z`,
            `  Block Hash   : 0x${Math.random().toString(16).slice(2,10).toUpperCase()}`,
            `  Channel      : ENCRYPTED / AES-256`,
        ].join('\n');
    }

    function cmdSnapshot() {
        const ts = new Date().toISOString().slice(0,19).replace('T','_').replace(/:/g,'-');
        const hash = Math.random().toString(16).slice(2,12).toUpperCase();
        const seq = [
            `SNAPSHOT // ${sectorName}`,
            `  Capturing sector state — ${ts}...`,
            `  Serialising ${currentDomain.cards} cards — [OK]`,
            `  Archiving ${currentDomain.audio} audio refs — [OK]`,
            `  Computing integrity hash...`,
            `  HASH: 0x${hash}`,
            `[SNAPSHOT SAVED] frontier_snap_${ts}.fpk`,
        ];
        seq.forEach((l, i) => setTimeout(() => {
            appendLine(l, l.startsWith('[SNAPSHOT') ? 'success' : l.startsWith('SNAPSHOT') ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 180));
        setTimeout(() => { playSuccess(); }, seq.length * 180 + 50);
        return null;
    }

    function cmdLocalAudit() {
        const { layers, speed, label } = getAuditParams();
        const checks = [
            { name: 'Card Schema Validity', pct: 100 },
            { name: 'Audio File Map      ', pct: currentDomain.audio > 30 ? 100 : 88 },
            { name: 'Cross-Reference Map ', pct: rnd(96, 100) },
            { name: 'Sector Index File   ', pct: 100 },
            { name: 'Metadata Completeness', pct: rnd(92, 100) },
            { name: 'Duplicate Detection ', pct: 100 },
        ].slice(0, Math.max(4, layers - 2));
        appendLine(`[ LOCAL AUDIT // ${sectorName} — ${label} ]`, 'success');
        checks.forEach((c, i) => setTimeout(() => {
            const filled = Math.round((c.pct / 100) * 20);
            appendLine(`  ${c.name} [${'#'.repeat(filled)}${'.'.repeat(20-filled)}] ${c.pct}%`, c.pct === 100 ? 'success' : 'error');
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * speed));
        setTimeout(() => {
            appendLine(`LOCAL AUDIT DONE. ${checks.length} checks passed for ${sectorName}.`, 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, checks.length * speed + 200);
        return null;
    }

    function cmdResourceMonitor() {
        const snapshots = 5;
        appendLine(`[ RESOURCE MONITOR // ${sectorName} — LIVE ]`, 'success');
        for (let i = 0; i < snapshots; i++) {
            setTimeout(() => {
                const cpu = rnd(10, 75);
                const mem = rnd(30, 80);
                const net = rnd(200, 950);
                const cpuBar = '#'.repeat(Math.round(cpu/5)) + '.'.repeat(20 - Math.round(cpu/5));
                const memBar = '#'.repeat(Math.round(mem/5)) + '.'.repeat(20 - Math.round(mem/5));
                appendLine(`  T+${i}s  CPU[${cpuBar}]${cpu}%  MEM[${memBar}]${mem}%  NET:${net}Mbps`);
                output.scrollTop = output.scrollHeight;
                if (i === snapshots - 1) { appendLine('MONITOR COMPLETE.', 'success'); playSuccess(); }
            }, (i + 1) * 400);
        }
        return null;
    }

    function cmdNodeTrace() {
        const path = [
            `◉ ${sectorName} [LOCAL]`,
            `  └─▶ SECTOR BRIDGE [RELAY]`,
            `        └─▶ NEURAL HUB [ZONE-A]`,
            `              └─▶ CORE ROUTER [ENCRYPTED]`,
            `                    └─▶ ◉ GLOBAL NODE [FRONTIER CORE]`,
        ];
        appendLine(`[ NODE TRACE // ${sectorName} → GLOBAL ]`, 'success');
        path.forEach((l, i) => setTimeout(() => {
            appendLine(l, l.includes('GLOBAL NODE') ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 250));
        setTimeout(() => {
            appendLine(`TRACE COMPLETE. ${path.length - 1} hops to global core.`, 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, path.length * 250 + 100);
        return null;
    }

    function cmdDataPulse() {
        const zones = [
            { name: 'Card Payload Zone   ', result: 'CLEAN' },
            { name: 'Audio Pointer Zone  ', result: 'CLEAN' },
            { name: 'Metadata Zone       ', result: rnd(0,4) > 1 ? 'CLEAN' : 'FLAG'  },
            { name: 'Index Zone          ', result: 'CLEAN' },
            { name: 'Cache Zone          ', result: 'CLEAN' },
        ];
        appendLine(`[ DATA PULSE // ${sectorName} ]`, 'success');
        let hasFlag = false;
        zones.forEach((z, i) => setTimeout(() => {
            if (z.result !== 'CLEAN') hasFlag = true;
            appendLine(`  ZONE: ${z.name} → [${z.result}]`, z.result === 'CLEAN' ? 'success' : 'error');
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 210));
        setTimeout(() => {
            appendLine(hasFlag ? 'PULSE COMPLETE — 1 ANOMALY DETECTED.' : 'PULSE COMPLETE — ALL ZONES CLEAN.', hasFlag ? 'error' : 'success');
            output.scrollTop = output.scrollHeight;
            hasFlag ? playError() : playSuccess();
        }, zones.length * 210 + 150);
        return null;
    }

    function cmdDecryptBlock(args) {
        const blockId = args || `0xFF-${String(rnd(1,16)).padStart(2,'0')}`;
        const seq = [
            `DECRYPTING BLOCK ${blockId.toUpperCase()}...`,
            `  Locating block in sector manifest...`,
            `  Applying cipher key...`,
            `  ▓▓▓░░░  33%`,
            `  ▓▓▓▓▓░  66%`,
            `  ▓▓▓▓▓▓ 100%`,
            `  Payload: [RAJSHREE_SECTOR_DATA_${Math.random().toString(36).slice(2,8).toUpperCase()}]`,
            `[OK] BLOCK ${blockId.toUpperCase()} DECRYPTED SUCCESSFULLY.`,
        ];
        seq.forEach((l, i) => setTimeout(() => {
            appendLine(l, l.startsWith('[OK]') ? 'success' : l.startsWith('DECRYPT') ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 220));
        setTimeout(() => { playSuccess(); }, seq.length * 220 + 50);
        return null;
    }

    function cmdSensorReadout() {
        return [
            `  SENSOR READOUT // ${sectorName}`,
            `  ─────────────────────────────────────`,
            `  TEMP SENSOR    : ${rnd(44, 67)}°C`,
            `  VOLTAGE RAIL   : ${(rnd(118, 122) / 10).toFixed(1)}V`,
            `  SIGNAL QUALITY : ${rnd(87, 100)}%`,
            `  PACKET LOSS    : ${rnd(0, 2)}%`,
            `  ENTROPY INDEX  : ${(rnd(320, 512) / 100).toFixed(2)} bits/token`,
            `  SECTOR LOAD    : ${rnd(10, 60)}%`,
        ].join('\n');
    }

    function cmdReIndex() {
        const stages = [
            `REBUILDING INDEX // ${sectorName}...`,
            `  Parsing ${currentDomain.cards} card entries...`,
            `  Mapping ${currentDomain.audio} audio files...`,
            '  Validating cross-references...',
            '  Writing index to sector manifest...',
            `[OK] INDEX REBUILT. ${currentDomain.cards + currentDomain.audio} assets registered.`,
        ];
        stages.forEach((s, i) => setTimeout(() => {
            appendLine(s, s.startsWith('[OK]') ? 'success' : s.startsWith('REBUILD') ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 200));
        setTimeout(() => { playSuccess(); }, stages.length * 200 + 50);
        return null;
    }

    function cmdBufferFlush() {
        const freed = rnd(12, 128);
        const lines = [
            `FLUSHING SECTOR BUFFERS // ${sectorName}...`,
            `  Releasing write buffer — [OK]`,
            `  Clearing read-ahead cache — [OK]`,
            `  Resetting neural prefetch — [OK]`,
            `  Freed ${freed} MB of sector memory.`,
            '[OK] BUFFER FLUSH COMPLETE.',
        ];
        lines.forEach((l, i) => setTimeout(() => {
            appendLine(l, l.startsWith('[OK]') ? 'success' : l.startsWith('FLUSH') ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 160));
        setTimeout(() => { playSuccess(); }, lines.length * 160 + 50);
        return null;
    }

    function cmdHealthCheck() {
        return [
            `  HEALTH CHECK // ${sectorName}`,
            `  ─────────────────────────────────────`,
            `  Heartbeat      : [OK] — Active`,
            `  Memory Alloc   : [OK] — ${rnd(40, 75)}% used`,
            `  Link Latency   : [OK] — ${rnd(8, 22)}ms`,
            `  Anomaly Count  : 0`,
            `  Uplink Status  : [OK] — Encrypted`,
            `  Overall        : HEALTHY`,
        ].join('\n');
    }

    function cmdAccessGrant(args) {
        const user = args ? args.toUpperCase() : 'UNKNOWN_USER';
        if (!args) return `Usage: access-grant [username]\nExample: access-grant ATUL`;
        const token = Math.random().toString(36).slice(2,10).toUpperCase();
        const expiry = new Date(Date.now() + 3600000).toISOString().slice(0,16);
        return [
            `[ACCESS GRANT] // ${sectorName}`,
            `  User     : ${user}`,
            `  Token    : ${token}`,
            `  Level    : READ / AUDIT`,
            `  Expires  : ${expiry}Z`,
            `  Status   : GRANTED`,
        ].join('\n');
    }

    // ── PHASE 2 SECTOR COMMANDS ────────────────────────────────────────
    function cmdAssetList() {
        const sectorSlug = currentDomain.name.toLowerCase().replace(/[& ]+/g, '_');
        const lines = [
            `[ ASSET MANIFEST // ${sectorName} ]`,
            `  assets/audio/${sectorSlug}/intro.mp3`,
            `  assets/audio/${sectorSlug}/sub_main.mp3`,
        ];
        for (let i = 0; i < Math.min(currentDomain.cards, 8); i++) {
            lines.push(`  assets/images/${sectorSlug}/card_${String(i+1).padStart(2,'0')}.png`);
            if (i < 4) lines.push(`  assets/audio/${sectorSlug}/audio_${String(i+1).padStart(2,'0')}.mp3`);
        }
        lines.push(`  [+${currentDomain.audio - 4} more audio files]`);
        lines.push(`  [+${currentDomain.cards - 4} more image files]`);
        lines.forEach((l, i) => setTimeout(() => {
            appendLine(l, i === 0 ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 60));
        setTimeout(() => { playSuccess(); output.scrollTop = output.scrollHeight; }, lines.length * 60 + 50);
        return null;
    }

    function cmdIntegrityScan() {
        const { layers, speed, label, detail } = getAuditParams();
        const BASE_CHECKS = [
            { label: 'Metadata Schema  ', pct: 100 },
            { label: 'Asset Manifest   ', pct: 100 },
            { label: 'Audio Coverage   ', pct: currentDomain.audio > 30 ? 100 : 88 },
            { label: 'Image Coverage   ', pct: currentDomain.cards > 10 ? 100 : 95 },
            { label: 'Cross-reference  ', pct: 97 },
            { label: 'Neural Sync      ', pct: 94 },
            { label: 'Leakage Screen   ', pct: 100 },
            { label: 'Block Parity     ', pct: 100 },
        ];
        const EXTRA_CHECKS = [
            { label: 'Cache Coherence  ', pct: rnd(95,100) },
            { label: 'Root Hash Verify ', pct: rnd(98,100) },
            { label: 'Block Sequencing ', pct: rnd(97,100) },
            { label: 'Entropy Monitor  ', pct: rnd(93,100) },
            { label: 'KPI Snapshot     ', pct: rnd(96,100) },
            { label: 'Audit Trail      ', pct: 100 },
            { label: 'Access Tokens    ', pct: rnd(99,100) },
            { label: 'Sync Anchors     ', pct: rnd(95,100) },
        ];
        const checks = [...BASE_CHECKS, ...EXTRA_CHECKS.slice(0, layers - 8)];
        appendLine(`[ ${label} // ${sectorName} — ${checks.length} CHECKS ]`, 'success');
        checks.forEach((s, i) => setTimeout(() => {
            const total = 20; const filled = Math.round((s.pct / 100) * total);
            const bar = '#'.repeat(filled) + '.'.repeat(total - filled);
            appendLine(`  ${s.label} [${bar}] ${s.pct}%`, s.pct === 100 ? 'success' : 'error');
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * speed));
        setTimeout(() => {
            appendLine(`SCAN COMPLETE (${label}). ${sectorName} integrity verified.`, 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, checks.length * speed + 200);
        return null;
    }

    function cmdRebootLink() {
        output.innerHTML = '';
        const seq = [
            '  INITIATING SECTOR REBOOT SEQUENCE...',
            '  Flushing cached memory blocks...',
            '  Disconnecting neural uplinks...',
            '  [LINK SEVERED]',
            '',
            '  RE-ESTABLISHING SECTOR INTERFACE...',
            `  Binding to ${sectorName} node...`,
            '  Verifying sector signature...',
            '[OK] SIGNATURE VERIFIED',
            `[OK] SECTOR ${sectorName} ONLINE`,
            `Type 'trace' to scan local sector assets.`,
        ];
        seq.forEach((line, i) => setTimeout(() => {
            appendLine(line, line.startsWith('[OK]') ? 'success' : line.startsWith('  [') ? 'error' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 200));
        setTimeout(() => { playSuccess(); output.scrollTop = output.scrollHeight; }, seq.length * 200 + 100);
        return null;
    }

    function cmdLeakCheck() {
        const checks = [
            { name: 'PII Exposure          ', result: 'CLEAN' },
            { name: 'Cross-Sector Bleed    ', result: 'CLEAN' },
            { name: 'Metadata Fingerprint  ', result: rnd(0, 5) > 1 ? 'CLEAN' : 'FLAG' },
            { name: 'Audio Origin Hash     ', result: 'CLEAN' },
            { name: 'ID Token Leakage      ', result: 'CLEAN' },
        ];
        appendLine('[ LEAK DETECTION // DATA SECURITY SCAN ]', 'success');
        let hasFlag = false;
        checks.forEach((c, i) => setTimeout(() => {
            const type = c.result === 'CLEAN' ? 'success' : 'error';
            if (c.result !== 'CLEAN') hasFlag = true;
            appendLine(`  CHECKING: ${c.name} → [${c.result}]`, type);
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 220));
        setTimeout(() => {
            appendLine(hasFlag ? 'WARNING: 1 FLAG DETECTED. Review metadata.' : 'ALL CLEAR. No data leakage.', hasFlag ? 'error' : 'success');
            output.scrollTop = output.scrollHeight;
            hasFlag ? playError() : playSuccess();
        }, checks.length * 220 + 150);
        return null;
    }

    function cmdSectorStats() {
        const now = new Date();
        const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        return [
            `  SECTOR STATS // ${sectorName}`,
            `  ────────────────────────────────────`,
            `  Total Cards  : ${currentDomain.cards}`,
            `  Audio Files  : ${currentDomain.audio}`,
            `  Audio Coverage: ${currentDomain.audio > 30 ? '100%' : '88%'}`,
            `  Neural Index : v2.${rnd(1,9)}`,
            `  Last Synced  : ${date}`,
            `  Sector ID    : ${currentDomain.id}`,
        ].join('\n');
    }

    function cmdUnlockModule() {
        const stages = [
            'VERIFYING AUDITOR CLEARANCE...',
            'RUNNING BIOMETRIC CHECK... [PASS]',
            'OVERRIDE CODE: ████████  [ACCEPTED]',
            'DECRYPTING MODULE LOCKS...',
            '▓▓▓▓▓▓▓▓▓░░░░░░░  60%',
            '▓▓▓▓▓▓▓▓▓▓▓▓▓░░░  80%',
            '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%',
            `[UNLOCK COMPLETE] SECTOR ${sectorName} — ALL MODULES UNLOCKED.`,
        ];
        stages.forEach((s, i) => setTimeout(() => {
            appendLine(s, s.startsWith('[UNLOCK') ? 'success' : s.includes('PASS') ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 300));
        setTimeout(() => { playSuccess(); output.scrollTop = output.scrollHeight; }, stages.length * 300 + 100);
        return null;
    }

    // ── COMMANDS REGISTRY ──────────────────────────────────────────────
    const commands = {
        'help':             () => `Available commands:\n  help, trace, drift, verify, ping, clear, exit,\n  asset-list, integrity-scan, reboot-link, leak-check, sector-stats,\n  unlock-module, analyze-pattern, isolate-node, sync-status, snapshot,\n  local-audit, resource-monitor, node-trace, data-pulse, re-index,\n  buffer-flush, health-check, sensor-readout`,
        'trace':            () => `Scanning Asset Manifest for ${sectorName}...\n[OK] sector_index.json found.\n[OK] audio/varnamala/ traces active.\n[OK] integrity_hash verified.`,
        'drift':            () => `Calculating Sector Drift for ${sectorName}...\nDRIFT RATE: 0.00% (STABLE)\nNEURAL SYNCHRONY: 98.4%`,
        'verify':           () => `Deep verify ${sectorName} memory blocks...\nBlock 0xFF-01: VALID\nBlock 0xFF-02: VALID\nBlock 0xFF-03: VALID`,
        'ping':             null, // defined below
        'asset-list':       cmdAssetList,
        'integrity-scan':   cmdIntegrityScan,
        'reboot-link':      cmdRebootLink,
        'leak-check':       cmdLeakCheck,
        'sector-stats':     cmdSectorStats,
        'unlock-module':    cmdUnlockModule,
        'analyze-pattern':  cmdAnalyzePattern,
        'isolate-node':     cmdIsolateNode,
        'sync-status':      cmdSyncStatus,
        'snapshot':         cmdSnapshot,
        'local-audit':      cmdLocalAudit,
        'resource-monitor': cmdResourceMonitor,
        'node-trace':       cmdNodeTrace,
        'data-pulse':       cmdDataPulse,
        'sensor-readout':   cmdSensorReadout,
        're-index':         cmdReIndex,
        'buffer-flush':     cmdBufferFlush,
        'health-check':     cmdHealthCheck,
        'clear':            () => { output.innerHTML = ''; return `${sectorName} Terminal cleared.`; },
        'exit':             () => { window.location.href = '../../index.html'; return 'Releasing sector lock...'; },
    };
    // decrypt-block and access-grant need argument parsing — handled in input handler

    // ASCII ping (depth-aware)
    commands['ping'] = function() {
        const { layers, speed, label } = getAuditParams();
        const BASE_STEPS = [
            { label: 'Asset Manifest    ', pct: 100 },
            { label: 'Audio Trace       ', pct: 97  },
            { label: 'Integrity Hash    ', pct: 100 },
            { label: 'Neural Sync       ', pct: 88  },
        ];
        const EXTRA = [
            { label: 'Cache Coherence   ', pct: rnd(91,100) },
            { label: 'Root Hash Verify  ', pct: rnd(95,100) },
            { label: 'Block Sequence    ', pct: rnd(97,100) },
            { label: 'Entropy Monitor   ', pct: rnd(93,100) },
        ];
        const steps = [...BASE_STEPS, ...EXTRA.slice(0, layers - 4)];
        appendLine(`[ ${label} // SECTOR ${sectorName} ]`, 'success');
        const total = 20;
        steps.forEach((s, i) => setTimeout(() => {
            const filled = Math.round((s.pct / 100) * total);
            appendLine(`  ${s.label} [${'#'.repeat(filled)}${'.'.repeat(total - filled)}] ${s.pct}%`, s.pct === 100 ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * speed));
        setTimeout(() => {
            appendLine(`SECTOR ${sectorName} DIAGNOSTICS COMPLETE. (${layers} vectors)`, 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, steps.length * speed + 100);
        return null;
    };

    // ── INPUT HANDLER ──────────────────────────────────────────────────
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) { historyIndex++; input.value = commandHistory[commandHistory.length - 1 - historyIndex]; }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) { historyIndex--; input.value = commandHistory[commandHistory.length - 1 - historyIndex]; }
            else { historyIndex = -1; input.value = ''; }
            return;
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            const partial = input.value.trim().toLowerCase();
            if (partial) {
                const match = Object.keys(commands).find(cmd => cmd.startsWith(partial));
                if (match) input.value = match;
            }
            return;
        }
        if (e.key === 'Enter') {
            const raw = input.value;
            const val = raw.trim().toLowerCase();
            if (val) { commandHistory.push(val); historyIndex = -1; }

            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `<span class="prompt">${sectorName}@FRONTIER:~$</span> ${raw}`;
            output.appendChild(line);

            if (val && commands[val] !== undefined) {
                const result = typeof commands[val] === 'function' ? commands[val]() : commands[val];
                if (result !== null && result !== undefined) { appendLine(result); playSuccess(); }
            } else if (val !== '') {
                // Check argument-bearing commands
                const [cmd, ...argParts] = val.split(' ');
                const args = argParts.join(' ').trim();
                if (cmd === 'decrypt-block') {
                    const r = cmdDecryptBlock(args); if (r !== null && r !== undefined) { appendLine(r); playSuccess(); }
                } else if (cmd === 'access-grant') {
                    const r = cmdAccessGrant(args);
                    appendLine(r, r.startsWith('Usage') || r.startsWith('[ERROR]') ? 'error' : '');
                    r.startsWith('Usage') || r.startsWith('[ERROR]') ? playError() : playSuccess();
                } else {
                    appendLine(`Command not found: ${val}. Type 'help' for sector options.`, 'error');
                    shakeTerminal(); playError();
                }
            }
            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });

    // ── SYNC HUD PANEL ─────────────────────────────────────────────────
    const hudBody = document.getElementById('hud-body');
    const hudToggleBtn = document.getElementById('hud-toggle-btn');

    function syncHUD() {
        if (!hudBody) return;
        hudBody.innerHTML = '';
        const allCmds = [
            ...Object.keys(commands).filter(c => c !== 'ping'),
            'ping', 'decrypt-block', 'access-grant'
        ];
        allCmds.forEach(cmd => {
            const btn = document.createElement('button');
            btn.className = 'hud-cmd';
            btn.textContent = `> ${cmd}`;
            btn.addEventListener('click', () => {
                input.value = cmd;
                input.focus();
                input.setSelectionRange(cmd.length, cmd.length);
            });
            hudBody.appendChild(btn);
        });
    }
    syncHUD();

    if (hudToggleBtn) {
        hudToggleBtn.addEventListener('click', () => {
            hudBody.classList.toggle('collapsed');
            hudToggleBtn.textContent = hudBody.classList.contains('collapsed') ? '+' : '−';
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.id === 'broadcast-close-btn' || e.target.classList.contains('broadcast-close')) {
            if (broadcastBar) broadcastBar.classList.remove('active');
        }
        if (!e.target.closest('#domain-selector') && !e.target.closest('.tab-link') && !e.target.closest('#audit-depth-selector') && !e.target.closest('.terminal-hud-panel')) {
            input.focus();
        }
    });
});
