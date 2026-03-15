if (!window.RAJSHREE_DATA) window.RAJSHREE_DATA = {};
window.RAJSHREE_DATA.tables_10_m1 = (() => {
    const tables = [];
    const icons = ["🥚", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍍", "🍎🥚", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🫐", "🍇", "🍈", "🍎🍎"];
    for (let n = 2; n <= 20; n++) {
        let l = "", r = "";
        for (let i = 1; i <= 10; i++) {
            const line = `${n} x ${i} = ${n * i}<br>`;
            if (i <= 5) l += line; else r += line;
        }
        const hiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "१०", "११", "१२", "१३", "१४", "१५", "१६", "१७", "१८", "१९", "२०"];
        const toHi = (num) => {
            const digits = num.toString().split('').map(d => ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"][parseInt(d)]);
            return digits.join('');
        };
        tables.push({
            letter: toHi(n), word: `पहाड़ा`, emoji: icons[n] || "🍎", audio: `ganit/tables/method_1/table_${n}_m1.mp3`,
            content: `<div style="text-align:center;"><b style="font-size:4.5vh; color:#FF5722;">स्कूल पद्धति</b></div><div style="display:flex; justify-content:center; align-items: flex-start; font-size:4.5vh; margin-top:15px; font-weight:bold; gap: 30px;"><div style="text-align:left;">${l}</div><div style="width: 3px; background: #FFDEE9; height: 35vh; align-self: center;"></div><div style="text-align:left;">${r}</div></div>`
        });
    }
    return tables;
})();
