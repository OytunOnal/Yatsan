import { UserStatus, UserType } from './common.types';

// ============================================================================
// USER TYPE DEFINITIONS
// ============================================================================

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
