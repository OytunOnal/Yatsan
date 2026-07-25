'use client';

import { useState, useEffect } from 'react';
import { ListingType, getFilterSchema, FilterSchema } from '@/lib/api';
import { DynamicFilters, DynamicFilterValue } from '@/types';

// API'den gelen filtre şeması (options string array olarak)
interface ApiFilterSchema {
  name: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'range' | 'multiselect';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

interface ApiFilterSchemaResponse {
  filters: ApiFilterSchema[];
}

export interface FiltersProps {
  listingType: ListingType | 'all';
  minPrice: string;
  maxPrice: string;
  location: string;
  search: string;
}

interface FiltersComponentProps {
  filters: FiltersProps;
  onFilterChange: (filters: FiltersProps) => void;
  onSearch: () => void;
  listingType: ListingType | 'all';
  dynamicFilters: DynamicFilters;
  onDynamicFilterChange: (name: string, value: DynamicFilterValue) => void;
}

export default function Filters({ 
  filters, 
  onFilterChange, 
  onSearch,
  listingType,
  dynamicFilters,
  onDynamicFilterChange,
}: FiltersComponentProps) {
  const [filterSchema, setFilterSchema] = useState<FilterSchema[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState(false);

  // listingType değiştiğinde filtre şemasını çek
  useEffect(() => {
    const fetchFilterSchema = async () => {
      if (listingType === 'all') {
        setFilterSchema([]);
        return;
      }

      setSchemaLoading(true);
      setSchemaError(false);

      try {
        const response = await getFilterSchema(listingType) as unknown as ApiFilterSchemaResponse;
        // API'den gelen options string array'ini {value, label} formatına dönüştür
        const transformedFilters: FilterSchema[] = (response.filters || []).map((filter: ApiFilterSchema) => {
          if (filter.options && Array.isArray(filter.options) && filter.options.length > 0) {
            return {
              ...filter,
              options: filter.options.map((opt) => ({
                value: opt,
                label: opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, ' '),
              })),
            };
          }
          return {
            ...filter,
            options: undefined,
          };
        });
        setFilterSchema(transformedFilters);
      } catch (error) {
        console.error('Failed to fetch filter schema:', error);
        setSchemaError(true);
        // Fallback filtreler
        setFilterSchema(getFallbackFilters(listingType));
      } finally {
        setSchemaLoading(false);
      }
    };

    fetchFilterSchema();
  }, [listingType]);

  const handleFilterChange = (key: keyof FiltersProps, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleDynamicFilterChange = (name: string, value: DynamicFilterValue) => {
    onDynamicFilterChange(name, value);
  };

  const listingTypes: { value: ListingType | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'Tüm İlanlar', color: 'bg-gray-400' },
    { value: 'yacht', label: 'Yatlar', color: 'category-yacht' },
    { value: 'part', label: 'Yedek Parça', color: 'category-part' },
    { value: 'marina', label: 'Marina', color: 'category-marina' },
    { value: 'crew', label: 'Mürettebat', color: 'category-crew' },
  ];

  const locations = [
    'İstanbul',
    'İzmir',
    'Antalya',
    'Muğla',
    'Mersin',
    'Çanakkale',
    'Balıkesir',
    'Aydın',
  ];

  // Dinamik input render fonksiyonları
  const renderFilterInput = (filter: FilterSchema) => {
    const value = dynamicFilters[filter.name];

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value as string || ''}
            onChange={(e) => handleDynamicFilterChange(filter.name, e.target.value)}
            className="input"
          >
            <option value="">{filter.placeholder || 'Seçiniz'}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'text':
        return (
          <input
            type="text"
            value={value as string || ''}
            onChange={(e) => handleDynamicFilterChange(filter.name, e.target.value)}
            placeholder={filter.placeholder || ''}
            className="input"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value as number || ''}
            onChange={(e) => handleDynamicFilterChange(filter.name, e.target.value ? parseFloat(e.target.value) : '')}
            placeholder={filter.placeholder || ''}
            min={filter.min}
            max={filter.max}
            className="input"
          />
        );

