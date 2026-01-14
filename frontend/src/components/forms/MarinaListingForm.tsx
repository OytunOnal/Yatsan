'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMarinaListing } from '@/lib/api';
import { z } from 'zod';

// Zod validasyon şeması
const marinaListingSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalıdır'),
  description: z.string().min(20, 'Açıklama en az 20 karakter olmalıdır'),
  price: z.string().min(1, 'Fiyat gereklidir'),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  location: z.string().min(2, 'Konum gereklidir'),
  priceType: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  maxLength: z.string().min(1, 'Maksimum uzunluk gereklidir'),
  maxBeam: z.string().min(1, 'Maksimum genişlik gereklidir'),
  maxDraft: z.string().optional(),
  services: z.string().min(1, 'Hizmetler gereklidir'),
  availability: z.string().optional(),
});

type MarinaListingFormData = z.infer<typeof marinaListingSchema>;

interface MarinaListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function MarinaListingForm({ onSuccess }: MarinaListingFormProps) {
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
    maxLength: 6,
    maxBeam: 6,
    maxDraft: 6,
    services: 2000,
    availability: 1000,
  };
  
  const [formData, setFormData] = useState<MarinaListingFormData>({
    title: '',
    description: '',
    price: '',
    currency: 'TRY',
    location: '',
    priceType: 'monthly',
    maxLength: '',
    maxBeam: '',
    maxDraft: '',
    services: '',
    availability: '',
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
      const validatedData = marinaListingSchema.parse(formData);

      // API çağrısı
      const response = await createMarinaListing({
        title: validatedData.title,
        description: validatedData.description,
        price: parseFloat(validatedData.price),
        currency: validatedData.currency,
        location: validatedData.location,
        priceType: validatedData.priceType,
        maxLength: validatedData.maxLength,
        maxBeam: validatedData.maxBeam,
        maxDraft: validatedData.maxDraft,
        services: validatedData.services,
        availability: validatedData.availability,
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
              placeholder="Örn: Lüks Marinada Yer İlanı"
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
              placeholder="Örn: Kalamış Marina, İstanbul"
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
              placeholder="Marina yeri hakkında detaylı bilgi verin..."
              required
            />
          </div>
        </div>
      </div>

      {/* Fiyat Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Fiyat *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleFieldChange('price')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('price', 10)}
              max="9999999999"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5000"
              required
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Para Birimi *
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TRY">Türk Lirası (₺)</option>
              <option value="USD">Amerikan Doları ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div>
            <label htmlFor="priceType" className="block text-sm font-medium text-gray-700 mb-1">
              Fiyat Tipi *
            </label>
            <select
              id="priceType"
              name="priceType"
              value={formData.priceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Günlük</option>
              <option value="weekly">Haftalık</option>
              <option value="monthly">Aylık</option>
              <option value="yearly">Yıllık</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teknik Özellikler */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Teknik Özellikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="maxLength" className="block text-sm font-medium text-gray-700 mb-1">
              Maksimum Uzunluk (metre) *
            </label>
            <input
              type="number"
              step="0.01"
              id="maxLength"
              name="maxLength"
              value={formData.maxLength}
              onChange={handleFieldChange('maxLength')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('maxLength', 6)}
              maxLength={6}
              max="9999.99"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="20"
              required
            />
          </div>

          <div>
            <label htmlFor="maxBeam" className="block text-sm font-medium text-gray-700 mb-1">
              Maksimum Genişlik (metre) *
            </label>
            <input
              type="number"
              step="0.01"
              id="maxBeam"
              name="maxBeam"
              value={formData.maxBeam}
              onChange={handleFieldChange('maxBeam')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('maxBeam', 6)}
              maxLength={6}
              max="9999.99"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="6"
              required
            />
          </div>

          <div>
            <label htmlFor="maxDraft" className="block text-sm font-medium text-gray-700 mb-1">
              Maksimum Sükunet Derinliği (metre)
            </label>
            <input
              type="number"
              step="0.01"
              id="maxDraft"
              name="maxDraft"
              value={formData.maxDraft}
              onChange={handleFieldChange('maxDraft')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('maxDraft', 6)}
              maxLength={6}
              max="9999.99"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3"
            />
          </div>
        </div>
      </div>

      {/* Hizmetler */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hizmetler</h3>
        <div>
          <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">
            Mevcut Hizmetler *
          </label>
          <textarea
            id="services"
            name="services"
            value={formData.services}
            onChange={handleFieldChange('services')}
            onPaste={handlePaste('services', 2000)}
            maxLength={2000}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Elektrik, su, Wi-Fi, duş, WC, güvenlik, vb."
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Marinada sunulan tüm hizmetleri listeleyin
          </p>
        </div>
      </div>

      {/* Müsaitlik */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Müsaitlik</h3>
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
            Müsaitlik Takvimi
          </label>
          <textarea
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleFieldChange('availability')}
            onPaste={handlePaste('availability', 1000)}
            maxLength={1000}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Hemen müsait, veya belirli tarihler arası..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Yerin müsait olduğu tarihleri belirtin
          </p>
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
