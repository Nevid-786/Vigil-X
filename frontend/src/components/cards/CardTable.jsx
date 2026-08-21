import React from 'react';
import { CreditCard, Edit, Trash2, User, Clock, Search } from 'lucide-react';

export const CardTable = ({ cards, onEdit, onDelete, search, setSearch }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            Mapped UID Directory ({cards.length})
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Maps physical NFC Card UIDs to cardholder names for automatic check-in resolution
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name or UID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Cards Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
              <th className="pb-3 px-3">Cardholder Name</th>
              <th className="pb-3 px-3">Raw UID Payload</th>
              <th className="pb-3 px-3">Normalized Hash</th>
              <th className="pb-3 px-3">Created Date</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {cards.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold">
                  No card mappings found. Click "Add New Card Mapping" above to create one.
                </td>
              </tr>
            ) : (
              cards.map((card) => (
                <tr key={card._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5 font-extrabold text-slate-900">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      {card.name}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {card.rawUid}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-purple-700 font-extrabold">
                    {card.normalizedUid}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {new Date(card.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(card)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="Edit Name"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(card._id)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
