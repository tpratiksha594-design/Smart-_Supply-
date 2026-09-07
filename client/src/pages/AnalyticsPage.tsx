import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { analyticsService } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [salesData, setSalesData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sData, iData] = await Promise.all([
          analyticsService.getSalesAnalytics(),
          analyticsService.getInventoryAnalytics()
        ]);
        setSalesData(sData);
        setInventoryData(iData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'];

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Business Intelligence & Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time revenue trends, category breakdown, and warehouse performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Monthly Revenue</span>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">₹18,45,000</h3>
          <span className="inline-block mt-2 font-bold text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            +18.4% YoY Growth
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Fulfilled Orders</span>
          <h3 className="text-3xl font-extrabold text-indigo-600 mt-1 font-heading">1,248</h3>
          <span className="inline-block mt-2 font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            98.6% On-Time Delivery
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Average Order Value</span>
          <h3 className="text-3xl font-extrabold text-cyan-600 mt-1 font-heading">₹14,784</h3>
          <span className="inline-block mt-2 font-bold text-xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">
            +5.2% vs Previous Quarter
          </span>
        </div>
      </div>

      {/* Sales Revenue Trend Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" /> Monthly Revenue Trend (2026)
            </h3>
            <p className="text-xs text-slate-500">Gross revenue generated across fulfilled enterprise sales orders</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData?.monthlySalesTrend || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Category Breakdown & Warehouse Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Pie */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft">
          <h3 className="text-base font-bold font-heading text-slate-900 mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-cyan-600" /> Category Revenue Distribution
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData?.categoryBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="category"
                >
                  {(salesData?.categoryBreakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => `₹${Number(val).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft">
          <h3 className="text-base font-bold font-heading text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" /> Warehouse Capacity Utilization (%)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData?.warehouseUtilization || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} domain={[0, 100]} />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Utilization']} />
                <Bar dataKey="utilization" fill="#06B6D4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
