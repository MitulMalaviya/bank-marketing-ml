import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  Zap, 
  Award, 
  Cpu, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle,
  AlertCircle, 
  RefreshCw, 
  Search,
  SlidersHorizontal,
  PlusCircle
} from 'lucide-react';
import AllModelPredictionMatrix from './AllModelPredictionMatrix';

// Timeframe sample datasets
const TIMEFRAME_DATA = {
  '24h': [
    { time: '00:00', requests: 1420, latency: 22.4 },
    { time: '03:00', requests: 980, latency: 19.8 },
    { time: '06:00', requests: 1850, latency: 21.2 },
    { time: '09:00', requests: 3890, latency: 28.5 },
    { time: '12:00', requests: 4620, latency: 31.0 },
    { time: '15:00', requests: 4210, latency: 26.8 },
    { time: '18:00', requests: 3450, latency: 24.1 },
    { time: '21:00', requests: 2310, latency: 23.0 },
  ],
  '7d': [
    { time: 'Mon', requests: 28400, latency: 23.5 },
    { time: 'Tue', requests: 31200, latency: 25.1 },
    { time: 'Wed', requests: 34500, latency: 26.8 },
    { time: 'Thu', requests: 32900, latency: 24.2 },
    { time: 'Fri', requests: 38100, latency: 27.9 },
    { time: 'Sat', requests: 18400, latency: 20.1 },
    { time: 'Sun', requests: 16200, latency: 19.4 },
  ],
  '30d': [
    { time: 'Week 1', requests: 195000, latency: 24.2 },
    { time: 'Week 2', requests: 218000, latency: 25.6 },
    { time: 'Week 3', requests: 242000, latency: 26.1 },
    { time: 'Week 4', requests: 234000, latency: 23.9 },
  ]
};

const INITIAL_LOGS = [
  {
    id: 'INF-9403',
    timestamp: 'Just now',
    model: 'Logistic Regression (model.pkl)',
    modelType: 'logistic',
    inputSummary: 'Age: 68, Bal: €7,200, Dur: 540s, Retired',
    prediction: 'YES (Subscribed)',
    isPositive: true,
    confidence: 96.8,
    latency: 8.4,
    status: 'Success'
  },
  {
    id: 'INF-9402',
    timestamp: '2 mins ago',
    model: 'XGBoost v2.4',
    modelType: 'xgboost',
    inputSummary: 'Age: 52, Bal: €6,400, Dur: 480s, Success',
    prediction: 'YES (Subscribed)',
    isPositive: true,
    confidence: 96.2,
    latency: 14.8,
    status: 'Success'
  },
  {
    id: 'INF-9401',
    timestamp: '5 mins ago',
    model: 'Neural Net v3.1',
    modelType: 'neural_net',
    inputSummary: 'Age: 29, Bal: €1,200, Dur: 210s, Cellular',
    prediction: 'YES (Subscribed)',
    isPositive: true,
    confidence: 91.4,
    latency: 38.2,
    status: 'Success'
  },
  {
    id: 'INF-9400',
    timestamp: '11 mins ago',
    model: 'Random Forest v1.8',
    modelType: 'random_forest',
    inputSummary: 'Age: 38, Bal: €120, Dur: 85s, Loans: Yes',
    prediction: 'NO (Declined)',
    isPositive: false,
    confidence: 89.5,
    latency: 26.4,
    status: 'Success'
  },
  {
    id: 'INF-9399',
    timestamp: '18 mins ago',
    model: 'XGBoost v2.4',
    modelType: 'xgboost',
    inputSummary: 'Age: 44, Bal: €3,100, Dur: 310s, Management',
    prediction: 'YES (Subscribed)',
    isPositive: true,
    confidence: 93.8,
    latency: 15.2,
    status: 'Success'
  },
  {
    id: 'INF-9398',
    timestamp: '24 mins ago',
    model: 'Random Forest v1.8',
    modelType: 'random_forest',
    inputSummary: 'Age: 61, Bal: €4,800, Dur: 520s, Retired',
    prediction: 'YES (Subscribed)',
    isPositive: true,
    confidence: 94.1,
    latency: 28.0,
    status: 'Success'
  }
];

