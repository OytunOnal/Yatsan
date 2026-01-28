'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  listingCount: number;
  subcategories?: Subcategory[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  listingCount: number;
  subcategories: Subcategory[];
}

interface CategorySidebarProps {
  className?: string;
}

export default function CategorySidebar({ className = '' }: CategorySidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:3001/api/categories?withCounts=true', {
          cache: 'no-store',
        });
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}>
        <div className="p-5 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-3/4 ml-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {/* Category List */}
      <div className="p-3">
        {categories.map((category, index) => (
            <div key={category.id} className={index > 0 ? 'mt-1' : ''}>
              {/* Main Category - Now clickable link */}
              <Link
                href={`/listings?category=${category.slug}`}
                className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">{category.icon}</span>
                  <span className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-700 transition-colors">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    {category.listingCount || 0}
                  </span>
                </div>
              </Link>

              {/* Subcategories - Always expanded */}
              {category.subcategories.length > 0 && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/listings?category=${category.slug}&subcategory=${subcategory.slug}`}
                      className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group/sub"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1 h-1 rounded-full bg-gray-300 group-hover/sub:bg-blue-400 transition-colors"></div>
                        <span className="truncate">{subcategory.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md group-hover/sub:bg-blue-100 group-hover/sub:text-blue-600 transition-colors">
                        {subcategory.listingCount || 0}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Footer - Show All Link */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <Link
          href="/listings"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 font-medium rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-200 group"
        >
          <span>Tüm İlanları Gör</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
