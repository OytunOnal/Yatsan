'use client';

import { useState, useRef } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { createEquipmentListing } from '@/lib/api';
import { z } from 'zod';

// Ekipman türü seçenekleri
const EQUIPMENT_TYPE_OPTIONS = [
  { value: 'navigation', label: 'Navigasyon' },
  { value: 'communication', label: 'İletişim' },
  { value: 'safety', label: 'Güvenlik' },
  { value: 'anchoring', label: 'Çıkarma/Demirleme' },
  { value: 'electrical', label: 'Elektrik' },
  { value: 'plumbing', label: 'Tesisat' },
  { value: 'deck_hardware', label: 'Güverte Donanımı' },
  { value: 'lighting', label: 'Aydınlatma' },
  { value: 'ventilation', label: 'Havalandırma' },
  { value: 'refrigeration', label: 'Soğutma' },
  { value: 'entertainment', label: 'Eğlence' },
  { value: 'fishing', label: 'Balıkçılık' },
  { value: 'water_sports', label: 'Su Sporları' },
  { value: 'cleaning', label: 'Temizlik' },
  { value: 'other', label: 'Diğer' },
];

// Voltaj seçenekleri
const VOLTAGE_OPTIONS = [
  { value: '12V', label: '12V' },
  { value: '24V', label: '24V' },
  { value: '110V', label: '110V' },
  { value: '220V', label: '220V' },
  { value: '12V/24V', label: '12V/24V' },
];

// Durum seçenekleri
const CONDITION_OPTIONS = [
  { value: 'new', label: 'Yeni' },
  { value: 'excellent', label: 'Mükemmel' },
  { value: 'good', label: 'İyi' },
  { value: 'fair', label: 'Orta' },
  { value: 'poor', label: 'Zayıf' },
];

