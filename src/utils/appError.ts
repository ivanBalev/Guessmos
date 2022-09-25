class AppError extends Error {
  statusCode: number;
  status: string;
  isExpected: boolean;

  // TODO: Fix error handling to be like in Node js course. The status code should not be received in ctor
  constructor(message: string, statusCode: number) {
    // Set up error for our global error-handling middleware to recognize as expected
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isExpected = true;
  }
}

export default AppError;
