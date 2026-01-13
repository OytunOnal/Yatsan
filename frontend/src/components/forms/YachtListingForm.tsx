'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createYachtListing } from '@/lib/api';
import { z } from 'zod';

// Zod validasyon şeması
const yachtListingSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalıdır'),
  description: z.string().min(20, 'Açıklama en az 20 karakter olmalıdır'),
  price: z.string().min(1, 'Fiyat gereklidir'),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  location: z.string().min(2, 'Konum gereklidir'),
  yachtType: z.enum(['motor_yacht', 'sailing_yacht', 'catamaran', 'gulet']),
  year: z.string().min(4, 'Yıl gereklidir'),
  length: z.string().min(1, 'Uzunluk gereklidir'),
  beam: z.string().min(1, 'Genişlik gereklidir'),
  draft: z.string().min(1, 'Sükunet derinliği gereklidir'),
  engineBrand: z.string().optional(),
  engineHours: z.string().optional(),
  engineHP: z.string().optional(),
  fuelType: z.enum(['diesel', 'petrol', 'electric', 'hybrid']).optional(),
  cruisingSpeed: z.string().optional(),
  maxSpeed: z.string().optional(),
  cabinCount: z.string().optional(),
  bedCount: z.string().optional(),
  bathroomCount: z.string().optional(),
  equipment: z.string().optional(),
  condition: z.enum(['new', 'excellent', 'good', 'fair']),
});

type YachtListingFormData = z.infer<typeof yachtListingSchema>;

