"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crewListingsData = void 0;
exports.seedCrewListings = seedCrewListings;
const db_1 = require("../../../lib/db");
const schema_1 = require("../../../db/schema");
const listingFactory_1 = require("../utils/listingFactory");
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
