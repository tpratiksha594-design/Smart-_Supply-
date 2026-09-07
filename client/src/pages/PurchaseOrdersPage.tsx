import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Calendar, DollarSign, Truck, CheckCircle2, Clock, PackageCheck } from 'lucide-react';
import { orderService, supplierService, warehouseService, productService } from '../services/api';
import { PurchaseOrder, Supplier, Warehouse, Product } from '../types';

export const PurchaseOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [newPo, setNewPo] = useState({
    supplier_id: 1,
    warehouse_id: 1,
    product_id: 1,
    quantity: 50,
    unit_cost: 780
  });

  const fetchData = async () => {
    try {
      const [oData, sData, wData, pData] = await Promise.all([
        orderService.getPurchaseOrders(),
        supplierService.getSuppliers(),
        warehouseService.getWarehouses(),
        productService.getProducts()
      ]);
      setOrders(oData);
      setSuppliers(sData);
      setWarehouses(wData);
      setProducts(pData);
    } catch (err) {
      console.error('Error fetching POs:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await orderService.createPurchaseOrder(newPo);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Error creating PO:', err);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await orderService.updatePOStatus(id, status);
      fetchData();
    } catch (err) {
      console.error('Error updating PO status:', err);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Purchase Order Management</h1>
          <p className="text-xs text-slate-500 mt-1">Track reordering timelines from suppliers to warehouse delivery</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-semibold hover:shadow-glow-indigo transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Issue Purchase Order
        </button>
      </div>

      {/* PO Timeline Cards List */}
      <div className="space-y-4">
        {orders.map((po) => (
          <motion.div
            key={po.po_id}
            whileHover={{ y: -2 }}
            className="glass-card rounded-2xl p-6 border border-slate-200 shadow-card-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                <ShoppingCart className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm text-slate-900">{po.po_number}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(po.status)}`}>
                    {po.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 mt-1 space-x-2">
                  <span>Vendor: <strong className="text-slate-800">{po.supplier_name}</strong></span>
                  <span>•</span>
                  <span>Destination: <strong className="text-slate-800">{po.warehouse_name}</strong></span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Order Date: {po.order_date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Expected: {po.expected_delivery_date}</span>
                </div>
              </div>
            </div>

            {/* Right Amount & Quick Status Controller */}
            <div className="flex flex-col md:items-end gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <span className="text-xs text-slate-400 font-medium">Total Amount</span>
              <span className="text-xl font-extrabold text-slate-900 font-heading">
                ₹{po.total_amount.toLocaleString()}
              </span>

              {/* Status Selector */}
              <select
                value={po.status}
                onChange={(e) => handleStatusChange(po.po_id, e.target.value)}
                className="mt-1 px-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-700 focus:outline-none"
              >
                <option value="PENDING">🟡 PENDING</option>
                <option value="APPROVED">🔵 APPROVED</option>
                <option value="SHIPPED">🟣 SHIPPED</option>
                <option value="DELIVERED">🟢 DELIVERED (Update Stock)</option>
                <option value="CANCELLED">🔴 CANCELLED</option>
              </select>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New PO Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Issue Purchase Order</h3>
            <p className="text-xs text-slate-500 mb-6">Create purchase request to supplier</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Supplier</label>
                <select
                  value={newPo.supplier_id}
                  onChange={(e) => setNewPo({ ...newPo, supplier_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                >
                  {suppliers.map(s => (
                    <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Warehouse</label>
                <select
                  value={newPo.warehouse_id}
                  onChange={(e) => setNewPo({ ...newPo, warehouse_id: Number(e.target.value) })}
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
                  value={newPo.product_id}
                  onChange={(e) => {
                    const pid = Number(e.target.value);
                    const prod = products.find(p => p.product_id === pid);
                    setNewPo({ ...newPo, product_id: pid, unit_cost: prod?.cost_price || 500 });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                >
                  {products.map(p => (
                    <option key={p.product_id} value={p.product_id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newPo.quantity}
                    onChange={(e) => setNewPo({ ...newPo, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={newPo.unit_cost}
                    onChange={(e) => setNewPo({ ...newPo, unit_cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
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
                  Issue Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
