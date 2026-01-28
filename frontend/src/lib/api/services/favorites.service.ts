import { api } from '../client';
import { Favorite, Listing } from '../types';

// ============================================================================
// FAVORITES API
// ============================================================================

// Favorileri getir
export const getFavorites = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  listings: Array<Favorite & { listing: Listing }>;
  unreadCount?: number;
}> => {
  const response = await api.get('/users/me/favorites', { params });
  return response.data.data;
};

// İlanı favorilere ekle
export const addFavorite = async (listingId: string): Promise<{ message: string }> => {
  const response = await api.post(`/users/me/favorites/${listingId}`);
  return response.data.data;
};

// İlanı favorilerden çıkar
export const removeFavorite = async (listingId: string): Promise<void> => {
  await api.delete(`/users/me/favorites/${listingId}`);
};

// Favori kontrolü
export const checkFavorite = async (listingId: string): Promise<{ isFavorited: boolean }> => {
  const response = await api.get(`/users/me/favorites/${listingId}/check`);
  return response.data.data;
};
