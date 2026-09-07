import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, ShoppingCart, CheckCircle2, Eye } from 'lucide-react';
import { alertService, orderService } from '../services/api';
import { LowStockAlert } from '../types';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const fetchData = async () => {
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcknowledge = async (id: number) => {
    try {
      await alertService.acknowledgeAlert(id);
      fetchData();
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  const handleQuickPO = async (alertItem: LowStockAlert) => {
    try {
      await orderService.createPurchaseOrder({
        supplier_id: 1,
        warehouse_id: alertItem.warehouse_id,
        product_id: alertItem.product_id,
        quantity: alertItem.reorder_level * 3,
        unit_cost: 500
      });
      alertService.acknowledgeAlert(alertItem.alert_id);
      window.alert('Purchase Order successfully generated for ' + alertItem.product_name);
      fetchData();
    } catch (err) {
      console.error('Error generating quick PO:', err);
    }
  };

  const filteredAlerts = alerts.filter(a => filterSeverity === 'ALL' || a.severity === filterSeverity);

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Intelligent Alert Center</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time database triggers detecting low stock and inventory risks</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterSeverity === 'ALL' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilterSeverity('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterSeverity === 'CRITICAL' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-slate-600'}`}
          >
            🔴 Critical
          </button>
          <button
            onClick={() => setFilterSeverity('WARNING')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterSeverity === 'WARNING' ? 'bg-amber-500 text-white shadow-xs font-bold' : 'text-slate-600'}`}
          >
            🟡 Warning
          </button>
        </div>
      </div>

      {/* Alert Stream */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          return (
            <motion.div
              key={alert.alert_id}
              whileHover={{ y: -2 }}
              className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-card-soft ${
                isCritical ? 'bg-rose-50/40 border-rose-200' : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                  isCritical ? 'bg-rose-500 text-white shadow-md' : 'bg-amber-500 text-white shadow-md'
                }`}>
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-extrabold text-base text-slate-900">{alert.product_name}</span>
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-cyan-400 px-2 py-0.5 rounded-md">
                      {alert.sku}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isCritical ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    Facility: <strong className="text-slate-800">{alert.warehouse_name}</strong>
                  </p>

                  <div className="flex items-center gap-4 text-xs mt-3 font-semibold">
                    <span className="text-rose-700">Current Stock: <strong>{alert.current_stock}</strong></span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">Reorder Threshold: <strong>{alert.reorder_level}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-200">
                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleAcknowledge(alert.alert_id)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}

                <button
                  onClick={() => handleQuickPO(alert)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-glow-indigo transition-all flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" /> Create Purchase Order
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
