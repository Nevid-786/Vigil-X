import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import { EventFilterBar } from '../components/history/EventFilterBar';
import { EventTable } from '../components/history/EventTable';
import { ExportButton } from '../components/history/ExportButton';
import { eventsService } from '../api/services';

export const HistoryPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    poleId: '',
    from: '',
    to: '',
    page: 1,
  });

  const [data, setData] = useState({
    events: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsService.getEvents({ ...filters, limit: 15 });
      setData({
        events: res.data.events || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
      });
    } catch (err) {
      console.error('Failed to load event history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      type: '',
      poleId: '',
      from: '',
      to: '',
      page: 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
              <History className="h-6 w-6" />
            </div>
            Historical Event Audit Log
          </h2>
          <p className="text-xs text-slate-500 font-semibold pt-1">
            Complete audit record of all LoRa transmissions, SOS alerts, NFC card taps, and portal messages
          </p>
        </div>

        <ExportButton filters={filters} />
      </div>

      {/* Filter Bar */}
      <EventFilterBar filters={filters} setFilters={setFilters} onReset={handleResetFilters} />

      {/* Event Table */}
      <EventTable
        events={data.events}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        loading={loading}
      />
    </div>
  );
};
