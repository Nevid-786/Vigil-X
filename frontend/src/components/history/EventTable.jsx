import React from 'react';
import { ShieldAlert, UserCheck, CreditCard, MessageSquare, Radio, Clock, CheckCircle2 } from 'lucide-react';

export const EventTable = ({ events, total, page, totalPages, onPageChange, loading }) => {
  const getBadgeClass = (type) => {
    switch (type) {
      case 'SOS':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'CHECKIN':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UNKNOWN_CARD':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MESSAGE':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-black text-slate-900">Historical Telemetry Log Entries</h3>
        <span className="text-xs font-extrabold text-indigo-600 font-mono">Total {total} events</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
              <th className="pb-3 px-3">Type</th>
              <th className="pb-3 px-3">Pole ID</th>
              <th className="pb-3 px-3">Mesh Route</th>
              <th className="pb-3 px-3">Raw Payload</th>
              <th className="pb-3 px-3">Resolved Person</th>
              <th className="pb-3 px-3">Received At</th>
              <th className="pb-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                  Loading event telemetry logs...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                  No historical records match your filter criteria.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getBadgeClass(
                        e.type
                      )}`}
                    >
                      {e.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">Pole {e.poleId}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                    {e.path || e.poleId} → {e.destination || 'MAIN'}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-800 font-bold">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {e.rawData}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">
                    {e.resolvedName || <span className="text-slate-400 font-normal italic">—</span>}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                    <div className="flex items-center gap-1 font-semibold">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {new Date(e.receivedAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {e.type === 'SOS' ? (
                      e.acknowledgedAt ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> Acknowledged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                          Unacknowledged
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">Logged</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-slate-600 font-mono">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
