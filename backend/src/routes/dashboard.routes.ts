import { Router } from 'express';
import { getDashboardStats, getUserListings } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/stats', authMiddleware, getDashboardStats);
router.get('/listings', authMiddleware, getUserListings);

export default router;
