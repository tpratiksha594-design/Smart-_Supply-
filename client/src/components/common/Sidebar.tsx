import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Layers, Warehouse, Truck,
  ShoppingCart, Receipt, ArrowLeftRight, TrendingUp, AlertTriangle,
  Settings, LogOut, Box, ShieldCheck, Sparkles
} from 'lucide-react';
import { authService } from '../../services/api';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser() || {
    name: 'Super Admin',
    email: 'admin@supplysync.com',
    role_name: 'ADMIN'
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Inventory', icon: Package, path: '/inventory' },
    { label: 'Products', icon: Tag, path: '/products' },
    { label: 'Categories', icon: Layers, path: '/categories' },
    { label: 'Warehouses', icon: Warehouse, path: '/warehouses' },
    { label: 'Suppliers', icon: Truck, path: '/suppliers' },
    { label: 'Purchase Orders', icon: ShoppingCart, path: '/purchase-orders' },
    { label: 'Sales Orders', icon: Receipt, path: '/sales-orders' },
    { label: 'Transfers', icon: ArrowLeftRight, path: '/transfers' },
    { label: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { label: 'Alerts', icon: AlertTriangle, path: '/alerts', badge: '3' },
    { label: 'Settings', icon: Settings, path: '/settings' }
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl text-slate-800 flex flex-col justify-between border-r border-indigo-100 shadow-aurora-card transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-indigo-100">
            <NavLink to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 p-0.5 shadow-glow-indigo">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-indigo-600">
                  <Box className="w-5 h-5 group-hover:rotate-12 transition-transform text-indigo-600" />
                </div>
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-slate-900 tracking-wide">
                  SUPPLY<span className="text-indigo-600">SYNC</span>
                </span>
                <span className="block text-[9px] font-extrabold text-cyan-600 uppercase tracking-widest -mt-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 animate-pulse inline" /> AURORA SPECTRUM
                </span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white shadow-glow-indigo font-extrabold scale-[1.02]'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-indigo-100 bg-slate-50/80">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-indigo-100 shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-indigo-600 font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 inline" /> {currentUser.role_name}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
