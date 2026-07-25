import { ListingStatus } from '../types/common.types';

// Frontend status values ('active', 'pending', 'sold') to Backend status values
export const mapStatusToBackend = (status: string): ListingStatus => {
  const statusMap: Record<string, ListingStatus> = {
    'active': 'APPROVED',
    'pending': 'PENDING',
    'sold': 'DELETED',
    'rejected': 'REJECTED',
    'deleted': 'DELETED',
  };
  return statusMap[status] || 'PENDING';
};

// Backend status values to Frontend status values
export const mapStatusToFrontend = (status: ListingStatus): string => {
  const statusMap: Record<ListingStatus, string> = {
    'APPROVED': 'active',
    'PENDING': 'pending',
    'REJECTED': 'rejected',
    'DELETED': 'sold',
  };
  return statusMap[status] || 'pending';
};

// Get display label for status
export const getStatusLabel = (status: ListingStatus): string => {
  const labels: Record<ListingStatus, string> = {
    'APPROVED': 'Aktif',
    'PENDING': 'Beklemede',
    'REJECTED': 'Reddedildi',
    'DELETED': 'Satıldı',
  };
  return labels[status] || status;
};

// Get color class for status
export const getStatusColor = (status: ListingStatus): string => {
  const colors: Record<ListingStatus, string> = {
    'APPROVED': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'DELETED': 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
