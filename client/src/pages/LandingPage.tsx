import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, ShieldCheck, Zap, TrendingUp, ArrowRight,
  Warehouse, Truck, BarChart3, ArrowLeftRight, AlertTriangle, Layers, CheckCircle2
} from 'lucide-react';
import { Hero3DCanvas } from '../components/3d/Hero3DCanvas';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Inventory Accuracy', value: '98.6%', color: 'text-purple-400' },
    { label: 'Lower Stockouts', value: '24%', color: 'text-cyan-400' },
    { label: 'Active Suppliers', value: '42', color: 'text-emerald-400' },
    { label: 'Inventory Value Managed', value: '₹2.4Cr', color: 'text-amber-400' }
  ];

  const features = [
    {
      title: 'Smart Inventory Intelligence',
      desc: 'Real-time stock tracking across all warehouses with automated reorder level triggers.',
      icon: Box,
      gradient: 'from-purple-500 via-indigo-600 to-cyan-400'
    },
    {
      title: 'Warehouse Facility Analytics',
      desc: 'Isometric zone mapping (Zone A to E) with capacity utilization monitoring.',
      icon: Warehouse,
      gradient: 'from-cyan-400 to-indigo-600'
    },
    {
      title: 'Supplier Leaderboard & Scores',
      desc: 'Automated supplier health scoring based on on-time delivery & quality scores.',
      icon: Truck,
      gradient: 'from-emerald-400 to-teal-600'
    },
    {
      title: 'Business Intelligence Suite',
      desc: 'Interactive sales trends, category distribution, and revenue growth analytics.',
      icon: BarChart3,
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      title: 'Inter-Facility Stock Transfers',
      desc: 'Atomic transaction stock balancing with animated trajectory visualizer.',
      icon: ArrowLeftRight,
      gradient: 'from-amber-400 to-rose-600'
    },
    {
      title: 'SupplySync Intelligence (AI)',
      desc: 'Automated rule engine generating conversational supply chain recommendations.',
      icon: Zap,
      gradient: 'from-purple-600 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090714] text-white">
      {/* Header Bar */}
      <header className="h-20 px-6 lg:px-16 flex items-center justify-between border-b border-purple-500/30 bg-[#0F0B24]/90 backdrop-blur-xl fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-cyan-400 p-0.5 shadow-glow-violet">
            <div className="w-full h-full bg-[#090714] rounded-[10px] flex items-center justify-center text-white">
              <Box className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-xl text-white tracking-wide">
            SUPPLY<span className="text-cyan-400">SYNC</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-extrabold shadow-glow-violet hover:shadow-glow-cyan transition-all flex items-center gap-2"
          >
            Explore Platform <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Hero Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 text-cyan-300 border border-purple-500/40 text-xs font-semibold mb-6 shadow-glow-violet">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" /> Cyber-Intelligent Supply Chain SaaS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading leading-tight tracking-tight text-white">
              Smart Supply Chain. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
                Intelligent Decisions.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg mt-6 leading-relaxed max-w-xl">
              Gain complete visibility into your inventory, suppliers, warehouses, and supply chain operations through intelligent real-time data & 3D process visualization.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-glow-violet hover:shadow-glow-cyan transition-all flex items-center gap-2"
              >
                Explore Platform <ArrowRight className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 rounded-xl bg-purple-950/60 text-white font-bold text-sm border border-purple-500/40 hover:bg-purple-900/60 transition-colors shadow-lg"
              >
                View Live Demo
              </button>
            </div>
          </div>

          {/* Right 3D Scene */}
          <div>
            <Hero3DCanvas />
          </div>
        </div>
      </section>

      {/* HERO METRICS SECTION */}
      <section className="py-12 bg-[#0E0922] border-y border-purple-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {metrics.map((m, idx) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-4"
              >
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${m.color} font-heading tracking-tight`}>
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300 mt-2">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Enterprise-Grade Supply Chain Capabilities
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Designed for high-growth logistics, manufacturing, and distribution operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 border border-purple-500/30 shadow-cyber-card relative group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading">{f.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#06040F] text-slate-400 py-12 border-t border-purple-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Box className="w-6 h-6 text-cyan-400" />
            <span className="font-heading font-extrabold text-lg text-white">SUPPLYSYNC</span>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 SupplySync Cyber Logistics Intelligence Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
