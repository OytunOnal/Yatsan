import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);
router.put('/password', authMiddleware, changePassword);

export default router;
