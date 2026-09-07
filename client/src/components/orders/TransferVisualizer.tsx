import React from 'react';
import { motion } from 'framer-motion';
import { Warehouse, ArrowRight, Package, CheckCircle2, Truck } from 'lucide-react';

interface TransferVisualizerProps {
  sourceWarehouse: string;
  destinationWarehouse: string;
  productName: string;
  quantity: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}

export const TransferVisualizer: React.FC<TransferVisualizerProps> = ({
  sourceWarehouse,
  destinationWarehouse,
  productName,
  quantity,
  status
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl my-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
            Real-Time Logistics Transfer Visualizer
          </span>
          <h4 className="text-base font-bold font-heading text-white">Stock Rebalancing Trajectory</h4>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
          status === 'IN_TRANSIT' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
          'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>
          {status}
        </span>
      </div>

      {/* Trajectory Stage */}
      <div className="relative py-8 px-4 flex items-center justify-between">
        {/* Connection Track */}
        <div className="absolute top-1/2 left-16 right-16 h-1.5 -translate-y-1/2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: status === 'COMPLETED' ? '100%' : status === 'IN_TRANSIT' ? '60%' : '20%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Animated Cargo Package moving on track */}
        {status === 'IN_TRANSIT' && (
          <motion.div
            className="absolute top-1/2 left-20 right-20 -translate-y-1/2 pointer-events-none"
            animate={{ x: [0, 220] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          >
            <div className="bg-cyan-400 text-slate-950 p-2 rounded-lg shadow-glow-cyan text-xs font-extrabold flex items-center gap-1.5 w-fit">
              <Package className="w-4 h-4" /> {quantity}x {productName}
            </div>
          </motion.div>
        )}

        {/* Source Node */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500 text-indigo-400 flex items-center justify-center shadow-lg">
            <Warehouse className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">SOURCE</span>
          <span className="text-xs font-bold text-white max-w-[130px] text-center mt-0.5">{sourceWarehouse}</span>
        </div>

        {/* Center Transit Badge */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center">
            <Truck className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300 mt-1">{quantity} Units In Transit</span>
        </div>

        {/* Destination Node */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border border-emerald-500 text-emerald-400 flex items-center justify-center shadow-lg">
            <Warehouse className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">DESTINATION</span>
          <span className="text-xs font-bold text-white max-w-[130px] text-center mt-0.5">{destinationWarehouse}</span>
        </div>
      </div>
    </div>
  );
};
