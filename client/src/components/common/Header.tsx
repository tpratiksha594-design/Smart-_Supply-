import React, { useState } from 'react';
import { Search, Bell, Menu, Plus, AlertTriangle, CheckCircle, PackageCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Low Stock Alert Triggered',
      desc: 'Online Double Conversion UPS 10kVA reached critical level (2 units remaining).',
      time: '2 minutes ago',
      type: 'CRITICAL',
      icon: ShieldAlert,
      color: 'text-rose-700 bg-rose-50 border-rose-200'
    },
    {
      id: 2,
      title: 'Purchase Order Dispatched',
      desc: 'PO-2026-1002 shipped from Global Logistics & Components.',
      time: '10 minutes ago',
      type: 'INFO',
      icon: PackageCheck,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      id: 3,
      title: 'Inventory Transfer Completed',
      desc: 'Mumbai Transit Yard received 50 SSD units from Pune Hub.',
      time: '1 hour ago',
      type: 'SUCCESS',
      icon: CheckCircle,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-indigo-100 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-700 hover:bg-indigo-50 lg:hidden"
        >
          <Menu className="w-5 h-5 text-indigo-600" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, SKUs, warehouses, suppliers..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-indigo-50/60 border border-indigo-200/60 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Animated Live Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Live Mesh Active
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => window.location.href = '/purchase-orders'}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white text-xs font-extrabold shadow-glow-indigo hover:shadow-glow-cyan transition-all"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>

        {/* Low Stock Counter Badge */}
        <a
          href="/alerts"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors shadow-xs"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">Alerts:</span>
          <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-extrabold">
            3
          </span>
        </a>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-700 hover:bg-indigo-50 relative transition-colors"
          >
            <Bell className="w-5 h-5 text-indigo-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-aurora-hover border border-indigo-100 p-4 z-50 text-slate-900"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                  <h4 className="font-bold text-slate-900 text-sm font-heading">Notifications Center</h4>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    3 New
                  </span>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} className={`p-3 rounded-xl border ${n.color} flex gap-3 items-start`}>
                        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                          <span className="text-[9px] text-slate-400 font-medium block mt-1">{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
