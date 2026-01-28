import { api } from '../../client';
import { Listing } from '../../types';
import { buildListingFormData } from '../../utils/formData.utils';

// ============================================================================
// CREW LISTING API
// ============================================================================

export interface CreateCrewListingData {
  title: string;
  description: string;
  price?: number;
  currency?: string;
  location: string;
  position: string;
  experience: number;
  certifications?: string;
  availability: string;
  availableFrom?: string;
  availableTo?: string;
  salary?: string;
  salaryCurrency?: string;
  salaryPeriod?: string;
  images?: File[];
}

export const createCrewListing = async (data: CreateCrewListingData): Promise<{ listing: Listing }> => {
  const { images, ...listingData } = data;
  const formData = buildListingFormData('crew', listingData, images);

  const response = await api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getCrewListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const updateCrewListing = async (
  id: string,
  data: Partial<Omit<CreateCrewListingData, 'images'>>
): Promise<{ listing: Listing }> => {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
};
