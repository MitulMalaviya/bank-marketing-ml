import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Clock, 
  Sliders, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Check,
  AlertTriangle
} from 'lucide-react';

const PRESET_OPTIONS = [
  {
    id: 'preset_prime',
    label: 'Prime Senior Investor',
    tag: 'High Propensity',
    tagColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    data: {
      age: 65,
      job: 'retired',
      education: 'tertiary',
      balance: 7500,
      housing: 'no',
      loan: 'no',
      contact: 'cellular',
      duration: 540,
      campaign: 1,
      pdays: 180,
      poutcome: 'success'
    }
  },
  {
    id: 'preset_tech',
    label: 'Tech Management Executive',
    tag: 'Moderate to High',
    tagColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    data: {
      age: 41,
      job: 'management',
      education: 'tertiary',
      balance: 3800,
      housing: 'yes',
      loan: 'no',
      contact: 'cellular',
      duration: 320,
      campaign: 2,
      pdays: -1,
      poutcome: 'unknown'
    }
  },
  {
    id: 'preset_student',
    label: 'Early-Career Graduate',
    tag: 'Promising Lead',
    tagColor: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    data: {
      age: 24,
      job: 'student',
      education: 'tertiary',
      balance: 1950,
      housing: 'no',
      loan: 'no',
      contact: 'cellular',
      duration: 280,
      campaign: 1,
      pdays: 90,
      poutcome: 'other'
    }
  },
  {
    id: 'preset_debt',
    label: 'Debt-Constrained Prospect',
    tag: 'Low Propensity',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
    data: {
      age: 35,
      job: 'blue-collar',
      education: 'secondary',
      balance: 85,
      housing: 'yes',
      loan: 'yes',
      contact: 'unknown',
      duration: 65,
      campaign: 5,
      pdays: -1,
      poutcome: 'unknown'
    }
  }
];

const BASELINE_DATA = {
  age: 42,
  job: 'management',
  education: 'tertiary',
  balance: 2400,
  housing: 'no',
  loan: 'no',
  contact: 'cellular',
  duration: 310,
  campaign: 1,
  pdays: -1,
  poutcome: 'unknown'
};

