import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Plus, Warehouse, Package, CheckCircle2, ArrowRight } from 'lucide-react';
import { TransferVisualizer } from '../components/orders/TransferVisualizer';
import { transferService, warehouseService, productService } from '../services/api';
import { InventoryTransfer, Warehouse as WarehouseType, Product } from '../types';

export const TransfersPage: React.FC = () => {
  const [transfers, setTransfers] = useState<InventoryTransfer[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<InventoryTransfer | null>(null);

  const [formData, setFormData] = useState({
    source_warehouse_id: 1,
    destination_warehouse_id: 3,
    product_id: 3,
    quantity: 50,
    notes: 'Urgent stock balancing transfer'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [tData, wData, pData] = await Promise.all([
        transferService.getTransfers(),
        warehouseService.getWarehouses(),
        productService.getProducts()
      ]);
      setTransfers(tData);
      setWarehouses(wData);
      setProducts(pData);
      if (tData.length > 0) {
        setSelectedTransfer(tData[0]);
      }
    } catch (err) {
      console.error('Error fetching transfers:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newTrf = await transferService.createTransfer(formData);
      setSelectedTransfer(newTrf);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed. Check source stock balance.');
    } finally {
      setLoading(false);
    }
  };

  const selectedProd = products.find(p => p.product_id === formData.product_id);
  const srcWh = warehouses.find(w => w.warehouse_id === formData.source_warehouse_id);
  const destWh = warehouses.find(w => w.warehouse_id === formData.destination_warehouse_id);

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Inter-Warehouse Inventory Transfers</h1>
        <p className="text-xs text-slate-500 mt-1">Re-balance inventory across facilities with ACID transaction safety</p>
      </div>

      {/* Transfer Creation Form + Live Animated Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft">
          <h3 className="text-lg font-bold font-heading text-slate-900 mb-2 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-indigo-600" /> Initiate Stock Transfer
          </h3>
          <p className="text-xs text-slate-500 mb-6">Atomic stock shift from source to destination</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source Warehouse (FROM)</label>
              <select
                value={formData.source_warehouse_id}
                onChange={(e) => setFormData({ ...formData, source_warehouse_id: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold"
              >
                {warehouses.map(w => (
                  <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination Warehouse (TO)</label>
              <select
                value={formData.destination_warehouse_id}
                onChange={(e) => setFormData({ ...formData, destination_warehouse_id: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold"
              >
                {warehouses.map(w => (
                  <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Item</label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
              >
                {products.map(p => (
                  <option key={p.product_id} value={p.product_id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transfer Quantity</label>
              <input
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-glow-indigo transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Processing Transfer...' : 'Execute Stock Transfer'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Live Visualizer Card */}
        <div className="lg:col-span-7">
          <TransferVisualizer
            sourceWarehouse={srcWh?.name || 'Pune Hub'}
            destinationWarehouse={destWh?.name || 'Mumbai Transit'}
            productName={selectedProd?.name || 'Product Item'}
            quantity={formData.quantity}
            status={selectedTransfer?.status || 'COMPLETED'}
          />

          {/* Transfers History Stream */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft mt-6">
            <h4 className="text-sm font-bold text-slate-900 font-heading mb-4">Transfer Audit History</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {transfers.map((t) => (
                <div
                  key={t.transfer_id}
                  onClick={() => setSelectedTransfer(t)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedTransfer?.transfer_id === t.transfer_id
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900">{t.transfer_number}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t.source_warehouse_name} → {t.destination_warehouse_name}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
