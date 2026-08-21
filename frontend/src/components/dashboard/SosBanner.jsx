import React, { useEffect } from 'react';
import { ShieldAlert, CheckCircle, Navigation, Clock, Radio } from 'lucide-react';
import { eventsService } from '../../api/services';

export const SosBanner = ({ activeSos, onAcknowledge, audioEnabled }) => {
  useEffect(() => {
    if (!activeSos || !audioEnabled) return;

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio chime play blocked', e);
    }
  }, [activeSos, audioEnabled]);

  if (!activeSos) return null;

  const handleAck = async () => {
    try {
      await eventsService.acknowledge(activeSos._id);
      if (onAcknowledge) onAcknowledge(activeSos._id);
    } catch (err) {
      console.error('Failed to acknowledge SOS:', err);
    }
  };

  return (
    <div className="mb-6 rounded-3xl border-2 border-rose-500 bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 p-6 shadow-2xl emergency-card-glow text-white backdrop-blur-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Banner Info */}
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/20 p-3.5 animate-pulse shadow-inner border border-white/30 shrink-0">
            <ShieldAlert className="h-9 w-9 text-white fill-white/20" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="rounded-full bg-white text-rose-600 px-3 py-0.5 text-xs font-black uppercase tracking-wider shadow-sm">
                🚨 ACTIVE SOS EMERGENCY
              </span>
              <span className="text-xs text-rose-100 font-mono font-bold bg-black/30 px-2.5 py-0.5 rounded-full border border-white/20">
                POLE NODE {activeSos.poleId}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
              Emergency Button Pressed at Pole {activeSos.poleId}
            </h2>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-rose-100 pt-1">
              <div className="flex items-center gap-1.5 font-mono">
                <Navigation className="h-4 w-4 text-amber-300" />
                <span>LoRa Route: <strong className="text-amber-200">{activeSos.path || activeSos.poleId} → MAIN</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Radio className="h-4 w-4 text-rose-200" />
                <span>Payload: <strong className="text-white">{activeSos.rawData}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-rose-200" />
                <span>Received: <strong>{new Date(activeSos.receivedAt).toLocaleTimeString()}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Acknowledge Button */}
        <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
          <button
            onClick={handleAck}
            className="flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 text-xs sm:text-sm transition-all shadow-xl active:scale-95 cursor-pointer"
          >
            <CheckCircle className="h-5 w-5 fill-slate-950 text-amber-400" />
            Acknowledge Emergency
          </button>
        </div>
      </div>
    </div>
  );
};
