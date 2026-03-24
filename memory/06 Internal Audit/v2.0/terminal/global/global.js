document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    lucide.createIcons();
    initNotifications();

    const commands = {
        'help': 'Available commands: help, status, stats, sectors, clear, exit',
        'status': 'GLOBAL SYSTEM STATUS: [NOMINAL]. Core heartbeat detected. Link uptime: 99.98%.',
        'stats': 'OVERALL KPI SUMMARY:\n- Data Fidelity: 94.2%\n- Neural Sync: 88.5%\n- Latency: 12ms\n- Active Anomalies: 0',
        'sectors': 'SECTOR LIST:\n01: SWAR\n02: VYANJAN\n06: INTERNAL AUDIT (CURRENT NODE)\n08: NUMBERS\n11: COLORS',
        'clear': () => { output.innerHTML = ''; return 'Global Terminal cleared.'; },
        'exit': () => { window.location.href = '../../index.html'; return 'Disconnecting...'; }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim().toLowerCase();
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `<span class="prompt">GLOBAL@FRONTIER:~$</span> ${input.value}`;
            output.appendChild(line);

            const response = document.createElement('div');
            response.className = 'terminal-line';

            if (commands[val]) {
                if (typeof commands[val] === 'function') {
                    response.innerText = commands[val]();
                } else {
                    response.innerText = commands[val];
                }
            } else if (val !== '') {
                response.className = 'terminal-line error';
                response.innerText = `Command not found: ${val}. Type 'help' for global options.`;
            }

            if (val !== '') output.appendChild(response);
            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });

    document.addEventListener('click', () => input.focus());
});
