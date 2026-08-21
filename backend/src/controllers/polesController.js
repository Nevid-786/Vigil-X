import { Pole } from '../models/Pole.js';

/**
 * GET /api/poles
 * Returns list of pole nodes with status, event counts, and last seen timestamps.
 */
export const getPoles = async (req, res) => {
  try {
    let poles = await Pole.find().sort({ poleId: 1 });

    // Seed default poles A and B if database has no poles recorded yet
    if (poles.length === 0) {
      poles = await Pole.insertMany([
        { poleId: 'A', label: 'Pole Alpha (North Gate)', lastSeenAt: new Date(), eventCount: 0 },
        { poleId: 'B', label: 'Pole Bravo (South Relay)', lastSeenAt: new Date(), eventCount: 0 },
      ]);
    }

    return res.json(poles);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};
