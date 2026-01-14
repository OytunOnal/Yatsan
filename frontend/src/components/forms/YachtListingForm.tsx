'use client';

import { useState, useRef } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { createYachtListing } from '@/lib/api';
import { z } from 'zod';

// Zod validasyon şeması
const getYachtListingSchema = (currentYear: number) => z.object({
  title: z.string().min(1, 'Başlık gereklidir').min(5, 'Başlık en az 5 karakter olmalıdır'),
  description: z.string().min(1, 'Açıklama gereklidir').min(20, 'Açıklama en az 20 karakter olmalıdır'),
  price: z.string().min(1, 'Fiyat gereklidir'),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  location: z.string().min(1, 'Konum gereklidir').min(2, 'Konum en az 2 karakter olmalıdır'),
  yachtType: z.enum(['motor_yacht', 'sailing_yacht', 'catamaran', 'gulet']),
  year: z.string().transform((val, ctx) => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Yıl sayısal bir değer olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed < 1970) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Yıl 1970 veya daha büyük olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed > currentYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Yıl ${currentYear} veya daha küçük olmalıdır`,
      });
      return z.NEVER;
    }
    return val;
  }),
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

type YachtListingFormData = z.infer<ReturnType<typeof getYachtListingSchema>>;

interface YachtListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function YachtListingForm({ onSuccess }: YachtListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const currentYear = new Date().getFullYear();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);
  const lengthRef = React.useRef<HTMLInputElement>(null);
  const beamRef = React.useRef<HTMLInputElement>(null);
  const draftRef = React.useRef<HTMLInputElement>(null);
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
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  // maxLength kısıtlamaları
  const MAX_LENGTHS: Record<string, number> = {
    title: 200,
    description: 5000,
    location: 200,
    price: 10,
    year: 4,
    length: 6,
    beam: 6,
    draft: 6,
    engineBrand: 100,
    engineHP: 5,
    engineHours: 6,
    cruisingSpeed: 3,
    maxSpeed: 3,
    cabinCount: 2,
    bedCount: 2,
    bathroomCount: 2,
    equipment: 2000,
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'title':
        if (!value || value.trim() === '') return 'Başlık gereklidir';
        if (value.length < 5) return 'Başlık en az 5 karakter olmalıdır';
        return null;
      case 'description':
        if (!value || value.trim() === '') return 'Açıklama gereklidir';
        if (value.length < 20) return 'Açıklama en az 20 karakter olmalıdır';
        return null;
      case 'price':
        if (!value || value.trim() === '') return 'Fiyat gereklidir';
        const numPrice = parseFloat(value);
        if (isNaN(numPrice) || numPrice <= 0) return 'Geçerli bir fiyat giriniz';
        // Database price field: decimal(12, 2) - max value is 10^10 = 10,000,000,000
        if (numPrice > 9999999999) return 'Fiyat 9.999.999.999\'dan küçük olmalıdır';
        return null;
      case 'location':
        if (!value || value.trim() === '') return 'Konum gereklidir';
        if (value.length < 2) return 'Konum en az 2 karakter olmalıdır';
        return null;
      case 'year':
        if (!value || value.trim() === '') return 'Yıl gereklidir';
        const parsed = parseInt(value);
        if (isNaN(parsed)) return 'Yıl sayısal bir değer olmalıdır';
        if (parsed < 1970) return 'Yıl 1970 veya daha büyük olmalıdır';
        if (parsed > currentYear) return `Yıl ${currentYear} veya daha küçük olmalıdır`;
        return null;
      case 'length':
      case 'beam':
      case 'draft':
        if (!value || value.trim() === '') return `${name === 'length' ? 'Uzunluk' : name === 'beam' ? 'Genişlik' : 'Sükunet derinliği'} gereklidir`;
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) return `Geçerli bir ${name === 'length' ? 'uzunluk' : name === 'beam' ? 'genişlik' : 'derinlik'} değeri giriniz`;
        return null;
      default:
        return null;
    }
  };

  const handleFieldChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let { value } = e.target;
    
    // maxLength kontrolü - paste durumunda da çalışır
    const maxLength = MAX_LENGTHS[name];
    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    // Değişiklik anında hata gösterme, sadece mevcut hatayı temizle
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
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

  const handleFieldBlur = (name: string) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value } = e.target;
    const fieldError = validateField(name, value);
    if (fieldError) {
      setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validasyon
      const yachtListingSchema = getYachtListingSchema(currentYear);
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
        images,
      });

      const listingId = response.listing.id;
      
      if (onSuccess) {
        onSuccess(listingId);
      } else {
        router.push('/dashboard/listings?success=true');
      }
    } catch (err: any) {
      console.log('YachtListingForm hatası:', err);
      
      if (err instanceof z.ZodError) {
        // Tüm hataları fieldErrors'a ekle
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            errors[e.path[0] as string] = e.message;
          }
        });
        setFieldErrors(errors);
        
        // İlk hatayı genel error'a da ekle
        const firstError = err.errors[0];
        setError(firstError.message);
        
        // İlk hatalı alana odaklan (bir sonraki render'da ref'ler hazır olacak)
        setTimeout(() => {
          const firstErrorField = firstError.path[0] as string;
          if (firstErrorField === 'title' && titleRef.current) {
            titleRef.current.focus();
          } else if (firstErrorField === 'description' && descriptionRef.current) {
            descriptionRef.current.focus();
          } else if (firstErrorField === 'year' && yearRef.current) {
            yearRef.current.focus();
          } else if (firstErrorField === 'length' && lengthRef.current) {
            lengthRef.current.focus();
          } else if (firstErrorField === 'beam' && beamRef.current) {
            beamRef.current.focus();
          } else if (firstErrorField === 'draft' && draftRef.current) {
            draftRef.current.focus();
          } else if (firstErrorField === 'location') {
            // Location ref'i yok, scroll ile odaklan
            document.getElementById('location')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.getElementById('location')?.focus();
          }
        }, 0);
      } else {
        // API hatası - detaylı mesaj göster
        const errorMessage = err?.response?.data?.message || err?.message || 'İlan oluşturulurken bir hata oluştu';
        const errors = err?.response?.data?.errors;
        
        if (errors && Array.isArray(errors)) {
          // Backend validasyon hataları
          setError(errorMessage);
          console.log('Backend validasyon hataları:', errors);
        } else {
          setError(errorMessage);
        }
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
      
      {/* Tüm alan hatalarını liste olarak göster */}
      {Object.keys(fieldErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-2">Lütfen şu hataları düzeltin:</p>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(fieldErrors).map(([field, message]) => (
              message && (
                <li key={field} className="text-sm">
                  {field === 'title' && 'Başlık: '}
                  {field === 'description' && 'Açıklama: '}
                  {field === 'price' && 'Fiyat: '}
                  {field === 'location' && 'Konum: '}
                  {field === 'year' && 'Yıl: '}
                  {field === 'length' && 'Uzunluk: '}
                  {field === 'beam' && 'Genişlik: '}
                  {field === 'draft' && 'Sükunet Derinliği: '}
                  {message}
                </li>
              )
            )).filter(Boolean)}
          </ul>
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
              ref={titleRef}
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFieldChange('title')}
              onBlur={handleFieldBlur('title')}
              onPaste={handlePaste('title', 200)}
              maxLength={200}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.title
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Örn: Lüks Motor Yat"
              required
            />
            {fieldErrors.title && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
            )}
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
              onBlur={handleFieldBlur('location')}
              onPaste={handlePaste('location', 200)}
              maxLength={200}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.location
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Örn: İstanbul, Türkiye"
              required
            />
            {fieldErrors.location && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.location}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama *
            </label>
            <textarea
              ref={descriptionRef}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFieldChange('description')}
              onBlur={handleFieldBlur('description')}
              onPaste={handlePaste('description', 5000)}
              maxLength={5000}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.description
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Yatınız hakkında detaylı bilgi verin..."
              required
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
            )}
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
              onBlur={handleFieldBlur('price')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('price', 10)}
              max="9999999999"
              maxLength={10}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.price
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="1000000"
              required
            />
            {fieldErrors.price && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>
            )}
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
              ref={yearRef}
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleFieldChange('year')}
              onBlur={handleFieldBlur('year')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('year', 4)}
              min="1970"
              max={currentYear}
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.year
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder={currentYear.toString()}
              required
            />
            {fieldErrors.year && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.year}</p>
            )}
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
              Uzunluk (metre) *
            </label>
            <input
              ref={lengthRef}
              type="number"
              step="0.01"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleFieldChange('length')}
              onBlur={handleFieldBlur('length')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('length', 6)}
              maxLength={6}
              max="9999.99"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.length
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="20.5"
              required
            />
            {fieldErrors.length && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.length}</p>
            )}
          </div>

          <div>
            <label htmlFor="beam" className="block text-sm font-medium text-gray-700 mb-1">
              Genişlik (metre) *
            </label>
            <input
              ref={beamRef}
              type="number"
              step="0.01"
              id="beam"
              name="beam"
              value={formData.beam}
              onChange={handleFieldChange('beam')}
              onBlur={handleFieldBlur('beam')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('beam', 6)}
              maxLength={6}
              max="9999.99"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.beam
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="5.5"
              required
            />
            {fieldErrors.beam && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.beam}</p>
            )}
          </div>

          <div>
            <label htmlFor="draft" className="block text-sm font-medium text-gray-700 mb-1">
              Sükunet Derinliği (metre) *
            </label>
            <input
              ref={draftRef}
              type="number"
              step="0.01"
              id="draft"
              name="draft"
              value={formData.draft}
              onChange={handleFieldChange('draft')}
              onBlur={handleFieldBlur('draft')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('draft', 6)}
              maxLength={6}
              max="9999.99"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.draft
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="2.5"
              required
            />
            {fieldErrors.draft && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.draft}</p>
            )}
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
              onChange={handleFieldChange('engineBrand')}
              onPaste={handlePaste('engineBrand', 100)}
              maxLength={100}
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
              onChange={handleFieldChange('engineHP')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('engineHP', 5)}
              maxLength={5}
              max="99999"
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
              onChange={handleFieldChange('engineHours')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('engineHours', 6)}
              maxLength={6}
              max="999999"
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
              onChange={handleFieldChange('cruisingSpeed')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('cruisingSpeed', 3)}
              maxLength={3}
              max="999"
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
              onChange={handleFieldChange('maxSpeed')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('maxSpeed', 3)}
              maxLength={3}
              max="999"
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
              onChange={handleFieldChange('cabinCount')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('cabinCount', 2)}
              maxLength={2}
              max="99"
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
              onChange={handleFieldChange('bedCount')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('bedCount', 2)}
              maxLength={2}
              max="99"
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
              onChange={handleFieldChange('bathroomCount')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('bathroomCount', 2)}
              maxLength={2}
              max="99"
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
            onChange={handleFieldChange('equipment')}
            onPaste={handlePaste('equipment', 2000)}
            maxLength={2000}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="GPS, Radar, Otomatik Pilot, Jeneratör, Su yapıcı, vb."
          />
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
