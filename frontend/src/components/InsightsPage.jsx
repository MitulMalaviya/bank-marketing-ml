import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { 
  Database, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { getDatasetStats } from '../api';

export default function InsightsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDatasetStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Error fetching dataset stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card-clean rounded-2xl p-12 text-center text-slate-400 text-sm">
        Loading Campaign Insights...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="card-clean rounded-2xl p-6 bg-gradient-to-r from-white via-indigo-50/20 to-white">
        <div className="flex items-center space-x-2 text-indigo-600 mb-1">
          <Database className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Exploratory Data Analysis</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Bank Marketing Campaign Dataset Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Historical patterns extracted from 45,211 customer interactions across direct telemarketing campaigns.
        </p>
      </div>

      {/* 4 Dataset Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-clean p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
            <span>Total Evaluated Clients</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">45,211</div>
          <span className="text-[11px] text-slate-400 mt-1 block">UCI Bank Marketing Dataset</span>
        </div>

        <div className="card-clean p-5 rounded-2xl border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
            <span>Overall Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">11.7%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">5,289 Term Subscriptions</span>
        </div>

        <div className="card-clean p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
            <span>Mean Account Balance</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">€1,362</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Std Dev: €3,068</span>
        </div>

        <div className="card-clean p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
            <span>Average Call Duration</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">258s</div>
          <span className="text-[11px] text-slate-400 mt-1 block">~4.3 minutes per call</span>
        </div>
      </div>

      {/* Charts: Jobs and Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion by Job */}
        <div className="card-clean rounded-2xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
            Conversion Rate by Client Job Category (%)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Students (28.7%) and Retirees (22.8%) demonstrate the highest propensity to subscribe.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.jobs_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="job" stroke="#94a3b8" fontSize={10} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke="#94a3b8" fontSize={10} unit="%" />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Conversion Rate']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="rate" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                  {stats?.jobs_distribution?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.rate > 20 ? '#10b981' : entry.rate > 10 ? '#4f46e5' : '#94a3b8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion by Month */}
        <div className="card-clean rounded-2xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
            Seasonal Conversion Rate by Month (%)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Shoulder months (March, September, October, December) show over 40% conversion effectiveness.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={10} unit="%" />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Conversion Rate']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Prior Outcome Impact */}
      <div className="card-clean rounded-2xl p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
          Historical Campaign Outcome Impact
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Clients who subscribed in an earlier campaign are 6x more likely to convert than cold prospects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {stats?.outcome_impact?.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block truncate">{item.outcome}</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className={`text-2xl font-bold ${
                  item.rate > 50 ? 'text-emerald-600' : 'text-slate-800'
                }`}>
                  {item.rate}%
                </span>
                <span className="text-[10px] text-slate-400">conversion</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
