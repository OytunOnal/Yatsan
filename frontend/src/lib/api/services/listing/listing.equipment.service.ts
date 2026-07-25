import { api } from '../../client';
import { Listing } from '../../types';
import { buildListingFormData } from '../../utils/formData.utils';

// ============================================================================
// EQUIPMENT LISTING API
// ============================================================================

export interface CreateEquipmentListingData {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  equipmentType: string;
  brand?: string;
  model?: string;
  condition: string;
  yearOfManufacture?: number;
  warrantyMonths?: number;
  powerConsumption?: number;
  voltage?: string;
  dimensions?: string;
  weight?: number;
  compatibleBoatTypes?: string;
  compatibleBoatLengths?: string;
  installationRequired?: boolean;
  manualIncluded?: boolean;
  images?: File[];
}

export const createEquipmentListing = async (data: CreateEquipmentListingData): Promise<{ listing: Listing }> => {
  const { images, ...listingData } = data;
  const formData = buildListingFormData('equipment', listingData, images);

  const response = await api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getEquipmentListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const updateEquipmentListing = async (
  id: string,
  data: Partial<Omit<CreateEquipmentListingData, 'images'>>
): Promise<{ listing: Listing }> => {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
};
