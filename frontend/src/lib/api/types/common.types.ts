// ============================================================================
// COMMON TYPE DEFINITIONS
// ============================================================================

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED';
export type ListingCategory = 'YACHT' | 'PART' | 'MARINA' | 'CREW' | 'EQUIPMENT' | 'SERVICE' | 'STORAGE' | 'INSURANCE' | 'EXPERTISE' | 'MARKETPLACE';
export type ListingType = 'yacht' | 'part' | 'marina' | 'crew' | 'equipment' | 'service' | 'storage' | 'insurance' | 'expertise' | 'marketplace';
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

export interface PaginatedResponse<T> {
  data?: T[];
  listings?: T[];
  messages?: T[];
  conversations?: import('./message.types').Conversation[];
  total: number;
  page: number;
  limit: number;
}
