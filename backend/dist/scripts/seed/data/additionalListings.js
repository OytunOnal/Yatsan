"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sparePartListingsData = exports.crewListingsData = exports.marinaListingsData = void 0;
exports.seedMarinaListings = seedMarinaListings;
exports.seedCrewListings = seedCrewListings;
exports.seedSparePartListings = seedSparePartListings;
const db_1 = require("../../../lib/db");
const schema_1 = require("../../../db/schema");
const listingFactory_1 = require("../utils/listingFactory");
// MARINA LISTINGS
exports.marinaListingsData = [
    {
        title: 'Marina İskelesi - 15m',
        description: 'Bodrum D-Marin\'de 15 metrelik iskele yeri. Yıllık kiralık.',
        price: '12000',
        currency: 'EUR',
        location: 'Bodrum, Türkiye',
        categoryName: 'Marina ve İskele',
        subcategoryName: 'İskele Yeri',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
    },
];
async function seedMarinaListings(userId) {
    console.log('⚓ Marina ilanları oluşturuluyor...');
    for (const marina of exports.marinaListingsData) {
        const listingId = await (0, listingFactory_1.createBaseListing)(userId, 'marina', marina);
        await db_1.db.insert(schema_1.marinaListings).values({
            id: (0, schema_1.generateId)(),
            listing_id: listingId,
            priceType: 'yearly',
            maxLength: '15.00',
            maxBeam: '5.00',
            maxDraft: '2.50',
            services: JSON.stringify(['electricity', 'water', 'wifi', 'security']),
        });
    }
    console.log(`✓ ${exports.marinaListingsData.length} marina ilanı oluşturuldu`);
    return exports.marinaListingsData.length;
}
// CREW LISTINGS
exports.crewListingsData = [
    {
        title: 'Deneyimli Kaptan Aranıyor',
        description: 'Gulet için deneyimli kaptan aranıyor. Sezon için.',
        price: '3500',
        currency: 'EUR',
        location: 'Bodrum, Türkiye',
        categoryName: 'Mürettebat',
        subcategoryName: 'Kaptan',
        image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop',
    },
];
async function seedCrewListings(userId) {
    console.log('👨‍✈️ Mürettebat ilanları oluşturuluyor...');
    for (const crew of exports.crewListingsData) {
        const listingId = await (0, listingFactory_1.createBaseListing)(userId, 'crew', crew);
        await db_1.db.insert(schema_1.crewListings).values({
            id: (0, schema_1.generateId)(),
            listing_id: listingId,
            position: 'captain',
            experience: 15,
            certifications: JSON.stringify(['Captain License', 'STCW']),
            availability: 'immediate',
            salary: crew.price,
            salaryCurrency: crew.currency,
            salaryPeriod: 'monthly',
        });
    }
    console.log(`✓ ${exports.crewListingsData.length} mürettebat ilanı oluşturuldu`);
    return exports.crewListingsData.length;
}
// SPARE PARTS LISTINGS
exports.sparePartListingsData = [
    {
        title: 'Yanmar Motor Yedek Parça',
        description: 'Yanmar motor için orijinal yedek parçalar.',
        price: '500',
        currency: 'EUR',
        location: 'İstanbul, Türkiye',
        categoryName: 'Deniz Aracı Ekipmanları',
        subcategoryName: 'Motor Yedek Parça',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
    },
];
async function seedSparePartListings(userId) {
    console.log('🔩 Yedek parça ilanları oluşturuluyor...');
    for (const part of exports.sparePartListingsData) {
        const listingId = await (0, listingFactory_1.createBaseListing)(userId, 'part', part);
        await db_1.db.insert(schema_1.partListings).values({
            id: (0, schema_1.generateId)(),
            listing_id: listingId,
            condition: 'new',
            brand: 'Yanmar',
            oemCode: 'YAN-123',
            compatibility: JSON.stringify({ models: ['Yanmar 4JH'] }),
            description: part.description,
        });
    }
    console.log(`✓ ${exports.sparePartListingsData.length} yedek parça ilanı oluşturuldu`);
    return exports.sparePartListingsData.length;
}
