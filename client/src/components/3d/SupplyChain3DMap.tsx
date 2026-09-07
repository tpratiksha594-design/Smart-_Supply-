import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Factory, Warehouse, Truck, Users, ArrowRight, ShieldCheck, Activity, PackageCheck } from 'lucide-react';

interface NodeData {
  id: string;
  name: string;
  type: 'Supplier' | 'Warehouse' | 'Distribution' | 'Customer';
  location: string;
  status: 'OPERATIONAL' | 'HIGH_VOLUME' | 'OPTIMAL';
  activeOrders: number;
  inventoryVal: string;
}

export const SupplyChain3DMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>({
    id: 'wh-1',
    name: 'Pune Central Logistics Hub',
    type: 'Warehouse',
    location: 'Pune, Maharashtra',
    status: 'OPERATIONAL',
    activeOrders: 18,
    inventoryVal: '₹1,24,50,000'
  });

  const nodes: (NodeData & { icon: any; color: string; position: string })[] = [
    {
      id: 'sup-1',
      name: 'TechSupply India & Quantum',
      type: 'Supplier',
      location: 'Bengaluru & Tokyo',
      status: 'OPTIMAL',
      activeOrders: 12,
      inventoryVal: '₹85,00,000',
      icon: Factory,
      color: 'from-blue-500 to-indigo-600',
      position: 'left-8 top-1/2 -translate-y-1/2'
    },
    {
      id: 'wh-1',
      name: 'Pune Central Logistics Hub',
      type: 'Warehouse',
      location: 'Pune, Maharashtra',
      status: 'OPERATIONAL',
      activeOrders: 18,
      inventoryVal: '₹1,24,50,000',
      icon: Warehouse,
      color: 'from-indigo-600 to-purple-600',
      position: 'left-1/3 top-1/2 -translate-y-1/2'
    },
    {
      id: 'dist-1',
      name: 'Mumbai Sea Port Transit Yard',
      type: 'Distribution',
      location: 'Navi Mumbai',
      status: 'HIGH_VOLUME',
      activeOrders: 24,
      inventoryVal: '₹85,00,000',
      icon: Truck,
      color: 'from-cyan-500 to-teal-600',
      position: 'right-1/3 top-1/2 -translate-y-1/2'
    },
    {
      id: 'cust-1',
      name: 'Reliance & Tata Enterprise Clients',
      type: 'Customer',
      location: 'Mumbai, NCR & Bengaluru',
      status: 'OPTIMAL',
      activeOrders: 42,
      inventoryVal: 'Fulfillment Active',
      icon: Users,
      color: 'from-emerald-500 to-green-600',
      position: 'right-8 top-1/2 -translate-y-1/2'
    }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <h3 className="text-xl font-bold font-heading">Real-Time 3D Supply Chain Process Map</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Live tracking of package flows: Supplier → Warehouse → Distribution → Customer</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> 4 Operational Nodes
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <PackageCheck className="w-4 h-4" /> 98.6% Flow Efficiency
          </span>
        </div>
      </div>

      {/* Interactive Node Flow Diagram Canvas */}
      <div className="relative min-h-[320px] flex items-center justify-between px-4 py-8 overflow-x-auto my-4 scrollbar-none">
        
        {/* Animated Connection Lines */}
        <div className="absolute top-1/2 left-20 right-20 h-1 -translate-y-1/2 bg-slate-800 pointer-events-none rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 w-1/3 rounded-full"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          />
        </div>

        {/* Floating Moving Package Particles */}
        <motion.div
          className="absolute top-[46%] left-[24%] bg-indigo-400 text-slate-950 p-1.5 rounded-md shadow-glow-indigo text-[10px] font-extrabold z-20 flex items-center gap-1 pointer-events-none"
          animate={{ x: [0, 180] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        >
          📦 MCU-PRO-X1 (100u)
        </motion.div>

        <motion.div
          className="absolute top-[52%] left-[54%] bg-cyan-400 text-slate-950 p-1.5 rounded-md shadow-glow-cyan text-[10px] font-extrabold z-20 flex items-center gap-1 pointer-events-none"
          animate={{ x: [0, 180] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
        >
          📦 BAT-LFP-48V (20u)
        </motion.div>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = selectedNode?.id === node.id;
          return (
            <motion.div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              whileHover={{ scale: 1.08 }}
              className={`relative z-10 cursor-pointer flex flex-col items-center group`}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${node.color} p-0.5 shadow-xl transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-cyan-400 ring-offset-4 ring-offset-slate-900 scale-105' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center text-white">
                  <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="mt-3 text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">{node.type}</span>
                <h4 className="text-xs font-bold text-slate-200 mt-0.5 max-w-[130px] line-clamp-1">{node.name}</h4>
              </div>

              {/* Status Badge */}
              <span className="mt-1.5 text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {node.location}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Node Inspector Floating Footer */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Selected Process Node</div>
              <div className="text-sm font-bold text-white">{selectedNode.name} ({selectedNode.type})</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Active Movements</span>
              <span className="font-bold text-indigo-400">{selectedNode.activeOrders} Shipments</span>
            </div>

            <div className="bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Inventory Value</span>
              <span className="font-bold text-emerald-400">{selectedNode.inventoryVal}</span>
            </div>

            <div className="bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px]">Node Status</span>
              <span className="font-bold text-cyan-400">{selectedNode.status}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
