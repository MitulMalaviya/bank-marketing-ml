import React, { useState } from 'react';
import { 
  TreePine, 
  Sparkles, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Layers, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function RandomForestPage() {
  const [inputs, setInputs] = useState({
    balance: 5200,
    duration: 380,
    age: 48,
    campaign: 2,
    poutcome: 'success',
    housing: 'no',
    job: 'retired',
    nEstimators: 200,
    maxFeatures: 'sqrt'
  });

  // Calculate ensemble voting
  const computeEnsemble = () => {
    let score = -0.9;
    score += (inputs.duration - 200) * 0.006;
    score += (Math.log(Math.max(1, inputs.balance + 1000)) - 7.5) * 0.45;
    if (inputs.poutcome === 'success') score += 2.2;
    if (inputs.housing === 'yes') score -= 0.55;
    if (inputs.job === 'retired') score += 0.8;
    if (inputs.campaign >= 4) score -= 0.3;

    const prob = 1 / (1 + Math.exp(-score));
    const yesTrees = Math.round(prob * inputs.nEstimators);
    const noTrees = inputs.nEstimators - yesTrees;
    const confidence = (prob * 100).toFixed(1);

    return {
      yesTrees,
      noTrees,
      confidence: parseFloat(confidence),
      isApproved: yesTrees >= inputs.nEstimators / 2
    };
  };

  const results = computeEnsemble();
  const latency = (22.5 + (inputs.nEstimators * 0.02)).toFixed(1);

  const giniImportance = [
    { name: 'Call Duration', gini: 31.4 },
    { name: 'Account Balance', gini: 24.8 },
    { name: 'Prior Outcome', gini: 19.5 },
    { name: 'Client Age', gini: 13.2 },
    { name: 'Housing Loan', gini: 6.7 },
    { name: 'Campaign Touches', gini: 4.4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-glass rounded-2xl p-6 bg-gradient-to-r from-white via-emerald-50/20 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-black/20 shadow-emerald-100 flex-shrink-0">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-50 tracking-tight">Random Forest Lab</h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-300 border border-emerald-500/30">
                  v1.8.0
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Ensemble Voting
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Bootstrap aggregating ensemble with 200 de-correlated decision trees minimizing classification variance.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/50 text-right">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">OOB Accuracy</span>
              <span className="text-lg font-bold font-mono text-emerald-600">93.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Inputs and Ensemble Voting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-glass rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/50">
              <h2 className="text-sm font-bold text-slate-50 uppercase tracking-wider text-xs">
                Ensemble Features & Forest Estimators
              </h2>
              <button 
                onClick={() => setInputs({
                  balance: 5200,
                  duration: 380,
                  age: 48,
                  campaign: 2,
                  poutcome: 'success',
                  housing: 'no',
                  job: 'retired',
                  nEstimators: 200,
                  maxFeatures: 'sqrt'
                })}
                className="text-xs text-slate-400 hover:text-slate-400 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Duration */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Call Engagement Duration</span>
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
                  className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Balance */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Customer Account Balance</span>
                  <span className="font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100">
                    €{Number(inputs.balance).toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="15000"
                  step="100"
                  value={inputs.balance}
                  onChange={(e) => setInputs({ ...inputs, balance: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Number of Trees Slider */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Ensemble Tree Count (n_estimators)</span>
                  <span className="font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100">
                    {inputs.nEstimators} Trees
                  </span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={inputs.nEstimators}
                  onChange={(e) => setInputs({ ...inputs, nEstimators: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Age */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Age</span>
                  <span className="font-mono text-emerald-600">{inputs.age} yrs</span>
                </div>
                <input 
                  type="range"
                  min="18"
                  max="80"
                  value={inputs.age}
                  onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Campaign Contacts */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Campaign Contacts</span>
                  <span className="font-mono text-emerald-600">{inputs.campaign}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="15"
                  value={inputs.campaign}
                  onChange={(e) => setInputs({ ...inputs, campaign: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Prior Outcome */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Prior Campaign Outcome</label>
                <select
                  value={inputs.poutcome}
                  onChange={(e) => setInputs({ ...inputs, poutcome: e.target.value })}
                  className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-lg shadow-black/10"
                >
                  <option value="success">Success</option>
                  <option value="failure">Failure</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {/* Housing Loan */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Housing Loan</label>
                <select
                  value={inputs.housing}
                  onChange={(e) => setInputs({ ...inputs, housing: e.target.value })}
                  className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-lg shadow-black/10"
                >
                  <option value="no">No Loan</option>
                  <option value="yes">Active Mortgage</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gini Feature Importance */}
          <div className="card-glass rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-50 uppercase tracking-wider mb-1">
              Random Forest Gini Impurity Decrease (%)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Mean reduction in node impurity averaged across all {inputs.nEstimators} trees.
            </p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={giniImportance} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} unit="%" />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Gini Importance']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="gini" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Output Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-glass rounded-2xl p-6 border-t-4 border-t-emerald-500">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ensemble Outcome</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700/50 text-slate-400">
                {latency} ms
              </span>
            </div>

            <div className="py-6 text-center">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-3 ${
                results.isApproved ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-rose-600 text-white shadow-rose-200'
              }`}>
                {results.isApproved ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                Prediction (YES / NO)
              </div>
              <h3 className={`text-4xl font-black tracking-tight ${
                results.isApproved ? 'text-emerald-300' : 'text-rose-700'
              }`}>
                {results.isApproved ? 'YES ✅' : 'NO ❌'}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-2">
                {results.isApproved ? 'Customer will subscribe to the term deposit' : 'Customer will NOT subscribe to the term deposit'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Ensemble confidence: <strong className="font-mono text-slate-50 font-bold">{results.confidence}%</strong> ({results.yesTrees} of {inputs.nEstimators} trees voted YES)
              </p>
            </div>

            {/* Tree Vote Breakdown Bar */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-300">Voted YES: {results.yesTrees} Trees</span>
                <span className="text-slate-400">Voted NO: {results.noTrees} Trees</span>
              </div>
              <div className="h-3 w-full bg-slate-700/80 rounded-full overflow-hidden p-0.5 flex">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(results.yesTrees / inputs.nEstimators) * 100}%` }}
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-700/50 text-xs text-slate-400">
                <span className="font-semibold text-slate-200 block mb-0.5">Majority Voting Result:</span>
                {results.yesTrees} of {inputs.nEstimators} trees cast a positive subscription verdict.
              </div>
            </div>
          </div>

          {/* Forest Architecture Specs */}
          <div className="card-glass rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-50 uppercase tracking-wider mb-3">
              Forest Hyperparameters
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                <span className="text-slate-400">Total Estimators</span>
                <span className="font-mono font-semibold text-slate-200">{inputs.nEstimators} Trees</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                <span className="text-slate-400">Criterion</span>
                <span className="font-mono font-semibold text-slate-200">Gini Impurity</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                <span className="text-slate-400">Max Features</span>
                <span className="font-mono font-semibold text-slate-200">sqrt(n_features)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Bootstrap Sampling</span>
                <span className="font-mono font-bold text-emerald-600">True (With Replacement)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
