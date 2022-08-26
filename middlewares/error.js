module.exports = (err, req, res, next) => {
  // TODO: This needs improving and testing
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    res.status(500).json({
      error: 'Something went wrong',
    });
  } else {
    res.status(err.statusCode).json({
      error: err.message,
    });
  }
};
