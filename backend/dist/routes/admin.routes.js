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
router.get('/pending-listings', admin_controller_1.getPendingListings);
router.post('/approve-listing', admin_controller_1.approveListing);
router.post('/reject-listing', admin_controller_1.rejectListing);
exports.default = router;
