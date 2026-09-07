import React from 'react';
import { Sparkles, ArrowRight, AlertOctagon, TrendingUp, Cpu, RefreshCw } from 'lucide-react';
import { AIInsight } from '../../types';

interface AIInsightCardProps {
  insights: AIInsight[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insights, onRefresh, isLoading }) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              SupplySync Intelligence
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Rule-Based Demo Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">Automated supply chain risk detection & operational optimization</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Insight Cards Stream */}
      <div className="space-y-3 relative z-10 max-h-96 overflow-y-auto pr-1">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getSeverityStyle(insight.severity)}`}>
                  {insight.severity} PRIORITY
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {insight.category}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{insight.timestamp}</span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug">{insight.title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{insight.description}</p>

            <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-cyan-300 font-medium flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5" /> Action: {insight.recommended_action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
