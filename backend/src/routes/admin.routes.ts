import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import { getPendingListings, approveListing, rejectListing } from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/pending-listings', getPendingListings);
router.post('/approve-listing', approveListing);
router.post('/reject-listing', rejectListing);

export default router;