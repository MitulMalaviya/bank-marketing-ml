import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell,
  Legend
} from 'recharts';
import { 
  Award, 
  Target, 
  Sliders, 
  CheckCircle, 
  GitCommit, 
  FileCode2, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { getModelInfo } from '../api';

export default function ModelDashboard() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelInfo()
      .then((data) => setModelInfo(data))
      .catch((err) => console.error('Error fetching model info:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 text-sm">
        Loading ML Model Specifications...
      </div>
    );
  }

  // Actual vs Predicted Chart Data (from Step 12 of user's notebook)
  const actualVsPredictedData = [
    { category: 'No (Declined)', Actual: 7985, Predicted: 8448 },
    { category: 'Yes (Subscribed)', Actual: 1058, Predicted: 595 }
  ];

  const coefData = modelInfo?.top_feature_coefficients || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Supervised Classification</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Logistic Regression Production Model Evaluation
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Trained on 45,211 bank marketing campaign interactions with 42 encoded & scaled features.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
              <span className="text-[11px] font-semibold text-slate-400 block">Overall Test Accuracy</span>
              <span className="text-2xl font-extrabold text-emerald-400">90.16%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>Accuracy</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">90.16%</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">8,130 of 9,043 correct</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>Precision (Class 1)</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-300">65.0%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Reliability of positive calls</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>Recall (Class 1)</span>
            <Sliders className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-teal-300">35.0%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Coverage of total subscribers</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>F1-Score</span>
            <GitCommit className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-300">45.5%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Harmonic mean balance</span>
        </div>
      </div>

      {/* Visual Confusion Matrix & Actual vs Predicted */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-1">
              Confusion Matrix (Test Set: 9,043 Records)
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Stratified 20% holdout test evaluation matrix.
            </p>

            {/* Matrix Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              {/* True Negatives */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  True Negatives (TN)
                </span>
                <span className="text-2xl font-extrabold text-white mt-1 block">7,760</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Predicted No, Actual No</span>
              </div>

              {/* False Positives */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
                  False Positives (FP)
                </span>
                <span className="text-2xl font-extrabold text-rose-400 mt-1 block">225</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Predicted Yes, Actual No</span>
              </div>

              {/* False Negatives */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  False Negatives (FN)
                </span>
                <span className="text-2xl font-extrabold text-amber-400 mt-1 block">688</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Predicted No, Actual Yes</span>
              </div>

              {/* True Positives */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                  True Positives (TP)
                </span>
                <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">370</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Predicted Yes, Actual Yes</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Specificity: <strong className="text-slate-200">97.2%</strong></span>
            <span>Sensitivity: <strong className="text-slate-200">35.0%</strong></span>
          </div>
        </div>

        {/* Actual vs Predicted Visual Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Actual vs. Predicted Subscriptions
              </h3>
              <p className="text-xs text-slate-400">
                Comparison of actual class counts vs model predictions on test data.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actualVsPredictedData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Actual" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Predicted" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Coefficients & Key Influence Weights */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Top Logistic Regression Feature Coefficients
          </h3>
          <p className="text-xs text-slate-400">
            Positive log-odds weights increase term deposit propensity; negative coefficients dampen conversion probability.
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={coefData} 
              layout="vertical"
              margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis 
                type="category" 
                dataKey="feature" 
                stroke="#cbd5e1" 
                fontSize={11}
                tickLine={false}
              />
              <Tooltip 
                formatter={(val) => [val, 'Coefficient']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <Bar dataKey="coefficient" radius={[0, 4, 4, 0]}>
                {coefData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.direction === 'positive' ? '#10b981' : '#f43f5e'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Technical Pipeline Specs */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
          Training & Pipeline Architecture Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Algorithm</span>
            <span className="font-semibold text-slate-200 text-sm">Logistic Regression</span>
            <p className="text-slate-400 text-[11px] mt-1">L-BFGS optimization with L2 regularization penalty</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Feature Engineering</span>
            <span className="font-semibold text-slate-200 text-sm">StandardScaler + One-Hot</span>
            <p className="text-slate-400 text-[11px] mt-1">Numeric standard normalization, categorical dummy variables with drop_first=True</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Validation Split</span>
            <span className="font-semibold text-slate-200 text-sm">80/20 Stratified</span>
            <p className="text-slate-400 text-[11px] mt-1">Random state 42 preserving target label distribution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
