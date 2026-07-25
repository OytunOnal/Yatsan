import { Listing } from './listing.types';
import { UserProfile } from './user.types';
import { UserStatus } from './common.types';

// ============================================================================
// ADMIN TYPE DEFINITIONS
// ============================================================================

export interface PlatformStats {
  users: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
  };
  listings: {
    totalListings: number;
    pendingListings: number;
    approvedListings: number;
    rejectedListings: number;
    newListingsThisMonth: number;
  };
  messages: {
    totalMessages: number;
    unreadMessages: number;
  };
  brokers: {
    totalBrokers: number;
    pendingBrokers: number;
    approvedBrokers: number;
  };
}

// ============================================================================
// FAVORITES TYPE DEFINITIONS
// ============================================================================

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
  listing?: Listing;
}

// ============================================================================
// NOTIFICATIONS TYPE DEFINITIONS
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