      case 'range':
        const rangeValue = value as { min?: number; max?: number } || {};
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                value={rangeValue.min || ''}
                onChange={(e) => handleDynamicFilterChange(filter.name, { 
                  ...rangeValue, 
                  min: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="Min"
                min={filter.min}
                max={filter.max}
                className="input flex-1"
              />
              <input
                type="number"
                value={rangeValue.max || ''}
                onChange={(e) => handleDynamicFilterChange(filter.name, { 
                  ...rangeValue, 
                  max: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="Max"
                min={filter.min}
                max={filter.max}
                className="input flex-1"
              />
            </div>
          </div>
        );

      case 'multiselect':
        const selectedValues = value as string[] || [];
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v) => v !== option.value);
                    handleDynamicFilterChange(filter.name, newValues);
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="label">Arama</label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="İlan başlığı ara..."
            className="input pl-10"
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
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
        </div>
      </div>

      {/* Listing Type */}
      <div>
        <label className="label">İlan Tipi</label>
        <div className="space-y-2">
          {listingTypes.map((type) => (
            <label
              key={type.value}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                filters.listingType === type.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="listingType"
                value={type.value}
                checked={filters.listingType === type.value}
                onChange={(e) => handleFilterChange('listingType', e.target.value as ListingType)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-900">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="label">Fiyat Aralığı</label>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Minimum</label>
            <input
              type="text"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="₺"
              className="input"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Maksimum</label>
            <input
              type="text"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="₺"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="label">Konum</label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="input"
        >
          <option value="">Tüm Türkiye</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Filters Section */}
      {listingType !== 'all' && (
        <div className="pt-4 border-t border-gray-200">
          {schemaLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : schemaError ? (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              Filtreler yüklenirken bir hata oluştu. Varsayılan filtreler gösteriliyor.
            </div>
          ) : filterSchema.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {listingType === 'yacht' ? 'Yat' : 
                 listingType === 'part' ? 'Yedek Parça' : 
                 listingType === 'marina' ? 'Marina' : 'Mürettebat'} Filtreleri
              </h3>
              {filterSchema.map((filter) => (
                <div key={filter.name}>
                  <label className="label">{filter.label}</label>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Apply Button */}
      <button onClick={onSearch} className="btn-primary w-full">
        Filtreleri Uygula
      </button>
    </div>
  );
}

// Fallback filtreler - API'den veri alınamazsa kullanılır
function getFallbackFilters(listingType: ListingType): FilterSchema[] {
  const fallbackMap: Record<ListingType, FilterSchema[]> = {
    yacht: [
      {
        name: 'yachtType',
        label: 'Yat Tipi',
        type: 'select',
        options: [
          { value: 'motor_yacht', label: 'Motor Yat' },
          { value: 'sailing_yacht', label: 'Yelkenli' },
          { value: 'catamaran', label: 'Katamaran' },
          { value: 'gulet', label: 'Gulet' },
        ],
      },
      {
        name: 'condition',
        label: 'Durum',
        type: 'select',
        options: [
          { value: 'new', label: 'Sıfır' },
          { value: 'excellent', label: 'Mükemmel' },
          { value: 'good', label: 'İyi' },
          { value: 'fair', label: 'Orta' },
        ],
      },
      {
        name: 'year',
        label: 'Yıl Aralığı',
        type: 'range',
        min: 1970,
        max: new Date().getFullYear() + 1,
      },
    ],
    part: [
      {
        name: 'condition',
        label: 'Durum',
        type: 'select',
        options: [
          { value: 'new', label: 'Yeni' },
          { value: 'used', label: 'Kullanılmış' },
          { value: 'refurbished', label: 'Yenilenmiş' },
        ],
      },
      {
        name: 'brand',
        label: 'Marka',
        type: 'text',
        placeholder: 'Marka ara...',
      },
    ],
    marina: [
      {
        name: 'priceType',
        label: 'Fiyat Tipi',
        type: 'select',
        options: [
          { value: 'monthly', label: 'Aylık' },
          { value: 'yearly', label: 'Yıllık' },
          { value: 'daily', label: 'Günlük' },
        ],
      },
      {
        name: 'services',
        label: 'Hizmetler',
        type: 'multiselect',
        options: [
          { value: 'electricity', label: 'Elektrik' },
          { value: 'water', label: 'Su' },
          { value: 'wifi', label: 'WiFi' },
          { value: 'shower', label: 'Duş' },
          { value: 'laundry', label: 'Çamaşır' },
          { value: 'fuel', label: 'Yakıt' },
        ],
      },
    ],
    crew: [
      {
        name: 'position',
        label: 'Pozisyon',
        type: 'select',
        options: [
          { value: 'captain', label: 'Kaptan' },
          { value: 'deckhand', label: 'Gemi Elini' },
          { value: 'engineer', label: 'Mühendis' },
          { value: 'chef', label: 'Şef' },
          { value: 'stewardess', label: 'Hostes' },
        ],
      },
      {
        name: 'experience',
        label: 'Deneyim (Yıl)',
        type: 'range',
        min: 0,
        max: 40,
      },
      {
        name: 'availability',
        label: 'Müsaitlik',
        type: 'select',
        options: [
          { value: 'immediate', label: 'Hemen' },
          { value: '1_month', label: '1 Ay İçinde' },
          { value: '3_months', label: '3 Ay İçinde' },
          { value: 'flexible', label: 'Esnek' },
        ],
      },
    ],
  };

  return fallbackMap[listingType] || [];
}
