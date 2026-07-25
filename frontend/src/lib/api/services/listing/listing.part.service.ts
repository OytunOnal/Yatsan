import { api } from '../../client';
import { Listing } from '../../types';

// ============================================================================
// PART LISTING API
// ============================================================================

export const createPartListing = async (data: {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  condition: string;
  brand: string;
  oemCode?: string;
  compatibility?: string;
  images?: File[];
}): Promise<{ listing: Listing }> => {
  const formData = new FormData();
  formData.append('listingType', 'part');
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('currency', data.currency);
  formData.append('location', data.location);
  formData.append('condition', data.condition);
  formData.append('brand', data.brand);
  if (data.oemCode) formData.append('oemCode', data.oemCode);
  if (data.compatibility) formData.append('compatibility', data.compatibility);
  
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

export const getPartListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const updatePartListing = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    currency: string;
    location: string;
    condition: string;
    brand: string;
    oemCode: string;
    compatibility: string;
  }>
): Promise<{ listing: Listing }> => {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
};
