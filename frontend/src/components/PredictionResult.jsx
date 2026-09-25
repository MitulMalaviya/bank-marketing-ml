import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  PhoneCall, 
  DollarSign, 
  Lightbulb, 
  AlertTriangle, 
  Info, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function PredictionResult({ result, loading }) {
  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
          <Zap className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-white">Running Model Inference...</h3>
        <p className="text-sm text-slate-400 max-w-sm mt-1">
          Scaling numerical features, one-hot encoding categorical variables, and evaluating logistic regression decision boundary.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4">
          <TrendingUp className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Awaiting Customer Input</h3>
        <p className="text-sm text-slate-400 max-w-sm mt-2 leading-relaxed">
          Select one of the pre-configured <span className="text-emerald-400 font-medium">Customer Personas</span> above or fill in the client details to forecast term deposit subscription propensity.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">42 Transformed Features</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">StandardScaler Normalized</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">L2 Logistic Model</span>
        </div>
      </div>
    );
  }

  const isSubscribed = result.prediction === 1;
  const probYes = result.probability_yes;
  const probNo = result.probability_no;
  const tier = result.propensity_tier;

  const tierColors = {
    High: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    Moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    Low: 'bg-rose-500/20 text-rose-400 border-rose-500/40'
  };

  return (
    <div className="space-y-6">
      {/* Primary Result Banner */}
      <div className={`glass-panel rounded-2xl p-6 border transition-all duration-300 ${
        isSubscribed 
          ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950 glow-emerald' 
          : 'border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              isSubscribed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {isSubscribed ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Prediction Outcome</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tierColors[tier] || tierColors.Low}`}>
                  {tier} Propensity Tier
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                {isSubscribed ? 'Likely to Subscribe' : 'Unlikely to Subscribe'}
              </h2>
            </div>
          </div>

          {/* Big Confidence Display */}
          <div className="sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Model Confidence</span>
            <div className="flex items-baseline sm:justify-end space-x-1">
              <span className={`text-4xl font-extrabold tracking-tight ${isSubscribed ? 'text-emerald-400' : 'text-slate-200'}`}>
                {probYes}%
              </span>
              <span className="text-xs text-slate-400 font-medium">positive</span>
            </div>
          </div>
        </div>

        {/* Dual Probability Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Term Deposit (Yes): {probYes}%
            </span>
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              Decline (No): {probNo}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden flex p-0.5 border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${probYes}%` }}
            ></div>
            <div 
              className="bg-slate-700/60 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${probNo}%` }}
            ></div>
          </div>
        </div>

        {/* Client Profile Pill Summary */}
        {result.customer_summary && (
          <div className="mt-5 pt-4 border-t border-slate-800/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Job / Role</span>
              <span className="font-semibold text-slate-200">{result.customer_summary.job}</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Current Balance</span>
              <span className="font-semibold text-slate-200">{result.customer_summary.balance}</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Call Duration</span>
              <span className="font-semibold text-slate-200">{result.customer_summary.contact_duration}</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Campaign Touches</span>
              <span className="font-semibold text-slate-200">{result.customer_summary.campaign_calls} contact(s)</span>
            </div>
          </div>
        )}
      </div>

      {/* Top Positive & Negative Contributing Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive Drivers */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center space-x-2 text-emerald-400 mb-3.5">
            <TrendingUp className="w-4 h-4" />
            <h4 className="text-sm font-bold uppercase tracking-wider">Top Conversion Drivers</h4>
          </div>
          <div className="space-y-2.5">
            {result.top_positive_factors && result.top_positive_factors.length > 0 ? (
              result.top_positive_factors.map((factor, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-slate-900/70 p-2.5 rounded-xl border border-emerald-500/20">
                  <span className="text-slate-200 font-medium truncate mr-2">{factor.label}</span>
                  <span className="text-emerald-400 font-mono font-semibold whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +{factor.impact}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">No major positive drivers detected</p>
            )}
          </div>
        </div>

        {/* Negative Drivers */}
        <div className="glass-panel rounded-2xl p-5 border border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center space-x-2 text-rose-400 mb-3.5">
            <TrendingDown className="w-4 h-4" />
            <h4 className="text-sm font-bold uppercase tracking-wider">Top Resistance Factors</h4>
          </div>
          <div className="space-y-2.5">
            {result.top_negative_factors && result.top_negative_factors.length > 0 ? (
              result.top_negative_factors.map((factor, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-slate-900/70 p-2.5 rounded-xl border border-rose-500/20">
                  <span className="text-slate-200 font-medium truncate mr-2">{factor.label}</span>
                  <span className="text-rose-400 font-mono font-semibold whitespace-nowrap bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {factor.impact}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">No major negative resistance factors</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Marketing Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400 mb-4">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              AI Marketing Action Plan & Advisory
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {result.recommendations.map((rec, i) => {
              const borderColors = {
                success: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
                warning: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
                caution: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
                action: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-300',
                info: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
              };
              return (
                <div 
                  key={i} 
                  className={`p-3.5 rounded-xl border ${borderColors[rec.type] || borderColors.info}`}
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="font-semibold text-xs text-white block mt-0.5">
                      {rec.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 pl-0.5 leading-relaxed">
                    {rec.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
