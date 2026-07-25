/**
 * Global Type Definitions
 *
 * This file contains shared type definitions for the Express app.
 */

import type { JwtPayload } from 'jsonwebtoken';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from '../db/schema';
import type { Request } from 'express';

// ============================================
// USER TYPES
// ============================================

export type UserType = 'ADMIN' | 'individual' | 'corporate';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

// User type from JWT token
export interface AuthUser extends JwtPayload {
  id: string;
  email: string;
  userType: UserType;
  iat?: number;
  exp?: number;
}

// ============================================
// DATABASE TYPES
// ============================================

export type Database = PostgresJsDatabase<typeof schema>;

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
  meta?: ResponseMeta;
}

export interface ApiError {
  path: string;
  message: string;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

// ============================================
// LISTING TYPES
// ============================================

export type ListingType = 'yacht' | 'part' | 'marina' | 'crew';
export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED';

export interface ListingFilters {
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  status?: ListingStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================
// MESSAGE TYPES
// ============================================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId?: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  latestMessage: Message | null;
  unreadCount: number;
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Type guard to check if req.user is defined
 * Use this in protected routes after auth middleware
 */
export function isAuthenticated(req: Request): req is Request & { user: AuthUser } {
  return req.user !== undefined;
}

/**
 * Assert that req.user is defined
 * Throws an error if user is not authenticated
 */
export function assertAuthenticated(req: Request): asserts req is Request & { user: AuthUser } {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
}
