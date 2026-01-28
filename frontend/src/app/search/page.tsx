'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getListings, type Listing } from '@/lib/api';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    listingType: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || '',
  });

  useEffect(() => {
    if (query || filters.listingType || filters.location) {
      fetchListings();
    }
  }, [query, filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params: any = { status: 'APPROVED' };
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.location) params.location = filters.location;
      
      const response = await getListings(params);
      let filteredListings = response.listings || [];
      
      // Client-side filtering for price range
      if (filters.minPrice) {
        filteredListings = filteredListings.filter((l: Listing) => Number(l.price) >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        filteredListings = filteredListings.filter((l: Listing) => Number(l.price) <= Number(filters.maxPrice));
      }
      
      // Client-side search for title/description
      if (query) {
        const searchLower = query.toLowerCase();
        filteredListings = filteredListings.filter((l: Listing) =>
          l.title.toLowerCase().includes(searchLower) ||
          (l.description && l.description.toLowerCase().includes(searchLower))
        );
      }
      
      setListings(filteredListings);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      listingType: '',
      minPrice: '',
      maxPrice: '',
      location: '',
    });
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `"${query}" için Arama Sonuçları` : 'İlan Ara'}
          </h1>
          <p className="text-gray-600 mt-1">
            {loading ? 'Aranıyor...' : `${listings.length} ilan bulundu`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filtreler</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Temizle
                </button>
              </div>

              <div className="space-y-4">
                {/* İlan Tipi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlan Tipi
                  </label>
                  <select
                    value={filters.listingType}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tümü</option>
                    <option value="yacht">Yat</option>
                    <option value="part">Yedek Parça</option>
                    <option value="marina">Marina</option>
                    <option value="crew">Mürettebat</option>
                  </select>
                </div>

                {/* Fiyat Aralığı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat Aralığı (₺)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Konum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konum
                  </label>
                  <input
                    type="text"
                    placeholder="Şehir veya ilçe"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={fetchListings}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Filtrele
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Sonuç bulunamadı</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Arama kriterlerinize uygun ilan bulunamadı. Filtreleri değiştirerek tekrar deneyin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <a
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19.5v-15A2.5 2.5 0 015.5 2h13A2.5 2.5 0 0121 4.5v15a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                          {listing.listingType === 'yacht' ? 'Yat' : 
                           listing.listingType === 'part' ? 'Parça' :
                           listing.listingType === 'marina' ? 'Marina' : 'Mürettebat'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {listing.title}
                      </h3>
                      {listing.location && (
                        <p className="text-sm text-gray-500 mb-2">{listing.location}</p>
                      )}
                      <p className="text-lg font-bold text-blue-600">
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: listing.currency || 'TRY',
                        }).format(Number(listing.price))}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
