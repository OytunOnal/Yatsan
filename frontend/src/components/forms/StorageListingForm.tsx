'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStorageListing } from '@/lib/api';
import { storageListingSchema, type StorageListingFormData } from '@/lib/validation/schemas';
import { useFormState, useFormValidation, useFormHandlers, useImageUpload } from '@/hooks/forms';
import {
  FormSection,
  FormInput,
  FormTextArea,
  FormSelect,
  FormNumericInput,
  FormErrorDisplay,
  FormActions,
  FormImageUpload,
} from './shared';

// Depolama türü seçenekleri
const STORAGE_TYPE_OPTIONS = [
  { value: 'dry_storage', label: 'Kuru Depolama' },
  { value: 'wet_slip', label: 'Su Üstü Park' },
  { value: 'covered', label: 'Kapalı' },
  { value: 'uncovered', label: 'Açık' },
  { value: 'indoor', label: 'İç Mekan' },
  { value: 'outdoor', label: 'Dış Mekan' },
];

// Evet/Hayır seçenekleri
const BOOLEAN_OPTIONS = [
  { value: 'false', label: 'Hayır' },
  { value: 'true', label: 'Evet' },
];

interface StorageListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function StorageListingForm({ onSuccess }: StorageListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Form state management
  const { formData, setFormData, fieldErrors, setFieldErrors } = useFormState<StorageListingFormData>({
    initialData: {
      title: '',
      description: '',
      price: '',
      location: '',
      storageType: 'dry_storage',
      facilityName: '',
      maxBoatLength: '',
      maxBoatBeam: '',
      maxBoatHeight: '',
      maxBoatWeight: '',
      securityFeatures: '',
      hasElectricity: false,
      hasWater: false,
      hasCamera: false,
      hasGuard: false,
      hasLift: false,
      liftCapacity: '',
      accessHours: '',
      gateAccess: false,
      winterizationService: false,
      maintenanceService: false,
      launchService: false,
      contactEmail: '',
      contactPhone: '',
    },
  });

  // Validation
  const { validate } = useFormValidation(storageListingSchema);

  // Form handlers
  const { handleFieldChange, handleFieldBlur, handlePaste } = useFormHandlers({
    setFormData,
    setFieldErrors,
    setError: setGeneralError,
  });

  // Image upload
  const { images, previews, handleImageChange, removeImage, error: imageError } = useImageUpload();

  // Boolean field handler
  const handleBooleanChange = (field: keyof StorageListingFormData) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value === 'true' }));
    setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setLoading(true);

    try {
      // Validate form data
      const validationResult = validate(formData);
      if (!validationResult.success) {
        setFieldErrors(validationResult.errors);
        setGeneralError('Lütfen formu eksiksiz ve doğru şekilde doldurun');
        setLoading(false);
        return;
      }

      // Submit to API
      const response = await createStorageListing({
        title: formData.title,
        description: formData.description || '',
        price: parseFloat(formData.price),
        currency: 'TRY',
        location: formData.location || '',
        storageType: formData.storageType,
        facilityName: formData.facilityName || undefined,
        maxBoatLength: formData.maxBoatLength ? parseFloat(formData.maxBoatLength) : undefined,
        maxBoatBeam: formData.maxBoatBeam ? parseFloat(formData.maxBoatBeam) : undefined,
        maxBoatHeight: formData.maxBoatHeight ? parseFloat(formData.maxBoatHeight) : undefined,
        maxBoatWeight: formData.maxBoatWeight ? parseFloat(formData.maxBoatWeight) : undefined,
        securityFeatures: formData.securityFeatures || undefined,
        hasElectricity: formData.hasElectricity,
        hasWater: formData.hasWater,
        hasCamera: formData.hasCamera,
        hasGuard: formData.hasGuard,
        hasLift: formData.hasLift,
        liftCapacity: formData.liftCapacity ? parseFloat(formData.liftCapacity) : undefined,
        accessHours: formData.accessHours || undefined,
        gateAccess: formData.gateAccess,
        winterizationService: formData.winterizationService,
        maintenanceService: formData.maintenanceService,
        launchService: formData.launchService,
        images,
      });

      const listingId = response.listing.id;

      if (onSuccess) {
        onSuccess(listingId);
      } else {
        router.push('/dashboard/listings?success=true');
      }
    } catch (err: any) {
      console.error('StorageListingForm hatası:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'İlan oluşturulurken bir hata oluştu';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormErrorDisplay error={generalError} fieldErrors={fieldErrors} />

      {/* Temel Bilgiler */}
      <FormSection title="Temel Bilgiler">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="title"
            name="title"
            label="Başlık"
            value={formData.title}
            onChange={handleFieldChange('title')}
            onBlur={handleFieldBlur('title')}
            onPaste={handlePaste('title', 200)}
            error={fieldErrors.title}
            maxLength={200}
            required
            placeholder="Örn: Kapalı Tekne Depolama Alanı"
          />

          <FormInput
            id="location"
            name="location"
            label="Konum"
            value={formData.location}
            onChange={handleFieldChange('location')}
            onPaste={handlePaste('location', 200)}
            error={fieldErrors.location}
            maxLength={200}
            placeholder="Örn: İstanbul, Türkiye"
          />

          <div className="md:col-span-2">
            <FormTextArea
              id="description"
              name="description"
              label="Açıklama"
              value={formData.description}
              onChange={handleFieldChange('description')}
              onPaste={handlePaste('description', 5000)}
              error={fieldErrors.description}
              maxLength={5000}
              rows={4}
              placeholder="Depolama alanınız hakkında detaylı bilgi verin..."
            />
          </div>
        </div>
      </FormSection>

      {/* Fiyat Bilgileri */}
      <FormSection title="Fiyat Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormNumericInput
            id="price"
            name="price"
            label="Fiyat (Aylık)"
            value={formData.price}
            onChange={handleFieldChange('price')}
            onBlur={handleFieldBlur('price')}
            onPaste={handlePaste('price', 10)}
            error={fieldErrors.price}
            maxLength={10}
            required
            placeholder="5000"
          />
        </div>
      </FormSection>

      {/* Depolama Bilgileri */}
      <FormSection title="Depolama Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            id="storageType"
            name="storageType"
            label="Depolama Türü"
            value={formData.storageType}
            onChange={handleFieldChange('storageType')}
            error={fieldErrors.storageType}
            options={STORAGE_TYPE_OPTIONS}
            required
          />

          <FormInput
            id="facilityName"
            name="facilityName"
            label="Tesis Adı"
            value={formData.facilityName}
            onChange={handleFieldChange('facilityName')}
            onPaste={handlePaste('facilityName', 200)}
            error={fieldErrors.facilityName}
            maxLength={200}
            placeholder="Tesis adı"
          />

          <FormInput
            id="accessHours"
            name="accessHours"
            label="Erişim Saatleri"
            value={formData.accessHours}
            onChange={handleFieldChange('accessHours')}
            onPaste={handlePaste('accessHours', 200)}
            error={fieldErrors.accessHours}
            maxLength={200}
            placeholder="Örn: 7/24 veya 08:00-20:00"
          />

          <FormInput
            id="securityFeatures"
            name="securityFeatures"
            label="Güvenlik Özellikleri"
            value={formData.securityFeatures}
            onChange={handleFieldChange('securityFeatures')}
            onPaste={handlePaste('securityFeatures', 500)}
            error={fieldErrors.securityFeatures}
            maxLength={500}
            placeholder="Örn: 24 saat kamera, alarm sistemi"
          />
        </div>
      </FormSection>

      {/* Tekne Boyut Limitleri */}
      <FormSection title="Tekne Boyut Limitleri">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormNumericInput
            id="maxBoatLength"
            name="maxBoatLength"
            label="Max Tekne Boyu (m)"
            value={formData.maxBoatLength}
            onChange={handleFieldChange('maxBoatLength')}
            onPaste={handlePaste('maxBoatLength', 6)}
            error={fieldErrors.maxBoatLength}
            maxLength={6}
            placeholder="20"
          />

          <FormNumericInput
            id="maxBoatBeam"
            name="maxBoatBeam"
            label="Max Tekne Genişliği (m)"
            value={formData.maxBoatBeam}
            onChange={handleFieldChange('maxBoatBeam')}
            onPaste={handlePaste('maxBoatBeam', 6)}
            error={fieldErrors.maxBoatBeam}
            maxLength={6}
            placeholder="6"
          />

          <FormNumericInput
            id="maxBoatHeight"
            name="maxBoatHeight"
            label="Max Tekne Yüksekliği (m)"
            value={formData.maxBoatHeight}
            onChange={handleFieldChange('maxBoatHeight')}
            onPaste={handlePaste('maxBoatHeight', 6)}
            error={fieldErrors.maxBoatHeight}
            maxLength={6}
            placeholder="5"
          />

          <FormNumericInput
            id="maxBoatWeight"
            name="maxBoatWeight"
            label="Max Tekne Ağırlığı (ton)"
            value={formData.maxBoatWeight}
            onChange={handleFieldChange('maxBoatWeight')}
            onPaste={handlePaste('maxBoatWeight', 6)}
            error={fieldErrors.maxBoatWeight}
            maxLength={6}
            placeholder="30"
          />
        </div>
      </FormSection>

      {/* Tesis Özellikleri */}
      <FormSection title="Tesis Özellikleri">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            id="hasElectricity"
            name="hasElectricity"
            label="Elektrik"
            value={formData.hasElectricity.toString()}
            onChange={handleBooleanChange('hasElectricity')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            id="hasWater"
            name="hasWater"
            label="Su"
            value={formData.hasWater.toString()}
            onChange={handleBooleanChange('hasWater')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            id="hasCamera"
            name="hasCamera"
            label="Kamera Sistemi"
            value={formData.hasCamera.toString()}
            onChange={handleBooleanChange('hasCamera')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            id="hasGuard"
            name="hasGuard"
            label="Güvenlik Görevlisi"
            value={formData.hasGuard.toString()}
            onChange={handleBooleanChange('hasGuard')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            id="gateAccess"
            name="gateAccess"
            label="Kapı Erişimi"
            value={formData.gateAccess.toString()}
            onChange={handleBooleanChange('gateAccess')}
            options={BOOLEAN_OPTIONS}
          />
        </div>
      </FormSection>

      {/* Vinç ve Hizmetler */}
      <FormSection title="Vinç ve Hizmetler">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormSelect
            id="hasLift"
            name="hasLift"
            label="Vinç Mevcut"
            value={formData.hasLift.toString()}
            onChange={handleBooleanChange('hasLift')}
            options={BOOLEAN_OPTIONS}
          />

          <FormNumericInput
            id="liftCapacity"
            name="liftCapacity"
            label="Vinç Kapasitesi (ton)"
            value={formData.liftCapacity}
            onChange={handleFieldChange('liftCapacity')}
            onPaste={handlePaste('liftCapacity', 6)}
            error={fieldErrors.liftCapacity}
            maxLength={6}
            placeholder="50"
          />

          <FormSelect
            id="winterizationService"
            name="winterizationService"
            label="Kışlık Hazırlık Hizmeti"
            value={formData.winterizationService.toString()}
            onChange={handleBooleanChange('winterizationService')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            id="maintenanceService"
            name="maintenanceService"
            label="Bakım Hizmeti"
            value={formData.maintenanceService.toString()}
            onChange={handleBooleanChange('maintenanceService')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            id="launchService"
            name="launchService"
            label="Denize İndirme Hizmeti"
            value={formData.launchService.toString()}
            onChange={handleBooleanChange('launchService')}
            options={BOOLEAN_OPTIONS}
          />
        </div>
      </FormSection>

      {/* İletişim Bilgileri */}
      <FormSection title="İletişim Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="contactEmail"
            name="contactEmail"
            type="email"
            label="E-posta"
            value={formData.contactEmail}
            onChange={handleFieldChange('contactEmail')}
            onPaste={handlePaste('contactEmail', 100)}
            error={fieldErrors.contactEmail}
            maxLength={100}
            placeholder="ornek@email.com"
          />

          <FormInput
            id="contactPhone"
            name="contactPhone"
            type="tel"
            label="Telefon"
            value={formData.contactPhone}
            onChange={handleFieldChange('contactPhone')}
            onPaste={handlePaste('contactPhone', 20)}
            error={fieldErrors.contactPhone}
            maxLength={20}
            placeholder="+90 555 123 4567"
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
          error={imageError || undefined}
        />
      </FormSection>

      {/* Submit Button */}
      <FormActions
        loading={loading}
        submitLabel="İlanı Oluştur"
        submitLoadingLabel="Kaydediliyor..."
        showCancel={!onSuccess}
        onCancel={onSuccess ? undefined : () => router.back()}
      />
    </form>
  );
}
