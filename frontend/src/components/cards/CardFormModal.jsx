import React, { useState, useEffect } from 'react';
import { X, CreditCard, User, Sparkles } from 'lucide-react';

export const CardFormModal = ({ isOpen, onClose, onSubmit, editingCard, initialUid = '' }) => {
  const [rawUid, setRawUid] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCard) {
      setRawUid(editingCard.rawUid || '');
      setName(editingCard.name || '');
    } else {
      setRawUid(initialUid || '');
      setName('');
    }
    setError('');
  }, [editingCard, initialUid, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rawUid.trim() || !name.trim()) {
      setError('Both Card UID and Person Name are required.');
      return;
    }

    onSubmit({ rawUid: rawUid.trim(), name: name.trim() });
  };

  const previewNormalized = rawUid
    ? rawUid.trim().toUpperCase().replace(/UID:/gi, '').replace(/[\s:-]/g, '')
    : '';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {editingCard ? 'Edit Card Mapping' : 'Add New Card Mapping'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Associate NFC hardware UID with user profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
              Hardware NFC UID
            </label>
            <div className="relative">
              <CreditCard className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. UID:04:A3:9F:1B or 04A39F1B"
                value={rawUid}
                onChange={(e) => setRawUid(e.target.value)}
                disabled={!!editingCard}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
              />
            </div>
            {previewNormalized && (
              <div className="mt-1.5 text-[11px] font-mono text-purple-700 flex items-center gap-1 font-bold">
                <Sparkles className="h-3 w-3" /> Normalized Hash: {previewNormalized}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
              Cardholder Full Name
            </label>
            <div className="relative">
              <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
            >
              {editingCard ? 'Save Changes' : 'Create Mapping'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
