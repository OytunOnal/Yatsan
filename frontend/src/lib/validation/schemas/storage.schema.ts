import { z } from 'zod';
import {
  titleSchema,
  descriptionSchema,
  priceSchema,
  locationSchema,
  optionalEmailSchema,
  optionalPhoneSchema,
} from './common.schema';

/**
 * Storage listing validation schema
 * Validates storage facility listings with boat dimension limits and facility features
 */
export const storageListingSchema = z.object({
  // Basic Information
  title: titleSchema(),
  description: descriptionSchema(),
  price: priceSchema,
  location: locationSchema(),

  // Storage Type
  storageType: z.enum([
    'dry_storage',
    'wet_slip',
    'covered',
    'uncovered',
    'indoor',
    'outdoor',
  ], {
    errorMap: () => ({ message: 'Depolama türü seçilmelidir' }),
  }),

  // Facility Information
  facilityName: z.string()
    .min(2, 'Tesis adı en az 2 karakter olmalıdır')
    .max(200, 'Tesis adı en fazla 200 karakter olabilir')
    .optional(),

  // Boat Dimension Limits
  maxBoatLength: z.string()
    .refine((val) => !val || !isNaN(parseFloat(val)), 'Geçerli bir sayı giriniz')
    .refine((val) => !val || parseFloat(val) >= 1, 'Maksimum tekne uzunluğu en az 1 metre olmalıdır')
    .refine((val) => !val || parseFloat(val) <= 100, 'Maksimum tekne uzunluğu en fazla 100 metre olabilir')
    .optional(),

  maxBoatBeam: z.string()
    .refine((val) => !val || !isNaN(parseFloat(val)), 'Geçerli bir sayı giriniz')
    .refine((val) => !val || parseFloat(val) >= 0.5, 'Maksimum tekne genişliği en az 0.5 metre olmalıdır')
    .refine((val) => !val || parseFloat(val) <= 30, 'Maksimum tekne genişliği en fazla 30 metre olabilir')
    .optional(),

  maxBoatHeight: z.string()
    .refine((val) => !val || !isNaN(parseFloat(val)), 'Geçerli bir sayı giriniz')
    .refine((val) => !val || parseFloat(val) >= 1, 'Maksimum tekne yüksekliği en az 1 metre olmalıdır')
    .refine((val) => !val || parseFloat(val) <= 50, 'Maksimum tekne yüksekliği en fazla 50 metre olabilir')
    .optional(),

  maxBoatWeight: z.string()
    .refine((val) => !val || !isNaN(parseFloat(val)), 'Geçerli bir sayı giriniz')
    .refine((val) => !val || parseFloat(val) >= 100, 'Maksimum tekne ağırlığı en az 100 kg olmalıdır')
    .refine((val) => !val || parseFloat(val) <= 1000000, 'Maksimum tekne ağırlığı en fazla 1.000.000 kg olabilir')
    .optional(),

  // Facility Features (boolean fields)
  hasElectricity: z.boolean().optional(),
  hasWater: z.boolean().optional(),
  hasCamera: z.boolean().optional(),
  hasGuard: z.boolean().optional(),
  hasLift: z.boolean().optional(),
  gateAccess: z.boolean().optional(),

  // Additional Features
  winterizationService: z.boolean().optional(),
  maintenanceService: z.boolean().optional(),
  launchService: z.boolean().optional(),

  // Additional Details
  securityFeatures: z.string()
    .max(500, 'Güvenlik özellikleri en fazla 500 karakter olabilir')
    .optional(),

  liftCapacity: z.string()
    .refine((val) => !val || !isNaN(parseFloat(val)), 'Geçerli bir sayı giriniz')
    .refine((val) => !val || parseFloat(val) >= 100, 'Lift kapasitesi en az 100 kg olmalıdır')
    .refine((val) => !val || parseFloat(val) <= 100000, 'Lift kapasitesi en fazla 100.000 kg olabilir')
    .optional(),

  accessHours: z.string()
    .max(200, 'Erişim saatleri en fazla 200 karakter olabilir')
    .optional(),

  // Contact Information
  contactEmail: optionalEmailSchema,
  contactPhone: optionalPhoneSchema,

  // Images
  images: z.array(z.any()).optional(),
});

export type StorageListingFormData = z.infer<typeof storageListingSchema>;
