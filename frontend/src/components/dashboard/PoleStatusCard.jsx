import React from 'react';
import { Radio, Activity, Clock, BarChart3 } from 'lucide-react';

export const PoleStatusCard = ({ pole }) => {
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Never';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const timeAgo = formatTimeAgo(pole.lastSeenAt);

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-slate-200/90 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Pole Node {pole.poleId}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {pole.label || `Hardware Node ${pole.poleId}`}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Active Node
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-100">
          <div className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" /> Last Event
          </div>
          <div className="text-xs font-black text-indigo-700 mt-1 font-mono">{timeAgo}</div>
        </div>

        <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-100">
          <div className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
            <BarChart3 className="h-3 w-3 text-slate-400" /> Total Activity
          </div>
          <div className="text-xs font-black text-slate-900 mt-1">{pole.eventCount || 0} events</div>
        </div>
      </div>
    </div>
  );
};
