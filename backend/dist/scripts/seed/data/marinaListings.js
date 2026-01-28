"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marinaListingsData = void 0;
exports.seedMarinaListings = seedMarinaListings;
const db_1 = require("../../../lib/db");
const schema_1 = require("../../../db/schema");
const listingFactory_1 = require("../utils/listingFactory");
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
