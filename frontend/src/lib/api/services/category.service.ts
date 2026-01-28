import { api } from '../client';
import { Category, CategorySuggestion, CategoryTreeResponse, CategorySuggestionsResponse } from '../types';

// ============================================================================
// CATEGORY API
// ============================================================================

// Tüm kategorileri getir (ağaç yapısında)
export const getAllCategories = async (includeInactive = false): Promise<CategoryTreeResponse> => {
  const response = await api.get('/categories', { params: { includeInactive } });
  return response.data;
};

// Ana kategorileri getir
export const getRootCategories = async (): Promise<{ success: boolean; data: Category[] }> => {
  const response = await api.get('/categories/root');
  return response.data;
};

// Alt kategorileri getir
export const getChildCategories = async (parentId: string): Promise<{ success: boolean; data: Category[] }> => {
  const response = await api.get(`/categories/${parentId}/children`);
  return response.data;
};

// Kategori detayını getir (ID ile)
export const getCategoryById = async (id: string): Promise<{ success: boolean; data: Category }> => {
  const response = await api.get(`/categories/id/${id}`);
  return response.data;
};

// Kategori detayını getir (Slug ile)
export const getCategoryBySlug = async (slug: string): Promise<{ success: boolean; data: Category }> => {
  const response = await api.get(`/categories/slug/${slug}`);
  return response.data;
};

// Kategori ara
export const searchCategories = async (query: string): Promise<{
  success: boolean;
  data: Category[];
  meta: { query: string; total: number }
}> => {
  const response = await api.get('/categories/search', { params: { q: query } });
  return response.data;
};

// Kategori önerisi oluştur
export const suggestCategory = async (data: {
  name: string;
  description?: string;
  parentCategoryId: string;
  reason?: string;
}): Promise<{ success: boolean; message: string; data: { id: string; name: string; similarCategories: number } }> => {
  const response = await api.post('/categories/suggest', data);
  return response.data;
};

// Kullanıcının kategori önerilerini getir
export const getUserCategorySuggestions = async (): Promise<CategorySuggestionsResponse> => {
  const response = await api.get('/categories/suggestions');
  return response.data;
};

// Admin: Tüm kategori önerilerini getir
export const getAllCategorySuggestions = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<CategorySuggestionsResponse> => {
  const response = await api.get('/categories/admin/suggestions', { params });
  return response.data;
};

// Admin: Kategori önerisini onayla
export const approveCategorySuggestion = async (
  id: string,
  data?: { order?: number }
): Promise<{ success: boolean; message: string; data: { categoryId: string } }> => {
  const response = await api.patch(`/categories/admin/suggestions/${id}/approve`, data);
  return response.data;
};

// Admin: Kategori önerisini reddet
export const rejectCategorySuggestion = async (
  id: string,
  data?: { reason?: string }
): Promise<{ success: boolean; message: string }> => {
  const response = await api.patch(`/categories/admin/suggestions/${id}/reject`, data);
  return response.data;
};

// Admin: Kategori önerisini birleştir
export const mergeCategorySuggestion = async (
  id: string,
  data: { existingCategoryId: string }
): Promise<{ success: boolean; message: string; data: { categoryId: string; categoryName: string } }> => {
  const response = await api.patch(`/categories/admin/suggestions/${id}/merge`, data);
  return response.data;
};

// Admin: Yeni kategori oluştur
export const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  order?: number;
  isActive?: boolean;
}): Promise<{ success: boolean; message: string; data: Category }> => {
  const response = await api.post('/categories/admin', data);
  return response.data;
};

// Admin: Kategori güncelle
export const updateCategory = async (
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    description: string;
    icon: string;
    image: string;
    parentId: string;
    order: number;
    isActive: boolean;
  }>
): Promise<{ success: boolean; message: string; data: Category }> => {
  const response = await api.patch(`/categories/admin/${id}`, data);
  return response.data;
};

// Admin: Kategori sil
export const deleteCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/categories/admin/${id}`);
  return response.data;
};
