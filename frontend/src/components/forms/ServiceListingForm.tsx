'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createServiceListing } from '@/lib/api';
import { serviceListingSchema, type ServiceListingFormData } from '@/lib/validation/schemas';
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

// Servis türü seçenekleri
const SERVICE_TYPE_OPTIONS = [
  { value: 'engine_repair', label: 'Motor Onarımı' },
  { value: 'electrical', label: 'Elektrik' },
  { value: 'plumbing', label: 'Tesisat' },
  { value: 'fiberglass', label: 'Fiberglass' },
  { value: 'painting', label: 'Boya' },
  { value: 'upholstery', label: 'Döşeme' },
  { value: 'mechanical', label: 'Mekanik' },
  { value: 'installation', label: 'Montaj' },
  { value: 'maintenance', label: 'Bakım' },
  { value: 'winterization', label: 'Kışlık Hazırlık' },
  { value: 'detailing', label: 'Detaylı Temizlik' },
  { value: 'other', label: 'Diğer' },
];

// Fiyatlandırma türü seçenekleri
const PRICE_TYPE_OPTIONS = [
  { value: '', label: 'Seçiniz' },
  { value: 'hourly', label: 'Saatlik' },
  { value: 'fixed', label: 'Sabit Fiyat' },
  { value: 'quote', label: 'Teklif Bazlı' },
  { value: 'negotiable', label: 'Pazarlık' },
];

// Evet/Hayır seçenekleri
const BOOLEAN_OPTIONS = [
  { value: 'false', label: 'Hayır' },
  { value: 'true', label: 'Evet' },
];

interface ServiceListingFormProps {
  onSuccess?: (listingId: string) => void;
}

