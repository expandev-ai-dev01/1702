import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/apiResponse';
import { AppError } from '@/utils/AppError';
import { loginSchema } from '@/services/auth/authValidation';
import * as authService from '@/services/auth/authService';

/**
 * @api {post} /external/auth/login User Login
 * @apiName UserLogin
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription Authenticates a user and returns a JWT upon success.
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password.
 * @apiParam {Boolean} [rememberMe] If true, the session token will have a longer expiration.
 *
 * @apiSuccess {String} token The JSON Web Token for the session.
 * @apiSuccess {Object} user User's basic information (id, name, email).
 *
 * @apiError {String} ValidationError Invalid parameters provided.
 * @apiError {String} UnauthorizedError Invalid credentials.
 * @apiError {String} ForbiddenError Account is locked.
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedBody = loginSchema.parse(req.body);

    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const authResult = await authService.loginUser({
      ...validatedBody,
      ipAddress,
      userAgent,
    });

    res.status(200).json(successResponse(authResult));
  } catch (error) {
    next(error);
  }
}
