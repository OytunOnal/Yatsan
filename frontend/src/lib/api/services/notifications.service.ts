import { api } from '../client';
import { Notification, NotificationsResponse } from '../types';

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

// Bildirimleri getir
export const getNotifications = async (params?: {
  page?: number;
  limit?: number;
  unread?: boolean;
}): Promise<NotificationsResponse> => {
  const response = await api.get('/notifications', { params });
  return response.data.data;
};

// Okunmamış bildirim sayısı
export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
  const response = await api.get('/notifications/unread-count');
  return response.data.data;
};

// Bildirimi okundu olarak işaretle
export const markNotificationAsRead = async (id: string): Promise<{ message: string }> => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data.data;
};

// Tüm bildirimleri okundu olarak işaretle
export const markAllNotificationsAsRead = async (): Promise<{ message: string }> => {
  const response = await api.put('/notifications/read-all');
  return response.data.data;
};

// Bildirimi sil
export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};
