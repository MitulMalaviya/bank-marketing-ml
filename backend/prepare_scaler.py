"""
prepare_scaler.py
Fits and saves the exact StandardScaler on the training split of bank-full.csv
matching the exact pipeline used in Week_5.ipynb / logisticRegrestion.ipynb.
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
DATA_PATH = os.path.join(PROJECT_DIR, "bank-full.csv")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

def generate_scaler():
    print(f"Loading data from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH, sep=";")
    
    X = df.drop('y', axis=1)
    y = df['y'].map({'no': 0, 'yes': 1})
    
    categorical_columns = X.select_dtypes(include=['object']).columns.tolist()
    numeric_columns = ['age', 'balance', 'day', 'duration', 'campaign', 'pdays', 'previous']
    
    X = pd.get_dummies(X, columns=categorical_columns, drop_first=True)
    X = X.astype(int)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    scaler.fit(X_train[numeric_columns])
    
    joblib.dump(scaler, SCALER_PATH)
    print(f"StandardScaler successfully saved to: {SCALER_PATH}")
    print(f"Fitted numeric columns: {numeric_columns}")
    print(f"Means: {scaler.mean_}")
    print(f"Scales: {scaler.scale_}")

if __name__ == "__main__":
    generate_scaler()
