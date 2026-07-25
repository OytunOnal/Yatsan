import { api } from '../client';
import { DashboardStats, Listing, PaginatedResponse } from '../types';

// ============================================================================
// DASHBOARD API
// ============================================================================

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<{ 
    totalListings: number;
    pendingListings: number;
    approvedListings: number;
    rejectedListings: number;
    totalMessages: number;
    unreadMessages: number;
  }>('/dashboard/stats');
  return response.data;
};

export const getUserListings = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Listing>> => {
  const response = await api.get('/dashboard/listings', { params });
  return {
    listings: response.data.listings,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
};
