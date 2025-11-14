import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '@/utils/apiResponse';
import { config } from '@/config';
import { JwtPayload } from '@/services/auth/authTypes';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(errorResponse('Authentication token is required.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.security.jwtSecret) as JwtPayload;
    req.user = decoded; // Attach user payload to the request object
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(errorResponse('Session expired. Please log in again.'));
    }
    return res.status(401).json(errorResponse('Invalid authentication token.'));
  }
};
