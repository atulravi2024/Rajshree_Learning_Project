if (!window.RAJSHREE_DATA) window.RAJSHREE_DATA = {};
window.RAJSHREE_DATA.tables_10_m2 = (() => {
    const tables = [];
    const icons = ["🥚", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍍", "🍎🥚"];
    for (let n = 2; n <= 10; n++) {
        let l = "", r = "";
        const hNames = ["०", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस"];
        for (let i = 1; i <= 10; i++) {
            const line = `${n} ${hNames[i]} जा ${n * i}<br>`;
            if (i <= 5) l += line; else r += line;
        }
        const hiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "१०"];
        const toHi = (num) => num.toString().split('').map(d => hiDigits[parseInt(d)]).join('');
        tables.push({
            letter: toHi(n), word: `पहाड़ा`, emoji: icons[n], audio: `ganit/tables/method_2/table_${n}_m2.mp3`,
            content: `<div class="table-method-title"><b class="table-method-label" style="color:#2196F3;">बोलचाल पद्धति</b></div><div class="table-method-container"><div class="table-column">${l}</div><div class="table-divider"></div><div class="table-column">${r}</div></div>`
        });
    }
    return tables;
})();
