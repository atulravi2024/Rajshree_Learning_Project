document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const header = document.getElementById('domain-header');
    const welcome = document.getElementById('welcome-message');
    const prompt = document.getElementById('terminal-prompt');

    lucide.createIcons();

    // Contextual Detection
    const urlParams = new URLSearchParams(window.location.search);
    const domainId = urlParams.get('domain') || 'INTERNAL AUDIT';
    const sectorName = domainId.toUpperCase();

    header.textContent = `DOMAIN CONSOLE // SECTOR: ${sectorName}`;
    welcome.textContent = `Sector ${sectorName} Diagnostics v2.0 READY. Connection: SECURE.`;
    prompt.textContent = `${sectorName}@FRONTIER:~$`;

    const commands = {
        'help': 'Available commands: help, trace, drift, verify, clear, exit',
        'trace': `Scanning Asset Manifest for ${sectorName}...\n[OK] sector_index.json found.\n[OK] audio/varnamala/ traces active.\n[OK] integrity_hash verified.`,
        'drift': `Calculating Sector Drift for ${sectorName}...\nDRIFT RATE: 0.00% (STABLE)\nNEURAL SYNCHRONY: 98.4%`,
        'verify': `Deep verify ${sectorName} memory blocks...\nBlock 0xFF-01: VALID\nBlock 0xFF-02: VALID\nBlock 0xFF-03: VALID`,
        'clear': () => { output.innerHTML = ''; return `${sectorName} Terminal cleared.`; },
        'exit': () => { window.location.href = '../../index.html'; return 'Releasing sector lock...'; }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim().toLowerCase();
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `<span class="prompt">${sectorName}@FRONTIER:~$</span> ${input.value}`;
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
                response.innerText = `Command not found: ${val}. Type 'help' for sector options.`;
            }

            if (val !== '') output.appendChild(response);
            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });

    document.addEventListener('click', () => input.focus());
});
