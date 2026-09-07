import React, { useState } from 'react';
import { Settings, ShieldCheck, User, Bell, Database, Key } from 'lucide-react';
import { authService } from '../services/api';

export const SettingsPage: React.FC = () => {
  const currentUser = authService.getCurrentUser() || {
    name: 'Super Admin',
    email: 'admin@supplysync.com',
    role_name: 'ADMIN'
  };

  const [activeRole, setActiveRole] = useState(currentUser.role_name);

  const handleRoleSwitch = (role: any) => {
    setActiveRole(role);
    const updated = { ...currentUser, role_name: role };
    localStorage.setItem('supplysync_user', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Platform Settings & RBAC Role Controller</h1>
        <p className="text-xs text-slate-500 mt-1">Manage system preferences, API credentials, and simulate user roles</p>
      </div>

      {/* Role Switcher Demo Box */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold font-heading">Role-Based Access Control (RBAC) Switcher</h2>
        </div>
        <p className="text-xs text-slate-300 mb-6">
          Switch roles to instantly test permission boundaries across Products, Warehouses, Suppliers, POs & Stock Transfers:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {['ADMIN', 'WAREHOUSE_MANAGER', 'PROCUREMENT_MANAGER', 'SALES_MANAGER', 'VIEWER'].map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                activeRole === role
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-glow-cyan'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* System Config Cards */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <Database className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">MySQL Database Driver Connection</h3>
            <p className="text-xs text-slate-500">Connected to supplysync_db on localhost:3306 (Auto-fallback enabled)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <Key className="w-6 h-6 text-cyan-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">JWT Token Security & Bcrypt Hashing</h3>
            <p className="text-xs text-slate-500">HS256 Encryption active with 7-day token expiration</p>
          </div>
        </div>
      </div>
    </div>
  );
};
