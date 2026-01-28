import { api } from '../client';
import { UserProfile } from '../types';

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