export default function ServiceListingForm({ onSuccess }: ServiceListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Form state management
  const { formData, setFormData, fieldErrors, setFieldErrors } = useFormState<ServiceListingFormData>({
    initialData: {
      title: '',
      description: '',
      price: '',
      location: '',
      serviceType: 'maintenance',
      businessName: '',
      yearsInBusiness: '',
      certifications: '',
      authorizedBrands: '',
      serviceArea: '',
      mobileService: false,
      emergencyService: false,
      emergencyPhone: '',
      priceType: 'quote',
      hourlyRate: '',
      minServiceFee: '',
      workingHours: '',
      website: '',
      whatsapp: '',
    },
  });

  // Validation
  const { validate } = useFormValidation(serviceListingSchema);

  // Form handlers
  const { handleFieldChange, handleFieldBlur, handlePaste } = useFormHandlers({
    setFormData,
    setFieldErrors,
    setError: setGeneralError,
  });

  // Image upload
  const { images, previews, handleImageChange, removeImage, error: imageError } = useImageUpload();

  // Boolean field handler
  const handleBooleanChange = (field: keyof ServiceListingFormData) => (
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
      const response = await createServiceListing({
        title: formData.title,
        description: formData.description || '',
        price: parseFloat(formData.price),
        currency: 'TRY',
        location: formData.location || '',
        serviceType: formData.serviceType,
        businessName: formData.businessName || undefined,
        yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : undefined,
        certifications: formData.certifications || undefined,
        authorizedBrands: formData.authorizedBrands || undefined,
        serviceArea: formData.serviceArea || undefined,
        mobileService: formData.mobileService,
        emergencyService: formData.emergencyService,
        emergencyPhone: formData.emergencyPhone || undefined,
        priceType: formData.priceType || undefined,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
        minServiceFee: formData.minServiceFee ? parseFloat(formData.minServiceFee) : undefined,
        workingHours: formData.workingHours || undefined,
        website: formData.website || undefined,
        whatsapp: formData.whatsapp || undefined,
        images,
      });

      const listingId = response.listing.id;

      if (onSuccess) {
        onSuccess(listingId);
      } else {
        router.push('/dashboard/listings?success=true');
      }
    } catch (err: any) {
      console.error('ServiceListingForm hatası:', err);
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
            placeholder="Örn: Motor Bakım ve Onarım Hizmeti"
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
              placeholder="Hizmetiniz hakkında detaylı bilgi verin..."
            />
          </div>
        </div>
      </FormSection>

      {/* Fiyat Bilgileri */}
      <FormSection title="Fiyat Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormNumericInput
            id="price"
            name="price"
            label="Başlangıç Fiyatı"
            value={formData.price}
            onChange={handleFieldChange('price')}
            onBlur={handleFieldBlur('price')}
            onPaste={handlePaste('price', 10)}
            error={fieldErrors.price}
            maxLength={10}
            required
            placeholder="500"
          />

          <FormSelect
            id="priceType"
            name="priceType"
            label="Fiyatlandırma Türü"
            value={formData.priceType}
            onChange={handleFieldChange('priceType')}
            error={fieldErrors.priceType}
            options={PRICE_TYPE_OPTIONS}
          />

          <FormNumericInput
            id="hourlyRate"
            name="hourlyRate"
            label="Saatlik Ücret"
            value={formData.hourlyRate}
            onChange={handleFieldChange('hourlyRate')}
            onPaste={handlePaste('hourlyRate', 10)}
            error={fieldErrors.hourlyRate}
            maxLength={10}
            placeholder="250"
          />

          <FormNumericInput
            id="minServiceFee"
            name="minServiceFee"
            label="Min. Servis Ücreti"
            value={formData.minServiceFee}
            onChange={handleFieldChange('minServiceFee')}
            onPaste={handlePaste('minServiceFee', 10)}
            error={fieldErrors.minServiceFee}
            maxLength={10}
            placeholder="500"
          />
        </div>
      </FormSection>

      {/* Servis Bilgileri */}
      <FormSection title="Servis Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            id="serviceType"
            name="serviceType"
            label="Servis Türü"
            value={formData.serviceType}
            onChange={handleFieldChange('serviceType')}
            error={fieldErrors.serviceType}
            options={SERVICE_TYPE_OPTIONS}
            required
          />

          <FormInput
            id="businessName"
            name="businessName"
            label="İşletme Adı"
            value={formData.businessName}
            onChange={handleFieldChange('businessName')}
            onPaste={handlePaste('businessName', 100)}
            error={fieldErrors.businessName}
            maxLength={100}
            placeholder="Şirket adı"
          />

          <FormNumericInput
            id="yearsInBusiness"
            name="yearsInBusiness"
            label="Sektördeki Yıl Sayısı"
            value={formData.yearsInBusiness}
            onChange={handleFieldChange('yearsInBusiness')}
            onBlur={handleFieldBlur('yearsInBusiness')}
            onPaste={handlePaste('yearsInBusiness', 3)}
            error={fieldErrors.yearsInBusiness}
            maxLength={3}
            placeholder="10"
          />

          <FormInput
            id="serviceArea"
            name="serviceArea"
            label="Hizmet Bölgesi"
            value={formData.serviceArea}
            onChange={handleFieldChange('serviceArea')}
            onPaste={handlePaste('serviceArea', 200)}
            error={fieldErrors.serviceArea}
            maxLength={200}
            placeholder="Örn: İstanbul, Marmara Bölgesi"
          />

          <FormInput
            id="certifications"
            name="certifications"
            label="Sertifikalar"
            value={formData.certifications}
            onChange={handleFieldChange('certifications')}
            onPaste={handlePaste('certifications', 500)}
            error={fieldErrors.certifications}
            maxLength={500}
            placeholder="Örn: Volvo Penta Yetkili Servis, Mercury Sertifikalı"
          />

          <FormInput
            id="authorizedBrands"
            name="authorizedBrands"
            label="Yetkili Markalar"
            value={formData.authorizedBrands}
            onChange={handleFieldChange('authorizedBrands')}
            onPaste={handlePaste('authorizedBrands', 500)}
            error={fieldErrors.authorizedBrands}
            maxLength={500}
            placeholder="Örn: Volvo Penta, Mercury, Yamaha"
          />

          <FormInput
            id="workingHours"
            name="workingHours"
            label="Çalışma Saatleri"
            value={formData.workingHours}
            onChange={handleFieldChange('workingHours')}
            onPaste={handlePaste('workingHours', 100)}
            error={fieldErrors.workingHours}
            maxLength={100}
            placeholder="Pzt-Cuma 09:00-18:00"
          />

          <FormSelect
            id="mobileService"
            name="mobileService"
            label="Mobil Hizmet"
            value={formData.mobileService?.toString()}
            onChange={handleBooleanChange('mobileService')}
            options={BOOLEAN_OPTIONS}
          />

          <FormSelect
            id="emergencyService"
            name="emergencyService"
            label="Acil Servis"
            value={formData.emergencyService?.toString()}
            onChange={handleBooleanChange('emergencyService')}
            options={BOOLEAN_OPTIONS}
          />

          <FormInput
            id="emergencyPhone"
            name="emergencyPhone"
            label="Acil Telefon"
            value={formData.emergencyPhone}
            onChange={handleFieldChange('emergencyPhone')}
            onPaste={handlePaste('emergencyPhone', 20)}
            error={fieldErrors.emergencyPhone}
            maxLength={20}
            placeholder="05XX XXX XX XX"
          />
        </div>
      </FormSection>

      {/* İletişim Bilgileri */}
      <FormSection title="İletişim Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="website"
            name="website"
            type="url"
            label="Web Sitesi"
            value={formData.website}
            onChange={handleFieldChange('website')}
            onPaste={handlePaste('website', 200)}
            error={fieldErrors.website}
            maxLength={200}
            placeholder="https://www.example.com"
          />

          <FormInput
            id="whatsapp"
            name="whatsapp"
            label="WhatsApp"
            value={formData.whatsapp}
            onChange={handleFieldChange('whatsapp')}
            onPaste={handlePaste('whatsapp', 20)}
            error={fieldErrors.whatsapp}
            maxLength={20}
            placeholder="05XX XXX XX XX"
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
