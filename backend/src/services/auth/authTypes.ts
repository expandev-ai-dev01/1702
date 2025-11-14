import { z } from 'zod';
import { loginSchema } from './authValidation';

// Type inferred from the Zod validation schema
export type LoginBody = z.infer<typeof loginSchema>;

// Type for the service layer, including request metadata
export interface LoginParams extends LoginBody {
  ipAddress: string;
  userAgent: string;
}

// Type for the user data returned from the database
export interface UserFromDb {
  idUser: number;
  name: string;
  email: string;
  passwordHash: string;
  failedLoginAttempts: number;
  lockoutUntil: string | null;
}

// Type for the JWT payload
export interface JwtPayload {
  id: number;
  email: string;
  name: string;
}

// Type for the final response after successful authentication
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
