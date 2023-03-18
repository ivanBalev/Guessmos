import { Request, Response, NextFunction } from "express";
import AppError from '../utils/appError';

/**
 * Global error handler
 * In production env - returns generic 500 error if error is unexpected
 * i.e. not thrown by us intentionally (no statusCode value provided)
 * In development env - returns error message
 */
export default function (err: AppError, _req: Request, res: Response, _next: NextFunction) {

  // Ensure statusCode & status properties have values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production' && !err.isExpected) {

    // In prod - send generic error to client
    res.status(500).json({
      error: 'Something went wrong',
    });
  } else {

    // In dev - provide all info to developer
    res.status(err.statusCode).json({
      error: err.message,
    });
  }

  throw (err);
};
