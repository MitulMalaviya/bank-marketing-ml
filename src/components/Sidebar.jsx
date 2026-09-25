import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Flame, 
  TreePine, 
  Network, 
  ShieldCheck, 
  Database,
  Zap,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: LayoutDashboard,
          badge: 'Live',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        },
        { 
          id: 'multi_predict', 
          label: 'Multi-Model Arena', 
          icon: Cpu,
          badge: 'Side-by-Side',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        },
      ]
    },
    {
      title: 'DEDICATED MODELS',
      items: [
        { 
          id: 'logistic', 
          label: 'Logistic Regression', 
          icon: ShieldCheck,
          badge: 'model.pkl (90.16%)',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        },
        { 
          id: 'xgboost', 
          label: 'XGBoost Studio', 
          icon: Flame,
          badge: 'v2.4',
          badgeColor: 'bg-orange-500/10 text-orange-300 border-orange-500/30'
        },
        { 
          id: 'random_forest', 
          label: 'Random Forest Lab', 
          icon: TreePine,
          badge: '200 Trees',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        },
        { 
          id: 'neural_net', 
          label: 'Neural Net Deep Lab', 
          icon: Network,
          badge: 'Deep MLP',
          badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
        },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { 
          id: 'batch', 
          label: 'Batch Portfolio', 
          icon: Layers,
          badge: 'CSV',
          badgeColor: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50'
        },
        { 
          id: 'insights', 
          label: 'Campaign Insights', 
          icon: Database,
          badge: '45k Rows',
          badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/30'
        },
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen bg-zinc-900/60 backdrop-blur-md border-r border-zinc-700/50 flex flex-col justify-between transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Logo */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/50 flex-shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex-shrink-0 flex items-center justify-center shadow-xl shadow-black/20 shadow-emerald-100 text-zinc-50">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight transition-opacity duration-200">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-base text-zinc-50 tracking-tight">Nexus</span>
                  <span className="font-extrabold text-base text-emerald-600 tracking-tight">ML</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium truncate">Model Inference Suite</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-950/80 flex items-center justify-center text-zinc-400 hover:text-zinc-400 transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="p-3 space-y-5">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-zinc-400 tracking-wider">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center rounded-xl font-medium text-xs transition-all duration-150 relative group ${
                      isCollapsed ? 'justify-center p-3' : 'px-3 py-2 space-x-2.5'
                    } ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-300 font-semibold shadow-lg shadow-black/10' 
                        : 'text-zinc-400 hover:bg-zinc-950/80 hover:text-zinc-50'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -tranzinc-y-1/2 w-1 h-5 bg-emerald-600 rounded-r-full" />
                    )}
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-400'}`} />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor} ml-1`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-zinc-800/50 flex-shrink-0">
        <div className={`flex items-center rounded-xl p-2 transition hover:bg-zinc-950/80 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-700 text-zinc-50 font-bold text-xs flex items-center justify-center shadow-lg shadow-black/10">
              AR
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-zinc-200 truncate">Alex Rivera</h4>
              <p className="text-[10px] text-zinc-400 truncate">Lead ML Engineer</p>
            </div>
          )}

          {!isCollapsed && (
            <button 
              className="text-zinc-400 hover:text-zinc-400 p-1 rounded-lg hover:bg-zinc-800/80 transition"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
