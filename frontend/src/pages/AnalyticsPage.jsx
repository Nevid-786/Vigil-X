import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  ShieldAlert,
  UserCheck,
  Clock,
  Radio,
  Award,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { analyticsService } from '../api/services';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getAnalytics();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-indigo-600 font-bold text-sm">
        <Zap className="h-5 w-5 animate-spin mr-2" /> Aggregating Pole Network Telemetry...
      </div>
    );
  }

  const summary = data?.summary || {};
  const timeline = data?.timeline || [];
  const poleDist = data?.poleDistribution || [];
  const leaderboard = data?.leaderboard || [];
  const hourly = data?.hourlyDistribution || [];

  const pieData = [
    { name: 'SOS Emergencies', value: summary.counts?.SOS || 0, color: '#f43f5e' },
    { name: 'Check-ins', value: summary.counts?.CHECKIN || 0, color: '#10b981' },
    { name: 'Unmapped UIDs', value: summary.counts?.UNKNOWN_CARD || 0, color: '#f59e0b' },
    { name: 'Captive Messages', value: summary.counts?.MESSAGE || 0, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
              <BarChart3 className="h-6 w-6" />
            </div>
            Network Telemetry & Analytics Hub
          </h2>
          <p className="text-xs text-slate-500 font-semibold pt-1">
            Real-time statistical breakdown of LoRa transmission volume, response speed, and attendance check-ins
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <TrendingUp className="h-4 w-4" /> Refresh Metrics
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-indigo-100 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-indigo-700 tracking-wider">
              Total Logged Transmissions
            </span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Radio className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{summary.totalEvents || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">
            {summary.recent7DaysTotal || 0} recorded in last 7 days
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-rose-200 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-rose-700 tracking-wider">
              SOS Emergency Triggers
            </span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2">{summary.counts?.SOS || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">Critical safety alerts</p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-amber-200 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider">
              Avg Emergency ACK Time
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-800 mt-2">
            {summary.avgAckTimeSec || 0} <span className="text-sm font-bold text-slate-500">sec</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">Speed to acknowledge SOS</p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-emerald-200 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
              Resolved NFC Check-ins
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-800 mt-2">{summary.counts?.CHECKIN || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">Mapped UID attendance logs</p>
        </div>
      </div>

      {/* Main Charts Grid: Velocity Timeline & Event Category Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Timeline Area Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">7-Day Event Velocity Timeline</h3>
              <p className="text-xs text-slate-500 font-semibold">Daily LoRa transmission volume breakdown</p>
            </div>
          </div>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCheckin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis stroke="#64748b" allowDecimals={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#0f172a',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="SOS" stroke="#f43f5e" fillOpacity={1} fill="url(#colorSos)" />
                <Area type="monotone" dataKey="CHECKIN" stroke="#10b981" fillOpacity={1} fill="url(#colorCheckin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Type Ratio Pie Chart */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Event Category Ratio</h3>
            <p className="text-xs text-slate-500 font-semibold">Proportion of incoming payload types</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#0f172a',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Pole Distribution, Leaderboard & Hourly Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Pole Node Distribution BarChart */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Pole Node Activity Ratio</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={poleDist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="poleId" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis stroke="#64748b" allowDecimals={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    color: '#0f172a',
                  }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Leaderboard */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" /> Top NFC Check-ins
            </h3>
          </div>

          <div className="space-y-2.5">
            {leaderboard.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-8 font-semibold">
                No check-in activity recorded yet.
              </div>
            ) : (
              leaderboard.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-950'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-indigo-700">
                    {item.count} taps
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 24-Hour Peak Activity Distribution */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Peak Hours (00:00 - 23:00)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 9, fontWeight: 700 }} />
                <YAxis stroke="#64748b" allowDecimals={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    color: '#0f172a',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
