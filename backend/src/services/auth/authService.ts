import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbRequest, ExpectedReturn } from '@/utils/database';
import { config } from '@/config';
import { AppError } from '@/utils/AppError';
import { LoginParams, UserFromDb, AuthResponse, JwtPayload } from './authTypes';

/**
 * @summary
 * Authenticates a user based on email and password.
 *
 * @param {LoginParams} params - The login parameters including credentials and request info.
 * @returns {Promise<AuthResponse>} The authentication response with token and user data.
 * @throws {AppError} If authentication fails (e.g., user not found, password incorrect, account locked).
 */
export async function loginUser(params: LoginParams): Promise<AuthResponse> {
  const { email, password, rememberMe, ipAddress, userAgent } = params;

  // 1. Fetch user from database
  const user: UserFromDb | null = await dbRequest(
    '[security].[spUserGetByEmail]',
    { email },
    ExpectedReturn.Single
  );

  if (!user) {
    // Log attempt for non-existent user and throw generic error
    await dbRequest(
      '[security].[spUserLoginAttempt]',
      { emailAttempt: email, ipAddress, userAgent, success: 0 },
      ExpectedReturn.None
    );
    throw new AppError('Invalid email or password.', 401);
  }

  // 2. Check if account is locked
  if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
    await dbRequest(
      '[security].[spUserLoginAttempt]',
      { emailAttempt: email, ipAddress, userAgent, success: 0 },
      ExpectedReturn.None
    );
    const minutesRemaining = Math.ceil(
      (new Date(user.lockoutUntil).getTime() - new Date().getTime()) / 60000
    );
    throw new AppError(`Account is locked. Please try again in ${minutesRemaining} minutes.`, 403);
  }

  // 3. Compare password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    await dbRequest(
      '[security].[spUserLoginAttempt]',
      { emailAttempt: email, ipAddress, userAgent, success: 0 },
      ExpectedReturn.None
    );
    throw new AppError('Invalid email or password.', 401);
  }

  // 4. On successful login, log the attempt
  await dbRequest(
    '[security].[spUserLoginAttempt]',
    { emailAttempt: email, ipAddress, userAgent, success: 1 },
    ExpectedReturn.None
  );

  // 5. Generate JWT
  const payload: JwtPayload = {
    id: user.idUser,
    email: user.email,
    name: user.name,
  };

  const expiresIn = rememberMe
    ? config.security.jwtRememberMeExpiresIn
    : config.security.jwtExpiresIn;

  const token = jwt.sign(payload, config.security.jwtSecret, { expiresIn });

  // TODO: Implement session limit logic (BR-006)

  return {
    token,
    user: {
      id: user.idUser,
      name: user.name,
      email: user.email,
    },
  };
}
