"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin role
router.use(auth_1.authMiddleware);
router.use(admin_1.adminMiddleware);
// Platform Stats
router.get('/stats', admin_controller_1.getPlatformStats);
// Listing Moderation
router.get('/listings/pending', admin_controller_1.getPendingListings);
router.patch('/listings/:id/approve', admin_controller_1.approveListing);
router.patch('/listings/:id/reject', admin_controller_1.rejectListing);
// User Management
router.get('/users', admin_controller_1.getUsers);
router.patch('/users/:id/status', admin_controller_1.updateUserStatus);
// Reports
router.get('/reports', admin_controller_1.getReports);
// Analytics
router.get('/analytics', admin_controller_1.getAnalytics);
exports.default = router;
