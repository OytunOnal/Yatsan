'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Filters from '../../components/listings/Filters';

export default function FiltersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Initialize from URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategories(categoryParam.split(','));
    }
    const minPriceParam = searchParams.get('minPrice');
    if (minPriceParam) {
      setMinPrice(Number(minPriceParam));
    }
    const maxPriceParam = searchParams.get('maxPrice');
    if (maxPriceParam) {
      setMaxPrice(Number(maxPriceParam));
    }
    const locationParam = searchParams.get('location');
    if (locationParam) {
      setLocation(locationParam);
    }
  }, [searchParams]);

  const handleApplyFilters = (filters: {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    location: string;
  }) => {
    const params = new URLSearchParams();
    if (filters.categories.length > 0) {
      params.set('category', filters.categories.join(','));
    }
    if (filters.minPrice > 0) {
      params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice < 1000000) {
      params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.location) {
      params.set('location', filters.location);
    }

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <Filters
      onApplyFilters={handleApplyFilters}
    />
  );
}