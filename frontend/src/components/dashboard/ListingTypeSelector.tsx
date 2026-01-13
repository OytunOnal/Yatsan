'use client';

import { ListingType } from '@/lib/api';

interface ListingTypeSelectorProps {
  selectedType: ListingType | null;
  onSelect: (type: ListingType) => void;
}

const listingTypes = [
  {
    type: 'yacht' as ListingType,
    title: 'Yat İlanı',
    description: 'Motor yat, yelkenli, katamaran veya gulet satışı',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17h18M3 12h18M3 7h18M5 7v10M19 7v10M12 3v18" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
  },
  {
    type: 'part' as ListingType,
    title: 'Yedek Parça',
    description: 'Denizcilik yedek parçaları ve ekipmanları',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'from-orange-500 to-orange-600',
  },
  {
    type: 'marina' as ListingType,
    title: 'Marina Yeri',
    description: 'Marina bağlama yeri kiralama veya satışı',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'from-teal-500 to-teal-600',
  },
  {
    type: 'crew' as ListingType,
    title: 'Mürettebat',
    description: 'Kaptan, şef, gemi personeli ilanları',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'from-purple-500 to-purple-600',
  },
];

export default function ListingTypeSelector({ selectedType, onSelect }: ListingTypeSelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">İlan Türü Seçin</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listingTypes.map((item) => (
          <button
            key={item.type}
            onClick={() => onSelect(item.type)}
            className={`
              relative p-6 rounded-xl border-2 transition-all duration-200 text-left
              ${selectedType === item.type
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.color} text-white mb-4`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            {selectedType === item.type && (
              <div className="absolute top-4 right-4">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
