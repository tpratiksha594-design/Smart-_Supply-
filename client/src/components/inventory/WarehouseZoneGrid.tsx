import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Box, Cpu, Wrench, ShieldAlert, CheckCircle } from 'lucide-react';

interface Zone {
  zone_name: string;
  type: string;
  occupied_pct: number;
  items_count: number;
  category: string;
  icon: any;
  color: string;
}

export const WarehouseZoneGrid: React.FC = () => {
  const zones: Zone[] = [
    { zone_name: 'Zone A', type: 'Electronics & Microchips', occupied_pct: 85, items_count: 4, category: 'Semiconductors', icon: Cpu, color: 'from-blue-500 to-indigo-600' },
    { zone_name: 'Zone B', type: 'Industrial Motors & Valves', occupied_pct: 72, items_count: 4, category: 'Hardware', icon: Wrench, color: 'from-indigo-600 to-purple-600' },
    { zone_name: 'Zone C', type: 'Peripherals & Docking', occupied_pct: 64, items_count: 4, category: 'Accessories', icon: Box, color: 'from-purple-600 to-pink-600' },
    { zone_name: 'Zone D', type: 'Packaging & Bulk Storage', occupied_pct: 90, items_count: 4, category: 'Logistics', icon: Layers, color: 'from-cyan-500 to-teal-600' },
    { zone_name: 'Zone E', type: 'Batteries & High Voltage UPS', occupied_pct: 45, items_count: 4, category: 'Power', icon: ShieldAlert, color: 'from-emerald-500 to-green-600' }
  ];

  const [activeZone, setActiveZone] = useState<Zone>(zones[0]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card-soft">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-800 font-heading">Isometric Warehouse Storage Facility Layout</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">Interactive zone utilization and active category mapping across Pune Hub</p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          5 Operational Zones Active
        </div>
      </div>

      {/* Grid of Storage Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-4">
        {zones.map((zone) => {
          const Icon = zone.icon;
          const isSelected = activeZone.zone_name === zone.zone_name;
          return (
            <motion.div
              key={zone.zone_name}
              onClick={() => setActiveZone(zone)}
              whileHover={{ scale: 1.03 }}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${zone.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  zone.occupied_pct >= 85 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {zone.occupied_pct}%
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-800">{zone.zone_name}</h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{zone.type}</p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${zone.color}`}
                  style={{ width: `${zone.occupied_pct}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Zone Inspector Footer */}
      <div className="mt-6 bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs text-slate-400">Inspecting Facility Zone</div>
            <div className="text-sm font-bold text-white">{activeZone.zone_name}: {activeZone.type}</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Zone Capacity</span>
            <span className="font-bold text-indigo-400">{activeZone.occupied_pct}% Occupied</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">SKU Category</span>
            <span className="font-bold text-cyan-400">{activeZone.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Safety Protocol</span>
            <span className="font-bold text-emerald-400">Class 1 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