// Zod validasyon şeması
const getEquipmentListingSchema = (currentYear: number) => z.object({
  title: z.string().min(1, 'Başlık gereklidir').min(3, 'Başlık en az 3 karakter olmalıdır').max(200, 'Başlık en fazla 200 karakter olabilir'),
  description: z.string().max(5000, 'Açıklama en fazla 5000 karakter olabilir').optional(),
  price: z.string().min(1, 'Fiyat gereklidir'),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  location: z.string().optional(),
  equipmentType: z.string().min(1, 'Ekipman türü seçilmeli'),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(['new', 'excellent', 'good', 'fair', 'poor']),
  yearOfManufacture: z.string().transform((val, ctx) => {
    if (!val || val.trim() === '') return val;
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Üretim yılı sayısal bir değer olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed < 1970) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Üretim yılı 1970 veya daha büyük olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed > currentYear + 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Üretim yılı ${currentYear + 1} veya daha küçük olmalıdır`,
      });
      return z.NEVER;
    }
    return val;
  }).optional(),
  warrantyMonths: z.string().transform((val, ctx) => {
    if (!val || val.trim() === '') return val;
    const parsed = parseInt(val);
    if (isNaN(parsed) || parsed < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Garanti süresi 0 veya daha büyük olmalıdır',
      });
      return z.NEVER;
    }
    return val;
  }).optional(),
  powerConsumption: z.string().optional(),
  voltage: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  compatibleBoatTypes: z.string().optional(),
  compatibleBoatLengths: z.string().optional(),
  installationRequired: z.boolean(),
  manualIncluded: z.boolean(),
});

type EquipmentListingFormData = z.infer<ReturnType<typeof getEquipmentListingSchema>>;

interface EquipmentListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function EquipmentListingForm({ onSuccess }: EquipmentListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const currentYear = new Date().getFullYear();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const equipmentTypeRef = React.useRef<HTMLSelectElement>(null);
  
  const [formData, setFormData] = useState<EquipmentListingFormData>({
    title: '',
    description: '',
    price: '',
    currency: 'TRY',
    location: '',
    equipmentType: 'navigation',
    brand: '',
    model: '',
    condition: 'good',
    yearOfManufacture: '',
    warrantyMonths: '',
    powerConsumption: '',
    voltage: '',
    dimensions: '',
    weight: '',
    compatibleBoatTypes: '',
    compatibleBoatLengths: '',
    installationRequired: false,
    manualIncluded: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
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
    brand: 100,
    model: 100,
    yearOfManufacture: 4,
    warrantyMonths: 3,
    powerConsumption: 10,
    voltage: 10,
    dimensions: 50,
    weight: 10,
    compatibleBoatTypes: 200,
    compatibleBoatLengths: 50,
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'title':
        if (!value || value.trim() === '') return 'Başlık gereklidir';
        if (value.length < 3) return 'Başlık en az 3 karakter olmalıdır';
        if (value.length > 200) return 'Başlık en fazla 200 karakter olabilir';
        return null;
      case 'price':
        if (!value || value.trim() === '') return 'Fiyat gereklidir';
        const numPrice = parseFloat(value);
        if (isNaN(numPrice) || numPrice <= 0) return 'Geçerli bir fiyat giriniz';
        if (numPrice > 9999999999) return 'Fiyat 9.999.999.999\'dan küçük olmalıdır';
        return null;
      case 'equipmentType':
        if (!value || value.trim() === '') return 'Ekipman türü seçilmelidir';
        return null;
      case 'yearOfManufacture':
        if (value && value.trim() !== '') {
          const parsed = parseInt(value);
          if (isNaN(parsed)) return 'Üretim yılı sayısal bir değer olmalıdır';
          if (parsed < 1970) return 'Üretim yılı 1970 veya daha büyük olmalıdır';
          if (parsed > currentYear + 1) return `Üretim yılı ${currentYear + 1} veya daha küçük olmalıdır`;
        }
        return null;
      case 'warrantyMonths':
        if (value && value.trim() !== '') {
          const parsed = parseInt(value);
          if (isNaN(parsed) || parsed < 0) return 'Garanti süresi 0 veya daha büyük olmalıdır';
        }
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
      const equipmentListingSchema = getEquipmentListingSchema(currentYear);
      const validatedData = equipmentListingSchema.parse(formData);

      // API çağrısı
      const response = await createEquipmentListing({
        title: validatedData.title,
        description: validatedData.description || '',
        price: parseFloat(validatedData.price),
        currency: validatedData.currency,
        location: validatedData.location || '',
        equipmentType: validatedData.equipmentType,
        brand: validatedData.brand || undefined,
        model: validatedData.model || undefined,
        condition: validatedData.condition,
        yearOfManufacture: validatedData.yearOfManufacture ? parseInt(validatedData.yearOfManufacture) : undefined,
        warrantyMonths: validatedData.warrantyMonths ? parseInt(validatedData.warrantyMonths) : undefined,
        powerConsumption: validatedData.powerConsumption ? parseFloat(validatedData.powerConsumption) : undefined,
        voltage: validatedData.voltage || undefined,
        dimensions: validatedData.dimensions || undefined,
        weight: validatedData.weight ? parseFloat(validatedData.weight) : undefined,
        compatibleBoatTypes: validatedData.compatibleBoatTypes || undefined,
        compatibleBoatLengths: validatedData.compatibleBoatLengths || undefined,
        installationRequired: validatedData.installationRequired,
        manualIncluded: validatedData.manualIncluded,
        images,
      });

      const listingId = response.listing.id;
      
      if (onSuccess) {
        onSuccess(listingId);
      } else {
        router.push('/dashboard/listings?success=true');
      }
    } catch (err: any) {
      console.log('EquipmentListingForm hatası:', err);
      
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
        
        // İlk hatalı alana odaklan
        setTimeout(() => {
          const firstErrorField = firstError.path[0] as string;
          if (firstErrorField === 'title' && titleRef.current) {
            titleRef.current.focus();
          } else if (firstErrorField === 'equipmentType' && equipmentTypeRef.current) {
            equipmentTypeRef.current.focus();
          } else {
            document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.getElementById(firstErrorField)?.focus();
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
                  {field === 'equipmentType' && 'Ekipman Türü: '}
                  {field === 'yearOfManufacture' && 'Üretim Yılı: '}
                  {field === 'warrantyMonths' && 'Garanti Süresi: '}
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
              placeholder="Örn: GPS Navigasyon Cihazı"
              required
            />
            {fieldErrors.title && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Konum
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
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
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
              placeholder="Ekipmanınız hakkında detaylı bilgi verin..."
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
              placeholder="5000"
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

      {/* Ekipman Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ekipman Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700 mb-1">
              Ekipman Türü *
            </label>
            <select
              ref={equipmentTypeRef}
              id="equipmentType"
              name="equipmentType"
              value={formData.equipmentType}
              onChange={handleChange}
              onBlur={handleFieldBlur('equipmentType')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.equipmentType
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            >
              {EQUIPMENT_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {fieldErrors.equipmentType && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.equipmentType}</p>
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
              {CONDITION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Marka
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
              placeholder="Örn: Garmin, Raymarine"
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleFieldChange('model')}
              onPaste={handlePaste('model', 100)}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: GPSMap 1242xsv"
            />
          </div>

          <div>
            <label htmlFor="yearOfManufacture" className="block text-sm font-medium text-gray-700 mb-1">
              Üretim Yılı
            </label>
            <input
              type="number"
              id="yearOfManufacture"
              name="yearOfManufacture"
              value={formData.yearOfManufacture}
              onChange={handleFieldChange('yearOfManufacture')}
              onBlur={handleFieldBlur('yearOfManufacture')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('yearOfManufacture', 4)}
              min="1970"
              max={currentYear + 1}
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.yearOfManufacture
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder={currentYear.toString()}
            />
            {fieldErrors.yearOfManufacture && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.yearOfManufacture}</p>
            )}
          </div>

          <div>
            <label htmlFor="warrantyMonths" className="block text-sm font-medium text-gray-700 mb-1">
              Garanti Süresi (ay)
            </label>
            <input
              type="number"
              id="warrantyMonths"
              name="warrantyMonths"
              value={formData.warrantyMonths}
              onChange={handleFieldChange('warrantyMonths')}
              onBlur={handleFieldBlur('warrantyMonths')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('warrantyMonths', 3)}
              min="0"
              maxLength={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                fieldErrors.warrantyMonths
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="12"
            />
            {fieldErrors.warrantyMonths && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.warrantyMonths}</p>
            )}
          </div>

          <div>
            <label htmlFor="voltage" className="block text-sm font-medium text-gray-700 mb-1">
              Voltaj
            </label>
            <select
              id="voltage"
              name="voltage"
              value={formData.voltage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seçiniz</option>
              {VOLTAGE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="powerConsumption" className="block text-sm font-medium text-gray-700 mb-1">
              Güç Tüketimi (W)
            </label>
            <input
              type="number"
              id="powerConsumption"
              name="powerConsumption"
              value={formData.powerConsumption}
              onChange={handleFieldChange('powerConsumption')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('powerConsumption', 10)}
              min="0"
              step="0.1"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">
              Boyutlar
            </label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleFieldChange('dimensions')}
              onPaste={handlePaste('dimensions', 50)}
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: 30x20x10 cm"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Ağırlık (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleFieldChange('weight')}
              onKeyDown={handleNumericKeyDown}
              onPaste={handlePaste('weight', 10)}
              min="0"
              step="0.1"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5.5"
            />
          </div>

          <div>
            <label htmlFor="compatibleBoatTypes" className="block text-sm font-medium text-gray-700 mb-1">
              Uyumlu Tekne Türleri
            </label>
            <input
              type="text"
              id="compatibleBoatTypes"
              name="compatibleBoatTypes"
              value={formData.compatibleBoatTypes}
              onChange={handleFieldChange('compatibleBoatTypes')}
              onPaste={handlePaste('compatibleBoatTypes', 200)}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Motor yat, Yelkenli"
            />
          </div>

          <div>
            <label htmlFor="compatibleBoatLengths" className="block text-sm font-medium text-gray-700 mb-1">
              Uyumlu Tekne Boyutları
            </label>
            <input
              type="text"
              id="compatibleBoatLengths"
              name="compatibleBoatLengths"
              value={formData.compatibleBoatLengths}
              onChange={handleFieldChange('compatibleBoatLengths')}
              onPaste={handlePaste('compatibleBoatLengths', 50)}
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: 8-15 metre"
            />
          </div>

          <div>
            <label htmlFor="installationRequired" className="block text-sm font-medium text-gray-700 mb-1">
              Kurulum Gerekli
            </label>
            <select
              id="installationRequired"
              name="installationRequired"
              value={formData.installationRequired.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, installationRequired: e.target.value === 'true' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="false">Hayır</option>
              <option value="true">Evet</option>
            </select>
          </div>

          <div>
            <label htmlFor="manualIncluded" className="block text-sm font-medium text-gray-700 mb-1">
              Kullanım Kılavuzu Dahil
            </label>
            <select
              id="manualIncluded"
              name="manualIncluded"
              value={formData.manualIncluded.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, manualIncluded: e.target.value === 'true' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="true">Evet</option>
              <option value="false">Hayır</option>
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
