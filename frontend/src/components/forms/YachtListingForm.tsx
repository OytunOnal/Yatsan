'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createYachtListing } from '@/lib/api';
import { getYachtListingSchema, YachtListingFormData } from '@/lib/validation/schemas/yacht.schema';
import { COMMON_MAX_LENGTHS } from '@/lib/validation/schemas/common.schema';
import { useFormState } from '@/hooks/forms/useFormState';
import { useFormValidation } from '@/hooks/forms/useFormValidation';
import { useFormHandlers } from '@/hooks/forms/useFormHandlers';
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

// Yacht type options
const YACHT_TYPE_OPTIONS = [
  { value: 'motor_yacht', label: 'Motor Yat' },
  { value: 'sailing_yacht', label: 'Yelkenli Yat' },
  { value: 'catamaran', label: 'Katamaran' },
  { value: 'gulet', label: 'Gulet' },
];

// Currency options
const CURRENCY_OPTIONS = [
  { value: 'TRY', label: 'Türk Lirası (₺)' },
  { value: 'USD', label: 'Amerikan Doları ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

// Fuel type options
const FUEL_TYPE_OPTIONS = [
  { value: 'diesel', label: 'Dizel' },
  { value: 'petrol', label: 'Benzin' },
  { value: 'electric', label: 'Elektrik' },
  { value: 'hybrid', label: 'Hibrit' },
];

// Condition options
const CONDITION_OPTIONS = [
  { value: 'new', label: 'Yeni' },
  { value: 'excellent', label: 'Mükemmel' },
  { value: 'good', label: 'İyi' },
  { value: 'fair', label: 'Orta' },
];

interface YachtListingFormProps {
  onSuccess?: (listingId: string) => void;
}

const currentYear = new Date().getFullYear();

export default function YachtListingForm({ onSuccess }: YachtListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state management
  const { formData, setFormData, fieldErrors, setFieldErrors, updateField, clearFieldError, resetForm } = useFormState<YachtListingFormData>({
    initialData: {
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
    },
  });

  // Validation
  const schema = getYachtListingSchema(currentYear);
  const { validate, validateField } = useFormValidation(schema);

  // Form handlers
  const { handleChange, handleFieldChange, handleFieldBlur, handlePaste, handleNumericKeyDown } = useFormHandlers<YachtListingFormData>({
    setFormData,
    setFieldErrors,
    setError,
    maxLengths: COMMON_MAX_LENGTHS,
  });

  // Image upload
  const { images, previews, handleImageChange, removeImage } = useImageUpload({
    maxFiles: 15,
  });

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
            placeholder="Örn: Lüks Motor Yat"
            required
          />

          <FormInput
            name="location"
            label="Konum"
            value={formData.location}
            onChange={handleFieldChange('location')}
            onBlur={handleFieldBlur('location')}
            onPaste={handlePaste('location', COMMON_MAX_LENGTHS.location)}
            maxLength={COMMON_MAX_LENGTHS.location}
            error={fieldErrors.location}
            placeholder="Örn: İstanbul, Türkiye"
            required
          />

          <div className="md:col-span-2">
            <FormTextArea
              name="description"
              label="Açıklama"
              value={formData.description}
              onChange={handleFieldChange('description')}
              onBlur={handleFieldBlur('description')}
              onPaste={handlePaste('description', COMMON_MAX_LENGTHS.description)}
              maxLength={COMMON_MAX_LENGTHS.description}
              error={fieldErrors.description}
              placeholder="Yatınız hakkında detaylı bilgi verin..."
              rows={4}
              required
            />
          </div>
        </div>
      </FormSection>

      {/* Fiyat Bilgileri */}
      <FormSection title="Fiyat Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="1000000"
            required
          />

          <FormSelect
            name="currency"
            label="Para Birimi"
            value={formData.currency}
            onChange={handleChange}
            options={CURRENCY_OPTIONS}
          />
        </div>
      </FormSection>

      {/* Yat Bilgileri */}
      <FormSection title="Yat Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="yachtType"
            label="Yat Tipi"
            value={formData.yachtType}
            onChange={handleChange}
            options={YACHT_TYPE_OPTIONS}
          />

          <FormNumericInput
            name="year"
            label="Yıl"
            value={formData.year}
            onChange={handleFieldChange('year')}
            onBlur={handleFieldBlur('year')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('year', COMMON_MAX_LENGTHS.year)}
            maxLength={COMMON_MAX_LENGTHS.year}
            error={fieldErrors.year}
            placeholder={currentYear.toString()}
            min={1970}
            max={currentYear}
            required
          />

          <FormNumericInput
            name="length"
            label="Uzunluk (metre)"
            value={formData.length}
            onChange={handleFieldChange('length')}
            onBlur={handleFieldBlur('length')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('length', COMMON_MAX_LENGTHS.length)}
            maxLength={COMMON_MAX_LENGTHS.length}
            error={fieldErrors.length}
            placeholder="20.5"
            step="0.01"
            required
          />

          <FormNumericInput
            name="beam"
            label="Genişlik (metre)"
            value={formData.beam}
            onChange={handleFieldChange('beam')}
            onBlur={handleFieldBlur('beam')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('beam', COMMON_MAX_LENGTHS.beam)}
            maxLength={COMMON_MAX_LENGTHS.beam}
            error={fieldErrors.beam}
            placeholder="5.5"
            step="0.01"
            required
          />

          <FormNumericInput
            name="draft"
            label="Sükunet Derinliği (metre)"
            value={formData.draft}
            onChange={handleFieldChange('draft')}
            onBlur={handleFieldBlur('draft')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('draft', COMMON_MAX_LENGTHS.draft)}
            maxLength={COMMON_MAX_LENGTHS.draft}
            error={fieldErrors.draft}
            placeholder="2.5"
            step="0.01"
            required
          />

          <FormSelect
            name="condition"
            label="Durum"
            value={formData.condition}
            onChange={handleChange}
            options={CONDITION_OPTIONS}
          />
        </div>
      </FormSection>

      {/* Motor Bilgileri */}
      <FormSection title="Motor Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="engineBrand"
            label="Motor Markası"
            value={formData.engineBrand}
            onChange={handleFieldChange('engineBrand')}
            onPaste={handlePaste('engineBrand', COMMON_MAX_LENGTHS.engineBrand)}
            maxLength={COMMON_MAX_LENGTHS.engineBrand}
            placeholder="Örn: Volvo Penta"
          />

          <FormNumericInput
            name="engineHP"
            label="Motor Gücü (HP)"
            value={formData.engineHP}
            onChange={handleFieldChange('engineHP')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('engineHP', COMMON_MAX_LENGTHS.engineHP)}
            maxLength={COMMON_MAX_LENGTHS.engineHP}
            placeholder="1000"
          />

          <FormNumericInput
            name="engineHours"
            label="Motor Saati"
            value={formData.engineHours}
            onChange={handleFieldChange('engineHours')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('engineHours', COMMON_MAX_LENGTHS.engineHours)}
            maxLength={COMMON_MAX_LENGTHS.engineHours}
            placeholder="500"
          />

          <FormSelect
            name="fuelType"
            label="Yakıt Tipi"
            value={formData.fuelType}
            onChange={handleChange}
            options={FUEL_TYPE_OPTIONS}
          />

          <FormNumericInput
            name="cruisingSpeed"
            label="Seyir Hızı (knot)"
            value={formData.cruisingSpeed}
            onChange={handleFieldChange('cruisingSpeed')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('cruisingSpeed', COMMON_MAX_LENGTHS.cruisingSpeed)}
            maxLength={COMMON_MAX_LENGTHS.cruisingSpeed}
            placeholder="20"
          />

          <FormNumericInput
            name="maxSpeed"
            label="Maksimum Hız (knot)"
            value={formData.maxSpeed}
            onChange={handleFieldChange('maxSpeed')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('maxSpeed', COMMON_MAX_LENGTHS.maxSpeed)}
            maxLength={COMMON_MAX_LENGTHS.maxSpeed}
            placeholder="30"
          />
        </div>
      </FormSection>

      {/* Konaklama Bilgileri */}
      <FormSection title="Konaklama Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormNumericInput
            name="cabinCount"
            label="Kabin Sayısı"
            value={formData.cabinCount}
            onChange={handleFieldChange('cabinCount')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('cabinCount', COMMON_MAX_LENGTHS.cabinCount)}
            maxLength={COMMON_MAX_LENGTHS.cabinCount}
            placeholder="4"
          />

          <FormNumericInput
            name="bedCount"
            label="Yatak Sayısı"
            value={formData.bedCount}
            onChange={handleFieldChange('bedCount')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('bedCount', COMMON_MAX_LENGTHS.bedCount)}
            maxLength={COMMON_MAX_LENGTHS.bedCount}
            placeholder="8"
          />

          <FormNumericInput
            name="bathroomCount"
            label="Banyo Sayısı"
            value={formData.bathroomCount}
            onChange={handleFieldChange('bathroomCount')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('bathroomCount', COMMON_MAX_LENGTHS.bathroomCount)}
            maxLength={COMMON_MAX_LENGTHS.bathroomCount}
            placeholder="4"
          />
        </div>
      </FormSection>

      {/* Ekipman */}
      <FormSection title="Ekipman ve Donanım">
        <FormTextArea
          name="equipment"
          label="Ekipman Listesi"
          value={formData.equipment}
          onChange={handleFieldChange('equipment')}
          onPaste={handlePaste('equipment', COMMON_MAX_LENGTHS.equipment)}
          maxLength={COMMON_MAX_LENGTHS.equipment}
          placeholder="GPS, Radar, Otomatik Pilot, Jeneratör, Su yapıcı, vb."
          rows={4}
        />
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
