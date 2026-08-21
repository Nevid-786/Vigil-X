import React from 'react';
import {
  ShieldAlert,
  UserCheck,
  CreditCard,
  MessageSquare,
  Clock,
  Radio,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveEventFeed = ({ events }) => {
  const navigate = useNavigate();

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SOS':
        return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      case 'CHECKIN':
        return <UserCheck className="h-4 w-4 text-emerald-600" />;
      case 'UNKNOWN_CARD':
        return <CreditCard className="h-4 w-4 text-amber-600" />;
      case 'MESSAGE':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return <Radio className="h-4 w-4 text-slate-600" />;
    }
  };

  const handleMapCard = (rawUid) => {
    navigate('/cards', { state: { prefillUid: rawUid } });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            Live Telemetry Feed
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Real-time incoming LoRa network events from Pole receiver
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
          {events.length} events buffered
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[520px]">
        {events.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs font-semibold">
            No events received yet. Click "Trigger Test SOS" in the top bar to dispatch a simulated payload.
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event._id || `${event.poleId}-${event.receivedAt}`}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                  {getTypeIcon(event.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getBadgeClass(
                        event.type
                      )}`}
                    >
                      {event.type}
                    </span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      Pole {event.poleId}
                    </span>
                    {event.path && (
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        {event.path} → MAIN
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-900 pt-0.5">
                    {event.type === 'CHECKIN' && (
                      <span className="text-emerald-800 font-black">
                        Check-in: {event.resolvedName}
                      </span>
                    )}
                    {event.type === 'UNKNOWN_CARD' && (
                      <span className="text-amber-800">
                        Unmapped NFC Card: <code className="font-mono text-slate-900 bg-amber-50 px-1.5 py-0.5 rounded">{event.rawData}</code>
                      </span>
                    )}
                    {event.type === 'SOS' && (
                      <span className="text-rose-600 font-black">
                        🚨 SOS Button Pressed at Pole {event.poleId}!
                      </span>
                    )}
                    {event.type === 'MESSAGE' && (
                      <span className="text-slate-800">
                        Message: "{event.rawData}"
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                {event.type === 'UNKNOWN_CARD' && (
                  <button
                    onClick={() => handleMapCard(event.rawData)}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Map UID
                  </button>
                )}
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono font-semibold">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {new Date(event.receivedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
