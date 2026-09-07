import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Box, AlertTriangle, Truck, Warehouse, RefreshCw, Sparkles, Activity, Layers } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { SupplyChain3DMap } from '../components/3d/SupplyChain3DMap';
import { AIInsightCard } from '../components/common/AIInsightCard';
import { analyticsService, aiService, warehouseService } from '../services/api';
import { DashboardSummary, AIInsight, Warehouse as WarehouseType } from '../types';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, insRes, whRes] = await Promise.all([
        analyticsService.getDashboardSummary(),
        aiService.getAIInsights(),
        warehouseService.getWarehouses()
      ]);
      setSummary(sumRes);
      setInsights(insRes);
      setWarehouses(whRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      {/* Top Light Spectrum Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-slate-900 shadow-aurora-hover border border-indigo-200/80 bg-gradient-to-r from-indigo-100/90 via-purple-100/80 to-cyan-100/90 backdrop-blur-xl">
        {/* Animated Light Flares */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-cyan-400/20 rounded-full filter blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl animate-float pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-indigo-700 border border-indigo-200 text-xs font-extrabold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Live Aurora Spectrum Active
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-slate-900">
              Good Morning, Admin 👋
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl font-medium">
              Here is what is happening across your multi-tier supply chain network today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-extrabold border border-indigo-200 shadow-md transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh State
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Inventory Value"
          value={`₹${(summary?.totalInventoryValue || 2458900).toLocaleString('en-IN')}`}
          changeText="+12.5%"
          isPositive={true}
          icon={DollarSign}
          accentColor="indigo"
          subtitle="Valuation across 5 hubs"
        />

        <StatCard
          title="Total Products"
          value={(summary?.totalProducts || 1248).toLocaleString()}
          changeText="+8.2%"
          isPositive={true}
          icon={Box}
          accentColor="cyan"
          subtitle="Active catalog SKUs"
        />

        <StatCard
          title="Low Stock Items"
          value={summary?.lowStockCount || 18}
          changeText="Needs Attention"
          isPositive={false}
          icon={AlertTriangle}
          accentColor="coral"
          subtitle="Below reorder threshold"
        />

        <StatCard
          title="Active Suppliers"
          value={summary?.activeSuppliers || 42}
          changeText="+5 This Month"
          isPositive={true}
          icon={Truck}
          accentColor="emerald"
          subtitle="98.4% On-time delivery"
        />
      </div>

      {/* 3D Supply Chain Process Map */}
      <SupplyChain3DMap />

      {/* AI Insights & Warehouse Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <AIInsightCard insights={insights} onRefresh={fetchData} isLoading={loading} />
        </div>

        {/* Warehouse Capacities Card */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-indigo-100 shadow-aurora-card flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-indigo-600 animate-float" /> Multi-Tier Facility Utilization
              </h3>
              <a href="/warehouses" className="text-xs font-extrabold text-indigo-600 hover:underline">View All Hubs</a>
            </div>

            <div className="space-y-4 my-2">
              {warehouses.map((wh) => (
                <div key={wh.warehouse_id} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 hover:bg-white hover:shadow-aurora-hover transition-all">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                    <span className="truncate max-w-[200px] font-heading">{wh.name}</span>
                    <span className={`font-extrabold ${wh.current_utilization_pct >= 85 ? 'text-rose-600' : 'text-indigo-600'}`}>
                      {wh.current_utilization_pct}%
                    </span>
                  </div>

                  <div className="w-full bg-indigo-100 rounded-full h-2 mt-2 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full ${
                        wh.current_utilization_pct >= 85
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600'
                          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500'
                      }`}
                      style={{ width: `${wh.current_utilization_pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-semibold">
                    <span>Stored: {wh.stored_units || (wh.total_capacity * wh.current_utilization_pct / 100).toFixed(0)} units</span>
                    <span>Cap: {wh.total_capacity.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
