import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, Star, Award, ShieldCheck, Mail, Phone, MapPin, Trophy } from 'lucide-react';
import { supplierService } from '../services/api';
import { Supplier } from '../types';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [leaderboard, setLeaderboard] = useState<Supplier[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [newSup, setNewSup] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    rating: 4.8,
    on_time_delivery_rate: 96,
    quality_score: 95
  });

  const fetchData = async () => {
    try {
      const [sData, lData] = await Promise.all([
        supplierService.getSuppliers(),
        supplierService.getLeaderboard()
      ]);
      setSuppliers(sData);
      setLeaderboard(lData);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supplierService.createSupplier(newSup);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Error creating supplier:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Supplier Performance & Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor supplier fulfillment metrics, ratings and lead-time scores</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-semibold hover:shadow-glow-indigo transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Vendor Partner
        </button>
      </div>

      {/* TOP SUPPLIER LEADERBOARD */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Trophy className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading">Top Supplier Leaderboard</h2>
            <p className="text-xs text-slate-400">Ranked by automated Health Score calculation (Rating + Delivery + Quality)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboard.slice(0, 3).map((sup, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            return (
              <div key={sup.supplier_id} className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-2xl">{medal}</span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">Health Score</span>
                    <span className="text-xl font-extrabold text-cyan-400 font-heading">{sup.health_score}/100</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-3 font-heading leading-snug">{sup.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{sup.contact_person}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-700 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">On-Time Rate</span>
                    <span className="font-bold text-emerald-400">{sup.on_time_delivery_rate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Quality Score</span>
                    <span className="font-bold text-indigo-400">{sup.quality_score}/100</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <motion.div
            key={s.supplier_id}
            whileHover={{ y: -3 }}
            className="glass-card rounded-2xl p-6 border border-slate-200 shadow-card-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="flex items-center gap-1 font-bold text-xs text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {s.rating}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  s.status === 'PREFERRED' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {s.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-heading leading-tight">{s.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{s.contact_person}</p>

              <div className="space-y-1.5 mt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate">{s.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">On-Time Delivery</span>
                  <span className="font-extrabold text-emerald-600">{s.on_time_delivery_rate}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Quality Rating</span>
                  <span className="font-extrabold text-indigo-600">{s.quality_score}/100</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Register Vendor Supplier</h3>
            <p className="text-xs text-slate-500 mb-6">Add a new component supplier</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newSup.name}
                  onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                  placeholder="e.g. Apex Industrial Motors"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={newSup.contact_person}
                  onChange={(e) => setNewSup({ ...newSup, contact_person: e.target.value })}
                  placeholder="e.g. Sanjay Deshmukh"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newSup.email}
                  onChange={(e) => setNewSup({ ...newSup, email: e.target.value })}
                  placeholder="orders@apex.in"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newSup.phone}
                  onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                  placeholder="+91 98200 11223"
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
