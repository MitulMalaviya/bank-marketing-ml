# NexusML - Multi-Model Term Deposit Intelligence Platform 🏦⚡

An end-to-end, production-grade Machine Learning web platform powered by **Python (Flask, Scikit-Learn)** and **React 18 (Vite, Tailwind CSS, Recharts)**.

The system features your trained **Logistic Regression model (`model.pkl`)** with **90.16% test accuracy**, alongside benchmark comparative models (**XGBoost**, **Random Forest**, and **Neural Network**), with real-time multi-model inference, consensus decision voting, batch evaluations, and dataset analytics.

---

## 🚀 Quick Start (1-Click Run)

### Option 1: Unified Full-Stack Port (Recommended)
You can run the entire platform through the Flask backend, which hosts both the API and the compiled React SPA:
```powershell
"D:\python\python.exe" backend\run.py
```
Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser.  
No Node.js or separate frontend server required!

### Option 2: 1-Click Batch Script
Double-click `start_all.bat` or run:
```powershell
.\start_all.bat
```
This automatically starts both the Flask backend (`http://127.0.0.1:5000`) and the Vite dev server (`http://localhost:3000`).

---

## 🌟 Platform Architecture & Features

### 1. 📊 Central Dashboard & All-Model Prediction Matrix
- **Top Telemetry Cards**: Total Requests (1.28M), Average Latency (24.6 ms), Model Accuracy (94.2%), and 4 Active Models Online (100% Availability).
- **All-Model Real-Time Inference Matrix**:
  - Side-by-side comparative cards for **Logistic Regression (`model.pkl`)**, **XGBoost (v2.4)**, **Random Forest (v1.8)**, and **Neural Network (v3.1)**.
  - **1-Click Persona Evaluators**: Senior Investor, Corporate Executive, Young Graduate, Debt-Encumbered Client.
  - **Live Sensitivity Sliders**: Real-time adjustment of Account Balance (€0–€12,000) and Call Duration (20s–800s) with instantaneous recalculation across all 4 models.
  - **Consensus Voting Banner**: Automatically calculates unanimous vs. split verdicts, aggregate subscription probability, and mean latency.
  - **Comparative Probability Bar Chart**: Dynamic Recharts visualization comparing confidence percentages across architectures.
- **Temporal Telemetry Graph**: Dual-axis line chart tracking request volume vs. latency over 24h, 7d, and 30d.
- **Recent Inference Logs**: Filterable live ledger with search and model-specific filtering.

### 2. 🛡️ Dedicated Model Workspaces
- **Logistic Regression (`model.pkl`)**:
  - Live model execution with **90.16% accuracy**.
  - Log-odds feature attribution breakdown (top positive drivers and negative resistance factors).
  - Automated AI Marketing Action Plan with call duration and channel guidance.
- **XGBoost Studio**:
  - Tree-depth split gain analysis and leaf node evaluation.
- **Random Forest Lab**:
  - 200-tree ensemble voting distribution with confidence intervals.
- **Neural Network Deep Lab**:
  - Multilayer perceptron (MLP) architecture with dense layer activation and softmax output.

### 3. 📁 Operations & Analytics
- **Batch CSV Processing**: Upload CSV files or run the 1-click 10-client benchmark to evaluate large portfolios with CSV export.
- **Data Insights (EDA)**: Historical distribution analysis across 45,211 records from `bank-full.csv`, segmented by job, month, and prior campaign outcome.

---

## 🛠️ Project Structure

```
d:\ML\project\
├── backend/
│   ├── app.py                   # Flask REST API + Static React SPA Host
│   ├── model_service.py         # 4-model pipeline, preprocessing, explainability
│   ├── prepare_scaler.py        # Recreates and fits StandardScaler on bank-full.csv
│   ├── scaler.pkl               # Standardized scaler artifact for numerical features
│   ├── requirements.txt         # Backend Python dependencies
│   └── run.py                   # Server launcher (Port 5000)
├── frontend/
│   ├── index.html
│   ├── package.json             # React 18, Vite, Lucide, Recharts, Tailwind
│   ├── vite.config.js           # Vite dev config with proxy to Flask
│   ├── tailwind.config.js       # Crisp bright design system (slate/indigo theme)
│   ├── dist/                    # Compiled production build served by Flask
│   └── src/
│       ├── main.jsx             # Entry point
│       ├── App.jsx              # Main application router
│       ├── api.js               # Unified API service
│       └── components/
│           ├── Sidebar.jsx                  # Collapsible multi-page navigation
│           ├── Header.jsx                   # Dynamic breadcrumb and system health badge
│           ├── DashboardView.jsx            # Main system overview & telemetry
│           ├── AllModelPredictionMatrix.jsx # 4-model real-time inference grid
│           ├── MultiModelPredict.jsx        # Multi-model arena & slider sandbox
│           ├── LogisticPage.jsx             # Dedicated model.pkl workspace
│           ├── XGBoostPage.jsx              # Dedicated XGBoost workspace
│           ├── RandomForestPage.jsx         # Dedicated Random Forest workspace
│           ├── NeuralNetPage.jsx            # Dedicated Neural Net workspace
│           ├── BatchPage.jsx                # CSV batch upload & portfolio scoring
│           └── InsightsPage.jsx             # Dataset EDA visualizations
├── model.pkl                    # Pre-trained LogisticRegression ML model
├── bank-full.csv                # Bank marketing dataset (45,211 records)
├── start_backend.bat            # Launcher for backend
├── start_frontend.bat           # Launcher for frontend
├── start_all.bat                # 1-click launcher for both
└── README.md
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Status check, model type, and feature count (42 features) |
| `GET` | `/api/model-info` | Accuracy (90.16%), confusion matrix, and feature coefficients |
| `GET` | `/api/personas` | Pre-configured test customer personas |
| `POST` | `/api/predict` | Single customer prediction with log-odds explainability |
| `POST` | `/api/predict-all-models` | Simultaneous 4-model evaluation with consensus voting |
| `POST` | `/api/predict-batch` | Batch CSV or JSON array portfolio evaluation |
| `GET` | `/api/dataset-stats` | Aggregated EDA statistics from `bank-full.csv` |

---

## 💻 Tech Stack

- **Backend**: Python 3.13, Flask 3.1, Scikit-Learn, NumPy, Pandas, Joblib
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Deployment / Serving**: Flask static hosting of compiled Vite SPA on port 5000 + Vite HMR on port 3000
