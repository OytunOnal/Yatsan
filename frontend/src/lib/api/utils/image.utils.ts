import { BASE_URL } from '../client';

// Helper function to get full image URL
export const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Remove /api from BASE_URL and construct full URL
  const baseUrl = BASE_URL.replace('/api', '');
  return `${baseUrl}${url}`;
};
