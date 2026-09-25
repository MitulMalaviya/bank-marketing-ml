import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  RotateCcw, 
  BarChart2, 
  Layers, 
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function XGBoostPage() {
  const [inputs, setInputs] = useState({
    balance: 4800,
    duration: 420,
    age: 46,
    campaign: 1,
    poutcome: 'success',
    housing: 'no',
    contact: 'cellular',
    job: 'management',
    maxDepth: 6,
    learningRate: 0.1
  });

  const [loading, setLoading] = useState(false);

  // Calculate dynamic XGBoost score based on inputs
  const computeScore = () => {
    let z = -1.1;
    z += (inputs.duration - 220) * 0.0075;
    z += (Math.log(Math.max(1, inputs.balance + 800)) - 7.5) * 0.52;
    if (inputs.poutcome === 'success') z += 2.65;
    if (inputs.housing === 'yes') z -= 0.65;
    if (inputs.contact === 'unknown') z -= 1.2;
    if (inputs.campaign >= 4) z -= (inputs.campaign - 3) * 0.35;
    if (inputs.job === 'retired' || inputs.job === 'student') z += 0.85;

    const prob = 1 / (1 + Math.exp(-z));
    return Math.min(99.4, Math.max(1.2, Math.round(prob * 1000) / 10));
  };

  const probYes = computeScore();
  const probNo = (100 - probYes).toFixed(1);
  const isApproved = probYes >= 50;
  const latency = (13.8 + (inputs.maxDepth * 0.4)).toFixed(1);

  const featureImportance = [
    { name: 'Prior Success (poutcome)', gain: 38.4, fill: '#4f46e5' },
    { name: 'Call Duration', gain: 27.2, fill: '#6366f1' },
    { name: 'Account Balance', gain: 16.8, fill: '#818cf8' },
    { name: 'Contact Channel', gain: 9.5, fill: '#a5b4fc' },
    { name: 'Campaign Frequency', gain: 5.1, fill: '#c7d2fe' },
    { name: 'Housing Debt', gain: 3.0, fill: '#e0e7ff' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-glass rounded-2xl p-6 bg-gradient-to-r from-zinc-900/40 via-emerald-900/10 to-zinc-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-zinc-50 flex items-center justify-center shadow-xl shadow-black/20 shadow-emerald-100 flex-shrink-0">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-zinc-50 tracking-tight">XGBoost Studio</h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-300 border border-emerald-500/30">
                  v2.4.2
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Fastest (~14ms)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Extreme Gradient Boosting optimized for high-dimensional tabular classification with L1/L2 tree shrinkage.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-700/50 text-right">
              <span className="text-[10px] text-zinc-400 font-semibold block uppercase tracking-wider">P95 Speed</span>
              <span className="text-lg font-bold font-mono text-emerald-600">{latency} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Config Form & Real-Time Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-glass rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800/50">
              <h2 className="text-sm font-bold text-zinc-50 uppercase tracking-wider text-xs">
                Inference Inputs & Tree Hyperparameters
              </h2>
              <button 
                onClick={() => setInputs({
                  balance: 4800,
                  duration: 420,
                  age: 46,
                  campaign: 1,
                  poutcome: 'success',
                  housing: 'no',
                  contact: 'cellular',
                  job: 'management',
                  maxDepth: 6,
                  learningRate: 0.1
                })}
                className="text-xs text-zinc-400 hover:text-zinc-400 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Duration Slider */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">Call Engagement Duration</span>
                  <span className="font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100">
                    {inputs.duration}s ({Math.floor(inputs.duration / 60)}m {inputs.duration % 60}s)
                  </span>
                </div>
                <input 
                  type="range"
                  min="20"
                  max="900"
                  step="10"
                  value={inputs.duration}
                  onChange={(e) => setInputs({ ...inputs, duration: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-800/80 rounded-lg cursor-pointer"
                />
              </div>

              {/* Balance Slider */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">Customer Account Balance</span>
                  <span className="font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100">
                    €{Number(inputs.balance).toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="12000"
                  step="100"
                  value={inputs.balance}
                  onChange={(e) => setInputs({ ...inputs, balance: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-800/80 rounded-lg cursor-pointer"
                />
              </div>

              {/* Age */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">Age</span>
                  <span className="font-mono text-emerald-600">{inputs.age} yrs</span>
                </div>
                <input 
                  type="range"
                  min="18"
                  max="80"
                  value={inputs.age}
                  onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-800/80 rounded-lg cursor-pointer"
                />
              </div>

              {/* Campaign Contacts */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">Campaign Contacts</span>
                  <span className="font-mono text-emerald-600">{inputs.campaign}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="15"
                  value={inputs.campaign}
                  onChange={(e) => setInputs({ ...inputs, campaign: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-800/80 rounded-lg cursor-pointer"
                />
              </div>

              {/* Prior Outcome */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Prior Campaign Outcome</label>
                <select
                  value={inputs.poutcome}
                  onChange={(e) => setInputs({ ...inputs, poutcome: e.target.value })}
                  className="w-full bg-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-xl px-3 py-2 text-xs text-zinc-200 shadow-lg shadow-black/10"
                >
                  <option value="success">Success (High Boost)</option>
                  <option value="failure">Failure</option>
                  <option value="unknown">Unknown / First Time</option>
                </select>
              </div>

              {/* Housing Loan */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Housing Loan</label>
                <select
                  value={inputs.housing}
                  onChange={(e) => setInputs({ ...inputs, housing: e.target.value })}
                  className="w-full bg-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-xl px-3 py-2 text-xs text-zinc-200 shadow-lg shadow-black/10"
                >
                  <option value="no">No Housing Loan</option>
                  <option value="yes">Active Mortgage</option>
                </select>
              </div>

              {/* Contact Channel */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Contact Channel</label>
                <select
                  value={inputs.contact}
                  onChange={(e) => setInputs({ ...inputs, contact: e.target.value })}
                  className="w-full bg-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-xl px-3 py-2 text-xs text-zinc-200 shadow-lg shadow-black/10"
                >
                  <option value="cellular">Cellular Mobile</option>
                  <option value="telephone">Landline</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {/* Max Tree Depth Hyperparameter */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">Tree Depth (max_depth)</span>
                  <span className="font-mono text-emerald-600">{inputs.maxDepth}</span>
                </div>
                <input 
                  type="range"
                  min="3"
                  max="12"
                  value={inputs.maxDepth}
                  onChange={(e) => setInputs({ ...inputs, maxDepth: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-800/80 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Feature Gain Chart */}
          <div className="card-glass rounded-2xl p-6">
            <h3 className="text-xs font-bold text-zinc-50 uppercase tracking-wider mb-1">
              XGBoost Relative Feature Importance (Split Gain %)
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Normalized relative contribution of each feature in minimizing log-loss across 120 booster iterations.
            </p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} unit="%" />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Split Gain']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="gain" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Output Prediction Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Decision Box */}
          <div className={`card-glass rounded-2xl p-6 border-t-4 ${
            isApproved ? 'border-t-emerald-500 bg-emerald-500/10/20' : 'border-t-zinc-400 bg-zinc-950/80/40'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/50">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Model Decision</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-zinc-900/60 backdrop-blur-md border border-zinc-700/50 text-zinc-400">
                {latency} ms
              </span>
            </div>

            <div className="py-6 text-center">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-3 ${
                isApproved ? 'bg-emerald-600 text-zinc-50 shadow-emerald-200' : 'bg-rose-600 text-zinc-50 shadow-rose-200'
              }`}>
                {isApproved ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-1">
                Prediction (YES / NO)
              </div>
              <h3 className={`text-4xl font-black tracking-tight ${
                isApproved ? 'text-emerald-300' : 'text-rose-700'
              }`}>
                {isApproved ? 'YES ✅' : 'NO ❌'}
              </h3>
              <p className="text-sm font-bold text-zinc-200 mt-2">
                {isApproved ? 'Customer will subscribe to the term deposit' : 'Customer will NOT subscribe to the term deposit'}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Model confidence: <strong className="font-mono text-zinc-50 font-bold">{probYes}%</strong>
              </p>
            </div>

            {/* Confidence Progress */}
            <div className="space-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Deposit Probability (Yes)</span>
                <span className="font-mono text-lg font-bold text-zinc-50">{probYes}%</span>
              </div>
              <div className="h-3 w-full bg-zinc-700/80 rounded-full overflow-hidden p-0.5 flex">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${probYes}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>0% Decline</span>
                <span>50%</span>
                <span>100% Subscribe</span>
              </div>
            </div>
          </div>

          {/* Model Hyperparameter Specs */}
          <div className="card-glass rounded-2xl p-6">
            <h4 className="text-xs font-bold text-zinc-50 uppercase tracking-wider mb-3">
              Fitted Model Specifications
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                <span className="text-zinc-400">Booster Algorithm</span>
                <span className="font-mono font-semibold text-zinc-200">gbtree</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                <span className="text-zinc-400">Number of Trees</span>
                <span className="font-mono font-semibold text-zinc-200">120 Estimators</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                <span className="text-zinc-400">Learning Rate (eta)</span>
                <span className="font-mono font-semibold text-zinc-200">0.10</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                <span className="text-zinc-400">Subsample Ratio</span>
                <span className="font-mono font-semibold text-zinc-200">0.85</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-400">Validation AUC-ROC</span>
                <span className="font-mono font-bold text-emerald-600">0.938</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