interface YachtListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function YachtListingForm({ onSuccess }: YachtListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<YachtListingFormData>({
    title: '',
    description: '',
    price: '',
    currency: 'TRY',
    location: '',
    yachtType: 'motor_yacht',
    year: '',
    length: '',
    beam: '',
    draft: '',
    engineBrand: '',
    engineHours: '',
    engineHP: '',
    fuelType: 'diesel',
    cruisingSpeed: '',
    maxSpeed: '',
    cabinCount: '',
    bedCount: '',
    bathroomCount: '',
    equipment: '',
    condition: 'good',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validasyon
      const validatedData = yachtListingSchema.parse(formData);

      // API çağrısı
      const response = await createYachtListing({
        title: validatedData.title,
        description: validatedData.description,
        price: parseFloat(validatedData.price),
        currency: validatedData.currency,
        location: validatedData.location,
        yachtType: validatedData.yachtType,
        year: parseInt(validatedData.year),
        length: validatedData.length,
        beam: validatedData.beam,
        draft: validatedData.draft,
        engineBrand: validatedData.engineBrand || undefined,
        engineHours: validatedData.engineHours ? parseInt(validatedData.engineHours) : undefined,
        engineHP: validatedData.engineHP ? parseInt(validatedData.engineHP) : undefined,
        fuelType: validatedData.fuelType,
        cruisingSpeed: validatedData.cruisingSpeed ? parseInt(validatedData.cruisingSpeed) : undefined,
        maxSpeed: validatedData.maxSpeed ? parseInt(validatedData.maxSpeed) : undefined,
        cabinCount: validatedData.cabinCount ? parseInt(validatedData.cabinCount) : undefined,
        bedCount: validatedData.bedCount ? parseInt(validatedData.bedCount) : undefined,
        bathroomCount: validatedData.bathroomCount ? parseInt(validatedData.bathroomCount) : undefined,
        equipment: validatedData.equipment,
        condition: validatedData.condition,
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Lüks Motor Yat"
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
              onChange={handleChange}
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
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Yatınız hakkında detaylı bilgi verin..."
              required
            />
          </div>
        </div>
      </div>

      {/* Fiyat Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Fiyat *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1000000"
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
        </div>
      </div>

      {/* Yat Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yat Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="yachtType" className="block text-sm font-medium text-gray-700 mb-1">
              Yat Tipi *
            </label>
            <select
              id="yachtType"
              name="yachtType"
              value={formData.yachtType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="motor_yacht">Motor Yat</option>
              <option value="sailing_yacht">Yelkenli Yat</option>
              <option value="catamaran">Katamaran</option>
              <option value="gulet">Gulet</option>
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Yıl *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2023"
              required
            />
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
              Uzunluk (metre) *
            </label>
            <input
              type="number"
              step="0.01"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="20.5"
              required
            />
          </div>

          <div>
            <label htmlFor="beam" className="block text-sm font-medium text-gray-700 mb-1">
              Genişlik (metre) *
            </label>
            <input
              type="number"
              step="0.01"
              id="beam"
              name="beam"
              value={formData.beam}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5.5"
              required
            />
          </div>

          <div>
            <label htmlFor="draft" className="block text-sm font-medium text-gray-700 mb-1">
              Sükunet Derinliği (metre) *
            </label>
            <input
              type="number"
              step="0.01"
              id="draft"
              name="draft"
              value={formData.draft}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Durum *
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new">Yeni</option>
              <option value="excellent">Mükemmel</option>
              <option value="good">İyi</option>
              <option value="fair">Orta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Motor Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Motor Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="engineBrand" className="block text-sm font-medium text-gray-700 mb-1">
              Motor Markası
            </label>
            <input
              type="text"
              id="engineBrand"
              name="engineBrand"
              value={formData.engineBrand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Volvo Penta"
            />
          </div>

          <div>
            <label htmlFor="engineHP" className="block text-sm font-medium text-gray-700 mb-1">
              Motor Gücü (HP)
            </label>
            <input
              type="number"
              id="engineHP"
              name="engineHP"
              value={formData.engineHP}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1000"
            />
          </div>

          <div>
            <label htmlFor="engineHours" className="block text-sm font-medium text-gray-700 mb-1">
              Motor Saati
            </label>
            <input
              type="number"
              id="engineHours"
              name="engineHours"
              value={formData.engineHours}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="500"
            />
          </div>

          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Yakıt Tipi
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="diesel">Dizel</option>
              <option value="petrol">Benzin</option>
              <option value="electric">Elektrik</option>
              <option value="hybrid">Hibrit</option>
            </select>
          </div>

          <div>
            <label htmlFor="cruisingSpeed" className="block text-sm font-medium text-gray-700 mb-1">
              Seyir Hızı (knot)
            </label>
            <input
              type="number"
              id="cruisingSpeed"
              name="cruisingSpeed"
              value={formData.cruisingSpeed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="20"
            />
          </div>

          <div>
            <label htmlFor="maxSpeed" className="block text-sm font-medium text-gray-700 mb-1">
              Maksimum Hız (knot)
            </label>
            <input
              type="number"
              id="maxSpeed"
              name="maxSpeed"
              value={formData.maxSpeed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30"
            />
          </div>
        </div>
      </div>

      {/* Konaklama Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Konaklama Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cabinCount" className="block text-sm font-medium text-gray-700 mb-1">
              Kabin Sayısı
            </label>
            <input
              type="number"
              id="cabinCount"
              name="cabinCount"
              value={formData.cabinCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="4"
            />
          </div>

          <div>
            <label htmlFor="bedCount" className="block text-sm font-medium text-gray-700 mb-1">
              Yatak Sayısı
            </label>
            <input
              type="number"
              id="bedCount"
              name="bedCount"
              value={formData.bedCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="8"
            />
          </div>

          <div>
            <label htmlFor="bathroomCount" className="block text-sm font-medium text-gray-700 mb-1">
              Banyo Sayısı
            </label>
            <input
              type="number"
              id="bathroomCount"
              name="bathroomCount"
              value={formData.bathroomCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="4"
            />
          </div>
        </div>
      </div>

      {/* Ekipman */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ekipman ve Donanım</h3>
        <div>
          <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
            Ekipman Listesi
          </label>
          <textarea
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="GPS, Radar, Otomatik Pilot, Jeneratör, Su yapıcı, vb."
          />
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
