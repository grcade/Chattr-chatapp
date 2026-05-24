import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    console.error(err);
    res
      .status(err.statusCode)
      .json({ success: false, error: err.message, code: err.code });
  } else if (err instanceof Error) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  } else {
    console.error('Unknown error:', err);
    res
      .status(500)
      .json({ success: false, error: 'An unknown error occurred' });
  }
};

export default errorHandler;
