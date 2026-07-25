import { Listing } from './listing.types';

// ============================================================================
// BROKER TYPE DEFINITIONS
// ============================================================================

export type BrokerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'message' | 'whatsapp';

export interface Broker {
  id: string;
  businessName: string;
  slug: string;
  status: BrokerStatus;
  rating: string;
  reviewCount: number;
  responseRate: string;
  responseTime: number | null;
  verifiedAt: string | null;
  createdAt: string;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  specialties: string[] | null;
  languages: string[] | null;
  serviceAreas: string[] | null;
  website: string | null;
  whatsapp: string | null;
  workingHours: Record<string, any> | null;
  socialMedia: Record<string, string> | null;
  establishedYear: number | null;
  teamSize: number | null;
  certifications: string[] | null;
  awards: string[] | null;
}

export interface BrokerProfile {
  id: string;
  brokerId: string;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  specialties: string[] | null;
  languages: string[] | null;
  serviceAreas: string[] | null;
  website: string | null;
  whatsapp: string | null;
  workingHours: Record<string, any> | null;
  socialMedia: Record<string, string> | null;
  establishedYear: number | null;
  teamSize: number | null;
  certifications: string[] | null;
  awards: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrmLead {
  id: string;
  brokerId: string;
  listingId: string | null;
  userId: string | null;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  budget: { min?: number; max?: number } | null;
  interestedCategories: string[] | null;
  notes: string | null;
  estimatedValue: string | null;
  probability: number | null;
  expectedCloseDate: string | null;
  lastContactDate: string | null;
  nextFollowUp: string | null;
  lostReason: string | null;
  createdAt: string;
  updatedAt: string;
  listingTitle?: string;
}

export interface CrmActivity {
  id: string;
  leadId: string;
  brokerId: string;
  type: ActivityType;
  subject: string;
  description: string | null;
  duration: number | null;
  outcome: 'positive' | 'neutral' | 'negative' | null;
  nextFollowUp: string | null;
  attachments: string[] | null;
  createdAt: string;
}

export interface BrokerReview {
  id: string;
  brokerId: string;
  userId: string;
  listingId: string | null;
  rating: number;
  title: string | null;
  comment: string;
  response: string | null;
  responseAt: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  helpful: number;
  createdAt: string;
  updatedAt: string;
  userFirstName?: string;
  userLastName?: string;
}
