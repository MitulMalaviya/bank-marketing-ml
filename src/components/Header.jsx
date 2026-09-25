import React from 'react';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  Menu
} from 'lucide-react';

export default function Header({ activeTab, isMobileMenuOpen, setIsMobileMenuOpen }) {
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
    <header className="sticky top-0 z-30 h-16 bg-zinc-900/60 backdrop-blur-md border-b border-zinc-700/50 px-6 flex items-center justify-between transition-all duration-300">
      {/* View Title */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-bold text-zinc-50 tracking-tight">
            {current.title}
          </h2>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {current.badge}
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 hidden sm:block">
          {current.subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* Cluster status badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-zinc-700/50 text-zinc-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>us-east-prod-01</span>
        </div>

        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search models, metrics..."
            className="bg-zinc-950/80 border border-zinc-700/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-zinc-900/60 w-44 transition"
          />
        </div>

        {/* Notification Bell */}
        <button 
          className="relative w-8 h-8 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-950/80 flex items-center justify-center text-zinc-400 hover:text-zinc-300 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-zinc-900" />
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden relative w-8 h-8 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-950/80 flex items-center justify-center text-zinc-400 hover:text-zinc-300 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
