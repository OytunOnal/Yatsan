import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token'ı zustand store'dan al (localStorage'dan değil)
    // Zustand persist middleware token'ı localStorage'a 'auth-storage' key'i ile kaydeder
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse auth storage:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED';
export type ListingCategory = 'YACHT' | 'PART' | 'MARINA' | 'CREW';
export type ListingType = 'yacht' | 'part' | 'marina' | 'crew';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type UserType = 'USER' | 'ADMIN';

export interface DashboardStats {
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
  rejectedListings: number;
  totalMessages: number;
  unreadMessages: number;
}

export interface ListingImage {
  id: string;
  url: string;
  orderIndex: number;
  createdAt: string;
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

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  phoneVerified: boolean;
  kvkkApproved: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  listingId: string | null;
  read: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  listing?: {
    id: string;
    title: string;
    price: number;
  };
}

export interface Conversation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  latestMessage: Message | null;
  unreadCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  phoneVerified: boolean;
  kvkkApproved: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  listings?: T[];
  messages?: T[];
  conversations?: Conversation[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================================
// STATUS MAPPING HELPERS
// ============================================================================

// Frontend status values ('active', 'pending', 'sold') to Backend status values
export const mapStatusToBackend = (status: string): ListingStatus => {
  const statusMap: Record<string, ListingStatus> = {
    'active': 'APPROVED',
    'pending': 'PENDING',
    'sold': 'DELETED',
    'rejected': 'REJECTED',
    'deleted': 'DELETED',
  };
  return statusMap[status] || 'PENDING';
};

// Backend status values to Frontend status values
export const mapStatusToFrontend = (status: ListingStatus): string => {
  const statusMap: Record<ListingStatus, string> = {
    'APPROVED': 'active',
    'PENDING': 'pending',
    'REJECTED': 'rejected',
    'DELETED': 'sold',
  };
  return statusMap[status] || 'pending';
};

// Get display label for status
export const getStatusLabel = (status: ListingStatus): string => {
  const labels: Record<ListingStatus, string> = {
    'APPROVED': 'Aktif',
    'PENDING': 'Beklemede',
    'REJECTED': 'Reddedildi',
    'DELETED': 'Satıldı',
  };
  return labels[status] || status;
};

// Get color class for status
export const getStatusColor = (status: ListingStatus): string => {
  const colors: Record<ListingStatus, string> = {
    'APPROVED': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'DELETED': 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

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

// ============================================================================
// LISTING API
// ============================================================================

// Genel ilan API'leri
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
  data: Partial<Omit<Listing, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'images' | 'user' | 'yachtListing' | 'partListing' | 'marinaListing' | 'crewListing'>>
): Promise<{ listing: Listing }> => {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
};

export const deleteListing = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
};

// Yacht Listing API'leri
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
}): Promise<{ listing: Listing }> => {
  const response = await api.post('/listings/yacht', data);
  return response.data;
};

export const getYachtListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/yacht/${id}`);
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
  const response = await api.put(`/listings/yacht/${id}`, data);
  return response.data;
};

// Part Listing API'leri
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
}): Promise<{ listing: Listing }> => {
  const response = await api.post('/listings/part', data);
  return response.data;
};

export const getPartListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/part/${id}`);
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
  const response = await api.put(`/listings/part/${id}`, data);
  return response.data;
};

// Marina Listing API'leri
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
}): Promise<{ listing: Listing }> => {
  const response = await api.post('/listings/marina', data);
  return response.data;
};

export const getMarinaListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/marina/${id}`);
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
  const response = await api.put(`/listings/marina/${id}`, data);
  return response.data;
};

// Crew Listing API'leri
export const createCrewListing = async (data: {
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
}): Promise<{ listing: Listing }> => {
  const response = await api.post('/listings/crew', data);
  return response.data;
};

export const getCrewListing = async (id: string): Promise<{ listing: Listing }> => {
  const response = await api.get(`/listings/crew/${id}`);
  return response.data;
};

export const updateCrewListing = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    currency: string;
    location: string;
    position: string;
    experience: number;
    certifications: string;
    availability: string;
    availableFrom: string;
    availableTo: string;
    salary: string;
    salaryCurrency: string;
    salaryPeriod: string;
  }>
): Promise<{ listing: Listing }> => {
  const response = await api.put(`/listings/crew/${id}`, data);
  return response.data;
};

// ============================================================================
// MESSAGE API
// ============================================================================

export const getConversations = async (): Promise<{ conversations: Conversation[] }> => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const getMessages = async (
  otherUserId: string,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<PaginatedResponse<Message>> => {
  const response = await api.get(`/messages/${otherUserId}`, { params });
  return {
    messages: response.data.messages,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
};

export const sendMessage = async (data: {
  receiverId: string;
  listingId?: string;
  content: string;
}): Promise<{ message: Message }> => {
  const response = await api.post('/messages', data);
  return response.data;
};

export const markMessagesAsRead = async (data: {
  messageIds: string[];
}): Promise<{ message: string }> => {
  const response = await api.put('/messages/read', data);
  return response.data;
};

// ============================================================================
// PROFILE API
// ============================================================================

export const getProfile = async (): Promise<{ user: UserProfile }> => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}): Promise<{ user: UserProfile }> => {
  const response = await api.put('/profile', data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await api.put('/profile/password', data);
  return response.data;
};

// ============================================================================
// FILTER SCHEMA API
// ============================================================================

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

export const getFilterSchema = async (listingType: string): Promise<FilterSchemaResponse> => {
  const response = await api.get(`/listings/filters/schema/${listingType}`);
  return response.data;
};

export default api;
