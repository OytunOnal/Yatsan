// ============================================================================
// CATEGORY TYPE DEFINITIONS
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  listingCount: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  parent?: Category;
}

export interface CategorySuggestion {
  id: string;
  name: string;
  description: string | null;
  parentCategoryId: string;
  suggestedBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MERGED';
  listingCount: number;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  mergedWith: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeResponse {
  success: boolean;
  data: Category[];
  meta: {
    total: number;
    active: number;
  };
}

export interface CategorySuggestionsResponse {
  success: boolean;
  data: CategorySuggestion[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
