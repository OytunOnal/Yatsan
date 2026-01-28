/**
 * Marketplace Listing Validation Schema
 * 
 * Zod validation schema for marketplace listing forms.
 */

import { z } from 'zod';
import {
  titleSchema,
  optionalDescriptionSchema,
  optionalLocationSchema,
  priceSchema,
  currencySchema,
} from './common.schema';

/**
 * Item type options
 */
export const ITEM_TYPE_OPTIONS = [
  { value: 'clothing', label: 'Giyim' },
  { value: 'safety_gear', label: 'Güvenlik Ekipmanı' },
  { value: 'fishing_equipment', label: 'Balıkçılık Ekipmanı' },
  { value: 'water_sports', label: 'Su Sporları' },
  { value: 'electronics', label: 'Elektronik' },
  { value: 'tools', label: 'Aletler' },
  { value: 'furniture', label: 'Mobilya' },
  { value: 'appliances', label: 'Cihazlar' },
  { value: 'parts', label: 'Parçalar' },
  { value: 'accessories', label: 'Aksesuarlar' },
  { value: 'books', label: 'Kitaplar' },
  { value: 'other', label: 'Diğer' },
] as const;

/**
 * Condition options
 */
export const CONDITION_OPTIONS = [
  { value: 'new', label: 'Yeni' },
  { value: 'excellent', label: 'Mükemmel' },
  { value: 'good', label: 'İyi' },
  { value: 'fair', label: 'Orta' },
  { value: 'poor', label: 'Zayıf' },
] as const;

/**
 * Usage frequency options
 */
export const USAGE_FREQUENCY_OPTIONS = [
  { value: 'never', label: 'Hiç Kullanılmadı' },
  { value: 'rarely', label: 'Nadiren' },
  { value: 'occasionally', label: 'Ara Sıra' },
  { value: 'regularly', label: 'Düzenli' },
  { value: 'frequently', label: 'Sık Sık' },
] as const;

/**
 * Marketplace listing validation schema
 */
export const getMarketplaceListingSchema = (currentYear: number) => z.object({
  // Temel Bilgiler
  title: titleSchema(3, 200), // Min 3 chars for marketplace
  description: optionalDescriptionSchema(5000),
  location: optionalLocationSchema(200),

  // Fiyat Bilgileri
  price: priceSchema,
  currency: currencySchema,

  // Ürün Bilgileri
  itemType: z.string().min(1, 'Ürün türü seçilmelidir'),
  brand: z.string().max(100, 'Marka en fazla 100 karakter olabilir').optional(),
  model: z.string().max(100, 'Model en fazla 100 karakter olabilir').optional(),
  condition: z.enum(['new', 'excellent', 'good', 'fair', 'poor'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçiniz' })
  }),

  // Tarih ve Kullanım
  yearPurchased: z.string().transform((val, ctx) => {
    if (!val || val.trim() === '') return val;
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Satın alma yılı sayısal bir değer olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed < 1970) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Satın alma yılı 1970 veya daha büyük olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed > currentYear + 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Satın alma yılı ${currentYear + 1} veya daha küçük olmalıdır`,
      });
      return z.NEVER;
    }
    return val;
  }).optional(),

  usageFrequency: z.string().optional(),

  // Fiyat Detayları
  originalPrice: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, 'Orijinal fiyat geçerli bir sayı olmalıdır')
    .optional(),

  reasonForSelling: z.string()
    .max(500, 'Satış nedeni en fazla 500 karakter olabilir')
    .optional(),

  // Fiziksel Özellikler
  dimensions: z.string()
    .max(50, 'Boyutlar en fazla 50 karakter olabilir')
    .optional(),
  
  weight: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, 'Ağırlık geçerli bir sayı olmalıdır')
    .optional(),
  
  color: z.string()
    .max(50, 'Renk en fazla 50 karakter olabilir')
    .optional(),
  
  material: z.string()
    .max(100, 'Malzeme en fazla 100 karakter olabilir')
    .optional(),

  // Dahil Olanlar
  includesOriginalBox: z.boolean(),
  includesManual: z.boolean(),
  includesAccessories: z.boolean(),
  accessoriesDescription: z.string()
    .max(500, 'Aksesuar açıklaması en fazla 500 karakter olabilir')
    .optional(),

  // Takas Seçenekleri
  negotiable: z.boolean(),
  acceptTrade: z.boolean(),
  tradeInterests: z.string()
    .max(500, 'Takas ilgileri en fazla 500 karakter olabilir')
    .optional(),
});

export type MarketplaceListingFormData = z.infer<ReturnType<typeof getMarketplaceListingSchema>>;
