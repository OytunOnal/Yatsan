import { ListingStatus, ListingType, UserType } from './common.types';

// ============================================================================
// LISTING TYPE DEFINITIONS
// ============================================================================

export interface ListingImage {
  id: string;
  url: string;
  orderIndex: number;
  createdAt: string;
}

export interface YachtListingData {
  id: string;
  yachtType: string;
  year: number;
  length: string;
  beam: string;
  draft: string;
  engineBrand: string | null;
  engineHours: number | null;
  engineHP: number | null;
  fuelType: string | null;
  cruisingSpeed: number | null;
  maxSpeed: number | null;
  cabinCount: number | null;
  bedCount: number | null;
  bathroomCount: number | null;
  equipment: string | null;
  condition: string;
}

export interface PartListingData {
  id: string;
  condition: string;
  brand: string;
  oemCode: string | null;
  compatibility: string | null;
  description: string | null;
}

export interface MarinaListingData {
  id: string;
  priceType: string;
  maxLength: string;
  maxBeam: string;
  maxDraft: string | null;
  services: string;
  availability: string | null;
}

export interface CrewListingData {
  id: string;
  position: string;
  experience: number;
  certifications: string | null;
  availability: string;
  availableFrom: string | null;
  availableTo: string | null;
  salary: string | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
}

export interface EquipmentListingData {
  id: string;
  equipmentType: string;
  brand: string | null;
  model: string | null;
  condition: string;
  yearOfManufacture: number | null;
  warrantyMonths: number | null;
  powerConsumption: string | null;
  voltage: string | null;
  dimensions: string | null;
  weight: string | null;
  compatibleBoatTypes: string | null;
  compatibleBoatLengths: string | null;
  installationRequired: boolean;
  manualIncluded: boolean;
}

export interface ServiceListingData {
  id: string;
  serviceType: string;
  businessName: string | null;
  yearsInBusiness: number | null;
  certifications: string | null;
  authorizedBrands: string | null;
  serviceArea: string | null;
  mobileService: boolean;
  emergencyService: boolean;
  emergencyPhone: string | null;
  priceType: string | null;
  hourlyRate: string | null;
  minServiceFee: string | null;
  workingHours: string | null;
  website: string | null;
  whatsapp: string | null;
}

export interface StorageListingData {
  id: string;
  storageType: string;
  facilityName: string | null;
  maxBoatLength: string | null;
  maxBoatBeam: string | null;
  maxBoatHeight: string | null;
  maxBoatWeight: string | null;
  securityFeatures: string | null;
  hasElectricity: boolean;
  hasWater: boolean;
  hasCamera: boolean;
  hasGuard: boolean;
  hasLift: boolean;
  liftCapacity: string | null;
  accessHours: string | null;
  gateAccess: boolean;
  winterizationService: boolean;
  maintenanceService: boolean;
  launchService: boolean;
}

export interface InsuranceListingData {
  id: string;
  companyName: string;
  agencyName: string | null;
  licenseNumber: string | null;
  insuranceType: string;
  coverageTypes: string | null;
  minBoatLength: string | null;
  maxBoatLength: string | null;
  minBoatValue: string | null;
  maxBoatValue: string | null;
  boatAgeLimit: number | null;
  coverageArea: string | null;
  premiumCalculation: string | null;
  minPremium: string | null;
  premiumPercentage: string | null;
  hullCoverage: boolean;
  liabilityCoverage: boolean;
  salvageCoverage: boolean;
  personalAccident: boolean;
  legalProtection: boolean;
  contactPerson: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  website: string | null;
}

export interface ExpertiseListingData {
  id: string;
  companyName: string | null;
  expertName: string | null;
  licenseNumber: string | null;
  yearsExperience: number | null;
  expertiseType: string;
  boatTypes: string | null;
  minBoatLength: string | null;
  maxBoatLength: string | null;
  serviceArea: string | null;
  mobileService: boolean;
  reportTypes: string | null;
  reportLanguages: string | null;
  turnaroundTime: string | null;
  basePrice: string | null;
  pricePerMeter: string | null;
  travelFee: string | null;
  certifications: string | null;
  memberships: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

export interface MarketplaceListingData {
  id: string;
  itemType: string;
  brand: string | null;
  model: string | null;
  condition: string;
  yearPurchased: number | null;
  usageFrequency: string | null;
  originalPrice: string | null;
  reasonForSelling: string | null;
  dimensions: string | null;
  weight: string | null;
  color: string | null;
  material: string | null;
  includesOriginalBox: boolean;
  includesManual: boolean;
  includesAccessories: boolean;
  accessoriesDescription: string | null;
  negotiable: boolean;
  acceptTrade: boolean;
  tradeInterests: string | null;
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  listingType: ListingType;
  status: ListingStatus;
  rejectionReason: string | null;
  userId: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  images?: ListingImage[];
  user?: {
    id: string;
    email: string;
    userType: UserType;
  };
  // Yacht specific fields
  yachtListing?: YachtListingData;
  // Part specific fields
  partListing?: PartListingData;
  // Marina specific fields
  marinaListing?: MarinaListingData;
  // Crew specific fields
  crewListing?: CrewListingData;
  // Equipment specific fields
  equipmentListing?: EquipmentListingData;
  // Service specific fields
  serviceListing?: ServiceListingData;
  // Storage specific fields
  storageListing?: StorageListingData;
  // Insurance specific fields
  insuranceListing?: InsuranceListingData;
  // Expertise specific fields
  expertiseListing?: ExpertiseListingData;
  // Marketplace specific fields
  marketplaceListing?: MarketplaceListingData;
}

export interface FilterSchema {
  name: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'range' | 'multiselect';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface FilterSchemaResponse {
  filters: FilterSchema[];
}
