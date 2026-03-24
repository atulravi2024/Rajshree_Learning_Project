document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const container = document.querySelector('.terminal-container');
    const broadcastBar = document.getElementById('broadcast-bar');
    const broadcastText = document.getElementById('broadcast-text');
    lucide.createIcons();
    initNotifications();

    // ── THEME MANAGER (Persistence) ────────────────────────────────────
    const THEMES = ['frontier', 'obsidian', 'ghost', 'nordic', 'synth', 'royal', 'emerald', 'crimson', 'solar', 'stealth'];
    const savedTheme = localStorage.getItem('fp_theme') || 'frontier';
    document.body.className = `theme-${savedTheme}`;

    const DOMAIN_DATA_GLOBAL = [
        { slot: '00', name: 'System & Guardrails',         status: 'stable'  },
        { slot: '01', name: 'Current State',               status: 'stable'  },
        { slot: '02', name: 'Research & Knowledge',        status: 'stable'  },
        { slot: '03', name: 'Architecture & Planning',     status: 'stable'  },
        { slot: '04', name: 'Sandbox & Demos',             status: 'stable'  },
        { slot: '05', name: 'Infrastructure & Workflows',  status: 'active'  },
        { slot: '06', name: 'Internal Audit',              status: 'threat'  },
        { slot: '07', name: 'AI Training & Models',        status: 'stable'  },
        { slot: '08', name: 'Protocol X',                  status: 'warning' },
        { slot: '09', name: 'Audio Script',                status: 'stable'  },
        { slot: '10', name: 'MVP',                         status: 'active'  },
        { slot: '11', name: 'Security & Ethics',           status: 'stable'  },
    ];

    // ─ Determine default domain (matches dashboard priority: Threat > Slot 01) ─
    function getDefaultDomain() {
        return DOMAIN_DATA_GLOBAL.find(d => d.status === 'threat')
            || DOMAIN_DATA_GLOBAL.find(d => d.slot === '01')
            || DOMAIN_DATA_GLOBAL[0];
    }

    const sectorSel = document.getElementById('domain-selector');
    if (sectorSel) {
        sectorSel.innerHTML = '';
        DOMAIN_DATA_GLOBAL.forEach((d) => {
            const opt = document.createElement('option');
            opt.value = d.name;
            opt.textContent = `${d.slot} ${d.name.toUpperCase()}`;
            sectorSel.appendChild(opt);
        });

        // Pre-select the default domain (dashboard context)
        const defaultDomain = getDefaultDomain();
        sectorSel.value = defaultDomain.name;

        // Update the persistent sector badge (visible but inactive on Global)
        const sectorBadge = document.getElementById('tab-sector-label');
        if (sectorBadge) {
            sectorBadge.textContent = `▸ ${defaultDomain.name.toUpperCase()}`;
            sectorBadge.classList.remove('active');
            sectorBadge.style.cursor = 'pointer';
            sectorBadge.onclick = () => {
                window.location.href = `../domain/domain.html?domain=${encodeURIComponent(defaultDomain.name)}`;
            };
        }

        sectorSel.addEventListener('change', () => {
            if (sectorSel.value) window.location.href = `../domain/domain.html?domain=${encodeURIComponent(sectorSel.value)}`;
        });
    }


    // ── AUDIT DEPTH PERSISTENCE ────────────────────────────────────────
    const depthSel = document.getElementById('audit-depth-selector');
    if (depthSel) {
        depthSel.value = localStorage.getItem('fp_audit_depth') || 'meta';
        depthSel.addEventListener('change', () => {
            localStorage.setItem('fp_audit_depth', depthSel.value);
            const label = depthSel.options[depthSel.selectedIndex].text;
            appendLine(`[SYSTEM] Re-calibrating sensors... DEPTH → ${label}`, 'success');
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

    function applyTheme(name) {
        const t = name.toLowerCase().trim();
        if (!THEMES.includes(t)) return `Unknown theme. Available: ${THEMES.join(', ')}`;
        document.body.className = `theme-${t}`;
        localStorage.setItem('fp_theme', t);
        return `Theme switched to [${t.toUpperCase()}]. Saving to memory...`;
    }

    // ── AUDIO ENGINE (Synthesized, no external files) ──────────────────
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }
    function playKeystroke() {
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.start(); osc.stop(ctx.currentTime + 0.05);
        } catch(e) {}
    }
    function playSuccess() {
        try {
            const ctx = getAudioCtx();
            [440, 660].forEach((freq, i) => {
                const osc = ctx.createOscillator(); const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
                gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
                osc.start(ctx.currentTime + i * 0.1); osc.stop(ctx.currentTime + i * 0.1 + 0.25);
            });
        } catch(e) {}
    }
    function playError() {
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        } catch(e) {}
    }

    input.addEventListener('keyup', (e) => {
        if (!['Enter','ArrowUp','ArrowDown','Tab'].includes(e.key)) playKeystroke();
    });

    // ── COMMAND HISTORY ────────────────────────────────────────────────
    const commandHistory = [];
    let historyIndex = -1;

    // ── MATRIX DECRYPT EFFECT ──────────────────────────────────────────
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>/\\|{}[]';
    function matrixDecrypt(element, finalString, duration = 600) {
        let start = null; const len = finalString.length;
        function step(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const lockedChars = Math.floor(progress * len);
            let result = '';
            for (let i = 0; i < len; i++) {
                if (i < lockedChars || finalString[i] === ' ') result += finalString[i];
                else result += CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            element.textContent = result;
            if (progress < 1) requestAnimationFrame(step);
            else element.textContent = finalString;
        }
        requestAnimationFrame(step);
    }
    document.querySelectorAll('.terminal-line.system, .terminal-line.success, .terminal-line').forEach((el, i) => {
        const original = el.textContent;
        if (original.trim()) {
            el.textContent = '';
            setTimeout(() => matrixDecrypt(el, original, 700), i * 180);
        }
    });

    // ── HELPERS ─────────────────────────────────────────────────────────
    function appendLine(text, type = '') {
        const div = document.createElement('div');
        div.className = 'terminal-line' + (type ? ` ${type}` : '');
        div.innerText = text;
        output.appendChild(div);
    }
    function shakeTerminal() {
        container.classList.add('terminal-error-shake');
        setTimeout(() => container.classList.remove('terminal-error-shake'), 500);
    }
    function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    // ── PHASE 3 COMMANDS (NEW) ──────────────────────────────────────────
    function cmdSectorJump(args) {
        if (!args) return `Usage: sector-jump [slot|name]\nExample: sector-jump 06  or  sector-jump Internal Audit`;
        const match = DOMAIN_DATA_GLOBAL.find(d =>
            d.slot === args.padStart(2,'0') ||
            d.name.toLowerCase() === args.toLowerCase()
        );
        if (!match) return `[ERROR] No sector found matching "${args}". Try sector-jump 01 or sector-jump Internal Audit.`;
        appendLine(`[JUMP] Binding sector lock → ${match.slot} ${match.name.toUpperCase()}...`, 'success');
        setTimeout(() => { window.location.href = `../domain/domain.html?domain=${encodeURIComponent(match.name)}`; }, 900);
        return null;
    }

    function cmdAuditReport() {
        const threats = DOMAIN_DATA_GLOBAL.filter(d => d.status === 'threat');
        const actives = DOMAIN_DATA_GLOBAL.filter(d => d.status === 'active');
        const warnings = DOMAIN_DATA_GLOBAL.filter(d => d.status === 'warning');
        const stables = DOMAIN_DATA_GLOBAL.filter(d => d.status === 'stable');
        const lines = [
            '  ╔══════════════════════════════════════╗',
            '  ║    GLOBAL AUDIT REPORT // LIVE       ║',
            '  ╠══════════════════════════════════════╣',
            `  ║  STABLE  : ${String(stables.length).padEnd(2)}  ${stables.map(d=>d.slot).join(', ').padEnd(22)}║`,
            `  ║  ACTIVE  : ${String(actives.length).padEnd(2)}  ${actives.map(d=>d.slot).join(', ').padEnd(22)}║`,
            `  ║  WARNING : ${String(warnings.length).padEnd(2)}  ${warnings.map(d=>d.slot).join(', ').padEnd(22)}║`,
            `  ║  THREAT  : ${String(threats.length).padEnd(2)}  ${threats.map(d=>d.slot).join(', ').padEnd(22)}║`,
            '  ╠══════════════════════════════════════╣',
            `  ║  TOTAL SECTORS : ${String(DOMAIN_DATA_GLOBAL.length).padEnd(20)}║`,
            `  ║  LAST UPDATED  : ${new Date().toISOString().slice(0,16)}Z  ║`,
            '  ╚══════════════════════════════════════╝',
        ];
        lines.forEach((l, i) => setTimeout(() => { appendLine(l, i === 1 ? 'success' : ''); output.scrollTop = output.scrollHeight; }, i * 80));
        setTimeout(() => playSuccess(), lines.length * 80 + 50);
        return null;
    }

    function cmdWeather() {
        const conditions = ['NEURAL STORM — MODERATE', 'CLEAR — DATA FIDELITY OPTIMAL', 'THERMAL SURGE — SECTOR 06', 'STATIC FOG — CROSS-REF ZONE'];
        const wind = ['N-NODE', 'S-SYNC', 'E-ENCRYPT', 'W-WRITE'];
        const lines = [
            '  ┌─────────────────────────────────────┐',
            '  │   ⚡ NEURAL WEATHER // FRONTIER    │',
            '  ├─────────────────────────────────────┤',
            `  │  CONDITION : ${conditions[rnd(0,3)].padEnd(23)}│`,
            `  │  TEMP      : ${rnd(48,65)}°C NEURAL CORE          │`,
            `  │  WIND      : ${wind[rnd(0,3)]} @ ${rnd(12,45)} Gbps        │`,
            `  │  HUMIDITY  : ${rnd(10,35)}% DATA DENSITY          │`,
            `  │  FORECAST  : STABLE BURST EXPECTED   │`,
            '  └─────────────────────────────────────┘',
        ];
        lines.forEach((l, i) => setTimeout(() => { appendLine(l, i === 1 ? 'success' : ''); output.scrollTop = output.scrollHeight; }, i * 90));
        setTimeout(() => playSuccess(), lines.length * 90 + 50);
        return null;
    }

    function cmdBroadcastClear() {
        if (broadcastBar) broadcastBar.classList.remove('active');
        return '[BROADCAST] Channel cleared. Frequency released.';
    }

    function cmdSystemLogs() {
        const actors = ['SYSTEM', 'AUDITOR_ATUL', 'AI_AGENT', 'NEURAL_GUARDIAN', 'SECTOR_06', 'GLOBAL_CORE'];
        const events = [
            'Heartbeat confirmed — all 12 sectors nominal',
            'Cross-sector sync completed — 0 conflicts',
            'KPI snapshot archived — block 0xFF-07',
            'Threat scan cycle complete — 0 anomalies',
            'Neural uplink re-established — 14ms latency',
            'Asset manifest rebuilt — 247 items indexed',
            'Theme persistence verified — [FRONTIER] mode',
            'Sector 06 integrity hash match — PASS',
            'Cache eviction triggered — 12 stale blocks removed',
            'Bandwidth allocation rebalanced — +18% headroom',
        ];
        appendLine('[ SYSTEM LOGS // LAST 10 EVENTS ]', 'success');
        events.forEach((ev, i) => setTimeout(() => {
            const actor = actors[rnd(0, actors.length - 1)];
            const h = String(rnd(0,23)).padStart(2,'0');
            const m = String(rnd(0,59)).padStart(2,'0');
            const s = String(rnd(0,59)).padStart(2,'0');
            appendLine(`  [${h}:${m}:${s}] [${actor}] ${ev}`);
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 130));
        setTimeout(() => { playSuccess(); output.scrollTop = output.scrollHeight; }, events.length * 130 + 100);
        return null;
    }

    function cmdNeuralSync() {
        const sectors = DOMAIN_DATA_GLOBAL.map(d => d.name);
        appendLine('[ NEURAL SYNC // RE-ALIGNING ALL SECTORS ]', 'success');
        sectors.forEach((s, i) => setTimeout(() => {
            const pct = rnd(96, 100);
            const filled = Math.round((pct / 100) * 20);
            const bar = '#'.repeat(filled) + '.'.repeat(20 - filled);
            appendLine(`  ${s.toUpperCase().padEnd(28)} [${bar}] ${pct}%`, pct === 100 ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 180));
        setTimeout(() => {
            appendLine(`NEURAL SYNC COMPLETE. ${sectors.length} sectors realigned.`, 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, sectors.length * 180 + 200);
        return null;
    }

    function cmdSectorPing(args) {
        if (!args) return `Usage: sector-ping [slot|name]\nExample: sector-ping 06`;
        const match = DOMAIN_DATA_GLOBAL.find(d =>
            d.slot === args.padStart(2,'0') ||
            d.name.toLowerCase().includes(args.toLowerCase())
        );
        if (!match) return `[ERROR] Sector "${args}" not found.`;
        const steps = [
            `PINGING ${match.name.toUpperCase()} [SLOT ${match.slot}]...`,
            `  Link Established   [####################] 100%`,
            `  Integrity Echo     [${('#'.repeat(rnd(17,20)) + '.'.repeat(3)).slice(0,20)}] ${rnd(92,100)}%`,
            `  Data Fidelity      [${('#'.repeat(rnd(17,20)) + '.'.repeat(3)).slice(0,20)}] ${rnd(94,100)}%`,
            `PING COMPLETE. Status: ${match.status.toUpperCase()}.`,
        ];
        steps.forEach((l, i) => setTimeout(() => {
            appendLine(l, l.startsWith('PING COMPLETE') || l.startsWith('PING') ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 220));
        setTimeout(() => { playSuccess(); }, steps.length * 220 + 50);
        return null;
    }

    function cmdGlobalSearch(args) {
        if (!args) return `Usage: global-search [query]\nExample: global-search audio`;
        appendLine(`[ GLOBAL SEARCH ] Scanning all sectors for: "${args.toUpperCase()}"...`, 'success');
        const results = DOMAIN_DATA_GLOBAL.filter(() => rnd(0, 2) > 0).map(d => ({
            slot: d.slot, name: d.name, hits: rnd(1, 12)
        }));
        results.forEach((r, i) => setTimeout(() => {
            appendLine(`  [${r.slot}] ${r.name.toUpperCase().padEnd(28)} → ${r.hits} match(es)`);
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 110));
        setTimeout(() => {
            appendLine(`SEARCH COMPLETE. ${results.length} sectors matched. ${results.reduce((a,b)=>a+b.hits,0)} total hits.`, 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, results.length * 110 + 150);
        return null;
    }

    function cmdProtocolX() {
        const seq = [
            '  ██████████████████████████████████████',
            '  ██   PROTOCOL X — CLASSIFIED       ██',
            '  ██████████████████████████████████████',
            '  Accessing restricted memory layer...',
            '  OVERRIDE: ████████████  [ACCEPTED]',
            '  Decrypting core manifest...',
            '  ▓▓▓▓▓▓░░░░░░  50%',
            '  ▓▓▓▓▓▓▓▓▓▓░░  80%',
            '  ▓▓▓▓▓▓▓▓▓▓▓▓ 100%',
            '  [PROTOCOL X] Sequence complete. No further action authorised.',
        ];
        seq.forEach((l, i) => setTimeout(() => {
            appendLine(l, l.startsWith('  [PROTOCOL X]') ? 'success' : l.includes('CLASSIFIED') ? 'error' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 260));
        setTimeout(() => { playSuccess(); }, seq.length * 260 + 50);
        return null;
    }

    function cmdThreatLevel() {
        const threats = DOMAIN_DATA_GLOBAL.filter(d => d.status === 'threat');
        const warnings = DOMAIN_DATA_GLOBAL.filter(d => d.status === 'warning');
        const level = threats.length > 0 ? 'ELEVATED' : warnings.length > 0 ? 'GUARDED' : 'NORMAL';
        return [
            `  THREAT LEVEL: ${level}`,
            `  ─────────────────────────────────────`,
            `  Active Threats  : ${threats.length > 0 ? threats.map(d=>d.name).join(', ') : 'NONE'}`,
            `  Active Warnings : ${warnings.length > 0 ? warnings.map(d=>d.name).join(', ') : 'NONE'}`,
            `  Anomaly Count   : ${rnd(0,2)}`,
            `  Last Sweep      : ${new Date().toISOString().slice(0,16)}Z`,
        ].join('\n');
    }

    function cmdFirewallStatus() {
        const layers = [
            { name: 'Perimeter Shield  ', pct: 100 },
            { name: 'Data Encapsulation', pct: 100 },
            { name: 'Auth Gateway      ', pct: rnd(97,100) },
            { name: 'Neural Firewall   ', pct: rnd(95,100) },
            { name: 'Cipher Wall       ', pct: 100 },
        ];
        appendLine('[ FIREWALL STATUS // GLOBAL NODE ]', 'success');
        layers.forEach((l, i) => setTimeout(() => {
            const filled = Math.round((l.pct / 100) * 20);
            appendLine(`  ${l.name} [${'#'.repeat(filled)}${'.'.repeat(20 - filled)}] ${l.pct}%`, l.pct === 100 ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 180));
        setTimeout(() => {
            appendLine('ALL FIREWALL LAYERS NOMINAL.', 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, layers.length * 180 + 120);
        return null;
    }

    function cmdBandwidthUsage() {
        const lines = [
            '  BANDWIDTH MONITOR // SECTOR TRAFFIC',
            '  ─────────────────────────────────────',
        ];
        DOMAIN_DATA_GLOBAL.forEach(d => {
            const mbps = rnd(1, 980);
            const filled = Math.round((mbps / 1000) * 20);
            lines.push(`  [${d.slot}] ${d.name.toUpperCase().slice(0,16).padEnd(16)} ${String(mbps).padStart(4)}Mbps [${'#'.repeat(filled)}${'.'.repeat(20-filled)}]`);
        });
        lines.push('  ─────────────────────────────────────');
        lines.push(`  TOTAL THROUGHPUT: ${rnd(5,12)}.${rnd(0,9)} Gbps`);
        lines.forEach((l, i) => setTimeout(() => { appendLine(l, i === 0 ? 'success' : ''); output.scrollTop = output.scrollHeight; }, i * 70));
        setTimeout(() => { playSuccess(); }, lines.length * 70 + 50);
        return null;
    }

    function cmdVersion() {
        return [
            '  FRONTIER PROTOCOL // VERSION INFO',
            '  ─────────────────────────────────────',
            '  CORE        : v2.0.0-stable',
            '  NEURAL ENGINE: v3.4.1',
            '  AUDIT MODULE: v1.8.2',
            '  THEME ENGINE: v2.1.0',
            '  BUILD DATE  : 2026-03-25',
            '  NODE        : GLOBAL',
            '  BUILD TAG   : #fp-2025-g-042',
        ].join('\n');
    }

    function cmdMOTD() {
        const messages = [
            'Every audit left unexamined is a risk unmanaged.',
            'The data does not lie — only the auditor sleeps.',
            'Clarity is security. Ambiguity is vulnerability.',
            'In the Frontier, the signal is truth. Noise is the enemy.',
            'Document everything. The next auditor is future you.',
        ];
        return [
            '  ┌─────────────────────────────────────┐',
            `  │  "${messages[rnd(0,4)].padEnd(35)}"`,
            '  │                                     │',
            '  │           — FRONTIER PROTOCOL       │',
            '  └─────────────────────────────────────┘',
        ].join('\n');
    }

    // ── PHASE 2 COMMANDS ────────────────────────────────────────────────
    function cmdNetworkMap() {
        const lines = [
            '  RAJSHREE FRONTIER — NEURAL TREE v2.0',
            '  ═══════════════════════════════════════',
            '  ◉ GLOBAL NODE [ONLINE]',
            '  ┣━━ 00 SYSTEM & GUARDRAILS  [ACTIVE]',
            '  ┣━━ 01 CURRENT STATE         [ACTIVE]',
            '  ┣━━ 02 RESEARCH & KNOWLEDGE  [ACTIVE]',
            '  ┣━━ 03 ARCHITECTURE          [ACTIVE]',
            '  ┣━━ 04 SANDBOX & DEMOS       [ACTIVE]',
            '  ┣━━ 05 INFRASTRUCTURE        [ACTIVE]',
            '  ┣━━ 06 INTERNAL AUDIT ●      [NODE]  ',
            '  ┣━━ 07 AI TRAINING & MODELS  [ACTIVE]',
            '  ┣━━ 08 PROTOCOL X            [ACTIVE]',
            '  ┣━━ 09 AUDIO SCRIPT          [ACTIVE]',
            '  ┣━━ 10 MVP                   [ACTIVE]',
            '  ┗━━ 11 SECURITY & ETHICS     [ACTIVE]',
        ];
        lines.forEach((l, i) => setTimeout(() => {
            appendLine(l, i === 1 || i === 0 ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * 80));
        setTimeout(() => { playSuccess(); output.scrollTop = output.scrollHeight; }, lines.length * 80 + 50);
        return null;
    }

    function cmdAuditLog() {
        const actors = ['SYSTEM', 'AUDITOR_ATUL', 'AI_AGENT', 'NEURAL_GUARDIAN'];
        const events = [
            'Sector 06 integrity verified — PASS',
            'Asset manifest rebuilt — 247 items indexed',
            'Neural sync re-aligned — latency 12ms',
            'Global KPI snapshot captured — stored',
            'Anomaly scan completed — 0 threats detected',
            'Sector 01 heartbeat confirmed — ONLINE',
            'Theme profile [FRONTIER] loaded from memory',
        ];
        appendLine('[ AUDIT LOG // LAST 7 EVENTS ]', 'success');
        events.forEach((ev, i) => setTimeout(() => {
            const actor = actors[rnd(0, actors.length - 1)];
            const min = String(rnd(0, 59)).padStart(2, '0');
            appendLine(`  [01:${min}:${String(rnd(0,59)).padStart(2,'0')}] [${actor}] ${ev}`);
            output.scrollTop = output.scrollHeight;
        }, (i + 1) * 150));
        setTimeout(() => { playSuccess(); output.scrollTop = output.scrollHeight; }, events.length * 150 + 100);
        return null;
    }

    function cmdWhoami() {
        return [
            '  ╔══════════════════════════════════╗',
            '  ║  IDENTITY PROFILE // FRONTIER    ║',
            '  ╠══════════════════════════════════╣',
            '  ║  ID    : LEAD_AUDITOR_V2         ║',
            '  ║  NAME  : ATUL VERMA              ║',
            '  ║  NODE  : INTERNAL AUDIT [06]     ║',
            '  ║  CLEAR : LEVEL 4 / UNRESTRICTED  ║',
            '  ║  UPLINK: PRIMARY / ENCRYPTED     ║',
            '  ╚══════════════════════════════════╝',
        ].join('\n');
    }

    function cmdThemeSwitch(args) {
        if (!args) {
            return `Usage: theme-switch [name]\nAvailable themes: ${THEMES.join(', ')}`;
        }
        return applyTheme(args);
    }

    function cmdUptime() {
        const start = performance.timing ? performance.timing.navigationStart : Date.now() - rnd(5000, 180000);
        const up = Math.round((Date.now() - start) / 1000);
        const mins = Math.floor(up / 60);
        const secs = up % 60;
        return [
            '  SYSTEM PERFORMANCE // LIVE SNAPSHOT',
            `  CPU TEMP  : ${rnd(48, 62)}°C       STATUS: OPTIMAL`,
            `  MEMORY    : ${rnd(34, 55)}% USED    (${rnd(4, 8)} GB free)`,
            `  UPTIME    : ${mins}m ${secs}s`,
            `  LINK RATE : ${rnd(980, 1000)} Mbps    LATENCY: ${rnd(10,18)}ms`,
            `  THREADS   : ${rnd(6, 24)} active  LOAD: ${rnd(10, 40)}%`,
        ].join('\n');
    }

    function cmdBroadcast(args) {
        if (!args) return 'Usage: broadcast [your message]';
        if (broadcastBar && broadcastText) {
            broadcastText.textContent = args.toUpperCase();
            broadcastBar.classList.add('active');
        }
        return `[BROADCAST SENT] → "${args}"`;
    }

    function cmdPing() {
        const { layers, speed, label } = getAuditParams();
        const BASE_STEPS = [
            { label: 'Memory Integrity  ', pct: 100 },
            { label: 'Neural Sync Link  ', pct: 88  },
            { label: 'Sector Uplinks    ', pct: 97  },
            { label: 'Data Fidelity     ', pct: 94  },
        ];
        // Generate extra steps for deeper scans
        const extraLabels = [
            'Cross-Ref Parity  ', 'Cipher Block Check', 'Metadata Tokens   ', 'Node Heartbeat    ',
            'Cache Coherence   ', 'Root Hash Verify  ', 'Block Sequence    ', 'Entropy Monitor   ',
            'KPI Snapshot      ', 'Audit Trail       ', 'Access Tokens     ', 'Sync Anchors      ',
        ];
        const steps = [...BASE_STEPS, ...extraLabels.slice(0, layers - 4).map(l => ({ label: l, pct: rnd(91, 100) }))];
        appendLine(`[ ${label} // ${layers} VECTORS ]`, 'success');
        const total = 20;
        steps.forEach((s, i) => setTimeout(() => {
            const bar = '#'.repeat(Math.round((s.pct / 100) * total)) + '.'.repeat(total - Math.round((s.pct / 100) * total));
            appendLine(`  ${s.label} [${bar}] ${s.pct}%`, s.pct === 100 ? 'success' : '');
            output.scrollTop = output.scrollHeight;
        }, i * speed));
        setTimeout(() => {
            appendLine(`DIAGNOSTICS COMPLETE. All ${layers} vectors nominal.`, 'success');
            output.scrollTop = output.scrollHeight; playSuccess();
        }, steps.length * speed + 100);
        return null;
    }

    // ── COMMANDS REGISTRY ──────────────────────────────────────────────
    function cmdStats() {
        const { label, detail } = getAuditParams();
        const base = [
            `  KPI SUMMARY // ${label}`,
            '  ─────────────────────────────────────',
            `  Data Fidelity  : ${rnd(92, 99)}.${rnd(0,9)}%`,
            `  Neural Sync    : ${rnd(85, 99)}.${rnd(0,9)}%`,
            `  Latency        : ${rnd(10, 20)}ms`,
            `  Active Anomalies: 0`,
        ];
        if (detail) {
            base.push(
                `  Sector Coverage: ${rnd(94, 100)}%`,
                `  Asset Integrity: ${rnd(97, 100)}%`,
                `  Cache Hit Rate : ${rnd(88, 98)}%`,
                `  Thread Saturation: ${rnd(10, 35)}%`,
            );
        }
        return base.join('\n');
    }

    const commands = {
        'help':            () => 'Available commands:\n  help, whoami, status, stats, sectors, network-map, audit-log,\n  system-uptime, broadcast, broadcast-clear, ping, clear, exit,\n  sector-jump, audit-report, weather, system-logs, neural-sync,\n  sector-ping, global-search, protocol-x, threat-level,\n  firewall-status, bandwidth-usage, version, motd, theme-switch',
        'status':          () => `GLOBAL SYSTEM STATUS: [NOMINAL]. Core heartbeat detected. Link uptime: 99.98%. Audit mode: ${getAuditParams().label}.`,
        'stats':           cmdStats,
        'sectors':         () => DOMAIN_DATA_GLOBAL.map(d => `  [${d.slot}] ${d.name.toUpperCase()} — ${d.status.toUpperCase()}`).join('\n'),
        'whoami':          cmdWhoami,
        'network-map':     cmdNetworkMap,
        'audit-log':       cmdAuditLog,
        'system-uptime':   cmdUptime,
        'ping':            cmdPing,
        'audit-report':    cmdAuditReport,
        'weather':         cmdWeather,
        'broadcast-clear': cmdBroadcastClear,
        'system-logs':     cmdSystemLogs,
        'neural-sync':     cmdNeuralSync,
        'protocol-x':      cmdProtocolX,
        'threat-level':    cmdThreatLevel,
        'firewall-status': cmdFirewallStatus,
        'bandwidth-usage': cmdBandwidthUsage,
        'version':         cmdVersion,
        'motd':            cmdMOTD,
        'clear':   () => { output.innerHTML = ''; return 'Global Terminal cleared.'; },
        'exit':    () => { window.location.href = '../../index.html'; return 'Disconnecting...'; },
    };
    // theme-switch, broadcast, sector-jump, sector-ping, global-search need argument parsing — handled in input handler

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
                const allCmds = [...Object.keys(commands), 'theme-switch', 'broadcast'];
                const match = allCmds.find(cmd => cmd.startsWith(partial));
                if (match) input.value = match;
            }
            return;
        }
        if (e.key === 'Enter') {
            const raw = input.value;
            const val = raw.trim().toLowerCase();
            const [cmd, ...argParts] = val.split(' ');
            const args = argParts.join(' ').trim();
            if (val) { commandHistory.push(val); historyIndex = -1; }

            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `<span class="prompt">GLOBAL@FRONTIER:~$</span> ${raw}`;
            output.appendChild(line);

            let handled = false;

            // Argument-bearing commands
            if (cmd === 'theme-switch') { appendLine(cmdThemeSwitch(args)); playSuccess(); handled = true; }
            else if (cmd === 'broadcast') {
                const r = cmdBroadcast(argParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
                appendLine(r); playSuccess(); handled = true;
            } else if (cmd === 'sector-jump') {
                const r = cmdSectorJump(args);
                if (r !== null) { appendLine(r, r.startsWith('[ERROR]') ? 'error' : ''); r.startsWith('[ERROR]') ? playError() : playSuccess(); }
                handled = true;
            } else if (cmd === 'sector-ping') {
                const r = cmdSectorPing(args);
                if (r !== null) { appendLine(r, r.startsWith('[ERROR]') ? 'error' : ''); r.startsWith('[ERROR]') ? playError() : playSuccess(); }
                handled = true;
            } else if (cmd === 'global-search') {
                const r = cmdGlobalSearch(args);
                if (r !== null) { appendLine(r, r.startsWith('[ERROR]') ? 'error' : ''); r.startsWith('[ERROR]') ? playError() : playSuccess(); }
                handled = true;
            }

            if (!handled) {
                if (cmd && commands[cmd] !== undefined) {
                    const result = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
                    if (result !== null && result !== undefined) { appendLine(result); playSuccess(); }
                } else if (val !== '') {
                    appendLine(`Command not found: ${cmd}. Type 'help' for options.`, 'error');
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
        const allCmds = [...Object.keys(commands), 'theme-switch', 'broadcast', 'sector-jump', 'sector-ping', 'global-search'];
        allCmds.forEach(cmd => {
            const btn = document.createElement('button');
            btn.className = 'hud-cmd';
            btn.textContent = `> ${cmd}`;
            btn.addEventListener('click', () => {
                input.value = cmd;
                input.focus();
                // place cursor at end
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

    // Fix: broadcast close button
    document.addEventListener('click', (e) => {
        if (e.target.id === 'broadcast-close-btn' || e.target.classList.contains('broadcast-close')) {
            broadcastBar.classList.remove('active');
        }
        if (!e.target.closest('#domain-selector') && !e.target.closest('.tab-link') && !e.target.closest('#audit-depth-selector') && !e.target.closest('.terminal-hud-panel')) {
            input.focus();
        }
    });
});
