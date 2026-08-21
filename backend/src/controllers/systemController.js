import mongoose from 'mongoose';

/**
 * GET /api/system/health
 * Returns live backend server & database diagnostics
 */
export const getSystemHealth = async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    const io = req.app.get('io');
    const activeSockets = io ? io.engine.clientsCount : 0;

    const mongoStatusMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };

    return res.json({
      status: 'operational',
      uptimeSec: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
        heapTotalMb: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
        heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
      },
      database: {
        status: mongoStatusMap[mongoose.connection.readyState] || 'Unknown',
        host: mongoose.connection.host || 'Atlas Mongo',
        name: mongoose.connection.name || 'nexttrack',
      },
      sockets: {
        activeClients: activeSockets,
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      timestamp: new Date(),
    });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};
