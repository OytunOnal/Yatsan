'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Listing, ListingType, getImageUrl } from '@/lib/api';

interface ListingCardProps {
  listing: Listing;
}

// İlan tipi için Türkçe etiketler
const getListingTypeLabel = (type: ListingType): string => {
  const labels: Record<ListingType, string> = {
    yacht: 'Yat',
    part: 'Yedek Parça',
    marina: 'Marina',
    crew: 'Mürettebat',
  };
  return labels[type] || type;
};

// İlan tipi için ikon ve renk
const getListingTypeInfo = (type: ListingType): { icon: React.ReactNode; colorClass: string } => {
  const info: Record<ListingType, { icon: React.ReactNode; colorClass: string }> = {
    yacht: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19.5v-15A2.5 2.5 0 015.5 2h13A2.5 2.5 0 0121 4.5v15a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5z" />
        </svg>
      ),
      colorClass: 'category-yacht',
    },
    part: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      colorClass: 'category-part',
    },
    marina: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25A9.724 9.724 0 003.75 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75c0-5.385-4.365-9.75-9.75-9.75z" />
        </svg>
      ),
      colorClass: 'category-marina',
    },
    crew: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      colorClass: 'category-crew',
    },
  };
  return info[type] || { icon: null, colorClass: 'badge-gray' };
};

// Para birimi formatlama
const formatPrice = (price: number, currency: string): string => {
  const symbols: Record<string, string> = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
  };
  const symbol = symbols[currency] || currency;
  return `${symbol}${price.toLocaleString()}`;
};

// İlan tipine göre özel bilgiler
const getListingDetails = (listing: Listing): { label: string; value: string }[] => {
  const details: { label: string; value: string }[] = [];

  if (listing.listingType === 'yacht' && listing.yachtListing) {
    const yacht = listing.yachtListing;
    details.push(
      { label: 'Yıl', value: yacht.year.toString() },
      { label: 'Uzunluk', value: `${yacht.length}m` },
      { label: 'Durum', value: yacht.condition === 'new' ? 'Yeni' : yacht.condition === 'excellent' ? 'Mükemmel' : yacht.condition === 'good' ? 'İyi' : 'Orta' }
    );
  } else if (listing.listingType === 'part' && listing.partListing) {
    const part = listing.partListing;
    details.push(
      { label: 'Marka', value: part.brand },
      { label: 'Durum', value: part.condition === 'new' ? 'Yeni' : part.condition === 'used' ? 'Kullanılmış' : 'Yenilenmiş' }
    );
    if (part.oemCode) {
      details.push({ label: 'OEM Kodu', value: part.oemCode });
    }
  } else if (listing.listingType === 'marina' && listing.marinaListing) {
    const marina = listing.marinaListing;
    details.push(
      { label: 'Maks. Uzunluk', value: `${marina.maxLength}m` },
      { label: 'Fiyat Tipi', value: marina.priceType === 'daily' ? 'Günlük' : marina.priceType === 'weekly' ? 'Haftalık' : marina.priceType === 'monthly' ? 'Aylık' : 'Yıllık' }
    );
  } else if (listing.listingType === 'crew' && listing.crewListing) {
    const crew = listing.crewListing;
    details.push(
      { label: 'Pozisyon', value: crew.position === 'captain' ? 'Kaptan' : crew.position === 'chef' ? 'Şef' : crew.position === 'deckhand' ? 'Gemi Personeli' : crew.position === 'engineer' ? 'Mühendis' : 'Hostes' },
      { label: 'Deneyim', value: `${crew.experience} yıl` }
    );
  }

  return details;
};

export default function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // İlan görseli (ilk resim veya placeholder)
  const image = listing.images && listing.images.length > 0
    ? (getImageUrl(listing.images[0].url) || '/placeholder-listing.jpg')
    : '/placeholder-listing.jpg';

  const details = getListingDetails(listing);
  const typeInfo = getListingTypeInfo(listing.listingType);

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="card-hover h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden bg-gray-200">
          <img
            src={image}
            alt={listing.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${typeInfo.colorClass}`}>
              {typeInfo.icon}
              <span>{getListingTypeLabel(listing.listingType)}</span>
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-all"
          >
            <svg
              className={`w-5 h-5 transition-colors ${isFavorite ? 'text-error-500 fill-current' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {listing.title}
          </h3>

          {/* Details */}
          {details.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {details.slice(0, 3).map((detail, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
                >
                  {detail.label}: {detail.value}
                </span>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price & Location */}
          <div className="flex items-end justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-xl font-bold text-primary-600">
                {formatPrice(Number(listing.price), listing.currency)}
              </p>
            </div>
            {listing.location && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listing.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
