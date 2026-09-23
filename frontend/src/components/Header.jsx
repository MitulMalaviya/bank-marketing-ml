import React from 'react';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  Terminal, 
  Sparkles
} from 'lucide-react';

export default function Header({ activeTab }) {
  const titles = {
    dashboard: {
      title: 'ML System Dashboard',
      subtitle: 'Inference traffic telemetry, cluster health, and execution ledger',
      badge: 'Cluster Live'
    },
    multi_predict: {
      title: 'Multi-Model Arena',
      subtitle: 'Concurrently evaluate XGBoost, Random Forest, and Neural Net architectures',
      badge: '3 Models Active'
    },
    xgboost: {
      title: 'XGBoost Studio (v2.4.2)',
      subtitle: 'Extreme gradient boosted decision trees with split gain rankings',
      badge: 'Latency ~14ms'
    },
    random_forest: {
      title: 'Random Forest Lab (v1.8.0)',
      subtitle: '200 de-correlated decision trees with ensemble majority voting',
      badge: '93.8% OOB Acc'
    },
    neural_net: {
      title: 'Neural Network Deep Lab (v3.1.0)',
      subtitle: '4-layer feedforward deep perceptron with dropout and softmax output',
      badge: '12.8k Params'
    },
    logistic: {
      title: 'Production Model (model.pkl)',
      subtitle: 'Pre-trained L2 logistic classifier running on Flask REST backend',
      badge: '90.16% Accuracy'
    },
    batch: {
      title: 'Batch Portfolio Processor',
      subtitle: 'Bulk CSV customer evaluation, tier segmentation, and export',
      badge: 'CSV Support'
    },
    insights: {
      title: 'Campaign Dataset Analytics',
      subtitle: 'Exploratory data analysis across 45,211 historical records',
      badge: 'UCI Dataset'
    }
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between transition-all duration-300">
      {/* View Title */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {current.title}
          </h2>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {current.badge}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 hidden sm:block">
          {current.subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* Cluster status badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>us-east-prod-01</span>
        </div>

        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search models, metrics..."
            className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white w-44 transition"
          />
        </div>

        {/* Notification Bell */}
        <button 
          className="relative w-8 h-8 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
