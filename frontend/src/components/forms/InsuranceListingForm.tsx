'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createInsuranceListing } from '@/lib/api';
import { getInsuranceListingSchema, InsuranceListingFormData, INSURANCE_TYPE_OPTIONS } from '@/lib/validation/schemas/insurance.schema';
import { COMMON_MAX_LENGTHS } from '@/lib/validation/schemas/common.schema';
import { useFormState } from '@/hooks/forms/useFormState';
import { useFormValidation } from '@/hooks/forms/useFormValidation';
import { useFormHandlers, COMMON_MAX_LENGTHS as HANDLER_MAX_LENGTHS } from '@/hooks/forms/useFormHandlers';
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

interface InsuranceListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function InsuranceListingForm({ onSuccess }: InsuranceListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state management
  const { formData, setFormData, fieldErrors, setFieldErrors, updateField, clearFieldError, resetForm } = useFormState<InsuranceListingFormData>({
    initialData: {
      title: '',
      description: '',
      price: '',
      currency: 'TRY',
      location: '',
      companyName: '',
      agencyName: '',
      licenseNumber: '',
      insuranceType: 'comprehensive',
      coverageTypes: '',
      minBoatLength: '',
      maxBoatLength: '',
      minBoatValue: '',
      maxBoatValue: '',
      boatAgeLimit: '',
      coverageArea: '',
      premiumCalculation: '',
      minPremium: '',
      premiumPercentage: '',
      hullCoverage: false,
      liabilityCoverage: false,
      salvageCoverage: false,
      personalAccident: false,
      legalProtection: false,
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      website: '',
    },
  });

  // Validation
  const schema = getInsuranceListingSchema();
  const { validate } = useFormValidation(schema);

  // Form handlers
  const { handleChange, handleFieldChange, handleFieldBlur, handlePaste, handleNumericKeyDown } = useFormHandlers<InsuranceListingFormData>({
    setFormData,
    setFieldErrors,
    setError,
    maxLengths: HANDLER_MAX_LENGTHS,
  });

  // Image upload
  const { images, previews, handleImageChange, removeImage } = useImageUpload({
    maxFiles: 15,
  });

  // Boolean field handler
  const handleBooleanChange = (fieldName: keyof InsuranceListingFormData) => 
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
      const response = await createInsuranceListing({
        title: validatedData.title,
        description: validatedData.description || '',
        price: parseFloat(validatedData.price),
        currency: validatedData.currency,
        location: validatedData.location || '',
        companyName: validatedData.companyName,
        agencyName: validatedData.agencyName || undefined,
        licenseNumber: validatedData.licenseNumber || undefined,
        insuranceType: validatedData.insuranceType,
        coverageTypes: validatedData.coverageTypes || undefined,
        minBoatLength: validatedData.minBoatLength ? parseFloat(validatedData.minBoatLength) : undefined,
        maxBoatLength: validatedData.maxBoatLength ? parseFloat(validatedData.maxBoatLength) : undefined,
        minBoatValue: validatedData.minBoatValue ? parseFloat(validatedData.minBoatValue) : undefined,
        maxBoatValue: validatedData.maxBoatValue ? parseFloat(validatedData.maxBoatValue) : undefined,
        boatAgeLimit: validatedData.boatAgeLimit ? parseInt(validatedData.boatAgeLimit) : undefined,
        coverageArea: validatedData.coverageArea || undefined,
        premiumCalculation: validatedData.premiumCalculation || undefined,
        minPremium: validatedData.minPremium ? parseFloat(validatedData.minPremium) : undefined,
        premiumPercentage: validatedData.premiumPercentage ? parseFloat(validatedData.premiumPercentage) : undefined,
        hullCoverage: validatedData.hullCoverage,
        liabilityCoverage: validatedData.liabilityCoverage,
        salvageCoverage: validatedData.salvageCoverage,
        personalAccident: validatedData.personalAccident,
        legalProtection: validatedData.legalProtection,
        contactPerson: validatedData.contactPerson || undefined,
        contactPhone: validatedData.contactPhone || undefined,
        contactEmail: validatedData.contactEmail || undefined,
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
      console.log('InsuranceListingForm hatası:', err);
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
            onPaste={handlePaste('title', HANDLER_MAX_LENGTHS.title)}
            maxLength={HANDLER_MAX_LENGTHS.title}
            error={fieldErrors.title}
            placeholder="Örn: Kapsamlı Tekne Sigortası"
            required
          />

          <FormInput
            name="location"
            label="Konum"
            value={formData.location || ''}
            onChange={handleFieldChange('location')}
            onPaste={handlePaste('location', HANDLER_MAX_LENGTHS.location)}
            maxLength={HANDLER_MAX_LENGTHS.location}
            placeholder="Örn: İstanbul, Türkiye"
          />

          <div className="md:col-span-2">
            <FormTextArea
              name="description"
              label="Açıklama"
              value={formData.description || ''}
              onChange={handleFieldChange('description')}
              onPaste={handlePaste('description', HANDLER_MAX_LENGTHS.description)}
              maxLength={HANDLER_MAX_LENGTHS.description}
              placeholder="Sigorta paketiniz hakkında detaylı bilgi verin..."
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
            onPaste={handlePaste('price', HANDLER_MAX_LENGTHS.price)}
            maxLength={HANDLER_MAX_LENGTHS.price}
            error={fieldErrors.price}
            placeholder="1000"
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
            name="minPremium"
            label="Min. Prim"
            value={formData.minPremium || ''}
            onChange={handleFieldChange('minPremium')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('minPremium', HANDLER_MAX_LENGTHS.minPremium)}
            step="0.01"
            placeholder="1000"
          />

          <FormNumericInput
            name="premiumPercentage"
            label="Prim Yüzdesi (%)"
            value={formData.premiumPercentage || ''}
            onChange={handleFieldChange('premiumPercentage')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('premiumPercentage', HANDLER_MAX_LENGTHS.premiumPercentage)}
            step="0.01"
            placeholder="2.5"
          />
        </div>
      </FormSection>

      {/* Şirket Bilgileri */}
      <FormSection title="Şirket Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="companyName"
            label="Şirket Adı"
            value={formData.companyName}
            onChange={handleFieldChange('companyName')}
            onBlur={handleFieldBlur('companyName')}
            onPaste={handlePaste('companyName', HANDLER_MAX_LENGTHS.companyName)}
            maxLength={HANDLER_MAX_LENGTHS.companyName}
            error={fieldErrors.companyName}
            placeholder="Sigorta şirketi adı"
            required
          />

          <FormInput
            name="agencyName"
            label="Acente Adı"
            value={formData.agencyName || ''}
            onChange={handleFieldChange('agencyName')}
            onPaste={handlePaste('agencyName', HANDLER_MAX_LENGTHS.agencyName)}
            maxLength={HANDLER_MAX_LENGTHS.agencyName}
            placeholder="Acente adı"
          />

          <FormInput
            name="licenseNumber"
            label="Lisans Numarası"
            value={formData.licenseNumber || ''}
            onChange={handleFieldChange('licenseNumber')}
            onPaste={handlePaste('licenseNumber', HANDLER_MAX_LENGTHS.licenseNumber)}
            maxLength={HANDLER_MAX_LENGTHS.licenseNumber}
            placeholder="Lisans numarası"
          />

          <FormSelect
            name="insuranceType"
            label="Sigorta Türü"
            value={formData.insuranceType}
            onChange={handleChange}
            options={INSURANCE_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            required
          />
        </div>
      </FormSection>

      {/* Tekne Limitleri */}
      <FormSection title="Tekne Limitleri">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormNumericInput
            name="minBoatLength"
            label="Min Tekne Boyu (m)"
            value={formData.minBoatLength || ''}
            onChange={handleFieldChange('minBoatLength')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('minBoatLength', 6)}
            step="0.1"
            placeholder="5"
          />

          <FormNumericInput
            name="maxBoatLength"
            label="Max Tekne Boyu (m)"
            value={formData.maxBoatLength || ''}
            onChange={handleFieldChange('maxBoatLength')}
            onKeyDown={handleNumericKeyDown}
            onPaste={handlePaste('maxBoatLength', 6)}
            step="0.1"
            placeholder="50"
          />

          <FormNumericInput
            name="boatAgeLimit"
            label="Tekne Yaş Sınırı (yıl)"
            value={formData.boatAgeLimit || ''}
            onChange={handleFieldChange('boatAgeLimit')}
            onKeyDown={handleNumericKeyDown}
            placeholder="25"
          />

          <FormNumericInput
            name="minBoatValue"
            label="Min Tekne Değeri"
            value={formData.minBoatValue || ''}
            onChange={handleFieldChange('minBoatValue')}
            onKeyDown={handleNumericKeyDown}
            step="0.01"
            placeholder="50000"
          />

          <FormNumericInput
            name="maxBoatValue"
            label="Max Tekne Değeri"
            value={formData.maxBoatValue || ''}
            onChange={handleFieldChange('maxBoatValue')}
            onKeyDown={handleNumericKeyDown}
            step="0.01"
            placeholder="5000000"
          />

          <FormInput
            name="coverageArea"
            label="Kapsam Alanı"
            value={formData.coverageArea || ''}
            onChange={handleFieldChange('coverageArea')}
            onPaste={handlePaste('coverageArea', HANDLER_MAX_LENGTHS.coverageArea)}
            maxLength={HANDLER_MAX_LENGTHS.coverageArea}
            placeholder="Örn: Türkiye kara suları, Akdeniz"
          />
        </div>
      </FormSection>

      {/* Teminat Türleri */}
      <FormSection title="Teminat Türleri">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormSelect
            name="hullCoverage"
            label="Gemi Gövdesi Teminatı"
            value={formData.hullCoverage.toString()}
            onChange={handleBooleanChange('hullCoverage')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            name="liabilityCoverage"
            label="Sorumluluk Teminatı"
            value={formData.liabilityCoverage.toString()}
            onChange={handleBooleanChange('liabilityCoverage')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            name="salvageCoverage"
            label="Kurtarma Teminatı"
            value={formData.salvageCoverage.toString()}
            onChange={handleBooleanChange('salvageCoverage')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            name="personalAccident"
            label="Kişisel Kaza Teminatı"
            value={formData.personalAccident.toString()}
            onChange={handleBooleanChange('personalAccident')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            name="legalProtection"
            label="Yasal Koruma"
            value={formData.legalProtection.toString()}
            onChange={handleBooleanChange('legalProtection')}
            options={BOOLEAN_OPTIONS}
          />

          <FormInput
            name="coverageTypes"
            label="Diğer Kapsam Türleri"
            value={formData.coverageTypes || ''}
            onChange={handleFieldChange('coverageTypes')}
            onPaste={handlePaste('coverageTypes', HANDLER_MAX_LENGTHS.coverageTypes)}
            maxLength={HANDLER_MAX_LENGTHS.coverageTypes}
            placeholder="Örn: Çalınma, yangın, doğal afet"
          />
        </div>
      </FormSection>

      {/* İletişim Bilgileri */}
      <FormSection title="İletişim Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="contactPerson"
            label="İletişim Kişisi"
            value={formData.contactPerson || ''}
            onChange={handleFieldChange('contactPerson')}
            onPaste={handlePaste('contactPerson', HANDLER_MAX_LENGTHS.contactPerson)}
            maxLength={HANDLER_MAX_LENGTHS.contactPerson}
            placeholder="Ad Soyad"
          />

          <FormInput
            name="contactPhone"
            label="İletişim Telefonu"
            value={formData.contactPhone || ''}
            onChange={handleFieldChange('contactPhone')}
            onPaste={handlePaste('contactPhone', HANDLER_MAX_LENGTHS.contactPhone)}
            maxLength={HANDLER_MAX_LENGTHS.contactPhone}
            placeholder="05XX XXX XX XX"
          />

          <FormInput
            name="contactEmail"
            label="İletişim E-posta"
            value={formData.contactEmail || ''}
            onChange={handleFieldChange('contactEmail')}
            onBlur={handleFieldBlur('contactEmail')}
            onPaste={handlePaste('contactEmail', HANDLER_MAX_LENGTHS.contactEmail)}
            maxLength={HANDLER_MAX_LENGTHS.contactEmail}
            error={fieldErrors.contactEmail}
            placeholder="email@example.com"
          />

          <FormInput
            name="website"
            label="Web Sitesi"
            value={formData.website || ''}
            onChange={handleFieldChange('website')}
            onPaste={handlePaste('website', HANDLER_MAX_LENGTHS.website)}
            maxLength={HANDLER_MAX_LENGTHS.website}
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
