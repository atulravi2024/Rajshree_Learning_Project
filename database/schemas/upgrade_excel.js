const xlsx = require('xlsx');

const filePath = 'C:\\\\Users\\\\Atul Verma\\\\.openclaw\\\\workspace\\\\RajShree_Project\\\\Rajshree Learning Project\\\\Rajshree_Learning_Data_Master.xlsx';

try {
    const wb = xlsx.readFile(filePath);
    const sheetName = wb.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });

    // Perform CRUD: Update all existing rows with future-proof columns
    data.forEach(row => {
        // Enforce age boundary and active status
        row.Age_Group = '3-5';
        row.Status = 'active';

        // Setup bilingual English columns for future expansion
        row.Display_Letter_En = '';

        // Smart extract: if Audio_Script_English is "अ for Pomegranate", extract "Pomegranate"
        let enWord = '';
        if (row.Audio_Script_English && row.Audio_Script_English.includes(' for ')) {
            enWord = row.Audio_Script_English.split(' for ')[1].trim();
        }
        row.Display_Word_En = enWord;
        row.Audio_File_En = '';
    });

    // Create updated sheet
    const newWs = xlsx.utils.json_to_sheet(data);
    const newWb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWb, newWs, "MasterData");

    // Overwrite the user's file with the upgraded version
    xlsx.writeFile(newWb, filePath);
    console.log("✅ Successfully upgraded Rajshree_Learning_Data_Master.xlsx with 5 new future-proof columns!");

} catch (e) {
    console.error('Error upgrading the excel file:', e.message);
}
