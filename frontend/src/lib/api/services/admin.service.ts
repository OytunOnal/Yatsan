import { api } from '../client';
import { PlatformStats, Listing, UserProfile, UserStatus } from '../types';

// ============================================================================
// ADMIN API
// ============================================================================

// Platform istatistikleri
export const getPlatformStats = async (): Promise<PlatformStats> => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// Bekleyen ilanlar
export const getAdminPendingListings = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  listings: Array<Listing & {
    userEmail: string;
    userFirstName: string;
    userLastName: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await api.get('/admin/listings/pending', { params });
  return response.data;
};

// İlan onayla
export const adminApproveListing = async (id: string): Promise<{ message: string }> => {
  const response = await api.patch(`/admin/listings/${id}/approve`);
  return response.data;
};

// İlan reddet
export const adminRejectListing = async (id: string, data: {
  reason: string;
}): Promise<{ message: string }> => {
  const response = await api.patch(`/admin/listings/${id}/reject`, data);
  return response.data;
};

// Kullanıcı listesi
export const getAdminUsers = async (params?: {
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  users: UserProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

// Kullanıcı durumu güncelle
export const adminUpdateUserStatus = async (id: string, data: {
  status: UserStatus;
}): Promise<{ message: string }> => {
  const response = await api.patch(`/admin/users/${id}/status`, data);
  return response.data;
};

// Raporlar
export const getAdminReports = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  reports: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await api.get('/admin/reports', { params });
  return response.data;
};

// Analitik
export const getAdminAnalytics = async (params?: {
  period?: string;
}): Promise<{
  dailyListings: Array<{ date: string; count: number }>;
  dailyUsers: Array<{ date: string; count: number }>;
  listingByType: Array<{ type: string; count: number }>;
  usersByStatus: Array<{ status: string; count: number }>;
}> => {
  const response = await api.get('/admin/analytics', { params });
  return response.data;
};
