import { api } from '../../client';
import { Listing } from '../../types';
import { buildListingFormData } from '../../utils/formData.utils';

// Service, Storage, Insurance, Expertise, Marketplace listing servisleri
// Benzer yapıda olduğu için tek dosyada toplandı

// ============================================================================
// SERVICE LISTING API
// ============================================================================

export interface CreateServiceListingData {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  serviceType: string;
  businessName?: string;
  yearsInBusiness?: number;
  certifications?: string;
  authorizedBrands?: string;
  serviceArea?: string;
  mobileService?: boolean;
  emergencyService?: boolean;
  emergencyPhone?: string;
  priceType?: string;
  hourlyRate?: number;
  minServiceFee?: number;
  workingHours?: string;
  website?: string;
  whatsapp?: string;
  images?: File[];
}

export const createServiceListing = async (data: CreateServiceListingData): Promise<{ listing: Listing }> => {
  const { images, ...listingData } = data;
  const formData = buildListingFormData('service', listingData, images);
  const response = await api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ============================================================================
// STORAGE LISTING API
// ============================================================================

export interface CreateStorageListingData {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  storageType: string;
  facilityName?: string;
  maxBoatLength?: number;
  maxBoatBeam?: number;
  maxBoatHeight?: number;
  maxBoatWeight?: number;
  securityFeatures?: string;
  hasElectricity?: boolean;
  hasWater?: boolean;
  hasCamera?: boolean;
  hasGuard?: boolean;
  hasLift?: boolean;
  liftCapacity?: number;
  accessHours?: string;
  gateAccess?: boolean;
  winterizationService?: boolean;
  maintenanceService?: boolean;
  launchService?: boolean;
  images?: File[];
}

export const createStorageListing = async (data: CreateStorageListingData): Promise<{ listing: Listing }> => {
  const { images, ...listingData } = data;
  const formData = buildListingFormData('storage', listingData, images);
  const response = await api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ============================================================================
// INSURANCE LISTING API
// ============================================================================

export interface CreateInsuranceListingData {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  companyName: string;
  agencyName?: string;
  licenseNumber?: string;
  insuranceType: string;
  coverageTypes?: string;
  minBoatLength?: number;
  maxBoatLength?: number;
  minBoatValue?: number;
  maxBoatValue?: number;
  boatAgeLimit?: number;
  coverageArea?: string;
  premiumCalculation?: string;
  minPremium?: number;
  premiumPercentage?: number;
  hullCoverage?: boolean;
  liabilityCoverage?: boolean;
  salvageCoverage?: boolean;
  personalAccident?: boolean;
  legalProtection?: boolean;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  images?: File[];
}

export const createInsuranceListing = async (data: CreateInsuranceListingData): Promise<{ listing: Listing }> => {
  const { images, ...listingData } = data;
  const formData = buildListingFormData('insurance', listingData, images);
  const response = await api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ============================================================================
// EXPERTISE LISTING API
// ============================================================================

export interface CreateExpertiseListingData {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  companyName?: string;
  expertName?: string;
  licenseNumber?: string;
  yearsExperience?: number;
  expertiseType: string;
  boatTypes?: string;
  minBoatLength?: number;
  maxBoatLength?: number;
  serviceArea?: string;
  mobileService?: boolean;
  reportTypes?: string;
  reportLanguages?: string;
  turnaroundTime?: string;
  basePrice?: number;
  pricePerMeter?: number;
  travelFee?: number;
  certifications?: string;
  memberships?: string;
  phone?: string;
  email?: string;
  website?: string;
  images?: File[];
}

export const createExpertiseListing = async (data: CreateExpertiseListingData): Promise<{ listing: Listing }> => {
  const { images, ...listingData } = data;
  const formData = buildListingFormData('expertise', listingData, images);
  const response = await api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ============================================================================
// MARKETPLACE LISTING API
// ============================================================================

export interface CreateMarketplaceListingData {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  itemType: string;
  brand?: string;
  model?: string;
  condition: string;
  yearPurchased?: number;
  usageFrequency?: string;
  originalPrice?: number;
  reasonForSelling?: string;
  dimensions?: string;
  weight?: number;
  color?: string;
  material?: string;
  includesOriginalBox?: boolean;
  includesManual?: boolean;
  includesAccessories?: boolean;
  accessoriesDescription?: string;
  negotiable?: boolean;
  acceptTrade?: boolean;
  tradeInterests?: string;
  images?: File[];
}

export const createMarketplaceListing = async (data: CreateMarketplaceListingData): Promise<{ listing: Listing }> => {
  const { images, ...listingData } = data;
  const formData = buildListingFormData('marketplace', listingData, images);
  const response = await api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
