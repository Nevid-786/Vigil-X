import jwt from 'jsonwebtoken';

/**
 * Dashboard admin authentication middleware.
 * Verifies JWT token from 'Authorization: Bearer <token>' header.
 */
export const jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        message: 'Authentication token required.',
        code: 'MISSING_TOKEN',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'nexttrack_secret_jwt_key_2026_super_secure';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'Invalid or expired token.',
        code: 'INVALID_TOKEN',
      },
    });
  }
};
