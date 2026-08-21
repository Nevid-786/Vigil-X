/**
 * Device/n8n authentication middleware.
 * Expects 'x-api-key' header matching process.env.DEVICE_API_KEY.
 */
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.DEVICE_API_KEY || 'nexttrack_device_secret_key_9988';

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      error: {
        message: 'Unauthorized device access. Missing or invalid x-api-key header.',
        code: 'UNAUTHORIZED_API_KEY',
      },
    });
  }

  next();
};
