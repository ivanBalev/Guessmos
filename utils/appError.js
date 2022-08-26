class AppError extends Error {
  constructor(message) {
    // TODO: not sure why super(message) doesn't work
    super(message);
    this.msg = message;
    this.isOperational = true;
  }
}

module.exports = AppError;
