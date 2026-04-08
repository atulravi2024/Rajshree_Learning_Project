const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, '..', '..', 'database', 'excel', 'Rajshree_Learning_Data_Master.xlsx');
const DATA_DIR = path.join(__dirname, '..', '..', 'frontend', 'src', 'js', 'data');

try {
    console.log('🔄 Reading Excel file...');
    const wb = xlsx.readFile(EXCEL_FILE);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    console.log(`📊 Total rows found: ${data.length}`);

    // Group exactly by the JS object keys used in Rajshree
    const outputData = {};
    const digitEmojis = {};

    const COLOR_EMOJI_OVERRIDES = {
        'Red': '🍎',
        'Blue': '🌊',
        'Green': '🌿',
        'Yellow': '🍌',
        'Black': '⚫',
        'White': '🥛',
        'Brown': '🐻',
        'Pink': '🎀',
        'Orange': '🍊',
        'Purple': '🍇',
        'Grey': '🗿',
        'Maroon': '🧱',
        'Magenta': '🟣',
        'Beige': '🥜',
        'Khaki': '🧥',
        'Turquoise': '💎',
        'Golden': '🏆',
        'Silver': '🥈',
        'Off-White': '🧊',
        'Camphor White': '🧊',
        'Slate': '🗿',
        'Violet': '🍆',
        'Plum': '🍇',
        'Antimony': '🌚',
        'Golden Yellow': '🌼',
        'Ochre': '🏺',
        'Spring Yellow': '🌻',
        'Mung Green': '🫘',
        'Brinjal Purple': '🍆',
        'Jamun Purple': '🫐',
        'Pomegranate Red': '🍎',
        'Moss Green': '🌿',
        'Turmeric Yellow': '🫚',
        'Henna Green': '🍃',
        'Dust Color': '🧥',
        'Parrot Green': '🦜',
        'Slate Grey': '🗿',
        'Ruby Red': '💎',
        'Silvery': '🥈',
        'Copper': '🏺',
        'Bronze': '🥉',
        'Shiny': '✨',
        'Matte': '🌫️',
        'Light Pink': '🌸',
        'Dark Pink': '🌺',
        'Onion Pink': '🧅',
        'Crimson': '🌹',
        'Bright Pink': '🍭',
        'Brick Red': '🧱',
        'Light Blue': '🌤️',
        'Navy Blue': '🔵',
        'Light Green': '🌱',
        'Dark Green': '🌲',
        'Light Brown': '🥨',
        'Dark Brown': '🐻',
        'Sandalwood': '🪵',
        'Clay': '🏺'
    };

    const COLOR_HEX_OVERRIDES = {
        'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#008000', 'Yellow': '#FFFF00',
        'Black': '#000000', 'White': '#FFFFFF', 'Brown': '#8B4513', 'Pink': '#FFC0CB',
        'Orange': '#FFA500', 'Purple': '#800080', 'Grey': '#808080', 'Maroon': '#800000',
        'Magenta': '#FF00FF', 'Beige': '#F5F5DC', 'Khaki': '#C3B091', 'Turquoise': '#40E0D0',
        'Golden': '#FFD700', 'Silver': '#C0C0C0', 'Off-White': '#FAF9F6', 'Camphor White': '#FAF9F6',
        'Slate': '#708090', 'Violet': '#8F00FF', 'Plum': '#8E4585', 'Antimony': '#333333',
        'Golden Yellow': '#FFDF00', 'Ochre': '#CC7722', 'Spring Yellow': '#ECEBB0',
        'Mung Green': '#89A84E', 'Brinjal Purple': '#4B0082', 'Jamun Purple': '#3A125E',
        'Pomegranate Red': '#C0392B', 'Moss Green': '#8A9A5B', 'Turmeric Yellow': '#E8D33F',
        'Henna Green': '#2D5A27', 'Dust Color': '#C3B091', 'Parrot Green': '#37FD12',
        'Slate Grey': '#708090', 'Ruby Red': '#E0115F', 'Silvery': '#C0C0C0',
        'Copper': '#B87333', 'Bronze': '#CD7F32', 'Shiny': '#E0F7FA', 'Matte': '#757575',
        'Light Pink': '#FFB6C1', 'Dark Pink': '#FF1493', 'Onion Pink': '#D2B48C',
        'Crimson': '#DC143C', 'Bright Pink': '#FF69B4', 'Brick Red': '#B22222',
        'Light Blue': '#ADD8E6', 'Navy Blue': '#000080', 'Light Green': '#90EE90',
        'Dark Green': '#006400', 'Light Brown': '#996633', 'Dark Brown': '#654321',
        'Sandalwood': '#C2B280', 'Clay': '#856D4D'
    };

    // Pre-pass to collect all digit emojis for numbers 1-9
    data.forEach(row => {
        if (row.Status !== 'active' && row.Status !== '') return;
        if (row.Title === 'Sankhya' && row.MainMenu === 'Ginti') {
            const letter = String(row.Letter_Numeral).trim();
            if (letter.length === 1 && letter >= '1' && letter <= '9') {
                digitEmojis[letter] = row.Icon_Emoji;
            }
        }
    });

    // Forced overrides as requested by USER
    digitEmojis['0'] = '🥚';
    digitEmojis['3'] = '🚁';

    console.log('DEBUG: digitEmojis mapping:', digitEmojis);

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

        const letter = String(row.Letter_Numeral).trim();
        let iconEmoji = row.Icon_Emoji;

        // Apply overrides for digits if specifically defined in digitEmojis (like 0 and 3)
        if (digitEmojis[letter]) {
            iconEmoji = digitEmojis[letter];
        }

        // Apply Color Overrides
        if (row.MainMenu === 'Colors' && COLOR_EMOJI_OVERRIDES[row.Word_Name]) {
            iconEmoji = COLOR_EMOJI_OVERRIDES[row.Word_Name];
        }

        // Logic for numbers 11-99 in Ginti: combine digit emojis
        if (row.Title === 'Sankhya' && row.MainMenu === 'Ginti' && row.SubMenu === '1-100') {
            const num = parseInt(letter);
            
            // Re-apply overrides just in case
            digitEmojis['0'] = '🥚';
            digitEmojis['3'] = '🚁';

            if (num >= 11 && num <= 99) {
                // IMPORTANT: Use the digitEmojis mapping which contains our overrides
                iconEmoji = letter.split('').map(digit => digitEmojis[digit] || '').join('');
            } else if (num === 100) {
                iconEmoji = '💯';
            }
        }

        // Apply override once more for the single digit case
        if (letter === '3' && row.Title === 'Sankhya' && row.MainMenu === 'Ginti') iconEmoji = '🚁';
        if (letter === '0') iconEmoji = '🥚';

        outputData[fileMap.key].data.push({
            letter: letter,
            word: row.Word_Name,
            emoji: iconEmoji,
            value: letter,
            audio: (row.Audio_Path || '').replace(/^assets\/audio\//, '').replace(/^assets\//, '../assets/'),
            word_en: row.Display_Word_En,
            color: COLOR_HEX_OVERRIDES[row.Word_Name] || ''
        });
    });

    // Write out the individual files
    Object.keys(outputData).forEach(key => {
        const folderPath = path.join(DATA_DIR, outputData[key].folder);
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        let jsOutput = `if (!window.RAJSHREE_DATA) window.RAJSHREE_DATA = {};\n\n`;
        jsOutput += `window.RAJSHREE_DATA.${key} = [\n`;

        outputData[key].data.forEach(item => {
            const colorProp = item.color ? `, color: '${item.color}'` : '';
            jsOutput += `    { letter: '${item.letter}', word: '${item.word}', emoji: '${item.emoji}', value: '${item.value}', audio: '${item.audio}', textOnly: ${item.word === 'खाली' ? 'false' : (item.word === '' ? 'true' : 'false')}${colorProp} },\n`;
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
