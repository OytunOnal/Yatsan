"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sparePartListingsData = void 0;
exports.seedSparePartListings = seedSparePartListings;
const db_1 = require("../../../lib/db");
const schema_1 = require("../../../db/schema");
const listingFactory_1 = require("../utils/listingFactory");
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
