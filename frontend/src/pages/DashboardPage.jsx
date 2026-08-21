import React, { useState, useEffect } from 'react';
import { SosBanner } from '../components/dashboard/SosBanner';
import { PoleStatusCard } from '../components/dashboard/PoleStatusCard';
import { LiveEventFeed } from '../components/dashboard/LiveEventFeed';
import { StatsPanel } from '../components/dashboard/StatsPanel';
import { eventsService, polesService } from '../api/services';
import { socket } from '../socket/socket';
import { ShieldAlert, Zap, Radio } from 'lucide-react';

export const DashboardPage = ({ audioEnabled }) => {
  const [events, setEvents] = useState([]);
  const [poles, setPoles] = useState([]);
  const [activeSos, setActiveSos] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, polesRes] = await Promise.all([
        eventsService.getEvents({ limit: 50 }),
        polesService.getPoles(),
      ]);

      const initialEvents = eventsRes.data.events || [];
      setEvents(initialEvents);
      setPoles(polesRes.data || []);

      // Check if there is an unacknowledged SOS event
      const unackSos = initialEvents.find((e) => e.type === 'SOS' && !e.acknowledgedAt);
      if (unackSos) {
        setActiveSos(unackSos);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Socket.io Listeners
    socket.on('new_event', (newEvent) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 199)]);
    });

    socket.on('sos_alert', (sosEvent) => {
      setActiveSos(sosEvent);
    });

    socket.on('event_acknowledged', (ackEvent) => {
      setActiveSos((prev) => (prev && prev._id === ackEvent._id ? null : prev));
      setEvents((prev) =>
        prev.map((e) => (e._id === ackEvent._id ? { ...e, acknowledgedAt: ackEvent.acknowledgedAt } : e))
      );
    });

    socket.on('pole_status', (statusUpdate) => {
      setPoles((prev) =>
        prev.map((p) =>
          p.poleId === statusUpdate.poleId
            ? { ...p, lastSeenAt: statusUpdate.lastSeenAt, eventCount: statusUpdate.eventCount }
            : p
        )
      );
    });

    return () => {
      socket.off('new_event');
      socket.off('sos_alert');
      socket.off('event_acknowledged');
      socket.off('pole_status');
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* SOS Banner */}
      <SosBanner
        activeSos={activeSos}
        onAcknowledge={(id) => setActiveSos(null)}
        audioEnabled={audioEnabled}
      />

      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Radio className="h-6 w-6 text-cyan-400 animate-pulse" />
            Live Command Overview
          </h2>
          <p className="text-xs text-slate-400 font-medium pt-0.5">
            Full-screen LoRa Mesh Event Router, NFC attendance logs, and emergency beacon alerts
          </p>
        </div>
      </div>

      {/* Pole Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {poles.map((pole) => (
          <PoleStatusCard key={pole.poleId} pole={pole} />
        ))}
      </div>

      {/* Grid: Live Feed & Stats Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LiveEventFeed events={events} />
        </div>
        <div className="lg:col-span-5">
          <StatsPanel events={events} />
        </div>
      </div>
    </div>
  );
};
