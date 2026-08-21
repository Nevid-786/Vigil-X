import React, { useState } from 'react';
import {
  Radio,
  Zap,
  Volume2,
  VolumeX,
  LogOut,
  Menu,
  X,
  Activity,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventsService } from '../../api/services';

export const Navbar = ({ sidebarOpen, setSidebarOpen, audioEnabled, setAudioEnabled }) => {
  const { user, logout } = useAuth();
  const [triggering, setTriggering] = useState(false);
  const [toast, setToast] = useState(null);

  const handleTriggerDemo = async (type = 'SOS') => {
    try {
      setTriggering(true);
      const res = await eventsService.triggerDemo({ poleId: 'A', type, rawData: type });
      setToast(`Simulated ${type} event dispatched to Pole ${res.data.event?.poleId || 'A'}`);
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setToast(`Demo trigger failed: ${err.message}`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-100 bg-white/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3 shadow-sm shadow-slate-200/50">
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed top-4 right-6 z-[9999] max-w-md rounded-2xl border-2 border-rose-500 bg-white p-4 shadow-2xl animate-bounce flex items-center gap-3 text-slate-900">
          <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-md">
            <Zap className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-rose-600 block tracking-wider">
              Network Event Broadcasted
            </span>
            <span className="text-xs font-bold text-slate-800">{toast}</span>
          </div>
        </div>
      )}

      {/* Perfectly Centered Navbar Content */}
      <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto">
        {/* Left Brand Details */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-2.5 shadow-md shadow-indigo-500/25">
              <Radio className="h-5 w-5 text-white fill-white/20 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                NextTrack <span className="text-[10px] font-extrabold bg-indigo-100 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">COMMAND CENTER</span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                ESP32 LoRa Mesh Event Router & Attendance Center
              </p>
            </div>
          </div>
        </div>

        {/* Center Live Badges */}
        <div className="hidden md:flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>n8n Router: <strong className="text-emerald-700 font-extrabold">ACTIVE</strong></span>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-800 px-3.5 py-1.5 rounded-full shadow-sm">
            <Activity className="h-3.5 w-3.5 text-indigo-600" />
            <span>LoRa 433MHz: <strong className="text-indigo-700 font-extrabold">ONLINE MESH</strong></span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Demo Trigger SOS Button */}
          <button
            onClick={() => handleTriggerDemo('SOS')}
            disabled={triggering}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black px-4 py-2 text-xs shadow-md shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <ShieldAlert className="h-4 w-4" />
            {triggering ? 'Simulating...' : '🚨 Trigger Test SOS'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            {audioEnabled ? <Volume2 className="h-4 w-4 text-emerald-600" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
          </button>

          {/* User Profile & Logout */}
          <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 pl-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-right">
              <div className="text-xs font-extrabold text-slate-900">{user?.email || 'Admin'}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">{user?.role || 'SYSTEM COMMANDER'}</div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
