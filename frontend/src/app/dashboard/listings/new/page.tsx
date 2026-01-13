'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListingType } from '@/lib/api';
import ListingTypeSelector from '@/components/dashboard/ListingTypeSelector';
import YachtListingForm from '@/components/forms/YachtListingForm';
import PartListingForm from '@/components/forms/PartListingForm';
import MarinaListingForm from '@/components/forms/MarinaListingForm';
import CrewListingForm from '@/components/forms/CrewListingForm';

export default function NewListingPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ListingType | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleTypeSelect = (type: ListingType) => {
    setSelectedType(type);
    setSuccessMessage(false);
  };

  const handleSuccess = (listingId: string) => {
    setSuccessMessage(true);
    // İlan detay sayfasına yönlendir
    setTimeout(() => {
      router.push(`/listings/${listingId}`);
    }, 1500);
  };

  const handleBackToTypes = () => {
    setSelectedType(null);
    setSuccessMessage(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Yeni İlan Oluştur</h1>
        <p className="text-gray-600 mt-2">
          {selectedType 
            ? 'İlan detaylarını doldurun ve ilanınızı yayınlayın.'
            : 'Oluşturmak istediğiniz ilan türünü seçin.'
          }
        </p>
      </div>

      {/* Başarı Mesajı */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">İlan başarıyla oluşturuldu!</p>
            <p className="text-sm">İlan detay sayfasına yönlendiriliyorsunuz...</p>
          </div>
        </div>
      )}

      {/* İlan Türü Seçimi */}
      {!selectedType && (
        <ListingTypeSelector 
          selectedType={selectedType} 
          onSelect={handleTypeSelect} 
        />
      )}

      {/* Form Gösterimi */}
      {selectedType && !successMessage && (
        <div className="space-y-6">
          {/* Seçili Tür Göstergesi ve Geri Butonu */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToTypes}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Türü Değiştir
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <span className="text-sm font-medium text-gray-700">
              {selectedType === 'yacht' && 'Yat İlanı'}
              {selectedType === 'part' && 'Yedek Parça İlanı'}
              {selectedType === 'marina' && 'Marina Yeri İlanı'}
              {selectedType === 'crew' && 'Mürettebat İlanı'}
            </span>
          </div>

          {/* İlgili Form */}
          <div className="bg-gray-50 rounded-xl p-6">
            {selectedType === 'yacht' && (
              <YachtListingForm onSuccess={handleSuccess} />
            )}
            {selectedType === 'part' && (
              <PartListingForm onSuccess={handleSuccess} />
            )}
            {selectedType === 'marina' && (
              <MarinaListingForm onSuccess={handleSuccess} />
            )}
            {selectedType === 'crew' && (
              <CrewListingForm onSuccess={handleSuccess} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
