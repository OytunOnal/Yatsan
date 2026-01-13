'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import Filters, { FiltersProps } from '@/components/listings/Filters';
import { Listing, ListingType } from '@/lib/api';
import { DynamicFilters, DynamicFilterValue } from '@/types';

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersProps>({
    listingType: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    search: '',
  });
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilters>({});

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.listingType !== 'all') {
        queryParams.append('listingType', filters.listingType);
      }
      if (filters.minPrice) {
        queryParams.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice) {
        queryParams.append('maxPrice', filters.maxPrice);
      }
      if (filters.location) {
        queryParams.append('location', filters.location);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const res = await fetch(`http://localhost:3001/api/listings?${queryParams.toString()}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('İlanlar yüklenirken bir hata oluştu');
      }

      const data = await res.json();
      setListings(data.listings || []);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('İlanlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Filtre değiştiğinde otomatik fetch et
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (newFilters: FiltersProps) => {
    // listingType değiştiğinde dinamik filtreleri sıfırla
    if (newFilters.listingType !== filters.listingType) {
      setDynamicFilters({});
    }
    setFilters(newFilters);
  };

  const handleDynamicFilterChange = (name: string, value: DynamicFilterValue) => {
    setDynamicFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
                {Object.values(filters).some(v => v !== '' && v !== 'all') && (
                  <button
                    onClick={() => {
                      const resetFilters: FiltersProps = {
                        listingType: 'all',
                        minPrice: '',
                        maxPrice: '',
                        location: '',
                        search: '',
                      };
                      setFilters(resetFilters);
                      setDynamicFilters({});
                      setTimeout(fetchListings, 0);
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Temizle
                  </button>
                )}
              </div>
              <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                listingType={filters.listingType}
                dynamicFilters={dynamicFilters}
                onDynamicFilterChange={handleDynamicFilterChange}
              />
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  <p className="text-gray-600">İlanlar yükleniyor...</p>
                </div>
              </div>
            ) : error ? (
              <div className="card p-6 border-l-4 border-error-500">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-error-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Hata</p>
                    <p className="text-sm text-gray-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            ) : listings.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">İlan Bulunamadı</h3>
                <p className="text-gray-600 mb-6">
                  Arama kriterlerinize uygun ilan bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
                </p>
                <button
                  onClick={() => {
                    const resetFilters: FiltersProps = {
                      listingType: 'all',
                      minPrice: '',
                      maxPrice: '',
                      location: '',
                      search: '',
                    };
                    setFilters(resetFilters);
                    setDynamicFilters({});
                    setTimeout(fetchListings, 0);
                  }}
                  className="btn-primary"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <>
                {/* Active Filters */}
                {Object.values(filters).some(v => v !== '' && v !== 'all') && (
                  <div className="card p-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Aktif Filtreler:</span>
                      {filters.listingType !== 'all' && (
                        <span className="badge-primary">
                          {filters.listingType === 'yacht' ? 'Yat' : filters.listingType === 'part' ? 'Yedek Parça' : filters.listingType === 'marina' ? 'Marina' : 'Mürettebat'}
                        </span>
                      )}
                      {filters.minPrice && (
                        <span className="badge-gray">Min: {filters.minPrice}</span>
                      )}
                      {filters.maxPrice && (
                        <span className="badge-gray">Max: {filters.maxPrice}</span>
                      )}
                      {filters.location && (
                        <span className="badge-gray">{filters.location}</span>
                      )}
                      {filters.search && (
                        <span className="badge-gray">Arama: {filters.search}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
