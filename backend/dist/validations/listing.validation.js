"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingQuerySchema = exports.updateListingSchema = exports.createListingSchema = exports.crewListingSchema = exports.marinaListingSchema = exports.partListingSchema = exports.yachtListingSchema = exports.baseListingSchema = void 0;
const zod_1 = require("zod");
// ============================================
// BASE LİSTİNG ŞEMASI
// ============================================
exports.baseListingSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Başlık en az 3 karakter olmalı').max(200, 'Başlık en fazla 200 karakter olabilir'),
    description: zod_1.z.string().max(5000, 'Açıklama en fazla 5000 karakter olabilir').optional(),
    price: zod_1.z.number().positive('Fiyat pozitif bir sayı olmalı'),
    currency: zod_1.z.enum(['TRY', 'USD', 'EUR'], {
        errorMap: () => ({ message: 'Para birimi TRY, USD veya EUR olmalı' })
    }).default('TRY'),
    location: zod_1.z.string().optional(),
});
// ============================================
// YACHT LİSTİNG ŞEMASI
// ============================================
exports.yachtListingSchema = exports.baseListingSchema.extend({
    listingType: zod_1.z.literal('yacht'),
    yachtType: zod_1.z.enum(['motor_yacht', 'sailing_yacht', 'catamaran', 'gulet'], {
        errorMap: () => ({ message: 'Geçersiz yat türü' })
    }),
    year: zod_1.z.number().int().min(1970).max(new Date().getFullYear() + 1, 'Geçersiz yıl'),
    length: zod_1.z.number().positive('Uzunluk pozitif olmalı'),
    beam: zod_1.z.number().positive('Genişlik pozitif olmalı'),
    draft: zod_1.z.number().positive('Sükunet pozitif olmalı'),
    engineBrand: zod_1.z.string().optional(),
    engineHours: zod_1.z.number().int().nonnegative().optional(),
    engineHP: zod_1.z.number().int().positive().optional(),
    fuelType: zod_1.z.enum(['diesel', 'petrol', 'electric', 'hybrid']).optional(),
    cruisingSpeed: zod_1.z.number().int().positive().optional(),
    maxSpeed: zod_1.z.number().int().positive().optional(),
    cabinCount: zod_1.z.number().int().nonnegative().optional(),
    bedCount: zod_1.z.number().int().nonnegative().optional(),
    bathroomCount: zod_1.z.number().int().nonnegative().optional(),
    equipment: zod_1.z.string().optional(), // JSON string
    condition: zod_1.z.enum(['new', 'excellent', 'good', 'fair'], {
        errorMap: () => ({ message: 'Geçersiz durum değeri' })
    }),
});
// ============================================
// PART LİSTİNG ŞEMASI
// ============================================
exports.partListingSchema = exports.baseListingSchema.extend({
    listingType: zod_1.z.literal('part'),
    condition: zod_1.z.enum(['new', 'used', 'refurbished'], {
        errorMap: () => ({ message: 'Geçersiz durum değeri' })
    }),
    brand: zod_1.z.string().min(1, 'Marka zorunludur'),
    oemCode: zod_1.z.string().optional(),
    compatibility: zod_1.z.string().optional(), // JSON string - uyumlu modeller
});
// ============================================
// MARINA LİSTİNG ŞEMASI
// ============================================
exports.marinaListingSchema = exports.baseListingSchema.extend({
    listingType: zod_1.z.literal('marina'),
    priceType: zod_1.z.enum(['daily', 'weekly', 'monthly', 'yearly'], {
        errorMap: () => ({ message: 'Geçersiz fiyat türü' })
    }),
    maxLength: zod_1.z.number().positive('Maksimum uzunluk pozitif olmalı'),
    maxBeam: zod_1.z.number().positive('Maksimum genişlik pozitif olmalı'),
    maxDraft: zod_1.z.number().positive().optional(),
    services: zod_1.z.string().min(1, 'Hizmetler bilgisi zorunludur'), // JSON string
    availability: zod_1.z.string().optional(), // JSON string - müsaitlik takvimi
});
// ============================================
// CREW LİSTİNG ŞEMASI
// ============================================
exports.crewListingSchema = exports.baseListingSchema.partial({ price: true }).extend({
    listingType: zod_1.z.literal('crew'),
    position: zod_1.z.enum(['captain', 'chef', 'deckhand', 'engineer', 'stewardess'], {
        errorMap: () => ({ message: 'Geçersiz pozisyon' })
    }),
    experience: zod_1.z.number().int().min(0).max(50, 'Deneyim 0-50 yıl arasında olmalı'),
    certifications: zod_1.z.string().optional(), // JSON string - sertifikalar listesi
    availability: zod_1.z.enum(['immediate', 'flexible', 'specific_dates'], {
        errorMap: () => ({ message: 'Geçersiz müsaitlik türü' })
    }),
    availableFrom: zod_1.z.string().datetime().optional(), // ISO date string
    availableTo: zod_1.z.string().datetime().optional(), // ISO date string
    salary: zod_1.z.number().positive().optional(),
    salaryCurrency: zod_1.z.string().default('USD'),
    salaryPeriod: zod_1.z.enum(['monthly', 'weekly', 'daily', 'per_trip']).optional(),
});
// ============================================
// BİRLEŞİK LİSTİNG ŞEMASI (Discriminated Union)
// ============================================
exports.createListingSchema = zod_1.z.discriminatedUnion('listingType', [
    exports.yachtListingSchema,
    exports.partListingSchema,
    exports.marinaListingSchema,
    exports.crewListingSchema,
]);
// ============================================
// UPDATE ŞEMALARI
// ============================================
exports.updateListingSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200).optional(),
    description: zod_1.z.string().max(5000).optional(),
    price: zod_1.z.number().positive().optional(),
    currency: zod_1.z.enum(['TRY', 'USD', 'EUR']).optional(),
    location: zod_1.z.string().optional(),
    status: zod_1.z.enum(['PENDING', 'APPROVED', 'REJECTED', 'DELETED']).optional(),
    rejectionReason: zod_1.z.string().optional(),
});
// ============================================
// QUERY PARAMETRE ŞEMALARI
// ============================================
exports.listingQuerySchema = zod_1.z.object({
    listingType: zod_1.z.enum(['yacht', 'part', 'marina', 'crew']).optional(),
    minPrice: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive()).optional(),
    maxPrice: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive()).optional(),
    location: zod_1.z.string().optional(),
    status: zod_1.z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('1'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive().max(100)).default('20'),
});
