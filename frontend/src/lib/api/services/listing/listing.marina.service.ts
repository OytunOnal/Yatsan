import { api } from '../../client';
import { Listing } from '../../types';

// ============================================================================
// MARINA LISTING API
// ============================================================================

export const createMarinaListing = async (data: {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  priceType: string;
  maxLength: string;
  maxBeam: string;
  maxDraft?: string;
  services: string;
  availability?: string;
  images?: File[];
}): Promise<{ listing: Listing }> => {
  const formData = new FormData();
  formData.append('listingType', 'marina');
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('currency', data.currency);
  formData.append('location', data.location);
  formData.append('priceType', data.priceType);
  formData.append('maxLength', data.maxLength);
  formData.append('maxBeam', data.maxBeam);
  if (data.maxDraft) formData.append('maxDraft', data.maxDraft);
  formData.append('services', data.services);
  if (data.availability) formData.append('availability', data.availability);
  
  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await api.post('/listings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMarinaListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const updateMarinaListing = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    currency: string;
    location: string;
    priceType: string;
    maxLength: string;
    maxBeam: string;
    maxDraft: string;
    services: string;
    availability: string;
  }>
): Promise<{ listing: Listing }> => {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
};
