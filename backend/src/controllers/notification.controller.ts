import { eq, and, isNull, desc } from 'drizzle-orm';
import { notifications } from '../db/schema';
import { assertAuthenticated } from '../types';

// Get user's notifications
export const getNotifications = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unread === 'true';
    const offset = (page - 1) * limit;

    const whereConditions = unreadOnly
      ? and(eq(notifications.userId, req.user.id), isNull(notifications.readAt))
      : eq(notifications.userId, req.user.id);

    const userNotifications = await req.db
      .select()
      .from(notifications)
      .where(whereConditions)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    // Get unread count
    const unreadCountResult = await req.db
      .select({ count: notifications.id })
      .from(notifications)
      .where(and(eq(notifications.userId, req.user.id), isNull(notifications.readAt)));

    const unreadCount = unreadCountResult.length;

    // Get total count
    const totalCountResult = await req.db
      .select({ count: notifications.id })
      .from(notifications)
      .where(eq(notifications.userId, req.user.id));

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
  } catch (error: any) {
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

// Mark notification as read
export const markAsRead = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);
    const { id } = req.params;

    const result = await req.db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, req.user.id)
        )
      );

    res.json({
      success: true,
      data: {
        message: 'Bildirim okundu olarak işaretlendi',
      },
    });
  } catch (error: any) {
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

// Mark all notifications as read
export const markAllAsRead = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);

    await req.db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(notifications.userId, req.user.id),
          isNull(notifications.readAt)
        )
      );

    res.json({
      success: true,
      data: {
        message: 'Tüm bildirimler okundu olarak işaretlendi',
      },
    });
  } catch (error: any) {
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

// Delete notification
export const deleteNotification = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);
    const { id } = req.params;

    await req.db
      .delete(notifications)
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, req.user.id)
        )
      );

    res.status(204).send();
  } catch (error: any) {
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

// Get unread count
export const getUnreadCount = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);

    const unreadCountResult = await req.db
      .select({ count: notifications.id })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, req.user.id),
          isNull(notifications.readAt)
        )
      );

    const unreadCount = unreadCountResult.length;

    res.json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error: any) {
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
