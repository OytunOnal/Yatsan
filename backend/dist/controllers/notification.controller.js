"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const types_1 = require("../types");
// Get user's notifications
const getNotifications = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const unreadOnly = req.query.unread === 'true';
        const offset = (page - 1) * limit;
        const whereConditions = unreadOnly
            ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.userId, req.user.id), (0, drizzle_orm_1.isNull)(schema_1.notifications.readAt))
            : (0, drizzle_orm_1.eq)(schema_1.notifications.userId, req.user.id);
        const userNotifications = await req.db
            .select()
            .from(schema_1.notifications)
            .where(whereConditions)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.createdAt))
            .limit(limit)
            .offset(offset);
        // Get unread count
        const unreadCountResult = await req.db
            .select({ count: schema_1.notifications.id })
            .from(schema_1.notifications)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.userId, req.user.id), (0, drizzle_orm_1.isNull)(schema_1.notifications.readAt)));
        const unreadCount = unreadCountResult.length;
        // Get total count
        const totalCountResult = await req.db
            .select({ count: schema_1.notifications.id })
            .from(schema_1.notifications)
            .where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, req.user.id));
        const total = totalCountResult.length;
        res.json({
            success: true,
            data: {
                notifications: userNotifications,
                unreadCount,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    }
    catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Bildirimler getirilirken hata oluştu',
            },
        });
    }
};
exports.getNotifications = getNotifications;
// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { id } = req.params;
        const result = await req.db
            .update(schema_1.notifications)
            .set({ readAt: new Date() })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.id, id), (0, drizzle_orm_1.eq)(schema_1.notifications.userId, req.user.id)));
        res.json({
            success: true,
            data: {
                message: 'Bildirim okundu olarak işaretlendi',
            },
        });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Bildirim işaretlenirken hata oluştu',
            },
        });
    }
};
exports.markAsRead = markAsRead;
// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        await req.db
            .update(schema_1.notifications)
            .set({ readAt: new Date() })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.userId, req.user.id), (0, drizzle_orm_1.isNull)(schema_1.notifications.readAt)));
        res.json({
            success: true,
            data: {
                message: 'Tüm bildirimler okundu olarak işaretlendi',
            },
        });
    }
    catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Bildirimler işaretlenirken hata oluştu',
            },
        });
    }
};
exports.markAllAsRead = markAllAsRead;
// Delete notification
const deleteNotification = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { id } = req.params;
        await req.db
            .delete(schema_1.notifications)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.id, id), (0, drizzle_orm_1.eq)(schema_1.notifications.userId, req.user.id)));
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Bildirim silinirken hata oluştu',
            },
        });
    }
};
exports.deleteNotification = deleteNotification;
// Get unread count
const getUnreadCount = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const unreadCountResult = await req.db
            .select({ count: schema_1.notifications.id })
            .from(schema_1.notifications)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.userId, req.user.id), (0, drizzle_orm_1.isNull)(schema_1.notifications.readAt)));
        const unreadCount = unreadCountResult.length;
        res.json({
            success: true,
            data: {
                unreadCount,
            },
        });
    }
    catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Okunmamış bildirim sayısı alınırken hata oluştu',
            },
        });
    }
};
exports.getUnreadCount = getUnreadCount;
