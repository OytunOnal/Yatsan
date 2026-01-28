/**
 * Common Validation Schemas
 * 
 * Reusable Zod schemas and helpers for form validation.
 * These can be composed into form-specific schemas.
 */

import { z } from 'zod';

// =======================
// Common Field Schemas
// =======================

/**
 * Title field validation - used in most listing forms
 */
export const titleSchema = (minLength = 5, maxLength = 200) =>
  z.string()
    .min(1, 'Başlık gereklidir')
    .min(minLength, `Başlık en az ${minLength} karakter olmalıdır`)
    .max(maxLength, `Başlık en fazla ${maxLength} karakter olabilir`);

/**
 * Description field validation
 */
export const descriptionSchema = (minLength = 20, maxLength = 5000) =>
  z.string()
    .min(1, 'Açıklama gereklidir')
    .min(minLength, `Açıklama en az ${minLength} karakter olmalıdır`)
    .max(maxLength, `Açıklama en fazla ${maxLength} karakter olabilir`);

/**
 * Optional description (no minimum required)
 */
export const optionalDescriptionSchema = (maxLength = 5000) =>
  z.string().max(maxLength, `Açıklama en fazla ${maxLength} karakter olabilir`).optional();

/**
 * Location field validation
 */
export const locationSchema = (minLength = 2, maxLength = 200) =>
  z.string()
    .min(1, 'Konum gereklidir')
    .min(minLength, `Konum en az ${minLength} karakter olmalıdır`)
    .max(maxLength, `Konum en fazla ${maxLength} karakter olabilir`);

/**
 * Optional location
 */
export const optionalLocationSchema = (maxLength = 200) =>
  z.string().max(maxLength, `Konum en fazla ${maxLength} karakter olabilir`).optional();

/**
 * Price field validation
 */
export const priceSchema = z.string()
  .min(1, 'Fiyat gereklidir')
  .refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Geçerli bir fiyat giriniz')
  .refine((val) => {
    const num = parseFloat(val);
    return num <= 9999999999;
  }, 'Fiyat 9.999.999.999\'dan küçük olmalıdır');

/**
 * Currency field validation
 */
export const currencySchema = z.enum(['TRY', 'USD', 'EUR'], {
  errorMap: () => ({ message: 'Geçerli bir para birimi seçiniz' })
});

/**
 * Year field validation with dynamic range
 */
export const yearSchema = (currentYear: number, minYear = 1970) =>
  z.string().transform((val, ctx) => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Yıl sayısal bir değer olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed < minYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Yıl ${minYear} veya daha büyük olmalıdır`,
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
  });

// =======================
// Numeric Field Schemas
// =======================

/**
 * Positive decimal number (required)
 */
export const positiveDecimalSchema = (fieldName: string, maxValue?: number) =>
  z.string()
    .min(1, `${fieldName} gereklidir`)
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, `Geçerli bir ${fieldName.toLowerCase()} değeri giriniz`)
    .refine((val) => {
      if (!maxValue) return true;
      const num = parseFloat(val);
      return num <= maxValue;
    }, maxValue ? `${fieldName} ${maxValue}'den küçük olmalıdır` : '');

/**
 * Optional positive decimal number
 */
export const optionalPositiveDecimalSchema = (fieldName: string, maxValue?: number) =>
  z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, `Geçerli bir ${fieldName.toLowerCase()} değeri giriniz`)
    .refine((val) => {
      if (!val || !maxValue) return true;
      const num = parseFloat(val);
      return num <= maxValue;
    }, maxValue ? `${fieldName} ${maxValue}'den küçük olmalıdır` : '')
    .optional();

/**
 * Optional positive integer within range
 */
export const optionalIntRangeSchema = (fieldName: string, min: number, max: number) =>
  z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= min && num <= max;
    }, `${fieldName} ${min}-${max} arasında olmalıdır`)
    .optional();

/**
 * Required positive integer within range
 */
export const intRangeSchema = (fieldName: string, min: number, max: number) =>
  z.string()
    .min(1, `${fieldName} gereklidir`)
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= min && num <= max;
    }, `${fieldName} ${min}-${max} arasında olmalıdır`);

// =======================
// Contact Field Schemas
// =======================

/**
 * Email field validation (optional, but must be valid if provided)
 */
export const optionalEmailSchema = z.string()
  .email('Geçerli bir e-posta adresi girin')
  .optional()
  .or(z.literal(''));

/**
 * Required email field
 */
export const requiredEmailSchema = z.string()
  .min(1, 'E-posta gereklidir')
  .email('Geçerli bir e-posta adresi girin');

/**
 * Phone field validation (optional)
 */
export const optionalPhoneSchema = z.string()
  .max(20, 'Telefon numarası en fazla 20 karakter olabilir')
  .optional();

/**
 * Website URL validation (optional)
 */
export const optionalWebsiteSchema = z.string()
  .url('Geçerli bir URL girin')
  .optional()
  .or(z.literal(''));

// =======================
// Condition Schemas
// =======================

/**
 * Standard condition enum
 */
export const conditionSchema = z.enum(['new', 'excellent', 'good', 'fair'], {
  errorMap: () => ({ message: 'Geçerli bir durum seçiniz' })
});

/**
 * Fuel type enum
 */
export const fuelTypeSchema = z.enum(['diesel', 'petrol', 'electric', 'hybrid'], {
  errorMap: () => ({ message: 'Geçerli bir yakıt tipi seçiniz' })
}).optional();

// =======================
// Max Length Constants
// =======================

/**
 * Common max length values for form fields
 */
export const COMMON_MAX_LENGTHS = {
  title: 200,
  description: 5000,
  location: 200,
  price: 10,
  year: 4,
  companyName: 200,
  agencyName: 200,
  licenseNumber: 50,
  contactPerson: 100,
  contactPhone: 20,
  contactEmail: 100,
  website: 200,
  equipment: 2000,
  notes: 2000,
  // Yacht specific
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
  // Insurance specific
  coverageTypes: 500,
  minBoatLength: 6,
  maxBoatLength: 6,
  minBoatValue: 15,
  maxBoatValue: 15,
  boatAgeLimit: 3,
  coverageArea: 200,
  premiumCalculation: 200,
  minPremium: 10,
  premiumPercentage: 5,
} as const;

// =======================
// Field Label Maps
// =======================

/**
 * Turkish field labels for error messages
 */
export const FIELD_LABELS: Record<string, string> = {
  title: 'Başlık',
  description: 'Açıklama',
  price: 'Fiyat',
  location: 'Konum',
  year: 'Yıl',
  length: 'Uzunluk',
  beam: 'Genişlik',
  draft: 'Sükunet Derinliği',
  companyName: 'Şirket Adı',
  contactEmail: 'E-posta',
  condition: 'Durum',
};

// =======================
// Helper Functions
// =======================

/**
 * Convert Zod validation errors to field error map
 */
export function zodErrorsToFieldMap(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((e) => {
    if (e.path.length > 0) {
      errors[e.path[0] as string] = e.message;
    }
  });
  return errors;
}

/**
 * Get localized error message with field label
 */
export function getErrorWithLabel(field: string, message: string): string {
  const label = FIELD_LABELS[field];
  return label ? `${label}: ${message}` : message;
}
