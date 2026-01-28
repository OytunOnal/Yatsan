import { api } from '../../client';
import { Listing, ListingType, PaginatedResponse, FilterSchemaResponse } from '../../types';

// ============================================================================
// GENERAL LISTING API
// ============================================================================

export const getListings = async (params?: {
  listingType?: ListingType;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Listing>> => {
  const response = await api.get('/listings', { params });
  return {
    listings: response.data.listings,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
};

export const getListingById = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const updateListing = async (
  id: string,
  data: Partial<Omit<Listing, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'images' | 'user' | 'yachtListing' | 'partListing' | 'marinaListing' | 'crewListing' | 'equipmentListing' | 'serviceListing' | 'storageListing' | 'insuranceListing' | 'expertiseListing' | 'marketplaceListing'>>
): Promise<{ listing: Listing }> => {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
};

export const deleteListing = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
};

export const getFilterSchema = async (listingType: string): Promise<FilterSchemaResponse> => {
  const response = await api.get(`/listings/filters/schema/${listingType}`);
  return response.data;
};
