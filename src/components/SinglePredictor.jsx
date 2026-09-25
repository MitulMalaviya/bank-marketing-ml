import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  CreditCard, 
  Phone, 
  History, 
  Sparkles, 
  RotateCcw, 
  Send,
  HelpCircle,
  Sliders,
  ChevronRight
} from 'lucide-react';
import PredictionResult from './PredictionResult';
import { predictSingle, getPersonas } from '../api';

const DEFAULT_VALUES = {
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

export default function SinglePredictor() {
  const [formData, setFormData] = useState(DEFAULT_VALUES);
  const [personas, setPersonas] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch personas on mount
    getPersonas()
      .then((data) => setPersonas(data))
      .catch((err) => console.warn('Could not load personas:', err));
      
    // Run initial prediction with default values
    handlePredict(DEFAULT_VALUES);
  }, []);

  const handleChange = (field, value) => {
    setSelectedPersonaId(null);
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonaSelect = (persona) => {
    setSelectedPersonaId(persona.id);
    setFormData(persona.data);
    handlePredict(persona.data);
  };

  const handleReset = () => {
    setSelectedPersonaId(null);
    setFormData(DEFAULT_VALUES);
    handlePredict(DEFAULT_VALUES);
  };

  const handlePredict = async (dataToPredict = formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictSingle(dataToPredict);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Prediction request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePredict();
  };

  return (
    <div className="space-y-8">
      {/* Top Personas Quick-Loader Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1-Click Preset Personas
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select a synthetic customer profile to immediately test high, moderate, and low propensity outcomes.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
              title="Reset all inputs to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Personas Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {personas.map((p) => {
            const isSelected = selectedPersonaId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePersonaSelect(p)}
                className={`p-3.5 rounded-xl text-left border transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-500/60 bg-emerald-950/30 ring-1 ring-emerald-500/50 shadow-xl shadow-black/20 shadow-emerald-500/10'
                    : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {p.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 truncate">{p.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Workspace: Form on Left, Live Predictions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Form (7 Columns) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Demographics */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-400 mb-5 pb-3 border-b border-slate-800">
                <User className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  1. Client Demographics
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Age (Years)</label>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {formData.age} yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="95"
                    value={formData.age}
                    onChange={(e) => handleChange('age', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>18</span>
                    <span>55</span>
                    <span>95</span>
                  </div>
                </div>

                {/* Job */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Job Category
                  </label>
                  <select
                    value={formData.job}
                    onChange={(e) => handleChange('job', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="admin.">Administrative</option>
                    <option value="blue-collar">Blue-Collar</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="housemaid">Housemaid</option>
                    <option value="management">Management</option>
                    <option value="retired">Retired</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="services">Services</option>
                    <option value="student">Student</option>
                    <option value="technician">Technician</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Marital Status
                  </label>
                  <select
                    value={formData.marital}
                    onChange={(e) => handleChange('marital', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                    <option value="divorced">Divorced / Widowed</option>
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Education Level
                  </label>
                  <select
                    value={formData.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="tertiary">Tertiary (University/Degree)</option>
                    <option value="secondary">Secondary (High School)</option>
                    <option value="primary">Primary School</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Financial Profile */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-400 mb-5 pb-3 border-b border-slate-800">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  2. Financial Status & Liquidity
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Account Balance */}
                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Average Yearly Account Balance (€ EUR)
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      €{Number(formData.balance).toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
                      €
                    </span>
                    <input
                      type="number"
                      value={formData.balance}
                      onChange={(e) => handleChange('balance', Number(e.target.value))}
                      placeholder="e.g. 2500"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Credit in Default */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Credit Currently in Default?
                  </label>
                  <select
                    value={formData.default}
                    onChange={(e) => handleChange('default', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="no">No Default History</option>
                    <option value="yes">Yes (Has Defaulted)</option>
                  </select>
                </div>

                {/* Housing Loan */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Active Housing Mortgage?
                  </label>
                  <select
                    value={formData.housing}
                    onChange={(e) => handleChange('housing', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="no">No Mortgage</option>
                    <option value="yes">Yes (Active Mortgage)</option>
                  </select>
                </div>

                {/* Personal Loan */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Active Personal Loan?
                  </label>
                  <select
                    value={formData.loan}
                    onChange={(e) => handleChange('loan', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="no">No Personal Loan</option>
                    <option value="yes">Yes (Active Personal Loan)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Campaign Interaction */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-400 mb-5 pb-3 border-b border-slate-800">
                <Phone className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  3. Contact & Communication Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Type */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Communication Channel
                  </label>
                  <select
                    value={formData.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="cellular">Cellular / Mobile</option>
                    <option value="telephone">Telephone (Landline)</option>
                    <option value="unknown">Unknown Method</option>
                  </select>
                </div>

                {/* Month */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Last Contact Month
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => handleChange('month', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="jan">January</option>
                    <option value="feb">February</option>
                    <option value="mar">March (High Conversion)</option>
                    <option value="apr">April</option>
                    <option value="may">May</option>
                    <option value="jun">June</option>
                    <option value="jul">July</option>
                    <option value="aug">August</option>
                    <option value="sep">September (High Conversion)</option>
                    <option value="oct">October (High Conversion)</option>
                    <option value="nov">November</option>
                    <option value="dec">December (High Conversion)</option>
                  </select>
                </div>

                {/* Day */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Day of Month (1 - 31)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={(e) => handleChange('day', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Call Duration */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Call Duration
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {formData.duration}s ({Math.floor(formData.duration / 60)}m {formData.duration % 60}s)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1200"
                    step="10"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0s</span>
                    <span>300s (5m)</span>
                    <span>1200s (20m)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Campaign History */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-400 mb-5 pb-3 border-b border-slate-800">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  4. Outreach History & Past Contacts
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Campaign Calls */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Contacts During This Campaign
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.campaign}
                    onChange={(e) => handleChange('campaign', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Previous Outcome */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Previous Campaign Outcome
                  </label>
                  <select
                    value={formData.poutcome}
                    onChange={(e) => handleChange('poutcome', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="unknown">Unknown (Never Contacted)</option>
                    <option value="success">Success (Subscribed Previously)</option>
                    <option value="failure">Failure (Declined Previously)</option>
                    <option value="other">Other Outcome</option>
                  </select>
                </div>

                {/* pdays */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Days Passed Since Previous Contact
                  </label>
                  <input
                    type="number"
                    min="-1"
                    max="1000"
                    value={formData.pdays}
                    onChange={(e) => handleChange('pdays', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">-1 indicates no prior contact</span>
                </div>

                {/* previous */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Contacts Performed Prior to this Campaign
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.previous}
                    onChange={(e) => handleChange('previous', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Predict Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Evaluating Model...' : 'Calculate Subscription Propensity'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Results Dashboard (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <PredictionResult result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
