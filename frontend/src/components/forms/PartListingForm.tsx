'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPartListing } from '@/lib/api';
import { z } from 'zod';

// Zod validasyon şeması
const partListingSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalıdır'),
  description: z.string().min(20, 'Açıklama en az 20 karakter olmalıdır'),
  price: z.string().min(1, 'Fiyat gereklidir'),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  location: z.string().min(2, 'Konum gereklidir'),
  condition: z.enum(['new', 'used', 'refurbished']),
  brand: z.string().min(1, 'Marka gereklidir'),
  oemCode: z.string().optional(),
  compatibility: z.string().optional(),
});

type PartListingFormData = z.infer<typeof partListingSchema>;

interface PartListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function PartListingForm({ onSuccess }: PartListingFormProps) {
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
    brand: 100,
    oemCode: 50,
    compatibility: 2000,
  };
  
  const [formData, setFormData] = useState<PartListingFormData>({
    title: '',
    description: '',
    price: '',
    currency: 'TRY',
    location: '',
    condition: 'new',
    brand: '',
    oemCode: '',
    compatibility: '',
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
      const validatedData = partListingSchema.parse(formData);

      // API çağrısı
      const response = await createPartListing({
        title: validatedData.title,
        description: validatedData.description,
        price: parseFloat(validatedData.price),
        currency: validatedData.currency,
        location: validatedData.location,
        condition: validatedData.condition,
        brand: validatedData.brand,
        oemCode: validatedData.oemCode,
        compatibility: validatedData.compatibility,
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
              placeholder="Örn: Volvo Penta Motor Filtresi"
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
              placeholder="Parça hakkında detaylı bilgi verin..."
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
              onChange={handleFieldChange('price')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('price', 10)}
              max="9999999999"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="500"
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

      {/* Parça Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parça Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Marka *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleFieldChange('brand')}
              onPaste={handlePaste('brand', 100)}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Volvo Penta"
              required
            />
          </div>

          <div>
            <label htmlFor="oemCode" className="block text-sm font-medium text-gray-700 mb-1">
              OEM Kodu
            </label>
            <input
              type="text"
              id="oemCode"
              name="oemCode"
              value={formData.oemCode}
              onChange={handleFieldChange('oemCode')}
              onPaste={handlePaste('oemCode', 50)}
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: VP-12345"
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
              <option value="used">Kullanılmış</option>
              <option value="refurbished">Yenilenmiş</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="compatibility" className="block text-sm font-medium text-gray-700 mb-1">
            Uyumlu Modeller
          </label>
          <textarea
            id="compatibility"
            name="compatibility"
            value={formData.compatibility}
            onChange={handleFieldChange('compatibility')}
            onPaste={handlePaste('compatibility', 2000)}
            maxLength={2000}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Uyumlu motor modellerini, yat tiplerini ve diğer uyumluluk bilgilerini listeleyin...&#10;&#10;Örnek:&#10;- Volvo Penta D1-20, D1-30, D2-40&#10;- Yanaca tipi: Dizel&#10;- Yat uzunluğu: 30-50 feet"
          />
          <p className="mt-1 text-sm text-gray-500">
            Her satıra bir uyumluluk bilgisi yazabilirsiniz. Bu bilgiler ilan detay sayfasında gösterilecektir.
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
