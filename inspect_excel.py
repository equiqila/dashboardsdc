import pandas as pd

files = {
    'Data_Kemenpar_UPDATED.xlsx': None,
    'data_jumlah_wisatawan.xlsx': None,
}

for fname, _ in files.items():
    print(f'\n{"="*60}')
    print(f'FILE: {fname}')
    print('='*60)
    try:
        xl = pd.ExcelFile(fname, engine='openpyxl')
        print(f'Sheets: {xl.sheet_names}')
        for sname in xl.sheet_names:
            print(f'\n  --- Sheet: {sname} ---')
            df = xl.parse(sname, nrows=5)
            print(f'  Columns: {list(df.columns)}')
            print(df.to_string(index=False, max_cols=10))
        xl.close()
    except Exception as e:
        print(f'  ERROR: {e}')
