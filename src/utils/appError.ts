class AppError extends Error {
  statusCode: number;
  status: string;
  isExpected: boolean;

  // Set up error for our global error-handling middleware to recognize as expected
  constructor(message: string, statusCode: number) {
    // Save message & status code
    super(message);
    this.statusCode = statusCode;

    // Set status
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Global error-handling middleware treats expected and unexpected errors differently 
    this.isExpected = true;
  }
}

export default AppError;
