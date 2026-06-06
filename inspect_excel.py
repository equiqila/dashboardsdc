import pandas as pd
import sys

path = r"c:\Users\hp\Documents\kemenpar_2\public\Data_Dashboard.xlsx"
sheet = sys.argv[1] if len(sys.argv) > 1 else "Page1_jumlahwisatawan"

try:
    df = pd.read_excel(path, sheet_name=sheet)
    print(f"=== Sheet: {sheet} ===")
    print(f"Columns: {list(df.columns)}")
    print("\nSample Data (First 20 rows):")
    print(df.head(20).to_string(index=False))
except Exception as e:
    print(f"Error reading sheet {sheet}: {e}")
