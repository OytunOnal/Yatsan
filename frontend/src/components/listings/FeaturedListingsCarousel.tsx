'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Listing, getImageUrl } from '@/lib/api';

interface FeaturedListingsCarouselProps {
  limit?: number;
}

export default function FeaturedListingsCarousel({ limit = 8 }: FeaturedListingsCarouselProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/listings?status=APPROVED&featured=true&limit=${limit}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error('Failed to fetch featured listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string): string => {
    const symbols: Record<string, string> = {
      TRY: '₺',
      USD: '$',
      EUR: '€',
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${price.toLocaleString()}`;
  };

  const getListingTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      yacht: 'Yat',
      part: 'Parça',
      marina: 'Marina',
      crew: 'Mürettebat',
      equipment: 'Ekipman',
      service: 'Servis',
      storage: 'Kışlama',
      marketplace: 'Panayır',
      insurance: 'Sigorta',
      examination: 'Ekspertiz',
    };
    return labels[type] || type;
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % Math.ceil(listings.length / 4));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + Math.ceil(listings.length / 4)) % Math.ceil(listings.length / 4));
  };

  if (loading) {
    return (
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Öne Çıkan İlanlar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(listings.length / itemsPerSlide);
  const startIndex = currentIndex * itemsPerSlide;
  const visibleListings = listings.slice(startIndex, startIndex + itemsPerSlide);

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Öne Çıkan İlanlar</h2>
            <p className="text-gray-600 text-sm">En popüler ilanları keşfedin</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={totalSlides <= 1}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Önceki"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              disabled={totalSlides <= 1}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Sonraki"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleListings.map((listing) => {
            const imageUrl = listing.images?.[0] ? getImageUrl(listing.images[0].url) : null;
            return (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group"
              >
                <div className="card-hover overflow-hidden">
                  <div className="aspect-video relative overflow-hidden bg-gray-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19.5v-15A2.5 2.5 0 015.5 2h13A2.5 2.5 0 0121 4.5v15a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="badge-primary text-xs">
                        {getListingTypeLabel(listing.listingType)}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        ⭐ Öne Çıkan
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {listing.title}
                    </h3>
                    {listing.location && (
                      <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {listing.location}
                      </p>
                    )}
                    <p className="text-lg font-bold text-primary-600">
                      {formatPrice(Number(listing.price), listing.currency)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/listings?featured=true"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            Tüm Öne Çıkanlar
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
