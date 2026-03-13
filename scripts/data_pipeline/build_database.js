const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, '..', '..', 'database', 'master_records', 'Rajshree_Learning_Data_Master.xlsx');
const DATA_DIR = path.join(__dirname, '..', '..', 'frontend', 'src', 'js', 'data');

try {
    console.log('🔄 Reading Excel file...');
    const wb = xlsx.readFile(EXCEL_FILE);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    console.log(`📊 Total rows found: ${data.length}`);

    // Group exactly by the JS object keys used in Rajshree
    const outputData = {};

    data.forEach(row => {
        if (row.Status !== 'active' && row.Status !== '') return;

        let fileMap = null;

        if (row.Title === 'Varnamala') {
            if (row.MainMenu === 'Swar') fileMap = { key: 'swar', folder: 'varnamala' };
            else if (row.MainMenu === 'Vyanjan') fileMap = { key: 'vyanjan', folder: 'varnamala' };
            else if (row.MainMenu === 'Samyukt') fileMap = { key: 'samyukt', folder: 'varnamala' };
            else if (row.MainMenu === 'Matra') fileMap = { key: 'matra', folder: 'varnamala' };
        } else if (row.Title === 'Sankhya') {
            if (row.MainMenu === 'Ginti' && row.SubMenu === '1-10') fileMap = { key: 'numbers_10', folder: 'ganit' };
            else if (row.MainMenu === 'Ginti' && row.SubMenu === '1-100') fileMap = { key: 'numbers_100', folder: 'ganit' };
            else if (row.MainMenu === 'Pahade' && row.SubMenu.includes('M1')) fileMap = { key: 'tables_10_m1', folder: 'ganit' };
            else if (row.MainMenu === 'Pahade' && row.SubMenu.includes('M2')) fileMap = { key: 'tables_10_m2', folder: 'ganit' };
            else if (row.MainMenu === 'Shapes') fileMap = { key: 'shapes', folder: 'ganit' };
            else if (row.MainMenu === 'Comparison') fileMap = { key: 'comparisons', folder: 'ganit' };
        } else if (row.Title === 'Names') {
            if (row.MainMenu === 'Family') fileMap = { key: 'family', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Body Parts') fileMap = { key: 'body_parts', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Animals' && row.SubMenu === 'Wild') fileMap = { key: 'animals_wild', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Animals' && row.SubMenu === 'Domestic') fileMap = { key: 'animals_domestic', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Nature') fileMap = { key: 'nature', folder: 'samay_prakriti' }; // It was mapped here previously
            else if (row.MainMenu === 'Fruits') fileMap = { key: 'fruits', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Vegetables') fileMap = { key: 'vegetables', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Habits') fileMap = { key: 'habits', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Vehicles') fileMap = { key: 'vehicles', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Emotions') fileMap = { key: 'emotions', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Clothes') fileMap = { key: 'clothes', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Actions') fileMap = { key: 'actions', folder: 'mera_sansar' };
            else if (row.MainMenu === 'Helpers') fileMap = { key: 'helpers', folder: 'mera_sansar' };
        } else if (row.Title === 'Samay') {
            if (row.MainMenu === 'Days') fileMap = { key: 'days_week', folder: 'samay_prakriti' };
            else if (row.MainMenu === 'Months') fileMap = { key: 'months_year', folder: 'samay_prakriti' };
            else if (row.MainMenu === 'Directions') fileMap = { key: 'directions', folder: 'samay_prakriti' };
            else if (row.MainMenu === 'Colors') {
                if (row.SubMenu === 'Primary') fileMap = { key: 'colors_primary', folder: 'rangon_ka_sansar' };
                else if (row.SubMenu === 'Secondary') fileMap = { key: 'colors_secondary', folder: 'rangon_ka_sansar' };
                else if (row.SubMenu === 'Natural') fileMap = { key: 'colors_natural', folder: 'rangon_ka_sansar' };
                else {
                    if (row.DeepSubMenu === 'Pink/Red') fileMap = { key: 'colors_pink_red', folder: 'rangon_ka_sansar' };
                    else if (row.DeepSubMenu === 'Blue/Green') fileMap = { key: 'colors_blue_green', folder: 'rangon_ka_sansar' };
                    else if (row.DeepSubMenu === 'Brown/Beige') fileMap = { key: 'colors_brown_beige', folder: 'rangon_ka_sansar' };
                    else if (row.DeepSubMenu === 'Metallic') fileMap = { key: 'colors_metallic', folder: 'rangon_ka_sansar' };
                    else if (row.DeepSubMenu === 'Special') fileMap = { key: 'colors_special', folder: 'rangon_ka_sansar' };
                    else fileMap = { key: 'colors_world_main', folder: 'rangon_ka_sansar' };
                }
            }
        }

        if (!fileMap) return; // Skip unrecognizable rows

        if (!outputData[fileMap.key]) outputData[fileMap.key] = { data: [], folder: fileMap.folder };

        outputData[fileMap.key].data.push({
            letter: row.Letter_Numeral,
            word: row.Word_Name,
            emoji: row.Icon_Emoji,
            audio: (row.Audio_Path || '').replace(/^assets\/audio\//, '').replace(/^assets\//, '../assets/'),
            word_en: row.Display_Word_En
        });
    });

    // Write out the individual files
    Object.keys(outputData).forEach(key => {
        const folderPath = path.join(DATA_DIR, outputData[key].folder);
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        let jsOutput = `if (!window.RAJSHREE_DATA) window.RAJSHREE_DATA = {};\n\n`;
        jsOutput += `window.RAJSHREE_DATA.${key} = [\n`;

        outputData[key].data.forEach(item => {
            jsOutput += `    { letter: '${item.letter}', word: '${item.word}', emoji: '${item.emoji}', audio: '${item.audio}', textOnly: ${item.word === 'खाली' ? 'false' : (item.word === '' ? 'true' : 'false')} },\n`;
        });

        jsOutput += `];\n`;

        const filePath = path.join(folderPath, `${key}.js`);
        fs.writeFileSync(filePath, jsOutput, 'utf8');
        console.log(`✅ Built: ${outputData[key].folder}/${key}.js`);
    });

    console.log('🎉 Successfully generated all individual category files!');

} catch (e) {
    console.error('❌ Build failed:', e.message);
}
