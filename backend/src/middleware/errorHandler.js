/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'SERVER_ERROR',
    },
  });
};
