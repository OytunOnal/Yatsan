import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import {
  getPlatformStats,
  getPendingListings,
  approveListing,
  rejectListing,
  getUsers,
  updateUserStatus,
  getReports,
  getAnalytics,
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Platform Stats
router.get('/stats', getPlatformStats);

// Listing Moderation
router.get('/listings/pending', getPendingListings);
router.patch('/listings/:id/approve', approveListing);
router.patch('/listings/:id/reject', rejectListing);

// User Management
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

// Reports
router.get('/reports', getReports);

// Analytics
router.get('/analytics', getAnalytics);

export default router;