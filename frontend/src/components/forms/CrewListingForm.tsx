'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCrewListing } from '@/lib/api';
import { z } from 'zod';

// Zod validasyon şeması
const crewListingSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalıdır'),
  description: z.string().min(20, 'Açıklama en az 20 karakter olmalıdır'),
  price: z.string().optional(),
  currency: z.enum(['TRY', 'USD', 'EUR']).optional(),
  location: z.string().min(2, 'Konum gereklidir'),
  position: z.enum(['captain', 'chef', 'deckhand', 'engineer', 'stewardess']),
  experience: z.string().min(1, 'Deneyim gereklidir'),
  certifications: z.string().optional(),
  availability: z.enum(['immediate', 'flexible', 'specific_dates']),
  availableFrom: z.string().optional(),
  availableTo: z.string().optional(),
  salary: z.string().optional(),
  salaryCurrency: z.enum(['TRY', 'USD', 'EUR']).optional(),
  salaryPeriod: z.enum(['monthly', 'weekly', 'daily', 'per_trip']).optional(),
});

type CrewListingFormData = z.infer<typeof crewListingSchema>;

interface CrewListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function CrewListingForm({ onSuccess }: CrewListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  
  // maxLength kısıtlamaları
  const MAX_LENGTHS: Record<string, number> = {
    title: 200,
    description: 5000,
    location: 200,
    price: 10,
    experience: 2,
    certifications: 2000,
    salary: 10,
  };
  
  const [formData, setFormData] = useState<CrewListingFormData>({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    location: '',
    position: 'captain',
    experience: '',
    certifications: '',
    availability: 'immediate',
    availableFrom: '',
    availableTo: '',
    salary: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'monthly',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFieldChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let { value } = e.target;
    
    // maxLength kontrolü - paste durumunda da çalışır
    const maxLength = MAX_LENGTHS[name];
    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePaste = (name: string, maxLength: number) => (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const truncatedText = pastedText.slice(0, maxLength);
    
    // Mevcut değeri al
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    const currentValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    
    // Yeni değeri oluştur
    const newValue = currentValue.slice(0, selectionStart) + truncatedText + currentValue.slice(selectionEnd);
    
    // maxLength kontrolü
    const finalValue = newValue.slice(0, maxLength);
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // İzin verilen tuşlar: rakamlar (0-9), backspace, delete, tab, arrow keys, enter, home, end, nokta
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', '.', ','
    ];

    // Ctrl/Cmd + A, C, V, X izin ver
    if (e.ctrlKey || e.metaKey) {
      if (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
        return;
      }
    }

    // Rakam veya izin verilen tuş değilse engelle
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validasyon
      const validatedData = crewListingSchema.parse(formData);

      // API çağrısı
      const response = await createCrewListing({
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price ? parseFloat(validatedData.price) : undefined,
        currency: validatedData.currency,
        location: validatedData.location,
        position: validatedData.position,
        experience: parseInt(validatedData.experience),
        certifications: validatedData.certifications,
        availability: validatedData.availability,
        availableFrom: validatedData.availableFrom || undefined,
        availableTo: validatedData.availableTo || undefined,
        salary: validatedData.salary,
        salaryCurrency: validatedData.salaryCurrency,
        salaryPeriod: validatedData.salaryPeriod,
        images,
      });

      const listingId = response.listing.id;
      
      if (onSuccess) {
        onSuccess(listingId);
      } else {
        router.push('/dashboard/listings?success=true');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('İlan oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Temel Bilgiler */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Başlık *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFieldChange('title')}
              onPaste={handlePaste('title', 200)}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Deneyimli Kaptan"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Konum *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleFieldChange('location')}
              onPaste={handlePaste('location', 200)}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: İstanbul, Türkiye"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFieldChange('description')}
              onPaste={handlePaste('description', 5000)}
              maxLength={5000}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kendiniz ve deneyiminiz hakkında bilgi verin..."
              required
            />
          </div>
        </div>
      </div>

      {/* Pozisyon ve Deneyim */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pozisyon ve Deneyim</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Pozisyon *
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="captain">Kaptan</option>
              <option value="chef">Şef</option>
              <option value="deckhand">Gemi Personeli</option>
              <option value="engineer">Mühendis</option>
              <option value="stewardess">Hostes</option>
            </select>
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Deneyim (Yıl) *
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleFieldChange('experience')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('experience', 2)}
              maxLength={2}
              max="99"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
              Sertifikalar
            </label>
            <textarea
              id="certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleFieldChange('certifications')}
              onPaste={handlePaste('certifications', 2000)}
              maxLength={2000}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kaptan sertifikası, Gemi mühendisliği sertifikası, vb."
            />
          </div>
        </div>
      </div>

      {/* Müsaitlik */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Müsaitlik</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Müsaitlik Durumu *
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="immediate">Hemen</option>
              <option value="flexible">Esnek</option>
              <option value="specific_dates">Belirli Tarihler</option>
            </select>
          </div>

          <div></div>

          <div>
            <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700 mb-1">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              id="availableFrom"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="availableTo" className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              id="availableTo"
              name="availableTo"
              value={formData.availableTo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Maaş Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maaş Beklentisi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Maaş Tutarı
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleFieldChange('salary')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('salary', 10)}
              max="9999999999"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5000"
            />
          </div>

          <div>
            <label htmlFor="salaryCurrency" className="block text-sm font-medium text-gray-700 mb-1">
              Para Birimi
            </label>
            <select
              id="salaryCurrency"
              name="salaryCurrency"
              value={formData.salaryCurrency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TRY">Türk Lirası (₺)</option>
              <option value="USD">Amerikan Doları ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div>
            <label htmlFor="salaryPeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Dönem
            </label>
            <select
              id="salaryPeriod"
              name="salaryPeriod"
              value={formData.salaryPeriod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Aylık</option>
              <option value="weekly">Haftalık</option>
              <option value="daily">Günlük</option>
              <option value="per_trip">Seyir Başına</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resim Yükleme */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resimler</h3>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            İlan Resimleri (En fazla 15 adet)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {images.length} adet resim seçildi
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        {!onSuccess && (
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Kaydediliyor...' : 'İlanı Oluştur'}
        </button>
      </div>
    </form>
  );
}
