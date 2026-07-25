'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Filters, { FiltersProps } from '../../components/listings/Filters';
import { ListingType } from '../../lib/api';
import { DynamicFilters, DynamicFilterValue } from '../../types';

export default function FiltersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FiltersProps>({
    listingType: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    search: '',
  });
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilters>({});

  useEffect(() => {
    // Initialize from URL params
    const listingTypeParam = searchParams.get('listingType') as ListingType | 'all' | null;
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const locationParam = searchParams.get('location');
    const searchParam = searchParams.get('search');

    setFilters({
      listingType: listingTypeParam || 'all',
      minPrice: minPriceParam || '',
      maxPrice: maxPriceParam || '',
      location: locationParam || '',
      search: searchParam || '',
    });
  }, [searchParams]);

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
    const params = new URLSearchParams();
    
    if (filters.listingType !== 'all') {
      params.set('listingType', filters.listingType);
    }
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice);
    }
    if (filters.location) {
      params.set('location', filters.location);
    }
    if (filters.search) {
      params.set('search', filters.search);
    }

    // Dinamik filtreleri URL'e ekle
    Object.entries(dynamicFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        }
      } else if (typeof value === 'object' && value !== null) {
        // Range value
        const rangeValue = value as { min?: number; max?: number };
        if (rangeValue.min !== undefined) {
          params.set(`${key}_min`, rangeValue.min.toString());
        }
        if (rangeValue.max !== undefined) {
          params.set(`${key}_max`, rangeValue.max.toString());
        }
      } else if (value !== '' && value !== null && value !== undefined) {
        params.set(key, value.toString());
      }
    });

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <Filters
      filters={filters}
      onFilterChange={handleFilterChange}
      onSearch={handleSearch}
      listingType={filters.listingType}
      dynamicFilters={dynamicFilters}
      onDynamicFilterChange={handleDynamicFilterChange}
    />
  );
}
