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
        tables.push({ letter: toHi(n), word: `पहाड़ा`, emoji: icons[n], audio: `assets/audio/ganit/tables/method_2/table_${n}_m2.mp3`, 
            content: `<div style="text-align:center;"><b style="font-size:4.5vh; color:#2196F3;">बोलचाल पद्धति</b></div><div style="display:flex; justify-content:center; align-items: flex-start; font-size:4vh; margin-top:15px; font-weight:bold; gap: 30px;"><div style="text-align:left;">${l}</div><div style="width: 3px; background: #FFDEE9; height: 35vh; align-self: center;"></div><div style="text-align:left;">${r}</div></div>` });
    }
    return tables;
})();