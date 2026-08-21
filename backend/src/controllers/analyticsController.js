import { Event } from '../models/Event.js';
import { CardMapping } from '../models/CardMapping.js';
import { Pole } from '../models/Pole.js';

/**
 * GET /api/analytics
 * Returns comprehensive analytics data for the dashboard & analytics hub
 */
export const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch raw event data for the past 7 days
    const events = await Event.find({ receivedAt: { $gte: sevenDaysAgo } }).sort({ receivedAt: 1 });
    const totalEventsCount = await Event.countDocuments();
    const totalCardsCount = await CardMapping.countDocuments();
    const totalPoles = await Pole.find();

    // 1. Summary Counts
    const typeCounts = {
      SOS: 0,
      CHECKIN: 0,
      UNKNOWN_CARD: 0,
      MESSAGE: 0,
    };

    // 2. Average SOS Acknowledge Time
    let totalAckTimeMs = 0;
    let ackedSosCount = 0;

    // 3. Hourly Distribution (0..23)
    const hourlyCounts = Array(24).fill(0);

    // 4. Pole Distribution
    const poleCounts = {};

    // 5. Card Checkin Frequency
    const checkinLeaderboard = {};

    events.forEach((e) => {
      if (typeCounts[e.type] !== undefined) {
        typeCounts[e.type] += 1;
      }

      // Pole counts
      const pole = e.poleId || 'A';
      poleCounts[pole] = (poleCounts[pole] || 0) + 1;

      // Hourly distribution
      const hour = new Date(e.receivedAt).getHours();
      hourlyCounts[hour] += 1;

      // SOS Ack time calculation
      if (e.type === 'SOS' && e.acknowledgedAt && e.receivedAt) {
        const diffMs = new Date(e.acknowledgedAt).getTime() - new Date(e.receivedAt).getTime();
        if (diffMs >= 0) {
          totalAckTimeMs += diffMs;
          ackedSosCount += 1;
        }
      }

      // Checkin leaderboard
      if (e.type === 'CHECKIN' && e.resolvedName) {
        checkinLeaderboard[e.resolvedName] = (checkinLeaderboard[e.resolvedName] || 0) + 1;
      }
    });

    const avgAckTimeSec = ackedSosCount > 0 ? Math.round(totalAckTimeMs / ackedSosCount / 1000) : 0;

    // 6. 7-Day Timeline Aggregation
    const timelineMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split('T')[0];
      timelineMap[dateKey] = { date: dateKey, SOS: 0, CHECKIN: 0, UNKNOWN_CARD: 0, MESSAGE: 0, total: 0 };
    }

    events.forEach((e) => {
      const dateKey = new Date(e.receivedAt).toISOString().split('T')[0];
      if (timelineMap[dateKey]) {
        if (timelineMap[dateKey][e.type] !== undefined) {
          timelineMap[dateKey][e.type] += 1;
        }
        timelineMap[dateKey].total += 1;
      }
    });

    const timeline = Object.values(timelineMap);

    // Format Leaderboard Top 5
    const leaderboardSorted = Object.entries(checkinLeaderboard)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Format Pole Node breakdown
    const poleDistribution = Object.entries(poleCounts).map(([poleId, count]) => ({
      poleId,
      count,
    }));

    return res.json({
      summary: {
        totalEvents: totalEventsCount,
        recent7DaysTotal: events.length,
        totalCards: totalCardsCount,
        activePoles: totalPoles.length,
        avgAckTimeSec,
        counts: typeCounts,
      },
      timeline,
      hourlyDistribution: hourlyCounts.map((count, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        count,
      })),
      poleDistribution,
      leaderboard: leaderboardSorted,
    });
  } catch (err) {
    console.error('Error in getAnalytics:', err);
    return res.status(500).json({ error: { message: err.message } });
  }
};
