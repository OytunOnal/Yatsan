/**
 * Expertise Listing Validation Schema
 * 
 * Zod validation schema for expertise listing forms.
 */

import { z } from 'zod';
import {
  titleSchema,
  optionalDescriptionSchema,
  optionalLocationSchema,
  priceSchema,
  currencySchema,
  optionalEmailSchema,
  optionalPhoneSchema,
  optionalWebsiteSchema,
  optionalPositiveDecimalSchema,
} from './common.schema';

/**
 * Expertise type options
 */
export const EXPERTISE_TYPE_OPTIONS = [
  { value: 'pre_purchase', label: 'Satın Alma Öncesi' },
  { value: 'insurance', label: 'Sigorta Ekspertizi' },
  { value: 'damage', label: 'Hasar Tespiti' },
  { value: 'valuation', label: 'Değerleme' },
  { value: 'condition', label: 'Durum Raporu' },
  { value: 'comprehensive', label: 'Kapsamlı Ekspertiz' },
] as const;

/**
 * Expertise listing validation schema
 */
export const getExpertiseListingSchema = () => z.object({
  // Temel Bilgiler
  title: titleSchema(3, 200),
  description: optionalDescriptionSchema(5000),
  location: optionalLocationSchema(200),

  // Fiyat Bilgileri
  price: priceSchema,
  currency: currencySchema,

  // Eksper Bilgileri
  companyName: z.string().max(200, 'Şirket adı en fazla 200 karakter olabilir').optional(),
  expertName: z.string().max(100, 'Eksper adı en fazla 100 karakter olabilir').optional(),
  licenseNumber: z.string().max(50, 'Lisans numarası en fazla 50 karakter olabilir').optional(),
  yearsExperience: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, 'Deneyim 0-100 yıl arasında olmalıdır')
    .optional(),

  expertiseType: z.enum(['pre_purchase', 'insurance', 'damage', 'valuation', 'condition', 'comprehensive'], {
    errorMap: () => ({ message: 'Geçerli bir ekspertiz türü seçiniz' })
  }),

  // Hizmet Bilgileri
  boatTypes: z.string().max(300, 'Tekne türleri en fazla 300 karakter olabilir').optional(),
  minBoatLength: optionalPositiveDecimalSchema('Min Tekne Boyu', 9999.99),
  maxBoatLength: optionalPositiveDecimalSchema('Max Tekne Boyu', 9999.99),
  serviceArea: z.string().max(200, 'Hizmet bölgesi en fazla 200 karakter olabilir').optional(),
  mobileService: z.boolean(),
  reportTypes: z.string().max(300, 'Rapor türleri en fazla 300 karakter olabilir').optional(),
  reportLanguages: z.string().max(100, 'Rapor dilleri en fazla 100 karakter olabilir').optional(),
  turnaroundTime: z.string().max(50, 'Teslimat süresi en fazla 50 karakter olabilir').optional(),

  // Fiyatlandırma Detayları
  basePrice: optionalPositiveDecimalSchema('Baz Ücret', 9999999999),
  pricePerMeter: optionalPositiveDecimalSchema('Metre Başına Ücret', 9999999999),
  travelFee: optionalPositiveDecimalSchema('Ulaşım Ücreti', 9999999999),

  // Nitelikler
  certifications: z.string().max(500, 'Sertifikalar en fazla 500 karakter olabilir').optional(),
  memberships: z.string().max(500, 'Üyelikler en fazla 500 karakter olabilir').optional(),

  // İletişim Bilgileri
  phone: optionalPhoneSchema,
  email: optionalEmailSchema,
  website: optionalWebsiteSchema,
});

export type ExpertiseListingFormData = z.infer<ReturnType<typeof getExpertiseListingSchema>>;
