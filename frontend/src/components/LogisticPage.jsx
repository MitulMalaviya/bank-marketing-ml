import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Send,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Calculator,
  User,
  CreditCard,
  PhoneCall,
  History,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceDot 
} from 'recharts';
import { predictSingle, getPersonas, getModelInfo } from '../api';

const DEFAULT_DATA = {
  age: 41,
  job: 'management',
  marital: 'married',
  education: 'tertiary',
  default: 'no',
  balance: 2143,
  housing: 'yes',
  loan: 'no',
  contact: 'cellular',
  day: 15,
  month: 'may',
  duration: 260,
  campaign: 1,
  pdays: -1,
  previous: 0,
  poutcome: 'unknown'
};

// Sigmoid curve generator for visual math representation
const generateSigmoidData = () => {
  const points = [];
  for (let z = -6; z <= 6; z += 0.5) {
    const prob = (1 / (1 + Math.exp(-z))) * 100;
    points.push({ z: parseFloat(z.toFixed(1)), prob: parseFloat(prob.toFixed(1)) });
  }
  return points;
};

const SIGMOID_CURVE = generateSigmoidData();

export default function LogisticPage() {
  const [formData, setFormData] = useState(DEFAULT_DATA);
  const [personas, setPersonas] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendAlive, setBackendAlive] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    getPersonas()
      .then(p => setPersonas(p))
      .catch(() => setBackendAlive(false));

    // Run initial prediction
    handleLivePredict(DEFAULT_DATA);
  }, []);

  const handleLivePredict = async (data = formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictSingle(data);
      setPrediction(res);
      setBackendAlive(true);
    } catch (err) {
      setError(err.message || 'Could not connect to Flask backend');
      setBackendAlive(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSelect = (p) => {
    setSelectedPersonaId(p.id);
    setFormData(p.data);
    handleLivePredict(p.data);
  };

  const handleInputChange = (field, val) => {
    setSelectedPersonaId(null);
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    handleLivePredict(updated);
  };

  const handleReset = () => {
    setSelectedPersonaId(null);
    setFormData(DEFAULT_DATA);
    handleLivePredict(DEFAULT_DATA);
  };

  // Compute logit (z) from probability for the sigmoid curve point
  const probVal = prediction?.probability_yes ?? 50;
  const clampedProb = Math.min(99.9, Math.max(0.1, probVal));
  const currentZ = parseFloat(Math.log((clampedProb / 100) / (1 - (clampedProb / 100))).toFixed(2));

  const isApproved = prediction?.prediction === 1;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-clean rounded-2xl p-6 bg-gradient-to-r from-white via-indigo-50/30 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Bank Deposit Predictor (YES / NO)
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  90.16% Accuracy
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  model.pkl
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter customer details or select a persona to predict if they will say <strong className="text-emerald-700 font-bold">YES</strong> or <strong className="text-rose-700 font-bold">NO</strong> to a bank term deposit.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              backendAlive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${backendAlive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {backendAlive ? 'API Engine Active' : 'Flask Server Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* 1-Click Quick Personas */}
      <div className="card-clean rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1-Click Benchmark Personas
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {personas.map((p) => {
            const isSelected = selectedPersonaId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePersonaSelect(p)}
                className={`p-3.5 rounded-xl text-left border transition ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900 truncate">{p.name}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {p.badge}
                </span>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Interface: Inputs on Left, Real-time Decision & Math on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Comprehensive 16-Feature Input Console (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Demographics */}
          <div className="card-clean rounded-2xl p-6">
            <div className="flex items-center space-x-2 text-indigo-600 mb-4 pb-2 border-b border-slate-100">
              <User className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Client Demographics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Client Age</span>
                  <span className="font-mono text-indigo-600">{formData.age} yrs</span>
                </div>
                <input 
                  type="range"
                  min="18"
                  max="90"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Job */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Job Category</label>
                <select
                  value={formData.job}
                  onChange={(e) => handleInputChange('job', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-sm"
                >
                  <option value="management">Management</option>
                  <option value="retired">Retired (High Propensity)</option>
                  <option value="student">Student (High Propensity)</option>
                  <option value="technician">Technician</option>
                  <option value="admin.">Administrative</option>
                  <option value="services">Services</option>
                  <option value="blue-collar">Blue-Collar</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="housemaid">Housemaid</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {/* Marital */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Marital Status</label>
                <select
                  value={formData.marital}
                  onChange={(e) => handleInputChange('marital', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-sm"
                >
                  <option value="married">Married</option>
                  <option value="single">Single</option>
                  <option value="divorced">Divorced / Widowed</option>
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Education Level</label>
                <select
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-sm"
                >
                  <option value="tertiary">Tertiary (University)</option>
                  <option value="secondary">Secondary (High School)</option>
                  <option value="primary">Primary School</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Assets & Debt */}
          <div className="card-clean rounded-2xl p-6">
            <div className="flex items-center space-x-2 text-indigo-600 mb-4 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Financial Assets & Liabilities
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Balance */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Average Yearly Balance</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-bold">
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
                  className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Housing Loan */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Housing Loan</label>
                <select
                  value={formData.housing}
                  onChange={(e) => handleInputChange('housing', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-sm"
                >
                  <option value="no">No Housing Loan</option>
                  <option value="yes">Active Mortgage (-0.68 Logit)</option>
                </select>
              </div>

              {/* Personal Loan */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Personal Loan</label>
                <select
                  value={formData.loan}
                  onChange={(e) => handleInputChange('loan', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-sm"
                >
                  <option value="no">No Personal Debt</option>
                  <option value="yes">Active Personal Loan (-0.43 Logit)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Campaign & Historical Outreach */}
          <div className="card-clean rounded-2xl p-6">
            <div className="flex items-center space-x-2 text-indigo-600 mb-4 pb-2 border-b border-slate-100">
              <PhoneCall className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                3. Campaign Communication & History
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration Slider */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Call Duration (seconds)</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-bold">
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
                  className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Contact Channel */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Channel</label>
                <select
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-sm"
                >
                  <option value="cellular">Cellular Mobile</option>
                  <option value="telephone">Landline</option>
                  <option value="unknown">Unknown Channel (-1.60 Logit)</option>
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Month</label>
                <select
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-sm"
                >
                  <option value="mar">March (+1.43 Logit)</option>
                  <option value="sep">September (+0.81 Logit)</option>
                  <option value="oct">October (+0.80 Logit)</option>
                  <option value="may">May</option>
                  <option value="jul">July</option>
                  <option value="aug">August</option>
                  <option value="nov">November</option>
                  <option value="jan">January</option>
                </select>
              </div>

              {/* Prior Outcome */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Prior Campaign Outcome</label>
                <select
                  value={formData.poutcome}
                  onChange={(e) => handleInputChange('poutcome', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 shadow-sm"
                >
                  <option value="success">Success (+2.33 Strongest Predictor)</option>
                  <option value="failure">Failure</option>
                  <option value="other">Other</option>
                  <option value="unknown">Unknown / First Time</option>
                </select>
              </div>

              {/* Campaign Touches */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Contacts in This Campaign</span>
                  <span className="font-mono text-indigo-600">{formData.campaign}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="15"
                  value={formData.campaign}
                  onChange={(e) => handleInputChange('campaign', Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={() => handleLivePredict()}
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Executing model.pkl Inference...' : 'Calculate Subscription Probability'}</span>
          </button>
        </div>

        {/* Right Column: Output Decision, Probability Gauge & Mathematical Curve (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Outcome Card: Clear YES / NO Verdict */}
          <div className={`card-clean rounded-2xl p-6 border-2 transition-all ${
            isApproved 
              ? 'border-emerald-400 bg-emerald-50/40 shadow-sm' 
              : 'border-rose-300 bg-rose-50/40 shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Model Prediction Result
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isApproved
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                {isApproved ? 'High Likelihood' : 'Low Likelihood'}
              </span>
            </div>

            <div className="py-6 text-center">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-3 ${
                isApproved 
                  ? 'bg-emerald-600 text-white shadow-emerald-200' 
                  : 'bg-rose-600 text-white shadow-rose-200'
              }`}>
                {isApproved ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
              </div>
              
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                Will Customer Subscribe?
              </div>

              <h3 className={`text-4xl font-black tracking-tight ${
                isApproved ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {isApproved ? 'YES ✅' : 'NO ❌'}
              </h3>

              <p className="text-sm font-bold text-slate-800 mt-2">
                {isApproved 
                  ? 'Customer will subscribe to the term deposit' 
                  : 'Customer will NOT subscribe to the term deposit'}
              </p>
              
              <p className="text-xs text-slate-500 mt-0.5">
                Model decision confidence: <strong className="font-mono text-slate-900 font-bold">{probVal}%</strong>
              </p>
            </div>

            {/* Probability Progress Bar */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 font-bold">Chance of Deposit (YES)</span>
                <span className="font-mono text-lg font-bold text-slate-900">{probVal}%</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 flex">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isApproved ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                  style={{ width: `${probVal}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>0% (Definitely NO)</span>
                <span>Cutoff: 50%</span>
                <span>100% (Definitely YES)</span>
              </div>
            </div>
          </div>

          {/* Mathematical Sigmoid S-Curve Diagram */}
          <div className="card-clean rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Logistic Sigmoid Curve σ(z)
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                z = {currentZ}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Position on logistic curve: P = 1 / (1 + e^-z)
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SIGMOID_CURVE} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="z" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} unit="%" />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Probability']}
                    labelFormatter={(z) => `Log-Odds (z): ${z}`}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="prob" stroke="#4f46e5" strokeWidth={2.5} dot={false} />
                  <ReferenceDot x={currentZ} y={probVal} r={6} fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Weights Explainability */}
          {prediction && prediction.top_positive_factors && (
            <div className="card-clean rounded-2xl p-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Key Logistic Regression Factor Impact
              </h4>
              <div className="space-y-2 text-xs">
                {prediction.top_positive_factors.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <span className="text-slate-700 font-medium">{f.label}</span>
                    <span className="font-mono font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                      +{f.impact}
                    </span>
                  </div>
                ))}
                {prediction.top_negative_factors && prediction.top_negative_factors.slice(0, 2).map((f, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                    <span className="text-slate-700 font-medium">{f.label}</span>
                    <span className="font-mono font-bold text-rose-700 bg-white px-1.5 py-0.5 rounded border border-rose-200">
                      {f.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
