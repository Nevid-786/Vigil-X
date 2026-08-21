import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  History,
  Activity,
  Settings,
  RadioTower,
} from 'lucide-react';

export const Sidebar = ({ sidebarOpen, setSidebarOpen, unresolvedSOSCount }) => {
  const navItems = [
    { label: 'Live Dashboard', path: '/', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Analytics Hub', path: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'UID Card Directory', path: '/cards', icon: <CreditCard className="h-4 w-4" /> },
    { label: 'Event Audit Log', path: '/history', icon: <History className="h-4 w-4" /> },
    { label: 'System Health', path: '/system', icon: <Activity className="h-4 w-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <aside
      className={`
      fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 transition-transform duration-200 ease-in-out shadow-sm flex flex-col justify-between shrink-0
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}
    >
      <nav className="space-y-1.5">
        <div className="text-[10px] font-black uppercase text-slate-400 px-3 pb-1 tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `
              flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all
              ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-200 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.path === '/' && unresolvedSOSCount > 0 && (
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white animate-pulse shadow-sm">
                {unresolvedSOSCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Network Hardware Details Card */}
      <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-white p-3.5 text-[11px] text-slate-600 shadow-sm space-y-1.5">
        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
          <RadioTower className="h-4 w-4 text-indigo-600" />
          Hardware Mesh Nodes
        </div>
        <div>
          LoRa Frequency: <span className="font-mono text-purple-700 font-bold">433 MHz</span>
        </div>
        <div>
          Sender Nodes: <span className="text-slate-800 font-bold">Pole A, Pole B</span>
        </div>
        <div>
          Receiver Node: <span className="text-emerald-700 font-bold">MAIN</span>
        </div>
      </div>
    </aside>
  );
};
