const XLSX = require('./node_modules/xlsx');

const files = [
    'Data_Kemenpar_UPDATED.xlsx',
    'data_jumlah_wisatawan.xlsx',
    'data_investasi.xlsx',
    'data_awal.xlsx',
];

for (const fname of files) {
    console.log('\n' + '='.repeat(60));
    console.log('FILE: ' + fname);
    console.log('='.repeat(60));
    try {
        const wb = XLSX.readFile(fname, { sheetRows: 8 });
        console.log('Sheets:', wb.SheetNames);
        for (const sname of wb.SheetNames) {
            const ws = wb.Sheets[sname];
            console.log('\n  --- Sheet:', sname, '---');
            const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
            console.log('  Row 1 (headers):', JSON.stringify(json[0]));
            for (let i = 1; i < Math.min(json.length, 6); i++) {
                console.log(`  Row ${i + 1}:`, JSON.stringify(json[i]));
            }
        }
    } catch (e) {
        console.log('  ERROR:', e.message);
    }
}
