import { Router } from 'express';
import authRoutes from './authRoutes';

const router = Router();

// FEATURE INTEGRATION POINT: Add external (public) feature routes here.
router.use('/auth', authRoutes);

export default router;
