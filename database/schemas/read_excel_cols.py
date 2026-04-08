import os
import pandas as pd

try:
    file_path = os.path.join(os.path.dirname(__file__), "..", "excel", "Rajshree_Learning_Data_Master.xlsx")
    df = pd.read_excel(file_path)
    print("Columns:", df.columns.tolist())
    print("Shape:", df.shape)
except Exception as e:
    print("Error:", e)
