import { Router } from 'express';
import * as loginController from '@/api/v1/external/auth/login/controller';

const router = Router();

router.post('/login', loginController.postHandler);

export default router;
