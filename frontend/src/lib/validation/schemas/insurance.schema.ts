/**
 * Insurance Listing Validation Schema
 * 
 * Zod validation schema for insurance listing forms.
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
  optionalIntRangeSchema,
} from './common.schema';

/**
 * Insurance type options
 */
export const INSURANCE_TYPE_OPTIONS = [
  { value: 'hull', label: 'Gemi Gövdesi Sigortası' },
  { value: 'liability', label: 'Sorumluluk Sigortası' },
  { value: 'comprehensive', label: 'Kapsamlı Sigorta' },
  { value: 'personal_accident', label: 'Kişisel Kaza Sigortası' },
  { value: 'cargo', label: 'Yük Sigortası' },
] as const;

/**
 * Insurance listing validation schema
 */
export const getInsuranceListingSchema = () => z.object({
  // Temel Bilgiler
  title: titleSchema(3, 200), // Min 3 chars for insurance
  description: optionalDescriptionSchema(5000),
  location: optionalLocationSchema(200),

  // Fiyat Bilgileri
  price: priceSchema,
  currency: currencySchema,

  // Şirket Bilgileri
  companyName: z.string()
    .min(1, 'Şirket adı gereklidir')
    .max(200, 'Şirket adı en fazla 200 karakter olabilir'),
  
  agencyName: z.string()
    .max(200, 'Acente adı en fazla 200 karakter olabilir')
    .optional(),
  
  licenseNumber: z.string()
    .max(50, 'Lisans numarası en fazla 50 karakter olabilir')
    .optional(),
  
  insuranceType: z.enum(['hull', 'liability', 'comprehensive', 'personal_accident', 'cargo'], {
    errorMap: () => ({ message: 'Geçerli bir sigorta türü seçiniz' })
  }),

  // Tekne Limitleri
  minBoatLength: optionalPositiveDecimalSchema('Min Tekne Boyu', 9999.99),
  maxBoatLength: optionalPositiveDecimalSchema('Max Tekne Boyu', 9999.99),
  minBoatValue: optionalPositiveDecimalSchema('Min Tekne Değeri', 9999999999),
  maxBoatValue: optionalPositiveDecimalSchema('Max Tekne Değeri', 9999999999),
  boatAgeLimit: optionalIntRangeSchema('Tekne Yaş Sınırı', 0, 999),
  
  coverageArea: z.string()
    .max(200, 'Kapsam alanı en fazla 200 karakter olabilir')
    .optional(),
  
  premiumCalculation: z.string()
    .max(200, 'Prim hesaplama en fazla 200 karakter olabilir')
    .optional(),
  
  minPremium: optionalPositiveDecimalSchema('Min Prim', 9999999999),
  premiumPercentage: optionalPositiveDecimalSchema('Prim Yüzdesi', 100),

  // Teminat Türleri
  coverageTypes: z.string()
    .max(500, 'Kapsam türleri en fazla 500 karakter olabilir')
    .optional(),
  
  hullCoverage: z.boolean(),
  liabilityCoverage: z.boolean(),
  salvageCoverage: z.boolean(),
  personalAccident: z.boolean(),
  legalProtection: z.boolean(),

  // İletişim Bilgileri
  contactPerson: z.string()
    .max(100, 'İletişim kişisi en fazla 100 karakter olabilir')
    .optional(),
  
  contactPhone: optionalPhoneSchema,
  contactEmail: optionalEmailSchema,
  website: optionalWebsiteSchema,
});

export type InsuranceListingFormData = z.infer<ReturnType<typeof getInsuranceListingSchema>>;
