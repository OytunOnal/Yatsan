import { api } from '../client';
import { Broker, BrokerProfile, CrmLead, CrmActivity, BrokerReview, Listing, BrokerStatus, LeadStatus, LeadPriority, ActivityType } from '../types';

// ============================================================================
// BROKER API
// ============================================================================

// Broker kayıt
export const registerBroker = async (data: {
  businessName: string;
  taxNumber: string;
  taxOffice: string;
  licenseNumber: string;
  licenseExpiry: string;
  profile?: Partial<BrokerProfile>;
}): Promise<{ message: string; broker: Broker }> => {
  const response = await api.post('/broker/register', data);
  return response.data;
};

// Broker mağaza sayfası
export const getBrokerBySlug = async (slug: string): Promise<{
  broker: Broker;
  stats: { listingCount: number };
  reviews: BrokerReview[];
}> => {
  const response = await api.get(`/brokers/${slug}`);
  return response.data;
};

// Broker ilanları
export const getBrokerListings = async (slug: string, params?: {
  page?: number;
  limit?: number;
}): Promise<{
  listings: Listing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await api.get(`/brokers/${slug}/listings`, { params });
  return response.data;
};

// Broker profil (kendi)
export const getBrokerProfile = async (): Promise<{ broker: Broker; profile: BrokerProfile | null }> => {
  const response = await api.get('/broker/profile');
  return response.data;
};

// Broker profil güncelle
export const updateBrokerProfile = async (data: Partial<BrokerProfile>): Promise<{ message: string }> => {
  const response = await api.put('/broker/profile', data);
  return response.data;
};

// CRM: Lead listesi
export const getLeads = async (params?: {
  status?: LeadStatus;
  priority?: LeadPriority;
  page?: number;
  limit?: number;
}): Promise<{
  leads: CrmLead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await api.get('/broker/leads', { params });
  return response.data;
};

// CRM: Lead oluştur
export const createLead = async (data: {
  listingId?: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  priority?: LeadPriority;
  budget?: { min?: number; max?: number };
  interestedCategories?: string[];
  notes?: string;
  estimatedValue?: string;
  probability?: number;
  expectedCloseDate?: string;
}): Promise<CrmLead> => {
  const response = await api.post('/broker/leads', data);
  return response.data;
};

// CRM: Lead güncelle
export const updateLead = async (id: string, data: {
  status?: LeadStatus;
  priority?: LeadPriority;
  budget?: { min?: number; max?: number };
  interestedCategories?: string[];
  notes?: string;
  estimatedValue?: string;
  probability?: number;
  expectedCloseDate?: string;
  nextFollowUp?: string;
  lostReason?: string;
}): Promise<{ message: string }> => {
  const response = await api.put(`/broker/leads/${id}`, data);
  return response.data;
};

// CRM: Lead aktiviteleri
export const getLeadActivities = async (leadId: string): Promise<CrmActivity[]> => {
  const response = await api.get(`/broker/leads/${leadId}/activities`);
  return response.data;
};

// CRM: Aktivite oluştur
export const createActivity = async (leadId: string, data: {
  type: ActivityType;
  subject: string;
  description?: string;
  duration?: number;
  outcome?: 'positive' | 'neutral' | 'negative';
  nextFollowUp?: string;
  attachments?: string[];
}): Promise<CrmActivity> => {
  const response = await api.post(`/broker/leads/${leadId}/activities`, data);
  return response.data;
};

// Broker analitik
export const getBrokerAnalytics = async (): Promise<{
  listings: {
    totalListings: number;
    totalViews: number;
    totalInquiries: number;
    totalLeads: number;
  };
  leads: {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
  activities: {
    totalActivities: number;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
  };
}> => {
  const response = await api.get('/broker/analytics');
  return response.data;
};

// Admin: Bekleyen brokerlar
export const getPendingBrokers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  brokers: Array<Broker & {
    userEmail: string;
    userFirstName: string;
    userLastName: string;
    userPhone: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await api.get('/admin/brokers/pending', { params });
  return response.data;
};

// Admin: Broker durumu güncelle
export const updateBrokerStatus = async (id: string, data: {
  status: BrokerStatus;
  rejectionReason?: string;
}): Promise<{ message: string }> => {
  const response = await api.patch(`/admin/brokers/${id}/status`, data);
  return response.data;
};

// Broker değerlendirmesi oluştur
export const createBrokerReview = async (data: {
  brokerId: string;
  listingId?: string;
  rating: number;
  title?: string;
  comment: string;
}): Promise<BrokerReview> => {
  const response = await api.post(`/brokers/${data.brokerId}/reviews`, data);
  return response.data;
};

// Admin: Değerlendirme durumu güncelle
export const updateReviewStatus = async (id: string, data: {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}): Promise<{ message: string }> => {
  const response = await api.patch(`/admin/broker-reviews/${id}/status`, data);
  return response.data;
};

// Broker: Değerlendirmeye yanıt ver
export const respondToReview = async (id: string, data: {
  response: string;
}): Promise<{ message: string }> => {
  const response = await api.post(`/broker/reviews/${id}/respond`, data);
  return response.data;
};
