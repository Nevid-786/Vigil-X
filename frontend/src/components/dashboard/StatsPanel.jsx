import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart2, ShieldAlert, UserCheck, MessageSquare, CreditCard } from 'lucide-react';

export const StatsPanel = ({ events }) => {
  const counts = {
    SOS: 0,
    CHECKIN: 0,
    UNKNOWN_CARD: 0,
    MESSAGE: 0,
  };

  events.forEach((e) => {
    if (counts[e.type] !== undefined) {
      counts[e.type] += 1;
    }
  });

  const chartData = [
    { name: 'SOS Alerts', count: counts.SOS, color: '#f43f5e' },
    { name: 'Check-ins', count: counts.CHECKIN, color: '#10b981' },
    { name: 'Unmapped Cards', count: counts.UNKNOWN_CARD, color: '#f59e0b' },
    { name: 'Portal Messages', count: counts.MESSAGE, color: '#3b82f6' },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-600" />
              Event Volume Distribution
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Category ratio of active buffer events
            </p>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl">
            <div className="text-[10px] font-extrabold uppercase text-rose-600 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> SOS
            </div>
            <div className="text-2xl font-black text-rose-700 mt-1">{counts.SOS}</div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <div className="text-[10px] font-extrabold uppercase text-emerald-700 flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> Check-ins
            </div>
            <div className="text-2xl font-black text-emerald-800 mt-1">{counts.CHECKIN}</div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl">
            <div className="text-[10px] font-extrabold uppercase text-amber-800 flex items-center gap-1">
              <CreditCard className="h-3 w-3" /> Unknown UIDs
            </div>
            <div className="text-2xl font-black text-amber-800 mt-1">{counts.UNKNOWN_CARD}</div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl">
            <div className="text-[10px] font-extrabold uppercase text-blue-700 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> Messages
            </div>
            <div className="text-2xl font-black text-blue-800 mt-1">{counts.MESSAGE}</div>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} stroke="#94a3b8" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fontWeight: 700 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#0f172a',
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
