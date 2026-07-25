import { api } from '../../client';
import { Listing } from '../../types';

// ============================================================================
// YACHT LISTING API
// ============================================================================

export const createYachtListing = async (data: {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  yachtType: string;
  year: number;
  length: string;
  beam: string;
  draft: string;
  engineBrand?: string;
  engineHours?: number;
  engineHP?: number;
  fuelType?: string;
  cruisingSpeed?: number;
  maxSpeed?: number;
  cabinCount?: number;
  bedCount?: number;
  bathroomCount?: number;
  equipment?: string;
  condition: string;
  images?: File[];
}): Promise<{ listing: Listing }> => {
  const formData = new FormData();
  formData.append('listingType', 'yacht');
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('currency', data.currency);
  formData.append('location', data.location);
  formData.append('yachtType', data.yachtType);
  formData.append('year', data.year.toString());
  formData.append('length', data.length);
  formData.append('beam', data.beam);
  formData.append('draft', data.draft);
  if (data.engineBrand) formData.append('engineBrand', data.engineBrand);
  if (data.engineHours) formData.append('engineHours', data.engineHours.toString());
  if (data.engineHP) formData.append('engineHP', data.engineHP.toString());
  if (data.fuelType) formData.append('fuelType', data.fuelType);
  if (data.cruisingSpeed) formData.append('cruisingSpeed', data.cruisingSpeed.toString());
  if (data.maxSpeed) formData.append('maxSpeed', data.maxSpeed.toString());
  if (data.cabinCount) formData.append('cabinCount', data.cabinCount.toString());
  if (data.bedCount) formData.append('bedCount', data.bedCount.toString());
  if (data.bathroomCount) formData.append('bathroomCount', data.bathroomCount.toString());
  if (data.equipment) formData.append('equipment', data.equipment);
  formData.append('condition', data.condition);
  
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

export const getYachtListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const updateYachtListing = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    currency: string;
    location: string;
    yachtType: string;
    year: number;
    length: string;
    beam: string;
    draft: string;
    engineBrand: string;
    engineHours: number;
    engineHP: number;
    fuelType: string;
    cruisingSpeed: number;
    maxSpeed: number;
    cabinCount: number;
    bedCount: number;
    bathroomCount: number;
    equipment: string;
    condition: string;
  }>
): Promise<{ listing: Listing }> => {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
};
