import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Users, 
  Percent, 
  Search, 
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { predictBatch, predictBatchFile } from '../api';

const SAMPLE_BENCHMARK_PROSPECTS = [
  { age: 58, job: "management", balance: 2143, duration: 261, campaign: 1, poutcome: "unknown", housing: "yes", loan: "no" },
  { age: 44, job: "technician", balance: 29, duration: 151, campaign: 1, poutcome: "unknown", housing: "yes", loan: "no" },
  { age: 72, job: "retired", balance: 5715, duration: 1127, campaign: 5, poutcome: "success", housing: "no", loan: "no" },
  { age: 33, job: "entrepreneur", balance: 2, duration: 76, campaign: 1, poutcome: "unknown", housing: "yes", loan: "yes" },
  { age: 51, job: "technician", balance: 825, duration: 977, campaign: 3, poutcome: "unknown", housing: "no", loan: "no" },
  { age: 28, job: "student", balance: 1850, duration: 420, campaign: 1, poutcome: "success", housing: "no", loan: "no" },
  { age: 37, job: "management", balance: 450, duration: 130, campaign: 3, poutcome: "unknown", housing: "yes", loan: "no" },
  { age: 62, job: "retired", balance: 3900, duration: 610, campaign: 2, poutcome: "success", housing: "no", loan: "no" },
  { age: 31, job: "blue-collar", balance: 120, duration: 95, campaign: 4, poutcome: "unknown", housing: "yes", loan: "yes" },
  { age: 49, job: "admin.", balance: 1420, duration: 380, campaign: 2, poutcome: "unknown", housing: "yes", loan: "no" }
];

export default function BatchPage() {
  const [loading, setLoading] = useState(false);
  const [batchResults, setBatchResults] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');

  const handleLoadSample = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictBatch(SAMPLE_BENCHMARK_PROSPECTS);
      setBatchResults(res);
    } catch (err) {
      setError(err.message || 'Error processing sample records');
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
      setError(err.message || 'File upload failed');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!batchResults?.records) return;
    const headers = ["ID", "Age", "Job", "Balance", "Duration", "Campaign", "Outcome", "Prediction", "Probability", "Tier"];
    const rows = batchResults.records.map(r => [
      r.id, r.age, r.job, r.balance, r.duration, r.campaign, r.poutcome, r.prediction_label, `${r.probability_yes}%`, r.propensity_tier
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `batch_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const records = batchResults?.records?.filter(r => {
    const matchesSearch = String(r.job).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          String(r.age).includes(searchQuery) ||
                          String(r.id).includes(searchQuery);
    const matchesTier = filterTier === 'ALL' || r.propensity_tier === filterTier;
    return matchesSearch && matchesTier;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-glass rounded-2xl p-6 bg-gradient-to-r from-white via-indigo-50/20 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-black/20 shadow-indigo-100 flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-50 tracking-tight">Batch Portfolio Evaluation</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Bulk Inference
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Upload raw CSV files or load sample portfolios to calculate high-throughput customer propensity scores.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLoadSample}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-black/10 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load 10-Prospect Sample</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="card-glass rounded-2xl p-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700/50 rounded-xl cursor-pointer bg-slate-950/80/50 hover:bg-slate-950/80 hover:border-indigo-500 transition">
          <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
          <p className="text-xs font-medium text-slate-300">
            <span className="text-indigo-600 font-semibold">Click to browse</span> or drag and drop customer CSV
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Supports standard bank-full.csv columns</p>
          <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={loading} />
        </label>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {batchResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card-glass p-4 rounded-xl">
              <span className="text-slate-400 text-xs block">Total Evaluated</span>
              <span className="text-2xl font-bold text-slate-50 mt-1 block">{batchResults.total_records}</span>
            </div>
            <div className="card-glass p-4 rounded-xl border-l-4 border-l-emerald-500">
              <span className="text-slate-400 text-xs block">Projected Subscribers</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">{batchResults.projected_subscribers}</span>
            </div>
            <div className="card-glass p-4 rounded-xl border-l-4 border-l-slate-400">
              <span className="text-slate-400 text-xs block">Projected Declines</span>
              <span className="text-2xl font-bold text-slate-300 mt-1 block">{batchResults.projected_non_subscribers}</span>
            </div>
            <div className="card-glass p-4 rounded-xl border-l-4 border-l-indigo-600">
              <span className="text-slate-400 text-xs block">Portfolio Conversion Rate</span>
              <span className="text-2xl font-bold text-indigo-600 mt-1 block">{batchResults.projected_conversion_rate}%</span>
            </div>
          </div>

          {/* Table */}
          <div className="card-glass rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Filter by job, age..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950/80 border border-slate-700/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
                  />
                </div>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="bg-slate-950/80 border border-slate-700/50 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">All Tiers</option>
                  <option value="High">High Propensity</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low Propensity</option>
                </select>
              </div>

              <button
                onClick={exportCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700/50">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Age</th>
                    <th className="py-2.5 px-3">Job</th>
                    <th className="py-2.5 px-3">Balance</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Prior Outcome</th>
                    <th className="py-2.5 px-3">Will Subscribe? (YES / NO)</th>
                    <th className="py-2.5 px-3">Probability</th>
                    <th className="py-2.5 px-3">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-300">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950/80/80 transition">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{r.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-50">{r.age}</td>
                      <td className="py-2.5 px-3 capitalize">{r.job}</td>
                      <td className="py-2.5 px-3 font-mono">€{Number(r.balance).toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono">{r.duration}s</td>
                      <td className="py-2.5 px-3 capitalize">{r.poutcome}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-lg border shadow-lg shadow-black/10 ${
                          r.prediction === 1 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          {r.prediction === 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {r.prediction === 1 ? 'YES ✅' : 'NO ❌'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-200">{r.probability_yes}%</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-300">{r.propensity_tier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
