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

export default function DataInsights() {
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
      <div className="glass-panel rounded-2xl p-12 text-center text-zinc-400 text-sm">
        Loading Campaign Insights...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <Database className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Exploratory Data Analysis</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-50 tracking-tight">
          Bank Marketing Campaign Dataset Analytics
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Historical patterns extracted from 45,211 customer interactions across direct telemarketing campaigns.
        </p>
      </div>

      {/* 4 Dataset Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2 text-xs">
            <span>Total Evaluated Clients</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-50">45,211</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">UCI Bank Marketing Records</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2 text-xs">
            <span>Overall Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">11.7%</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">5,289 Term Deposit Subscriptions</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2 text-xs">
            <span>Mean Account Balance</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-teal-300">€1,362</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Standard deviation €3,068</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2 text-xs">
            <span>Average Call Duration</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300">258s</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">~4.3 minutes per call</span>
        </div>
      </div>

      {/* Chart 1 & Chart 2: Jobs and Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion by Job */}
        <div className="glass-panel rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-1">
            Conversion Rate by Client Job Category (%)
          </h3>
          <p className="text-xs text-zinc-400 mb-4">
            Students (28.7%) and Retirees (22.8%) demonstrate the highest propensity to subscribe.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.jobs_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="job" stroke="#94a3b8" fontSize={10} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke="#94a3b8" fontSize={10} unit="%" />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Conversion Rate']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {stats?.jobs_distribution?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.rate > 20 ? '#10b981' : entry.rate > 10 ? '#6366f1' : '#64748b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion by Month */}
        <div className="glass-panel rounded-2xl p-6 border border-zinc-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-1">
            Seasonal Conversion Rate by Month (%)
          </h3>
          <p className="text-xs text-zinc-400 mb-4">
            Shoulder months (March, September, October, December) show over 40% conversion effectiveness.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={10} unit="%" />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Conversion Rate']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Impact of Previous Campaign Outcome */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-1">
          Historical Campaign Outcome Impact
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Clients who subscribed in an earlier campaign are 6x more likely to convert than cold prospects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {stats?.outcome_impact?.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-xs text-zinc-400 block truncate">{item.outcome}</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className={`text-2xl font-extrabold ${
                  item.rate > 50 ? 'text-emerald-400' : 'text-zinc-200'
                }`}>
                  {item.rate}%
                </span>
                <span className="text-[10px] text-zinc-400">conversion</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Banking Takeaways */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 bg-emerald-950/10">
        <div className="flex items-center space-x-2 text-emerald-400 mb-3">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-50">
            Key Strategic Recommendations for Bank Marketing Teams
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <strong className="text-emerald-400 block mb-1">1. Retarget Previous Winners</strong>
            Clients with prior campaign success convert at 64.7%. They should be placed in tier-1 VIP priority outreach queues with senior relationship managers.
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <strong className="text-emerald-400 block mb-1">2. Seasonal Campaign Alignment</strong>
            Shift high-intensity campaigns from May/July to March, September, and October to capitalize on fiscal quarter reviews and surplus savings allocations.
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <strong className="text-teal-400 block mb-1">3. Tailored Retiree Packages</strong>
            Retirees boast a 22.8% conversion rate with strong average liquidity. Offer senior-focused guaranteed interest rate deposit structures.
          </div>
        </div>
      </div>
    </div>
  );
}
