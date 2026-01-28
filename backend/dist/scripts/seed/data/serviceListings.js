"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceListingsData = void 0;
exports.seedServiceListings = seedServiceListings;
const db_1 = require("../../../lib/db");
const schema_1 = require("../../../db/schema");
const listingFactory_1 = require("../utils/listingFactory");
exports.serviceListingsData = [
    {
        title: 'Volvo Penta Yetkili Servis - Bodrum',
        description: 'Profesyonel Volvo Penta motor servisi. Deneyimli teknisyenler ve orijinal yedek parça.',
        price: '150',
        currency: 'EUR',
        location: 'Bodrum, Türkiye',
        categoryName: 'Teknik Servisler',
        subcategoryName: 'Volvo Penta Yetkili Servis',
        position: 'engineer',
        experience: 15,
        certifications: JSON.stringify(['Volvo Penta Certified', 'Marine Engineer']),
        availability: 'immediate',
        salary: '5000',
        salaryCurrency: 'EUR',
        salaryPeriod: 'monthly',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
    },
    {
        title: 'Fiberglass Tamir Hizmeti',
        description: 'Profesyonel fiberglass tamir ve restorasyon hizmeti. Osmoz tedavisi ve boyama.',
        price: '75',
        currency: 'EUR',
        location: 'Marmaris, Türkiye',
        categoryName: 'Teknik Servisler',
        subcategoryName: 'Fiberglass Tamiri',
        position: 'engineer',
        experience: 10,
        certifications: JSON.stringify(['Fiberglass Specialist', 'Gelcoat Expert']),
        availability: 'flexible',
        salary: '2000',
        salaryCurrency: 'EUR',
        salaryPeriod: 'monthly',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    },
    {
        title: 'Yamaha Motor Servisi',
        description: 'Yamaha outboard motor servisi ve bakımı. Yetkili servis kalitesi.',
        price: '100',
        currency: 'EUR',
        location: 'İstanbul, Türkiye',
        categoryName: 'Teknik Servisler',
        subcategoryName: 'Yamaha Yetkili Servis',
        position: 'engineer',
        experience: 12,
        certifications: JSON.stringify(['Yamaha Certified Technician']),
        availability: 'immediate',
        salary: '3500',
        salaryCurrency: 'EUR',
        salaryPeriod: 'monthly',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
    },
];
async function seedServiceListings(userId) {
    console.log('🔧 Teknik Servis ilanları oluşturuluyor...');
    for (const service of exports.serviceListingsData) {
        const listingId = await (0, listingFactory_1.createBaseListing)(userId, 'service', service);
        await db_1.db.insert(schema_1.crewListings).values({
            id: (0, schema_1.generateId)(),
            listing_id: listingId,
            position: service.position,
            experience: service.experience,
            certifications: service.certifications,
            availability: service.availability,
            salary: service.salary,
            salaryCurrency: service.salaryCurrency,
            salaryPeriod: service.salaryPeriod,
        });
    }
    console.log(`✓ ${exports.serviceListingsData.length} teknik servis ilanı oluşturuldu`);
    return exports.serviceListingsData.length;
}
