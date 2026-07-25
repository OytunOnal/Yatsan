import { Router } from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favorite.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get user's favorites
router.get('/', getFavorites);

// Add listing to favorites
router.post('/:listingId', addFavorite);

// Remove listing from favorites
router.delete('/:listingId', removeFavorite);

// Check if listing is favorited
router.get('/:listingId/check', checkFavorite);

export default router;
