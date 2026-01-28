"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorite_controller_1 = require("../controllers/favorite.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authMiddleware);
// Get user's favorites
router.get('/', favorite_controller_1.getFavorites);
// Add listing to favorites
router.post('/:listingId', favorite_controller_1.addFavorite);
// Remove listing from favorites
router.delete('/:listingId', favorite_controller_1.removeFavorite);
// Check if listing is favorited
router.get('/:listingId/check', favorite_controller_1.checkFavorite);
exports.default = router;
