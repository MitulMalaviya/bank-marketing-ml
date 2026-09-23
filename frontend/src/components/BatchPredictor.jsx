import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Users, 
  Percent, 
  ArrowRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { predictBatch, predictBatchFile } from '../api';

const SAMPLE_BATCH_DATA = [
  { age: 58, job: "management", marital: "married", education: "tertiary", default: "no", balance: 2143, housing: "yes", loan: "no", contact: "unknown", day: 5, month: "may", duration: 261, campaign: 1, pdays: -1, previous: 0, poutcome: "unknown" },
  { age: 44, job: "technician", marital: "single", education: "secondary", default: "no", balance: 29, housing: "yes", loan: "no", contact: "unknown", day: 5, month: "may", duration: 151, campaign: 1, pdays: -1, previous: 0, poutcome: "unknown" },
  { age: 72, job: "retired", marital: "married", education: "secondary", default: "no", balance: 5715, housing: "no", loan: "no", contact: "cellular", day: 17, month: "nov", duration: 1127, campaign: 5, pdays: 184, previous: 3, poutcome: "success" },
  { age: 33, job: "entrepreneur", marital: "married", education: "secondary", default: "no", balance: 2, housing: "yes", loan: "yes", contact: "unknown", day: 5, month: "may", duration: 76, campaign: 1, pdays: -1, previous: 0, poutcome: "unknown" },
  { age: 51, job: "technician", marital: "married", education: "tertiary", default: "no", balance: 825, housing: "no", loan: "no", contact: "cellular", day: 17, month: "nov", duration: 977, campaign: 3, pdays: -1, previous: 0, poutcome: "unknown" },
  { age: 28, job: "student", marital: "single", education: "tertiary", default: "no", balance: 1850, housing: "no", loan: "no", contact: "cellular", day: 22, month: "sep", duration: 420, campaign: 1, pdays: 90, previous: 2, poutcome: "success" },
  { age: 37, job: "management", marital: "married", education: "tertiary", default: "no", balance: 450, housing: "yes", loan: "no", contact: "cellular", day: 14, month: "jul", duration: 130, campaign: 3, pdays: -1, previous: 0, poutcome: "unknown" },
  { age: 62, job: "retired", marital: "married", education: "primary", default: "no", balance: 3900, housing: "no", loan: "no", contact: "telephone", day: 10, month: "mar", duration: 610, campaign: 2, pdays: 120, previous: 1, poutcome: "success" },
  { age: 31, job: "blue-collar", marital: "single", education: "secondary", default: "no", balance: 120, housing: "yes", loan: "yes", contact: "cellular", day: 18, month: "may", duration: 95, campaign: 4, pdays: -1, previous: 0, poutcome: "unknown" },
  { age: 49, job: "admin.", marital: "divorced", education: "secondary", default: "no", balance: 1420, housing: "yes", loan: "no", contact: "cellular", day: 19, month: "oct", duration: 380, campaign: 2, pdays: -1, previous: 0, poutcome: "unknown" }
];

export default function BatchPredictor() {
  const [loading, setLoading] = useState(false);
  const [batchResults, setBatchResults] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');

  const handleLoadSampleBatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictBatch(SAMPLE_BATCH_DATA);
      setBatchResults(res);
    } catch (err) {
      setError(err.message || 'Sample batch processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const res = await predictBatchFile(file);
      setBatchResults(res);
    } catch (err) {
      setError(err.message || 'File evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const exportResultsCSV = () => {
    if (!batchResults || !batchResults.records) return;
    const headers = ["ID", "Age", "Job", "Balance", "Duration", "Campaign", "PrevOutcome", "Prediction", "ProbabilityYes", "Tier"];
    const rows = batchResults.records.map(r => [
      r.id,
      r.age,
      r.job,
      r.balance,
      r.duration,
      r.campaign,
      r.poutcome,
      r.prediction_label,
      `${r.probability_yes}%`,
      r.propensity_tier
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bank_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = batchResults?.records?.filter(r => {
    const matchesSearch = 
      String(r.job).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.age).includes(searchTerm) ||
      String(r.id).includes(searchTerm);
    const matchesTier = filterTier === 'ALL' || r.propensity_tier === filterTier;
    return matchesSearch && matchesTier;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Upload & Sample Loading Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Batch Portfolio Evaluation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload a customer CSV dataset or load the verified sample benchmark batch to process multi-client propensity scores in seconds.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLoadSampleBatch}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load 10-Client Sample</span>
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div className="mt-6">
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-700/80 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/50 transition duration-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-slate-400" />
              <p className="mb-1 text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">Click to upload CSV</span> or drag and drop
              </p>
              <p className="text-[11px] text-slate-500">Supports standard bank-full.csv columns (comma or semicolon delimited)</p>
            </div>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={loading}
            />
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Batch Results Overview */}
      {batchResults && (
        <div className="space-y-6">
          {/* Executive Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
                <span>Total Prospects Evaluated</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-3xl font-extrabold text-white">
                {batchResults.total_records}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
              <div className="flex items-center justify-between text-emerald-400 mb-2 text-xs">
                <span>Projected Subscribers</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-3xl font-extrabold text-emerald-400">
                {batchResults.projected_subscribers}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
                <span>Projected Declines</span>
                <XCircle className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-3xl font-extrabold text-slate-300">
                {batchResults.projected_non_subscribers}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/10">
              <div className="flex items-center justify-between text-indigo-400 mb-2 text-xs">
                <span>Projected Conversion Rate</span>
                <Percent className="w-4 h-4" />
              </div>
              <span className="text-3xl font-extrabold text-indigo-400">
                {batchResults.projected_conversion_rate}%
              </span>
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by job, age, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">All Tiers</option>
                  <option value="High">High Propensity</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low Propensity</option>
                </select>
              </div>

              <button
                onClick={exportResultsCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export to CSV</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Age</th>
                    <th className="py-3 px-3">Job</th>
                    <th className="py-3 px-3">Balance</th>
                    <th className="py-3 px-3">Call Time</th>
                    <th className="py-3 px-3">Touches</th>
                    <th className="py-3 px-3">Prior Outcome</th>
                    <th className="py-3 px-3">Model Decision</th>
                    <th className="py-3 px-3">Propensity</th>
                    <th className="py-3 px-3">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRecords.map((row) => {
                    const isYes = row.prediction === 1;
                    return (
                      <tr key={row.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{row.id}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-200">{row.age}</td>
                        <td className="py-2.5 px-3 capitalize">{row.job}</td>
                        <td className="py-2.5 px-3 font-mono">€{Number(row.balance).toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-mono">{row.duration}s</td>
                        <td className="py-2.5 px-3 font-mono">{row.campaign}</td>
                        <td className="py-2.5 px-3 capitalize">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            row.poutcome === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400'
                          }`}>
                            {row.poutcome}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                            isYes 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {isYes ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {row.prediction_label}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold font-mono text-slate-200">
                          {row.probability_yes}%
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            row.propensity_tier === 'High' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : row.propensity_tier === 'Moderate'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {row.propensity_tier}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No matching records found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
