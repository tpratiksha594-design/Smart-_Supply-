import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  changeText?: string;
  isPositive?: boolean;
  icon: any;
  accentColor: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'coral';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  changeText,
  isPositive = true,
  icon: Icon,
  accentColor,
  subtitle
}) => {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50/80',
      iconBg: 'bg-gradient-to-br from-indigo-600 to-purple-600',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      glow: 'shadow-glow-indigo'
    },
    cyan: {
      bg: 'bg-cyan-50/80',
      iconBg: 'bg-gradient-to-br from-cyan-600 to-teal-500',
      text: 'text-cyan-700',
      border: 'border-cyan-100',
      glow: 'shadow-glow-cyan'
    },
    emerald: {
      bg: 'bg-emerald-50/80',
      iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-600',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      glow: 'shadow-md'
    },
    amber: {
      bg: 'bg-amber-50/80',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      text: 'text-amber-700',
      border: 'border-amber-100',
      glow: 'shadow-md'
    },
    coral: {
      bg: 'bg-rose-50/80',
      iconBg: 'bg-gradient-to-br from-rose-600 to-pink-600',
      text: 'text-rose-700',
      border: 'border-rose-100',
      glow: 'shadow-md'
    }
  }[accentColor];

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      className={`glass-card rounded-2xl p-5 border ${colorStyles.border} relative overflow-hidden text-slate-900 shadow-aurora-card`}
    >
      {/* Top Accent Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorStyles.iconBg}`} />

      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{title}</span>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1 font-heading tracking-tight">
            {value}
          </h3>
        </div>

        <div className={`w-12 h-12 rounded-2xl ${colorStyles.iconBg} text-white flex items-center justify-center ${colorStyles.glow} shrink-0 animate-float`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        {changeText && (
          <div className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-0.5 font-extrabold px-2.5 py-0.5 rounded-full ${
                isPositive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {changeText}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">vs last month</span>
          </div>
        )}

        {subtitle && <span className="text-slate-500 font-bold text-[11px]">{subtitle}</span>}
      </div>
    </motion.div>
  );
};
