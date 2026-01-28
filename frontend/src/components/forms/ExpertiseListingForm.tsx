'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createExpertiseListing } from '@/lib/api';
import { getExpertiseListingSchema, ExpertiseListingFormData, EXPERTISE_TYPE_OPTIONS } from '@/lib/validation/schemas/expertise.schema';
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

interface ExpertiseListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function ExpertiseListingForm({ onSuccess }: ExpertiseListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state management
  const { formData, setFormData, fieldErrors, setFieldErrors, updateField, clearFieldError, resetForm } = useFormState<ExpertiseListingFormData>({
    initialData: {
      title: '',
      description: '',
      price: '',
      currency: 'TRY',
      location: '',
      companyName: '',
      expertName: '',
      licenseNumber: '',
      yearsExperience: '',
      expertiseType: 'comprehensive',
      boatTypes: '',
      minBoatLength: '',
      maxBoatLength: '',
      serviceArea: '',
      mobileService: false,
      reportTypes: '',
      reportLanguages: '',
      turnaroundTime: '',
      basePrice: '',
      pricePerMeter: '',
      travelFee: '',
      certifications: '',
      memberships: '',
      phone: '',
      email: '',
      website: '',
    },
  });

  // Validation
  const schema = getExpertiseListingSchema();
  const { validate } = useFormValidation(schema);

  // Form handlers
  const { handleChange, handleFieldChange, handleFieldBlur, handlePaste, handleNumericKeyDown } = useFormHandlers<ExpertiseListingFormData>({
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
  const handleBooleanChange = (fieldName: keyof ExpertiseListingFormData) => 
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
      const response = await createExpertiseListing({
        title: validatedData.title,
        description: validatedData.description || '',
        price: parseFloat(validatedData.price),
        currency: validatedData.currency,
        location: validatedData.location || '',
        companyName: validatedData.companyName || undefined,
        expertName: validatedData.expertName || undefined,
        licenseNumber: validatedData.licenseNumber || undefined,
        yearsExperience: validatedData.yearsExperience ? parseInt(validatedData.yearsExperience) : undefined,
        expertiseType: validatedData.expertiseType,
        boatTypes: validatedData.boatTypes || undefined,
        minBoatLength: validatedData.minBoatLength ? parseFloat(validatedData.minBoatLength) : undefined,
        maxBoatLength: validatedData.maxBoatLength ? parseFloat(validatedData.maxBoatLength) : undefined,
        serviceArea: validatedData.serviceArea || undefined,
        mobileService: validatedData.mobileService,
        reportTypes: validatedData.reportTypes || undefined,
        reportLanguages: validatedData.reportLanguages || undefined,
        turnaroundTime: validatedData.turnaroundTime || undefined,
        basePrice: validatedData.basePrice ? parseFloat(validatedData.basePrice) : undefined,
        pricePerMeter: validatedData.pricePerMeter ? parseFloat(validatedData.pricePerMeter) : undefined,
        travelFee: validatedData.travelFee ? parseFloat(validatedData.travelFee) : undefined,
        certifications: validatedData.certifications || undefined,
        memberships: validatedData.memberships || undefined,
        phone: validatedData.phone || undefined,
        email: validatedData.email || undefined,
        website: validatedData.website || undefined,
        images,
      });

      const listingId = response.listing.id;
      
      if (onSuccess) {
        onSuccess(listingId);
      } else {
        router.push('/dashboard/listings?success=true');
      }
    } catch (err: any) {
      console.log('ExpertiseListingForm hatası:', err);
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
            placeholder="Örn: Profesyonel Tekne Ekspertizi"
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
              placeholder="Ekspertiz hizmetiniz hakkında detaylı bilgi verin..."
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
            label="Başlangıç Fiyatı"
            value={formData.price}
            onChange={handleFieldChange('price')}
            onBlur={handleFieldBlur('price')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('price', COMMON_MAX_LENGTHS.price)}
            maxLength={COMMON_MAX_LENGTHS.price}
            error={fieldErrors.price}
            placeholder="3000"
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
            name="basePrice"
            label="Baz Ücret"
            value={formData.basePrice || ''}
            onChange={handleFieldChange('basePrice')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('basePrice', COMMON_MAX_LENGTHS.basePrice)}
            step="0.01"
            placeholder="2000"
          />

          <FormNumericInput
            name="pricePerMeter"
            label="Metre Başına Ücret"
            value={formData.pricePerMeter || ''}
            onChange={handleFieldChange('pricePerMeter')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('pricePerMeter', COMMON_MAX_LENGTHS.pricePerMeter)}
            step="0.01"
            placeholder="200"
          />

          <FormNumericInput
            name="travelFee"
            label="Ulaşım Ücreti"
            value={formData.travelFee || ''}
            onChange={handleFieldChange('travelFee')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('travelFee', COMMON_MAX_LENGTHS.travelFee)}
            step="0.01"
            placeholder="500"
          />
        </div>
      </FormSection>

      {/* Eksper Bilgileri */}
      <FormSection title="Eksper Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="companyName"
            label="Şirket Adı"
            value={formData.companyName || ''}
            onChange={handleFieldChange('companyName')}
            onPaste={handlePaste('companyName', COMMON_MAX_LENGTHS.companyName)}
            maxLength={COMMON_MAX_LENGTHS.companyName}
            placeholder="Şirket adı"
          />

          <FormInput
            name="expertName"
            label="Eksper Adı"
            value={formData.expertName || ''}
            onChange={handleFieldChange('expertName')}
            onPaste={handlePaste('expertName', COMMON_MAX_LENGTHS.expertName)}
            maxLength={COMMON_MAX_LENGTHS.expertName}
            placeholder="Ad Soyad"
          />

          <FormInput
            name="licenseNumber"
            label="Lisans Numarası"
            value={formData.licenseNumber || ''}
            onChange={handleFieldChange('licenseNumber')}
            onPaste={handlePaste('licenseNumber', COMMON_MAX_LENGTHS.licenseNumber)}
            maxLength={COMMON_MAX_LENGTHS.licenseNumber}
            placeholder="Lisans numarası"
          />

          <FormNumericInput
            name="yearsExperience"
            label="Deneyim (yıl)"
            value={formData.yearsExperience || ''}
            onChange={handleFieldChange('yearsExperience')}
            onKeyDown={handleNumericKeyDown}
            placeholder="15"
          />

          <FormSelect
            name="expertiseType"
            label="Ekspertiz Türü"
            value={formData.expertiseType}
            onChange={handleChange}
            options={EXPERTISE_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            required
          />

          <FormInput
            name="certifications"
            label="Sertifikalar"
            value={formData.certifications || ''}
            onChange={handleFieldChange('certifications')}
            onPaste={handlePaste('certifications', COMMON_MAX_LENGTHS.certifications)}
            maxLength={COMMON_MAX_LENGTHS.certifications}
            placeholder="Örn: IIMS, YBDSA"
          />

          <FormInput
            name="memberships"
            label="Üyelikler"
            value={formData.memberships || ''}
            onChange={handleFieldChange('memberships')}
            onPaste={handlePaste('memberships', COMMON_MAX_LENGTHS.memberships)}
            maxLength={COMMON_MAX_LENGTHS.memberships}
            placeholder="Örn: TMMOB, Deniz Ticaret Odası"
          />
        </div>
      </FormSection>

      {/* Hizmet Bilgileri */}
      <FormSection title="Hizmet Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="boatTypes"
            label="Tekne Türleri"
            value={formData.boatTypes || ''}
            onChange={handleFieldChange('boatTypes')}
            onPaste={handlePaste('boatTypes', COMMON_MAX_LENGTHS.boatTypes)}
            maxLength={COMMON_MAX_LENGTHS.boatTypes}
            placeholder="Örn: Motor yat, Yelkenli, Gulet"
          />

          <FormInput
            name="serviceArea"
            label="Hizmet Bölgesi"
            value={formData.serviceArea || ''}
            onChange={handleFieldChange('serviceArea')}
            onPaste={handlePaste('serviceArea', COMMON_MAX_LENGTHS.serviceArea)}
            maxLength={COMMON_MAX_LENGTHS.serviceArea}
            placeholder="Örn: Marmara, Ege, Akdeniz"
          />

          <FormNumericInput
            name="minBoatLength"
            label="Min Tekne Boyu (m)"
            value={formData.minBoatLength || ''}
            onChange={handleFieldChange('minBoatLength')}
            onKeyDown={handleNumericKeyDown}
            step="0.1"
            placeholder="5"
          />

          <FormNumericInput
            name="maxBoatLength"
            label="Max Tekne Boyu (m)"
            value={formData.maxBoatLength || ''}
            onChange={handleFieldChange('maxBoatLength')}
            onKeyDown={handleNumericKeyDown}
            step="0.1"
            placeholder="50"
          />

          <FormSelect
            name="mobileService"
            label="Mobil Hizmet"
            value={formData.mobileService.toString()}
            onChange={handleBooleanChange('mobileService')}
            options={BOOLEAN_OPTIONS}
          />

          <FormInput
            name="turnaroundTime"
            label="Teslimat Süresi"
            value={formData.turnaroundTime || ''}
            onChange={handleFieldChange('turnaroundTime')}
            onPaste={handlePaste('turnaroundTime', COMMON_MAX_LENGTHS.turnaroundTime)}
            maxLength={COMMON_MAX_LENGTHS.turnaroundTime}
            placeholder="Örn: 3-5 iş günü"
          />

          <FormInput
            name="reportTypes"
            label="Rapor Türleri"
            value={formData.reportTypes || ''}
            onChange={handleFieldChange('reportTypes')}
            onPaste={handlePaste('reportTypes', COMMON_MAX_LENGTHS.reportTypes)}
            maxLength={COMMON_MAX_LENGTHS.reportTypes}
            placeholder="Örn: Detaylı rapor, Özet rapor, Sigorta raporu"
          />

          <FormInput
            name="reportLanguages"
            label="Rapor Dilleri"
            value={formData.reportLanguages || ''}
            onChange={handleFieldChange('reportLanguages')}
            onPaste={handlePaste('reportLanguages', COMMON_MAX_LENGTHS.reportLanguages)}
            maxLength={COMMON_MAX_LENGTHS.reportLanguages}
            placeholder="Örn: Türkçe, İngilizce"
          />
        </div>
      </FormSection>

      {/* İletişim Bilgileri */}
      <FormSection title="İletişim Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="phone"
            label="Telefon"
            value={formData.phone || ''}
            onChange={handleFieldChange('phone')}
            onPaste={handlePaste('phone', COMMON_MAX_LENGTHS.phone)}
            maxLength={COMMON_MAX_LENGTHS.phone}
            placeholder="05XX XXX XX XX"
          />

          <FormInput
            name="email"
            label="E-posta"
            value={formData.email || ''}
            onChange={handleFieldChange('email')}
            onBlur={handleFieldBlur('email')}
            onPaste={handlePaste('email', COMMON_MAX_LENGTHS.email)}
            maxLength={COMMON_MAX_LENGTHS.email}
            error={fieldErrors.email}
            placeholder="email@example.com"
          />

          <FormInput
            name="website"
            label="Web Sitesi"
            value={formData.website || ''}
            onChange={handleFieldChange('website')}
            onPaste={handlePaste('website', COMMON_MAX_LENGTHS.website)}
            maxLength={COMMON_MAX_LENGTHS.website}
            placeholder="https://www.example.com"
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
