import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Radio,
  RefreshCw,
  Server,
  Zap,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { systemService } from '../api/services';

export const SystemHealthPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadHealth = async () => {
    try {
      setLoading(true);
      const res = await systemService.getHealth();
      setHealth(res.data);
    } catch (err) {
      console.error('Failed to load system health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (loading && !health) {
    return (
      <div className="flex h-64 items-center justify-center text-indigo-600 font-bold text-sm">
        <Zap className="h-5 w-5 animate-spin mr-2" /> Polling System Health...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            System Health & Server Diagnostics
          </h2>
          <p className="text-xs text-slate-500 font-semibold pt-1">
            Real-time process memory consumption, MongoDB cluster status, and Socket.io active sockets
          </p>
        </div>

        <button
          onClick={loadHealth}
          className="flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Status
        </button>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Badge */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-emerald-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
              System Core Status
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 capitalize">{health?.status || 'Operational'}</div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ALL SERVICES HEALTHY
          </span>
        </div>

        {/* Server Uptime */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-indigo-700 tracking-wider">
              Server Uptime
            </span>
            <Server className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{formatUptime(health?.uptimeSec)}</div>
          <p className="text-[11px] text-slate-500 font-semibold">Continuous Node.js execution</p>
        </div>

        {/* Database Status */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-amber-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider">
              MongoDB Database
            </span>
            <Database className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800">{health?.database?.status}</div>
          <p className="text-[11px] text-slate-600 font-mono font-bold truncate">
            {health?.database?.host}
          </p>
        </div>

        {/* Socket.io Clients */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-purple-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-purple-700 tracking-wider">
              Socket.io WebSockets
            </span>
            <Radio className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {health?.sockets?.activeClients || 0} <span className="text-xs font-bold text-slate-500">clients</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">Active dashboard socket feeds</p>
        </div>
      </div>

      {/* Memory Breakdown & Environment Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <HardDrive className="h-5 w-5 text-indigo-600" /> Process RAM Memory Footprint
          </div>
          <div className="space-y-3 pt-2 text-xs font-semibold">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Resident Set Size (RSS)</span>
              <span className="font-mono font-black text-indigo-700">{health?.memory?.rssMb} MB</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Heap Total Allocated</span>
              <span className="font-mono font-black text-indigo-700">{health?.memory?.heapTotalMb} MB</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Heap Used</span>
              <span className="font-mono font-black text-emerald-700">{health?.memory?.heapUsedMb} MB</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Cpu className="h-5 w-5 text-purple-600" /> Host Environment Specs
          </div>
          <div className="space-y-3 pt-2 text-xs font-semibold">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Node.js Runtime</span>
              <span className="font-mono font-black text-purple-700">{health?.environment?.nodeVersion}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Host OS Platform</span>
              <span className="font-mono font-black text-purple-700">{health?.environment?.platform} ({health?.environment?.arch})</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Last Diagnostics Poll</span>
              <span className="font-mono font-extrabold text-slate-800">
                {new Date(health?.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
