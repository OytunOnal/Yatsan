'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMarketplaceListing } from '@/lib/api';
import { getMarketplaceListingSchema, MarketplaceListingFormData, ITEM_TYPE_OPTIONS, CONDITION_OPTIONS, USAGE_FREQUENCY_OPTIONS } from '@/lib/validation/schemas/marketplace.schema';
import { useFormState } from '@/hooks/forms/useFormState';
import { useFormValidation } from '@/hooks/forms/useFormValidation';
import { useFormHandlers, COMMON_MAX_LENGTHS } from '@/hooks/forms/useFormHandlers';
import { useImageUpload } from '@/hooks/forms/useImageUpload';
import {
  FormInput,
  FormTextArea,
  FormSelect,
  FormNumericInput,
  FormSection,
  FormErrorDisplay,
  FormActions,
  FormImageUpload,
} from './shared';

// Currency options
const CURRENCY_OPTIONS = [
  { value: 'TRY', label: 'Türk Lirası (₺)' },
  { value: 'USD', label: 'Amerikan Doları ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

// Boolean options
const BOOLEAN_OPTIONS = [
  { value: 'false', label: 'Hayır' },
  { value: 'true', label: 'Evet' },
];

interface MarketplaceListingFormProps {
  onSuccess?: (listingId: string) => void;
}

const currentYear = new Date().getFullYear();

export default function MarketplaceListingForm({ onSuccess }: MarketplaceListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state management
  const { formData, setFormData, fieldErrors, setFieldErrors, updateField, clearFieldError, resetForm } = useFormState<MarketplaceListingFormData>({
    initialData: {
      title: '',
      description: '',
      price: '',
      currency: 'TRY',
      location: '',
      itemType: 'accessories',
      brand: '',
      model: '',
      condition: 'good',
      yearPurchased: '',
      usageFrequency: '',
      originalPrice: '',
      reasonForSelling: '',
      dimensions: '',
      weight: '',
      color: '',
      material: '',
      includesOriginalBox: false,
      includesManual: true,
      includesAccessories: false,
      accessoriesDescription: '',
      negotiable: true,
      acceptTrade: false,
      tradeInterests: '',
    },
  });

  // Validation
  const schema = getMarketplaceListingSchema(currentYear);
  const { validate } = useFormValidation(schema);

  // Form handlers
  const { handleChange, handleFieldChange, handleFieldBlur, handlePaste, handleNumericKeyDown } = useFormHandlers<MarketplaceListingFormData>({
    setFormData,
    setFieldErrors,
    setError,
    maxLengths: COMMON_MAX_LENGTHS,
  });

  // Image upload
  const { images, previews, handleImageChange, removeImage } = useImageUpload({
    maxFiles: 15,
  });

  // Boolean field handler
  const handleBooleanChange = (fieldName: keyof MarketplaceListingFormData) => 
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value === 'true';
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      const validationResult = validate(formData);
      
      if (!validationResult.success) {
        setFieldErrors(validationResult.errors);
        setError(Object.values(validationResult.errors)[0] || 'Lütfen form hatalarını düzeltin');
        setLoading(false);
        return;
      }

      const validatedData = validationResult.data!;

      // API call
      const response = await createMarketplaceListing({
        title: validatedData.title,
        description: validatedData.description || '',
        price: parseFloat(validatedData.price),
        currency: validatedData.currency,
        location: validatedData.location || '',
        itemType: validatedData.itemType,
        brand: validatedData.brand || undefined,
        model: validatedData.model || undefined,
        condition: validatedData.condition,
        yearPurchased: validatedData.yearPurchased ? parseInt(validatedData.yearPurchased) : undefined,
        usageFrequency: validatedData.usageFrequency || undefined,
        originalPrice: validatedData.originalPrice ? parseFloat(validatedData.originalPrice) : undefined,
        reasonForSelling: validatedData.reasonForSelling || undefined,
        dimensions: validatedData.dimensions || undefined,
        weight: validatedData.weight ? parseFloat(validatedData.weight) : undefined,
        color: validatedData.color || undefined,
        material: validatedData.material || undefined,
        includesOriginalBox: validatedData.includesOriginalBox,
        includesManual: validatedData.includesManual,
        includesAccessories: validatedData.includesAccessories,
        accessoriesDescription: validatedData.accessoriesDescription || undefined,
        negotiable: validatedData.negotiable,
        acceptTrade: validatedData.acceptTrade,
        tradeInterests: validatedData.tradeInterests || undefined,
        images,
      });

      const listingId = response.listing.id;
      
      if (onSuccess) {
        onSuccess(listingId);
      } else {
        router.push('/dashboard/listings?success=true');
      }
    } catch (err: any) {
      console.log('MarketplaceListingForm hatası:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'İlan oluşturulurken bir hata oluştu';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormErrorDisplay error={error} fieldErrors={fieldErrors} />

      {/* Temel Bilgiler */}
      <FormSection title="Temel Bilgiler">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="title"
            label="Başlık"
            value={formData.title}
            onChange={handleFieldChange('title')}
            onBlur={handleFieldBlur('title')}
            onPaste={handlePaste('title', COMMON_MAX_LENGTHS.title)}
            maxLength={COMMON_MAX_LENGTHS.title}
            error={fieldErrors.title}
            placeholder="Örn: İkinci El Can Yeleği"
            required
          />

          <FormInput
            name="location"
            label="Konum"
            value={formData.location || ''}
            onChange={handleFieldChange('location')}
            onPaste={handlePaste('location', COMMON_MAX_LENGTHS.location)}
            maxLength={COMMON_MAX_LENGTHS.location}
            placeholder="Örn: İstanbul, Türkiye"
          />

          <div className="md:col-span-2">
            <FormTextArea
              name="description"
              label="Açıklama"
              value={formData.description || ''}
              onChange={handleFieldChange('description')}
              onPaste={handlePaste('description', COMMON_MAX_LENGTHS.description)}
              maxLength={COMMON_MAX_LENGTHS.description}
              placeholder="Ürününüz hakkında detaylı bilgi verin..."
              rows={4}
            />
          </div>
        </div>
      </FormSection>

      {/* Fiyat Bilgileri */}
      <FormSection title="Fiyat Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormNumericInput
            name="price"
            label="Fiyat"
            value={formData.price}
            onChange={handleFieldChange('price')}
            onBlur={handleFieldBlur('price')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('price', COMMON_MAX_LENGTHS.price)}
            maxLength={COMMON_MAX_LENGTHS.price}
            error={fieldErrors.price}
            placeholder="1500"
            required
          />

          <FormSelect
            name="currency"
            label="Para Birimi"
            value={formData.currency}
            onChange={handleChange}
            options={CURRENCY_OPTIONS}
          />

          <FormNumericInput
            name="originalPrice"
            label="Orijinal Fiyat"
            value={formData.originalPrice || ''}
            onChange={handleFieldChange('originalPrice')}
            onKeyDown={handleNumericKeyDown}
            step="0.01"
            placeholder="3000"
          />

          <FormSelect
            name="negotiable"
            label="Pazarlık İmkânı"
            value={formData.negotiable.toString()}
            onChange={handleBooleanChange('negotiable')}
            options={[{ value: 'true', label: 'Evet' }, { value: 'false', label: 'Hayır' }]}
          />
        </div>
      </FormSection>

      {/* Ürün Bilgileri */}
      <FormSection title="Ürün Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="itemType"
            label="Ürün Türü"
            value={formData.itemType}
            onChange={handleChange}
            onBlur={handleFieldBlur('itemType')}
            options={ITEM_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            error={fieldErrors.itemType}
            required
          />

          <FormSelect
            name="condition"
            label="Durum"
            value={formData.condition}
            onChange={handleChange}
            options={CONDITION_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            required
          />

          <FormInput
            name="brand"
            label="Marka"
            value={formData.brand || ''}
            onChange={handleFieldChange('brand')}
            onPaste={handlePaste('brand', COMMON_MAX_LENGTHS.brand)}
            maxLength={COMMON_MAX_LENGTHS.brand}
            placeholder="Örn: Crewsaver, Musto"
          />

          <FormInput
            name="model"
            label="Model"
            value={formData.model || ''}
            onChange={handleFieldChange('model')}
            onPaste={handlePaste('model', COMMON_MAX_LENGTHS.model)}
            maxLength={COMMON_MAX_LENGTHS.model}
            placeholder="Model adı"
          />

          <FormNumericInput
            name="yearPurchased"
            label="Satın Alma Yılı"
            value={formData.yearPurchased || ''}
            onChange={handleFieldChange('yearPurchased')}
            onBlur={handleFieldBlur('yearPurchased')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('yearPurchased', COMMON_MAX_LENGTHS.yearPurchased)}
            maxLength={COMMON_MAX_LENGTHS.yearPurchased}
            error={fieldErrors.yearPurchased}
            placeholder={currentYear.toString()}
            min={1970}
            max={currentYear + 1}
          />

          <FormSelect
            name="usageFrequency"
            label="Kullanım Sıklığı"
            value={formData.usageFrequency || ''}
            onChange={handleChange}
            options={[{ value: '', label: 'Seçiniz' }, ...USAGE_FREQUENCY_OPTIONS.map(o => ({ value: o.value, label: o.label }))]}
          />

          <FormInput
            name="color"
            label="Renk"
            value={formData.color || ''}
            onChange={handleFieldChange('color')}
            onPaste={handlePaste('color', COMMON_MAX_LENGTHS.color)}
            maxLength={COMMON_MAX_LENGTHS.color}
            placeholder="Örn: Siyah, Kırmızı"
          />

          <FormInput
            name="material"
            label="Malzeme"
            value={formData.material || ''}
            onChange={handleFieldChange('material')}
            onPaste={handlePaste('material', COMMON_MAX_LENGTHS.material)}
            maxLength={COMMON_MAX_LENGTHS.material}
            placeholder="Örn: Neopren, Polyester"
          />

          <FormInput
            name="dimensions"
            label="Boyutlar"
            value={formData.dimensions || ''}
            onChange={handleFieldChange('dimensions')}
            onPaste={handlePaste('dimensions', COMMON_MAX_LENGTHS.dimensions)}
            maxLength={COMMON_MAX_LENGTHS.dimensions}
            placeholder="Örn: 30x20x10 cm"
          />

          <FormNumericInput
            name="weight"
            label="Ağırlık (kg)"
            value={formData.weight || ''}
            onChange={handleFieldChange('weight')}
            onKeyDown={handleNumericKeyDown}
            step="0.1"
            placeholder="2.5"
          />

          <div className="md:col-span-2">
            <FormTextArea
              name="reasonForSelling"
              label="Satış Nedeni"
              value={formData.reasonForSelling || ''}
              onChange={handleFieldChange('reasonForSelling')}
              onPaste={handlePaste('reasonForSelling', COMMON_MAX_LENGTHS.reasonForSelling)}
              maxLength={COMMON_MAX_LENGTHS.reasonForSelling}
              placeholder="Neden satıyorsunuz?"
              rows={2}
            />
          </div>
        </div>
      </FormSection>

      {/* Dahil Olanlar */}
      <FormSection title="Dahil Olanlar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            name="includesOriginalBox"
            label="Orijinal Kutu"
            value={formData.includesOriginalBox.toString()}
            onChange={handleBooleanChange('includesOriginalBox')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            name="includesManual"
            label="Kullanım Kılavuzu"
            value={formData.includesManual.toString()}
            onChange={handleBooleanChange('includesManual')}
            options={[{ value: 'true', label: 'Evet' }, { value: 'false', label: 'Hayır' }]}
          />

          <FormSelect
            name="includesAccessories"
            label="Aksesuarlar"
            value={formData.includesAccessories.toString()}
            onChange={handleBooleanChange('includesAccessories')}
            options={BOOLEAN_OPTIONS}
          />

          <div className="md:col-span-3">
            <FormTextArea
              name="accessoriesDescription"
              label="Aksesuar Açıklaması"
              value={formData.accessoriesDescription || ''}
              onChange={handleFieldChange('accessoriesDescription')}
              onPaste={handlePaste('accessoriesDescription', COMMON_MAX_LENGTHS.accessoriesDescription)}
              maxLength={COMMON_MAX_LENGTHS.accessoriesDescription}
              placeholder="Dahil olan aksesuarları belirtin..."
              rows={2}
            />
          </div>
        </div>
      </FormSection>

      {/* Takas */}
      <FormSection title="Takas Seçenekleri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="acceptTrade"
            label="Takas Kabul"
            value={formData.acceptTrade.toString()}
            onChange={handleBooleanChange('acceptTrade')}
            options={BOOLEAN_OPTIONS}
          />

          <FormInput
            name="tradeInterests"
            label="Takas İlgileri"
            value={formData.tradeInterests || ''}
            onChange={handleFieldChange('tradeInterests')}
            onPaste={handlePaste('tradeInterests', COMMON_MAX_LENGTHS.tradeInterests)}
            maxLength={COMMON_MAX_LENGTHS.tradeInterests}
            placeholder="Örn: GPS cihazı, Balık bulucu"
          />
        </div>
      </FormSection>

      {/* Resim Yükleme */}
      <FormSection title="Resimler">
        <FormImageUpload
          images={images}
          previews={previews}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
          maxFiles={15}
          label="İlan Resimleri"
        />
      </FormSection>

      {/* Submit Button */}
      <FormActions
        loading={loading}
        submitLabel="İlanı Oluştur"
        onCancel={!onSuccess ? () => router.back() : undefined}
      />
    </form>
  );
}
