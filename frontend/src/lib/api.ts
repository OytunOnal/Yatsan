/**
 * API Module - Backward Compatibility Wrapper
 * 
 * Bu dosya eski api.ts dosyasındaki tüm export'ları koruyarak
 * geriye dönük uyumluluk sağlar.
 * 
 * Yeni kullanım (önerilir):
 * import { getDashboardStats } from '@/lib/api/services/dashboard.service';
 * import type { Listing } from '@/lib/api/types';
 * 
 * Eski kullanım (hala çalışır):
 * import { getDashboardStats, Listing } from '@/lib/api';
 */

// Export axios instance
export { api, API_URL, BASE_URL } from './api/client';
export { api as default } from './api/client';

// Export all types
export * from './api/types';

// Export all services
export * from './api/services';

// Export utility functions
export { getImageUrl } from './api/utils/image.utils';
export { mapStatusToBackend, mapStatusToFrontend, getStatusLabel, getStatusColor } from './api/utils/status.utils';
