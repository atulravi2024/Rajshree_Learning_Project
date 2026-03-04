import pandas as pd
import sys

try:
    file_path = r'c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\Rajshree_Learning_Data_Master.xlsx'
    df = pd.read_excel(file_path)
    print("Columns:", df.columns.tolist())
    print("Shape:", df.shape)
except Exception as e:
    print("Error:", e)
