import React, { useState } from 'react';
import { Settings, Key, Volume2, ShieldCheck, Database, Server } from 'lucide-react';
import { playAlertChime } from '../utils/audio';

export const SettingsPage = ({ audioEnabled, setAudioEnabled }) => {
  const [testingSound, setTestingSound] = useState(false);

  const testAudioChime = () => {
    setTestingSound(true);
    playAlertChime();
    setTimeout(() => setTestingSound(false), 500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
            <Settings className="h-6 w-6" />
          </div>
          System Settings & Operational Credentials
        </h2>
        <p className="text-xs text-slate-500 font-semibold pt-1">
          Configure local alert audio chimes, device API key credentials, and server connection parameters
        </p>
      </div>

      {/* Audio Preferences */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Audio Emergency Synthesizer</h3>
              <p className="text-xs text-slate-500 font-semibold">Synthesize loud alert chime on incoming SOS emergency events</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-700 font-bold">Test audio synthesizer tone</span>
          <button
            onClick={testAudioChime}
            disabled={testingSound}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
          >
            {testingSound ? 'Playing Chime...' : '🔊 Test Chime Tone'}
          </button>
        </div>
      </div>

      {/* Security Credentials Reference */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700 border border-purple-200">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Device API Secret Key (`x-api-key`)</h3>
            <p className="text-xs text-slate-500 font-semibold">
              Shared secret header required by n8n HTTP Request node when forwarding `POST /api/events`
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="text-slate-400 text-[10px] uppercase tracking-wider font-extrabold">
            n8n HTTP Request Header Configuration:
          </div>
          <div className="text-indigo-400 font-bold">Header Name: x-api-key</div>
          <div className="text-amber-300 font-bold">
            Header Value: nexttrack_device_secret_key_9988
          </div>
        </div>
      </div>

      {/* Endpoint Info */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Production Server Endpoints</h3>
            <p className="text-xs text-slate-500 font-semibold">MERN Stack Backend & Database Target</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-600">Backend API URL</span>
            <code className="font-mono text-indigo-700 font-extrabold">http://127.0.0.1:4000/api</code>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-600">Database Cluster</span>
            <code className="font-mono text-emerald-700 font-extrabold">MongoDB Atlas</code>
          </div>
        </div>
      </div>
    </div>
  );
};