export default function MultiModelPredict() {
  const [formData, setFormData] = useState(BASELINE_DATA);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Model selection checkboxes state
  const [selectedModels, setSelectedModels] = useState({
    xgboost: true,
    random_forest: true,
    neural_net: true,
  });

  const [inferenceLoading, setInferenceLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState(() => calculateInferences(BASELINE_DATA));

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSelectedPreset(null);
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    // Instant live preview calculation
    setPredictionResults(calculateInferences(updated));
  };

  const handleApplyPreset = (preset) => {
    setSelectedPreset(preset.id);
    setFormData(preset.data);
    setPredictionResults(calculateInferences(preset.data));
  };

  const handleReset = () => {
    setSelectedPreset(null);
    setFormData(BASELINE_DATA);
    setPredictionResults(calculateInferences(BASELINE_DATA));
  };

  const toggleModel = (key) => {
    setSelectedModels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Run full explicit inference with animation
  const handleRunInference = () => {
    setInferenceLoading(true);
    setTimeout(() => {
      setPredictionResults(calculateInferences(formData));
      setInferenceLoading(false);
    }, 350);
  };

  // Mock scoring logic reflecting ML characteristics
  function calculateInferences(data) {
    // Base score components
    let score = -1.2; // base log-odds

    // Duration impact
    score += (data.duration - 200) * 0.006;
    // Balance impact
    score += (Math.log(Math.max(1, data.balance + 1000)) - 7.5) * 0.4;
    // Prior success
    if (data.poutcome === 'success') score += 2.4;
    if (data.job === 'retired') score += 0.8;
    if (data.job === 'student') score += 0.9;
    if (data.job === 'blue-collar') score -= 0.4;
    if (data.housing === 'yes') score -= 0.6;
    if (data.loan === 'yes') score -= 0.5;
    if (data.contact === 'unknown') score -= 1.1;
    if (data.campaign >= 4) score -= (data.campaign - 3) * 0.3;

    // Logistic sigmoid
    const sigmoid = (z) => 1 / (1 + Math.exp(-z));
    const baseProb = sigmoid(score);

    // 1. XGBoost: Sharp decision trees, highly sensitive to duration & prior success
    const xgbScore = sigmoid(score * 1.15);
    const xgbProb = Math.min(99.4, Math.max(1.5, Math.round(xgbScore * 1000) / 10));
    const xgbLatency = (12.4 + Math.random() * 3.5).toFixed(1);

    // 2. Random Forest: Smoother ensemble averaging across 200 trees
    const rfScore = sigmoid(score * 0.92);
    const rfProb = Math.min(98.1, Math.max(3.2, Math.round(rfScore * 1000) / 10));
    const rfLatency = (24.8 + Math.random() * 4.2).toFixed(1);

    // 3. Neural Net: Deep non-linear representations with multi-layer activation
    const nnScore = sigmoid(score * 1.05 + 0.05);
    const nnProb = Math.min(98.8, Math.max(2.1, Math.round(nnScore * 1000) / 10));
    const nnLatency = (38.6 + Math.random() * 5.8).toFixed(1);

    return {
      xgboost: {
        name: 'XGBoost',
        version: 'v2.4.2',
        tag: 'Gradient Boosted Trees',
        isApproved: xgbProb >= 50,
        confidence: xgbProb,
        latency: parseFloat(xgbLatency),
        features: [
          { name: 'Call Duration', weight: '+34%' },
          { name: data.poutcome === 'success' ? 'Prior Success' : 'Contact Channel', weight: data.poutcome === 'success' ? '+41%' : '-18%' },
          { name: 'Account Balance', weight: '+15%' },
        ]
      },
      random_forest: {
        name: 'Random Forest',
        version: 'v1.8.0',
        tag: '200 Tree Ensemble',
        isApproved: rfProb >= 50,
        confidence: rfProb,
        latency: parseFloat(rfLatency),
        features: [
          { name: 'Account Balance', weight: '+28%' },
          { name: 'Call Duration', weight: '+26%' },
          { name: 'Client Age', weight: '+18%' },
        ]
      },
      neural_net: {
        name: 'Neural Net (MLP)',
        version: 'v3.1.0',
        tag: '4-Layer Deep Perceptron',
        isApproved: nnProb >= 50,
        confidence: nnProb,
        latency: parseFloat(nnLatency),
        features: [
          { name: 'Prior Success / Poutcome', weight: '+38%' },
          { name: 'Non-linear Liquidity', weight: '+24%' },
          { name: 'Interaction Velocity', weight: '-12%' },
        ]
      }
    };
  }

  // Count active selections & consensus
  const activeKeys = Object.keys(selectedModels).filter(k => selectedModels[k]);
  const activeCount = activeKeys.length;
  const approvedCount = activeKeys.filter(k => predictionResults[k]?.isApproved).length;
  const isFullConsensus = activeCount > 0 && (approvedCount === activeCount || approvedCount === 0);
  const consensusDecision = approvedCount > activeCount / 2;

  return (
    <div className="space-y-8">
      {/* Header & Presets Bar */}
      <div className="card-glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/50">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Multi-Model Comparative Inference</span>
            </div>
            <h1 className="text-xl font-bold text-slate-50 tracking-tight">
              Concurrent Model Evaluation & Benchmarking
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Simultaneously score client profiles across distinct model architectures with side-by-side latency & confidence metrics.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Inputs</span>
          </button>
        </div>

        {/* 1-Click Preset Options */}
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Quick Persona Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_OPTIONS.map((p) => {
              const isSelected = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className={`p-3 rounded-xl text-left border transition-all duration-150 ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-500/10/50 shadow-lg shadow-black/10 ring-1 ring-indigo-500' 
                      : 'border-slate-700/50 bg-slate-900/60 backdrop-blur-md hover:border-slate-600/50 hover:bg-slate-950/80/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{p.label}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.tagColor}`}>
                    {p.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Model Selection Checkboxes Card */}
      <div className="card-glass rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-50 tracking-tight">Active Inference Models</h2>
            <p className="text-xs text-slate-400">Check or uncheck architectures to evaluate concurrently.</p>
          </div>

          <div className="flex space-x-2 text-xs">
            <button 
              onClick={() => setSelectedModels({ xgboost: true, random_forest: true, neural_net: true })}
              className="text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-500/10"
            >
              Select All
            </button>
            <span className="text-slate-300">|</span>
            <button 
              onClick={() => setSelectedModels({ xgboost: false, random_forest: false, neural_net: false })}
              className="text-slate-400 hover:text-slate-300 font-medium px-2 py-1 rounded hover:bg-slate-800/80"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Checkbox 1: XGBoost */}
          <label 
            className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              selectedModels.xgboost 
                ? 'bg-indigo-500/10/40 border-indigo-500 shadow-lg shadow-black/10' 
                : 'bg-slate-900/60 backdrop-blur-md border-slate-700/50 hover:bg-slate-950/80'
            }`}
          >
            <input 
              type="checkbox" 
              checked={selectedModels.xgboost} 
              onChange={() => toggleModel('xgboost')}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-600/50 focus:ring-indigo-500" 
            />
            <div className="ml-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-50">XGBoost</span>
                <span className="text-[10px] font-mono font-semibold bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700/50">v2.4</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Gradient Boosted Trees (Lowest Latency ~14ms)</p>
            </div>
          </label>

          {/* Checkbox 2: Random Forest */}
          <label 
            className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              selectedModels.random_forest 
                ? 'bg-indigo-500/10/40 border-indigo-500 shadow-lg shadow-black/10' 
                : 'bg-slate-900/60 backdrop-blur-md border-slate-700/50 hover:bg-slate-950/80'
            }`}
          >
            <input 
              type="checkbox" 
              checked={selectedModels.random_forest} 
              onChange={() => toggleModel('random_forest')}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-600/50 focus:ring-indigo-500" 
            />
            <div className="ml-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-50">Random Forest</span>
                <span className="text-[10px] font-mono font-semibold bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700/50">v1.8</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">200 Decision Trees (Balanced Variance ~26ms)</p>
            </div>
          </label>

          {/* Checkbox 3: Neural Net */}
          <label 
            className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              selectedModels.neural_net 
                ? 'bg-indigo-500/10/40 border-indigo-500 shadow-lg shadow-black/10' 
                : 'bg-slate-900/60 backdrop-blur-md border-slate-700/50 hover:bg-slate-950/80'
            }`}
          >
            <input 
              type="checkbox" 
              checked={selectedModels.neural_net} 
              onChange={() => toggleModel('neural_net')}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-600/50 focus:ring-indigo-500" 
            />
            <div className="ml-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-50">Neural Net (MLP)</span>
                <span className="text-[10px] font-mono font-semibold bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700/50">v3.1</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">4-Layer Deep Classifier (Non-linear ~38ms)</p>
            </div>
          </label>
        </div>
      </div>

      {/* Input Sliders & Dropdowns Grid */}
      <div className="card-glass rounded-2xl p-6">
        <h2 className="text-sm font-bold text-slate-50 uppercase tracking-wider text-xs mb-4 pb-2 border-b border-slate-800/50">
          Customer Feature Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Balance */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Account Balance</label>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-100">
                €{Number(formData.balance).toLocaleString()}
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="15000"
              step="100"
              value={formData.balance}
              onChange={(e) => handleInputChange('balance', Number(e.target.value))}
              className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>€0</span>
              <span>€7,500</span>
              <span>€15,000+</span>
            </div>
          </div>

          {/* Slider 2: Duration */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Call Duration</label>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-100">
                {formData.duration}s ({Math.floor(formData.duration / 60)}m {formData.duration % 60}s)
              </span>
            </div>
            <input 
              type="range"
              min="10"
              max="900"
              step="10"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', Number(e.target.value))}
              className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10s</span>
              <span>300s (5m)</span>
              <span>900s (15m)</span>
            </div>
          </div>

          {/* Slider 3: Age */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Client Age</label>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-100">
                {formData.age} yrs
              </span>
            </div>
            <input 
              type="range"
              min="18"
              max="85"
              value={formData.age}
              onChange={(e) => handleInputChange('age', Number(e.target.value))}
              className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>18</span>
              <span>50</span>
              <span>85</span>
            </div>
          </div>

          {/* Slider 4: Campaign Contacts */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Campaign Contacts</label>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-100">
                {formData.campaign} touch(es)
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="20"
              value={formData.campaign}
              onChange={(e) => handleInputChange('campaign', Number(e.target.value))}
              className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>

          {/* Dropdown 1: Job */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Job Category</label>
            <select
              value={formData.job}
              onChange={(e) => handleInputChange('job', e.target.value)}
              className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-lg shadow-black/10"
            >
              <option value="management">Management</option>
              <option value="blue-collar">Blue-Collar</option>
              <option value="technician">Technician</option>
              <option value="retired">Retired</option>
              <option value="student">Student</option>
              <option value="admin.">Administrative</option>
              <option value="services">Services</option>
              <option value="self-employed">Self-Employed</option>
              <option value="entrepreneur">Entrepreneur</option>
            </select>
          </div>

          {/* Dropdown 2: Education */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Education</label>
            <select
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-lg shadow-black/10"
            >
              <option value="tertiary">Tertiary (University)</option>
              <option value="secondary">Secondary (High School)</option>
              <option value="primary">Primary</option>
            </select>
          </div>

          {/* Dropdown 3: Housing Loan */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Housing Loan</label>
            <select
              value={formData.housing}
              onChange={(e) => handleInputChange('housing', e.target.value)}
              className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-lg shadow-black/10"
            >
              <option value="no">No Housing Debt</option>
              <option value="yes">Active Mortgage</option>
            </select>
          </div>

          {/* Dropdown 4: Prior Outcome */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Prior Campaign Outcome</label>
            <select
              value={formData.poutcome}
              onChange={(e) => handleInputChange('poutcome', e.target.value)}
              className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-lg shadow-black/10"
            >
              <option value="unknown">Unknown (Never Contacted)</option>
              <option value="success">Success (Subscribed Previously)</option>
              <option value="failure">Failure (Declined Previously)</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Scores update live on input change. Press button to trigger full synchronized re-evaluation.
          </p>
          <button
            onClick={handleRunInference}
            disabled={inferenceLoading || activeCount === 0}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xl shadow-black/20 shadow-indigo-200 transition disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${inferenceLoading ? 'animate-spin' : 'fill-current'}`} />
            <span>{inferenceLoading ? 'Evaluating Ensemble...' : 'Run Multi-Model Inference'}</span>
          </button>
        </div>
      </div>

      {/* Consensus Banner */}
      {activeCount > 0 && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          consensusDecision 
            ? 'bg-emerald-500/10/70 border-emerald-500/30 text-emerald-900' 
            : 'bg-slate-800/80 border-slate-700/50 text-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
              consensusDecision ? 'bg-emerald-600 text-white shadow-xl shadow-black/20 shadow-emerald-200' : 'bg-rose-600 text-white shadow-xl shadow-black/20 shadow-rose-200'
            }`}>
              {consensusDecision ? 'YES' : 'NO'}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Consensus Verdict ({approvedCount} of {activeCount} models say YES)
              </div>
              <h3 className="text-base font-black tracking-tight text-slate-50">
                {consensusDecision 
                  ? '✅ YES — Customer will subscribe to term deposit' 
                  : '❌ NO — Customer will NOT subscribe to term deposit'}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium">
            <div>
              <span className="text-slate-400 block text-[10px]">Avg Confidence</span>
              <span className="font-bold font-mono">
                {activeCount > 0 
                  ? (activeKeys.reduce((acc, k) => acc + (predictionResults[k]?.confidence || 0), 0) / activeCount).toFixed(1) 
                  : 0}%
              </span>
            </div>
            <div className="border-l border-slate-700/50 pl-4">
              <span className="text-slate-400 block text-[10px]">Mean Latency</span>
              <span className="font-bold font-mono">
                {activeCount > 0 
                  ? (activeKeys.reduce((acc, k) => acc + (predictionResults[k]?.latency || 0), 0) / activeCount).toFixed(1) 
                  : 0} ms
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Output Cards */}
      {activeCount === 0 ? (
        <div className="card-glass rounded-2xl p-12 text-center text-slate-400 text-xs">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          No models selected. Please check at least one model architecture in the section above.
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-6 ${activeCount === 1 ? 'max-w-md mx-auto' : activeCount === 2 ? 'md:grid-cols-2' : 'lg:grid-cols-3'}`}>
          {activeKeys.map((key) => {
            const m = predictionResults[key];
            if (!m) return null;
            const isApproved = m.isApproved;

            return (
              <div 
                key={key} 
                className="card-glass rounded-2xl p-5 flex flex-col justify-between card-glass-hover relative overflow-hidden"
              >
                {/* Top indicator bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isApproved ? 'bg-emerald-500' : 'bg-slate-400'}`} />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-base text-slate-50">{m.name}</h3>
                        <span className="font-mono text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                          {m.version}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{m.tag}</span>
                    </div>

                    {/* Latency Pill */}
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/50 text-slate-400 text-xs font-mono font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{m.latency} ms</span>
                    </div>
                  </div>

                  {/* Decision Outcome Card with YES / NO */}
                  <div className={`p-4 rounded-xl border-2 mb-4 transition-all ${
                    isApproved 
                      ? 'bg-emerald-500/10 border-emerald-400 text-emerald-950' 
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        {isApproved ? (
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-7 h-7 text-rose-600 flex-shrink-0" />
                        )}
                        <div>
                          <div className="text-xl font-black leading-tight">
                            {isApproved ? 'YES ✅' : 'NO ❌'}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-400">
                            {isApproved ? 'Will Subscribe' : 'Will Not Subscribe'}
                          </div>
                        </div>
                      </div>
                      <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded-md ${
                        isApproved ? 'bg-emerald-200/80 text-emerald-900' : 'bg-rose-200/80 text-rose-900'
                      }`}>
                        {m.confidence}%
                      </span>
                    </div>

                    {/* Probability Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className={isApproved ? 'text-emerald-800' : 'text-rose-800'}>
                          Confidence (Chance of YES)
                        </span>
                        <span className="font-mono text-slate-50 font-bold">
                          {m.confidence}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isApproved ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                          style={{ width: `${m.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature Impact Breakdown */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Primary Driving Features
                    </span>
                    <div className="space-y-1.5">
                      {m.features.map((f, i) => (
                        <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-950/80 border border-slate-800/50">
                          <span className="text-slate-400 font-medium">{f.name}</span>
                          <span className={`font-mono font-bold text-[11px] ${
                            f.weight.startsWith('+') ? 'text-emerald-600' : 'text-slate-400'
                          }`}>
                            {f.weight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="mt-5 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Architecture</span>
                  <span className="font-mono text-slate-400">
                    {key === 'xgboost' ? 'Tree Depth: 6' : key === 'random_forest' ? '200 Estimators' : 'Layers: [128, 64]'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
