"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authMiddleware);
// Get user's notifications
router.get('/', notification_controller_1.getNotifications);
// Get unread count
router.get('/unread-count', notification_controller_1.getUnreadCount);
// Mark all notifications as read
router.put('/read-all', notification_controller_1.markAllAsRead);
// Mark notification as read
router.put('/:id/read', notification_controller_1.markAsRead);
// Delete notification
router.delete('/:id', notification_controller_1.deleteNotification);
exports.default = router;
