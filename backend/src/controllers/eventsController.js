import { Event } from '../models/Event.js';
import { CardMapping } from '../models/CardMapping.js';
import { Pole } from '../models/Pole.js';
import { normalizeUid } from '../utils/normalizeUid.js';

/**
 * Helper to get Socket.io instance from app
 */
const getIO = (req) => req.app.get('io');

/**
 * POST /api/events
 * Ingestion endpoint from n8n workflow (protected by x-api-key header)
 */
export const createEvent = async (req, res) => {
  try {
    let { poleId, path, destination, type, rawData, receivedAt } = req.body;

    if (!poleId || !rawData) {
      return res.status(400).json({
        error: { message: 'poleId and rawData are required.' },
      });
    }

    receivedAt = receivedAt ? new Date(receivedAt) : new Date();

    let normalizedUid = null;
    let resolvedName = null;

    // Handle NFC UID card lookups
    if (type === 'CHECKIN_PENDING' || (rawData && rawData.toUpperCase().startsWith('UID:'))) {
      normalizedUid = normalizeUid(rawData);
      const mapping = await CardMapping.findOne({ normalizedUid });

      if (mapping) {
        type = 'CHECKIN';
        resolvedName = mapping.name;
      } else {
        type = 'UNKNOWN_CARD';
        resolvedName = null;
      }
    } else if (!type) {
      if (rawData === 'SOS') {
        type = 'SOS';
      } else {
        type = 'MESSAGE';
      }
    }

    // Touch/upsert Pole
    const pole = await Pole.findOneAndUpdate(
      { poleId },
      {
        $set: { lastSeenAt: receivedAt },
        $inc: { eventCount: 1 },
      },
      { upsert: true, new: true }
    );

    // Save Event
    const event = await Event.create({
      poleId,
      path: path || poleId,
      destination: destination || 'MAIN',
      type,
      rawData,
      normalizedUid,
      resolvedName,
      receivedAt,
    });

    // Emit Socket events
    const io = getIO(req);
    if (io) {
      io.emit('new_event', event);
      io.emit('pole_status', { poleId: pole.poleId, lastSeenAt: pole.lastSeenAt, eventCount: pole.eventCount });
      if (type === 'SOS') {
        io.emit('sos_alert', event);
      }
    }

    return res.status(201).json(event);
  } catch (err) {
    console.error('Error in createEvent:', err);
    return res.status(500).json({ error: { message: err.message } });
  }
};

/**
 * GET /api/events
 * Query dashboard event history (paginated & filterable)
 */
