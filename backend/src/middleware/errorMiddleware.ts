import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '@/utils/logger';
import { errorResponse } from '@/utils/apiResponse';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'An unexpected error occurred on the server.';

  // Log the error
  logger.error(
    `[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`,
    {
      stack: err.stack,
      requestBody: req.body,
    }
  );

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json(errorResponse('Validation failed', { details: err.flatten().fieldErrors }));
  }

  // Send the response
  return res.status(statusCode).json(errorResponse(message));
};
