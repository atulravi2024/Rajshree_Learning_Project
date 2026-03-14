const xlsx = require('xlsx');
const path = require('path');
const file = path.join(__dirname, '..', '..', 'database', 'master_records', 'Rajshree_Learning_Data_Master.xlsx');
const wb = xlsx.readFile(file);
const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });

const colors = data.filter(row => row.MainMenu === 'Colors');

console.log(JSON.stringify(colors.slice(0, 5), null, 2));
