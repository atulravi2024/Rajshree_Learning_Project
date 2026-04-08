const xlsx = require('xlsx');
const path = require('path');
const file = path.join(__dirname, '..', '..', 'database', 'excel', 'Rajshree_Learning_Data_Master.xlsx');
const wb = xlsx.readFile(file);
const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
console.log(Object.keys(data[0]));
console.log(data.slice(0, 2));