export default function DashboardView() {
  const [timeframe, setTimeframe] = useState('24h');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [modelFilter, setModelFilter] = useState('ALL');

  // Interactive: Simulate a new live inference record added to the table
  const handleSimulateInference = () => {
    const models = [
      { name: 'Logistic Regression (model.pkl)', type: 'logistic', latencyRange: [7, 11], defaultConf: 96.5 },
      { name: 'XGBoost v2.4', type: 'xgboost', latencyRange: [12, 18], defaultConf: 95.8 },
      { name: 'Random Forest v1.8', type: 'random_forest', latencyRange: [24, 30], defaultConf: 92.4 },
      { name: 'Neural Net v3.1', type: 'neural_net', latencyRange: [35, 45], defaultConf: 90.7 }
    ];
    const picked = models[Math.floor(Math.random() * models.length)];
    const isPos = Math.random() > 0.35;
    const randomLatency = (Math.random() * (picked.latencyRange[1] - picked.latencyRange[0]) + picked.latencyRange[0]).toFixed(1);
    const randomConf = (Math.random() * 10 + 88).toFixed(1);
    const newId = `INF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLog = {
      id: newId,
      timestamp: 'Just now',
      model: picked.name,
      modelType: picked.type,
      inputSummary: `Age: ${Math.floor(22 + Math.random() * 50)}, Bal: €${Math.floor(100 + Math.random() * 8000)}, Dur: ${Math.floor(50 + Math.random() * 600)}s`,
      prediction: isPos ? 'YES (Subscribed)' : 'NO (Declined)',
      isPositive: isPos,
      confidence: parseFloat(randomConf),
      latency: parseFloat(randomLatency),
      status: Math.random() > 0.1 ? 'Success' : 'Flagged'
    };

    setLogs([newLog, ...logs.slice(0, 9)]);
  };

  const filteredLogs = logs.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.inputSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModel = modelFilter === 'ALL' || item.modelType === modelFilter;
    return matchesSearch && matchesModel;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">System Overview</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Real-time inference traffic, model latency metrics, and execution diagnostics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSimulateInference}
            className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-zinc-50 rounded-xl text-xs font-semibold shadow-lg shadow-black/10 shadow-emerald-200 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate Request</span>
          </button>
        </div>
      </div>

      {/* 1. Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Requests */}
        <div className="card-glass rounded-2xl p-5 card-glass-hover">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">Total Requests</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-50">1,284,930</div>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.4%
            </span>
            <span className="text-[11px] text-zinc-400">vs. last week</span>
          </div>
        </div>

        {/* KPI 2: Avg Latency */}
        <div className="card-glass rounded-2xl p-5 card-glass-hover">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">Average Latency</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-50">24.6 ms</div>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> -3.2 ms
            </span>
            <span className="text-[11px] text-zinc-400">P95: 38.4 ms</span>
          </div>
        </div>

        {/* KPI 3: Accuracy */}
        <div className="card-glass rounded-2xl p-5 card-glass-hover">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">Model Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-50">94.2%</div>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +0.8%
            </span>
            <span className="text-[11px] text-zinc-400">Benchmark: 90.2%</span>
          </div>
        </div>

        {/* KPI 4: Active Models */}
        <div className="card-glass rounded-2xl p-5 card-glass-hover">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">Active Models</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-50">4 Online</div>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              100% Availability
            </span>
          </div>
        </div>
      </div>

      {/* 2. All Models Real-Time Prediction Matrix & Consensus */}
      <AllModelPredictionMatrix />

      {/* 3. Interactive Line Graph: Traffic vs. Latency */}
      <div className="card-glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-zinc-50 tracking-tight">Traffic Volume vs. Inference Latency</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Dual-axis temporal telemetry tracking request throughput and service response duration.
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-xs font-semibold">
            {['24h', '7d', '30d'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg transition ${
                  timeframe === t 
                    ? 'bg-zinc-900/60 backdrop-blur-md text-emerald-600 shadow-lg shadow-black/10' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t === '24h' ? '24 Hours' : t === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts LineChart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TIMEFRAME_DATA[timeframe]} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }} 
              />
              <YAxis 
                yAxisId="left" 
                stroke="#6366f1" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#10b981" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }}
                unit=" ms"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#e2e8f0', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '12px' 
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="requests" 
                name="Request Volume" 
                stroke="#4f46e5" 
                strokeWidth={2.5} 
                dot={{ fill: '#4f46e5', r: 3 }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="latency" 
                name="Latency (ms)" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                strokeDasharray="4 4"
                dot={{ fill: '#10b981', r: 3 }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Recent Inference Log Table */}
      <div className="card-glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-zinc-50 tracking-tight">Recent Inference Logs</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live ledger of incoming payload evaluations across production model deployments.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-950/80 border border-zinc-700/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-zinc-900/60 backdrop-blur-md w-48 transition"
              />
            </div>

            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="bg-zinc-950/80 border border-zinc-700/50 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-zinc-900/60 backdrop-blur-md transition"
            >
              <option value="ALL">All Models</option>
              <option value="logistic">Logistic (model.pkl)</option>
              <option value="xgboost">XGBoost</option>
              <option value="random_forest">Random Forest</option>
              <option value="neural_net">Neural Net</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 font-semibold uppercase tracking-wider text-[10px] border-b border-zinc-700/50">
              <tr>
                <th className="py-3 px-3.5">Log ID</th>
                <th className="py-3 px-3.5">Timestamp</th>
                <th className="py-3 px-3.5">Model</th>
                <th className="py-3 px-3.5">Input Feature Snapshot</th>
                <th className="py-3 px-3.5 text-center">Prediction (YES / NO)</th>
                <th className="py-3 px-3.5">Confidence</th>
                <th className="py-3 px-3.5">Latency</th>
                <th className="py-3 px-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-950/80/80 transition">
                  <td className="py-3 px-3.5 font-mono text-zinc-400 font-medium">{log.id}</td>
                  <td className="py-3 px-3.5 text-zinc-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-3.5">
                    <span className="font-semibold text-zinc-50 bg-zinc-800/80 px-2 py-0.5 rounded text-[11px] border border-zinc-700/50">
                      {log.model}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-zinc-400 text-[11px] truncate max-w-xs" title={log.inputSummary}>
                    {log.inputSummary}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <span className={`inline-flex items-center gap-1.5 font-black text-xs px-3 py-1 rounded-lg border shadow-lg shadow-black/10 ${
                      log.isPositive 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      {log.isPositive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      <span>{log.isPositive ? 'YES ✅' : 'NO ❌'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-bold font-mono text-zinc-200">
                    {log.confidence}%
                  </td>
                  <td className="py-3 px-3.5 font-mono text-zinc-400">
                    {log.latency} ms
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      log.status === 'Success' 
                        ? 'bg-emerald-500/10 text-emerald-300' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-zinc-400 text-xs">
              No matching inference records found for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
