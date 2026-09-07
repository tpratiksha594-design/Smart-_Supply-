import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Warehouse as WhIcon, Plus, MapPin, Layers, Box, DollarSign, Activity } from 'lucide-react';
import { WarehouseZoneGrid } from '../components/inventory/WarehouseZoneGrid';
import { warehouseService } from '../services/api';
import { Warehouse } from '../types';

export const WarehousesPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newWh, setNewWh] = useState({ name: '', code: '', location: '', total_capacity: 20000 });

  const fetchData = async () => {
    try {
      const data = await warehouseService.getWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await warehouseService.createWarehouse(newWh);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Error creating warehouse:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Warehouse Intelligence & Logistics Hubs</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time facility utilization, zone breakdown, and inventory valuation</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-semibold hover:shadow-glow-indigo transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Warehouse Hub
        </button>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((w) => (
          <motion.div
            key={w.warehouse_id}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-6 border border-slate-200 shadow-card-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono font-extrabold bg-slate-900 text-cyan-400 px-2.5 py-0.5 rounded-md">
                  {w.code}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  w.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {w.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-heading leading-tight">{w.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {w.location}
              </p>

              {/* Utilization Bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Capacity Utilization</span>
                  <span className={w.current_utilization_pct >= 85 ? 'text-coral' : 'text-indigo-600'}>
                    {w.current_utilization_pct}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      w.current_utilization_pct >= 85 ? 'bg-gradient-to-r from-coral to-rose-600' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
                    }`}
                    style={{ width: `${w.current_utilization_pct}%` }}
                  />
                </div>
              </div>

              {/* Facility Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Inventory Valuation</span>
                  <span className="font-extrabold text-slate-900">₹{w.inventory_value.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Stored Units</span>
                  <span className="font-extrabold text-indigo-600">{(w.stored_units || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Isometric Facility Storage Zone Grid */}
      <WarehouseZoneGrid />

      {/* Add Warehouse Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Register Warehouse Facility</h3>
            <p className="text-xs text-slate-500 mb-6">Add a new operational logistics facility</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Warehouse Name</label>
                <input
                  type="text"
                  required
                  value={newWh.name}
                  onChange={(e) => setNewWh({ ...newWh, name: e.target.value })}
                  placeholder="e.g. Hyderabad Transit Hub"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Facility Code</label>
                <input
                  type="text"
                  required
                  value={newWh.code}
                  onChange={(e) => setNewWh({ ...newWh, code: e.target.value })}
                  placeholder="e.g. WH-HYD-06"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location Address</label>
                <input
                  type="text"
                  required
                  value={newWh.location}
                  onChange={(e) => setNewWh({ ...newWh, location: e.target.value })}
                  placeholder="e.g. Gachibowli Logistics Park, HYD"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Capacity (Units)</label>
                <input
                  type="number"
                  value={newWh.total_capacity}
                  onChange={(e) => setNewWh({ ...newWh, total_capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Register Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
