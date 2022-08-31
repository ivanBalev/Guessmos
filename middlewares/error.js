module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production' && !err.isExpected) {
    res.status(500).json({
      error: 'Something went wrong',
    });
  } else {
    res.status(err.statusCode).json({
      error: err.message,
    });
  }
};
