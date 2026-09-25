"""
app.py
Unified Flask REST API & Web Application Server for the Bank Marketing ML Platform.
Serves both backend API endpoints (/api/*) and the compiled React frontend directly.
"""

import os
import sys
import io
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

sys.path.append(BASE_DIR)
import model_service

app = Flask(__name__)

# Universal CORS Middleware
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,X-Requested-With"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

# =========================================================================
# REST API Endpoints (/api/*)
# =========================================================================

@app.route("/api/health", methods=["GET", "OPTIONS"])
def health_check():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "features_count": len(model_service.EXPECTED_FEATURES),
        "model_type": "LogisticRegression",
        "version": "v2.4",
        "supported_models": ["logistic", "xgboost", "random_forest", "neural_net"]
    }), 200

@app.route("/api/model-info", methods=["GET", "OPTIONS"])
def model_info():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        info = model_service.get_model_info()
        return jsonify(info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/personas", methods=["GET", "OPTIONS"])
def get_personas():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        personas = model_service.get_personas()
        return jsonify(personas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No input JSON received"}), 400
        result = model_service.predict_single(data)
        print(f"[FRONTEND -> BACKEND] Received single prediction request: Age={data.get('age')}, Job={data.get('job')}, Balance=€{data.get('balance')}, Duration={data.get('duration')}s => Verdict: {result.get('verdict')} ({result.get('probability_yes')}%)", flush=True)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/api/predict-all-models", methods=["POST", "OPTIONS"])
def predict_all_models_endpoint():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No input JSON received"}), 400
        result = model_service.predict_all_models(data)
        print(f"[FRONTEND -> BACKEND] Received all-models request: Balance=€{data.get('balance')}, Duration={data.get('duration')}s => Consensus: {result['consensus']['verdict']} ({result['consensus']['avg_confidence']}%)", flush=True)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Multi-model prediction failed: {str(e)}"}), 500

@app.route("/api/predict-batch", methods=["POST", "OPTIONS"])
def predict_batch_endpoint():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        # Check if CSV file was uploaded
        if "file" in request.files:
            file = request.files["file"]
            if file.filename.endswith(".csv"):
                content = file.read().decode("utf-8", errors="ignore")
                delim = ";" if ";" in content.splitlines()[0] else ","
                df = pd.read_csv(io.StringIO(content), sep=delim)
                records = df.to_dict(orient="records")
            else:
                return jsonify({"error": "Uploaded file must be a .csv"}), 400
        else:
            json_data = request.get_json(force=True)
            if isinstance(json_data, dict) and "records" in json_data:
                records = json_data["records"]
            elif isinstance(json_data, list):
                records = json_data
            else:
                return jsonify({"error": "Expected a JSON list or object with 'records' array"}), 400

        # Limit batch size to 500 for responsiveness
        if len(records) > 500:
            records = records[:500]

        result = model_service.predict_batch(records)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Batch prediction error: {str(e)}"}), 500

@app.route("/api/dataset-stats", methods=["GET", "OPTIONS"])
def dataset_stats():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        stats = {
            "total_clients": 45211,
            "overall_subscription_rate": 11.7,
            "subscribed_count": 5289,
            "not_subscribed_count": 39922,
            "avg_age": 40.9,
            "avg_balance": 1362,
            "avg_duration_sec": 258,
            "jobs_distribution": [
                {"job": "Management", "count": 9458, "rate": 13.8},
                {"job": "Blue-Collar", "count": 9732, "rate": 7.3},
                {"job": "Technician", "count": 7597, "rate": 11.1},
                {"job": "Admin", "count": 5171, "rate": 12.2},
                {"job": "Services", "count": 4154, "rate": 8.9},
                {"job": "Retired", "count": 2264, "rate": 22.8},
                {"job": "Self-Employed", "count": 1579, "rate": 11.8},
                {"job": "Entrepreneur", "count": 1487, "rate": 8.3},
                {"job": "Student", "count": 938, "rate": 28.7},
                {"job": "Unemployed", "count": 1303, "rate": 15.5},
                {"job": "Housemaid", "count": 1240, "rate": 8.8}
            ],
            "outcome_impact": [
                {"outcome": "Previous Success", "rate": 64.7},
                {"outcome": "Previous Failure", "rate": 12.6},
                {"outcome": "Other", "rate": 16.7},
                {"outcome": "Unknown / First Time", "rate": 9.2}
            ],
            "monthly_trends": [
                {"month": "Mar", "rate": 52.0},
                {"month": "Sep", "rate": 46.5},
                {"month": "Oct", "rate": 43.8},
                {"month": "Dec", "rate": 46.7},
                {"month": "Apr", "rate": 19.7},
                {"month": "Feb", "rate": 16.6},
                {"month": "Aug", "rate": 11.0},
                {"month": "Jun", "rate": 10.2},
                {"month": "Nov", "rate": 10.2},
                {"month": "Jan", "rate": 10.1},
                {"month": "Jul", "rate": 9.1},
                {"month": "May", "rate": 6.7}
            ]
        }
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================================================================
# Local Development Server
# =========================================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Bank Marketing ML API Server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
