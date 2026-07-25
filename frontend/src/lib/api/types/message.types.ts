import { Listing } from './listing.types';

// ============================================================================
// MESSAGE TYPE DEFINITIONS
// ============================================================================

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
