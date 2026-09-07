import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Plus, Users, Calendar, CheckCircle2, Truck } from 'lucide-react';
import { orderService, warehouseService, productService } from '../services/api';
import { SalesOrder, Warehouse, Product } from '../types';

export const SalesOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [newSo, setNewSo] = useState({
    customer_id: 1,
    warehouse_id: 1,
    product_id: 1,
    quantity: 20
  });

  const fetchData = async () => {
    try {
      const [oData, wData, pData] = await Promise.all([
        orderService.getSalesOrders(),
        warehouseService.getWarehouses(),
        productService.getProducts()
      ]);
      setOrders(oData);
      setWarehouses(wData);
      setProducts(pData);
    } catch (err) {
      console.error('Error fetching SOs:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await orderService.createSalesOrder(newSo);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Error creating SO:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Sales Order Fulfillment</h1>
          <p className="text-xs text-slate-500 mt-1">Manage outbound enterprise customer orders</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-semibold hover:shadow-glow-indigo transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Sales Order
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((so) => (
          <motion.div
            key={so.so_id}
            whileHover={{ y: -2 }}
            className="glass-card rounded-2xl p-6 border border-slate-200 shadow-card-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold shrink-0">
                <Receipt className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm text-slate-900">{so.order_number}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    so.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {so.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 mt-1">
                  Customer: <strong className="text-slate-800">{so.customer_name}</strong> • Fulfilled from: <strong className="text-slate-800">{so.warehouse_name}</strong>
                </div>

                <div className="text-[11px] text-slate-400 mt-2 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Order Date: {so.order_date}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-1">
              <span className="text-xs text-slate-400 font-medium">Order Total</span>
              <span className="text-xl font-extrabold text-slate-900 font-heading">
                ₹{so.total_amount.toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New SO Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Create Sales Order</h3>
            <p className="text-xs text-slate-500 mb-6">Dispatched stock from warehouse</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fulfillment Warehouse</label>
                <select
                  value={newSo.warehouse_id}
                  onChange={(e) => setNewSo({ ...newSo, warehouse_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                >
                  {warehouses.map(w => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Item</label>
                <select
                  value={newSo.product_id}
                  onChange={(e) => setNewSo({ ...newSo, product_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                >
                  {products.map(p => (
                    <option key={p.product_id} value={p.product_id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={newSo.quantity}
                  onChange={(e) => setNewSo({ ...newSo, quantity: Number(e.target.value) })}
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
                  Process Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
