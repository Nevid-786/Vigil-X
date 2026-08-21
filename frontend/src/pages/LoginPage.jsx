import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Lock, Mail, ShieldAlert, ArrowRight, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check NODE_ENV / VITE_NODE_ENV to distinguish local/docker dev from production
  const nodeEnv = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development';
  const isDevelopment = nodeEnv === 'development' || !import.meta.env.PROD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDevCredentials = () => {
    setEmail('admin@nexttrack.io');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-900">
      {/* Glow ambient background elements */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/40 relative z-10">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3.5 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-rose-500 text-white shadow-xl shadow-indigo-500/30 mb-2">
            <Radio className="h-8 w-8 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            NextTrack <span className="text-indigo-600">Command</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
            ESP32 LoRa Pole Network Monitoring & Security Command Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">
              Operator Email
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter operator email"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 hover:from-indigo-500 hover:to-rose-400 text-white text-xs font-black uppercase tracking-wider shadow-xl shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? 'Authenticating...' : 'Access Command Center'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Development & Local Docker Credentials Hint Banner (Hidden in Production) */}
        {isDevelopment && (
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[11px] text-slate-500 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Terminal className="h-3.5 w-3.5 text-indigo-600" />
                <strong className="text-indigo-700">Development / Local Docker Mode</strong>
              </span>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                NODE_ENV={nodeEnv}
              </span>
            </div>

            <div className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl flex items-center justify-between">
              <span className="truncate pr-2">
                <strong className="text-slate-900">admin@nexttrack.io</strong> / Admin@123456
              </span>
              <button
                type="button"
                onClick={fillDevCredentials}
                className="text-[10px] font-extrabold uppercase text-indigo-600 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200 transition-all shadow-sm shrink-0 cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
