import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import MultiModelPredict from './components/MultiModelPredict';
import XGBoostPage from './components/XGBoostPage';
import RandomForestPage from './components/RandomForestPage';
import NeuralNetPage from './components/NeuralNetPage';
import LogisticPage from './components/LogisticPage';
import BatchPage from './components/BatchPage';
import InsightsPage from './components/InsightsPage';
import { Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-zinc-300 flex font-sans antialiased selection:bg-emerald-500 selection:text-zinc-50 relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 1. Collapsible Multi-Page Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* 2. Main Page Layout */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full md:w-auto ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        } ml-0`}
      >
        {/* Top Dynamic Header */}
        <Header 
          activeTab={activeTab} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* View Content based on activeTab */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'multi_predict' && <MultiModelPredict />}
          {activeTab === 'xgboost' && <XGBoostPage />}
          {activeTab === 'random_forest' && <RandomForestPage />}
          {activeTab === 'neural_net' && <NeuralNetPage />}
          {activeTab === 'logistic' && <LogisticPage />}
          {activeTab === 'batch' && <BatchPage />}
          {activeTab === 'insights' && <InsightsPage />}
        </main>

        {/* Clean Light Footer */}
        <footer className="border-t border-zinc-700/50 bg-zinc-900/60 backdrop-blur-md py-4 px-6 text-xs text-zinc-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center text-zinc-50">
                <Zap className="w-2.5 h-2.5 fill-current" />
              </div>
              <span className="font-bold text-zinc-200">NexusML Platform</span>
              <span>•</span>
              <span className="text-zinc-400">All Model Inference Workspaces Operational</span>
            </div>

            <div className="flex items-center space-x-4 text-zinc-400">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 4 Active Production Models
              </span>
              <span>•</span>
              <span>React 18 & Tailwind CSS</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
