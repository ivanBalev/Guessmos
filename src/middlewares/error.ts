import { Request, Response, NextFunction } from "express";
import AppError from '../utils/appError';

/**
 * Global error handler
 * Returns generic 500 error if in production
 * and error is unexpected
 * Returns error message otherwise
 */
export default function (err: AppError, _req: Request, _res: Response, _next: NextFunction) {
  // err.statusCode = err.statusCode || 500;
  // err.status = err.status || 'error';

  // if (process.env.NODE_ENV === 'production' && !err.isExpected) {
  //   res.status(500).json({
  //     error: 'Something went wrong',
  //   });
  // } else {
  //   res.status(err.statusCode).json({
  //     error: err.message,
  //   });
  // }
  throw(err)
};
