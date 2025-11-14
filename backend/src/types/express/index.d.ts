import { JwtPayload } from '@/services/auth/authTypes';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}
