import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Search, Filter, LayoutGrid, Table as TableIcon, Plus,
  AlertTriangle, ShieldCheck, Warehouse, SlidersHorizontal, Edit3
} from 'lucide-react';
import { inventoryService, warehouseService, productService } from '../services/api';
import { WarehouseInventory, Warehouse as WarehouseType } from '../types';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<WarehouseInventory[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Stock Adjust Modal State
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustData, setAdjustData] = useState({ warehouse_id: 1, product_id: 1, qty: 10, notes: '' });

  const fetchData = async () => {
    try {
      const [invData, whData] = await Promise.all([
        inventoryService.getInventory(selectedWarehouse, selectedCategory, selectedStatus),
        warehouseService.getWarehouses()
      ]);
      setInventory(invData);
      setWarehouses(whData);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedWarehouse, selectedCategory, selectedStatus]);

  const filteredInventory = inventory.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.product_name?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q) ||
        item.category_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inventoryService.adjustStock(
        adjustData.warehouse_id,
        adjustData.product_id,
        adjustData.qty,
        adjustData.notes
      );
      setShowAdjustModal(false);
      fetchData();
    } catch (err) {
      console.error('Stock adjustment error:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Inventory Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor live stock levels and reorder limits across all facilities</p>
        </div>

        <button
          onClick={() => setShowAdjustModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-semibold hover:shadow-glow-indigo transition-all flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" /> Adjust Stock Level
        </button>
      </div>

      {/* Filter & View Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card-soft flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium focus:border-indigo-600 focus:outline-none"
          >
            <option value="ALL">All Warehouses</option>
            {warehouses.map(w => (
              <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium focus:border-indigo-600 focus:outline-none"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="HEALTHY">🟢 Healthy Stock</option>
            <option value="LOW_STOCK">🟡 Low Stock</option>
            <option value="CRITICAL">🔴 Critical Stock</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Inventory Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => {
            const reorderLevel = item.reorder_level || 10;
            const healthPct = Math.min(100, Math.round((item.quantity / (reorderLevel * 4)) * 100));
            const statusStyle =
              item.stock_status === 'CRITICAL'
                ? { bg: 'bg-rose-100 text-rose-800 border-rose-200', dot: '🔴 Critical' }
                : item.stock_status === 'LOW_STOCK'
                ? { bg: 'bg-amber-100 text-amber-800 border-amber-200', dot: '🟡 Low Stock' }
                : { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: '🟢 Healthy' };

            return (
              <motion.div
                key={`${item.warehouse_id}-${item.product_id}`}
                whileHover={{ y: -3 }}
                className="glass-card rounded-2xl p-5 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.sku}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusStyle.bg}`}>
                      {statusStyle.dot}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-heading leading-tight">{item.product_name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{item.warehouse_name} • {item.zone_location}</p>

                  {/* Stock Quantities breakdown */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Total</span>
                      <span className="text-sm font-extrabold text-slate-900">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Available</span>
                      <span className="text-sm font-extrabold text-emerald-600">{item.available_quantity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Reserved</span>
                      <span className="text-sm font-extrabold text-amber-600">{item.reserved_quantity}</span>
                    </div>
                  </div>

                  {/* Stock Health Animated Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Stock Health</span>
                      <span>{healthPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.stock_status === 'CRITICAL'
                            ? 'bg-rose-500'
                            : item.stock_status === 'LOW_STOCK'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${healthPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Facility & Zone</th>
                  <th className="p-4 text-center">Total Stock</th>
                  <th className="p-4 text-center">Available</th>
                  <th className="p-4 text-center">Reserved</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item) => (
                  <tr key={`${item.warehouse_id}-${item.product_id}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{item.product_name}</td>
                    <td className="p-4 font-mono font-semibold text-slate-500">{item.sku}</td>
                    <td className="p-4 text-slate-600">{item.warehouse_name} ({item.zone_location})</td>
                    <td className="p-4 text-center font-extrabold text-slate-900">{item.quantity}</td>
                    <td className="p-4 text-center font-extrabold text-emerald-600">{item.available_quantity}</td>
                    <td className="p-4 text-center font-extrabold text-amber-600">{item.reserved_quantity}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.stock_status === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                        item.stock_status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.stock_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Adjust Warehouse Stock</h3>
            <p className="text-xs text-slate-500 mb-6">Manually increment or decrement inventory quantity</p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Facility</label>
                <select
                  value={adjustData.warehouse_id}
                  onChange={(e) => setAdjustData({ ...adjustData, warehouse_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                >
                  {warehouses.map(w => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product ID</label>
                <input
                  type="number"
                  value={adjustData.product_id}
                  onChange={(e) => setAdjustData({ ...adjustData, product_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adjustment Quantity (+/-)</label>
                <input
                  type="number"
                  value={adjustData.qty}
                  onChange={(e) => setAdjustData({ ...adjustData, qty: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adjustment Notes</label>
                <textarea
                  value={adjustData.notes}
                  onChange={(e) => setAdjustData({ ...adjustData, notes: e.target.value })}
                  placeholder="e.g. Annual stock audit discrepancy check"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
