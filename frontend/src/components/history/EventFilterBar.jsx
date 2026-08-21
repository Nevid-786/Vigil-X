import React from 'react';
import { Filter, Calendar, Radio, Tag } from 'lucide-react';

export const EventFilterBar = ({ filters, setFilters, onReset }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  return (
    <div className="glass-panel rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider shrink-0">
        <Filter className="h-4 w-4 text-indigo-600" />
        Filter Telemetry History
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
        {/* Type Filter */}
        <div className="relative">
          <Tag className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="">All Event Types</option>
            <option value="SOS">🚨 SOS Emergencies</option>
            <option value="CHECKIN">✅ Check-ins</option>
            <option value="UNKNOWN_CARD">❓ Unmapped UIDs</option>
            <option value="MESSAGE">💬 Captive Messages</option>
          </select>
        </div>

        {/* Pole Filter */}
        <div className="relative">
          <Radio className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={filters.poleId}
            onChange={(e) => handleChange('poleId', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="">All Pole Nodes</option>
            <option value="A">Pole Node A</option>
            <option value="B">Pole Node B</option>
          </select>
        </div>

        {/* Date From Filter */}
        <div className="relative">
          <Calendar className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="date"
            value={filters.from}
            onChange={(e) => handleChange('from', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {(filters.type || filters.poleId || filters.from) && (
        <button
          onClick={onReset}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3.5 py-2.5 rounded-2xl border border-rose-100 transition-colors shrink-0 cursor-pointer"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
