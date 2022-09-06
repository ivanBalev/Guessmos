class AppError extends Error {
  constructor(message, statusCode) {
    // Set up error for our global error-handling middleware to recognize as expected
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isExpected = true;
  }
}

module.exports = AppError;
