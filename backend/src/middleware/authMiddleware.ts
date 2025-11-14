import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@/utils/apiResponse';

/**
 * @summary
 * Placeholder for authentication middleware.
 * This should be replaced with actual JWT or session validation logic.
 *
 * @important
 * For the base structure, this middleware is a pass-through.
 * It must be implemented to secure internal endpoints.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // --- AUTHENTICATION LOGIC TO BE IMPLEMENTED ---
  // 1. Extract token from Authorization header.
  // 2. Verify the token (e.g., JWT verification).
  // 3. If valid, decode it and attach user info to `req` object.
  // 4. If invalid, send a 401 Unauthorized response.

  // For now, we'll simulate a successful authentication for development purposes.
  // In a real application, remove this and implement proper validation.
  console.warn(
    'Authentication middleware is a placeholder. All internal routes are currently unprotected.'
  );

  // Example of what a real implementation might attach to the request:
  // req.user = { id: 1, idAccount: 1, email: 'test@example.com' };

  next();
};