export const getEvents = async (req, res) => {
  try {
    const { type, poleId, from, to, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }
    if (poleId) {
      filter.poleId = poleId;
    }
    if (from || to) {
      filter.receivedAt = {};
      if (from) filter.receivedAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.receivedAt.$lte = toDate;
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ receivedAt: -1 }).skip(skip).limit(limitNum),
      Event.countDocuments(filter),
    ]);

    return res.json({
      events,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};

/**
 * GET /api/events/export
 * Download CSV file of filtered events
 */
export const exportEventsCSV = async (req, res) => {
  try {
    const { type, poleId, from, to, format = 'csv' } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (poleId) filter.poleId = poleId;
    if (from || to) {
      filter.receivedAt = {};
      if (from) filter.receivedAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.receivedAt.$lte = toDate;
      }
    }

    const events = await Event.find(filter).sort({ receivedAt: -1 }).limit(2000);

    if (format === 'excel' || format === 'xlsx' || format === 'xls') {
      let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  th { background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #3730a3; text-align: left; padding: 8px; }
  td { border: 1px solid #cbd5e1; padding: 6px; font-family: monospace; font-size: 12px; }
  .sos { background-color: #ffe4e6; color: #9f1239; font-weight: bold; }
  .checkin { background-color: #dcfce7; color: #166534; }
  .unknown { background-color: #fef3c7; color: #92400e; }
  .message { background-color: #e0e7ff; color: #3730a3; }
</style>
</head>
<body>
<h2>NextTrack Telemetry Event Audit Log</h2>
<table border="1">
<thead>
  <tr>
    <th>Event ID</th>
    <th>Pole ID</th>
    <th>Path</th>
    <th>Type</th>
    <th>Raw Data</th>
    <th>Normalized UID</th>
    <th>Resolved Name</th>
    <th>Received At</th>
    <th>Acknowledged At</th>
  </tr>
</thead>
<tbody>`;

      events.forEach((e) => {
        let typeClass = '';
        if (e.type === 'SOS') typeClass = 'sos';
        else if (e.type === 'CHECKIN') typeClass = 'checkin';
        else if (e.type === 'UNKNOWN_CARD') typeClass = 'unknown';
        else if (e.type === 'MESSAGE') typeClass = 'message';

        const safeRawData = (e.rawData || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeResolvedName = (e.resolvedName || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        html += `
  <tr class="${typeClass}">
    <td>${e._id}</td>
    <td>${e.poleId || ''}</td>
    <td>${e.path || ''}</td>
    <td>${e.type || ''}</td>
    <td>${safeRawData}</td>
    <td>${e.normalizedUid || ''}</td>
    <td>${safeResolvedName}</td>
    <td>${e.receivedAt ? e.receivedAt.toISOString() : ''}</td>
    <td>${e.acknowledgedAt ? e.acknowledgedAt.toISOString() : ''}</td>
  </tr>`;
      });

      html += `
</tbody>
</table>
</body>
</html>`;

      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', `attachment; filename=nexttrack_events_${Date.now()}.xls`);
      return res.status(200).send(html);
    }

    let csv = 'Event ID,Pole ID,Path,Type,Raw Data,Normalized UID,Resolved Name,Received At,Acknowledged At\n';

    events.forEach((e) => {
      const row = [
        e._id,
        `"${e.poleId || ''}"`,
        `"${e.path || ''}"`,
        `"${e.type || ''}"`,
        `"${(e.rawData || '').replace(/"/g, '""')}"`,
        `"${e.normalizedUid || ''}"`,
        `"${(e.resolvedName || '').replace(/"/g, '""')}"`,
        `"${e.receivedAt ? e.receivedAt.toISOString() : ''}"`,
        `"${e.acknowledgedAt ? e.acknowledgedAt.toISOString() : ''}"`,
      ].join(',');
      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=nexttrack_events_${Date.now()}.csv`);
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};

/**
 * PATCH /api/events/:id/acknowledge
 * Acknowledge an active SOS event
 */
export const acknowledgeEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { $set: { acknowledgedAt: new Date() } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found.' } });
    }

    const io = getIO(req);
    if (io) {
      io.emit('event_acknowledged', event);
    }

    return res.json(event);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};

/**
 * POST /api/events/demo
 * Trigger a simulated SOS or Checkin event for live dashboard demo
 */
export const triggerDemoEvent = async (req, res) => {
  try {
    const { poleId = 'A', type = 'SOS', rawData = 'SOS' } = req.body;

    const receivedAt = new Date();

    const pole = await Pole.findOneAndUpdate(
      { poleId },
      {
        $set: { lastSeenAt: receivedAt },
        $inc: { eventCount: 1 },
      },
      { upsert: true, new: true }
    );

    let normalizedUid = null;
    let resolvedName = null;

    if (type === 'CHECKIN' || type === 'UNKNOWN_CARD') {
      normalizedUid = 'A3B4C5D6';
      if (type === 'CHECKIN') resolvedName = 'Jane Doe (Demo)';
    }

    const event = await Event.create({
      poleId,
      path: `${poleId}->MAIN`,
      destination: 'MAIN',
      type,
      rawData: type === 'SOS' ? 'SOS' : rawData,
      normalizedUid,
      resolvedName,
      receivedAt,
    });

    const io = getIO(req);
    if (io) {
      io.emit('new_event', event);
      io.emit('pole_status', { poleId: pole.poleId, lastSeenAt: pole.lastSeenAt, eventCount: pole.eventCount });
      if (type === 'SOS') {
        io.emit('sos_alert', event);
      }
    }

    return res.status(201).json({ success: true, event });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};
