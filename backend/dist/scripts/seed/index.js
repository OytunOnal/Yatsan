"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../lib/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const categoryCache_1 = require("./utils/categoryCache");
const yachtListings_1 = require("./data/yachtListings");
const equipmentListings_1 = require("./data/equipmentListings");
const serviceListings_1 = require("./data/serviceListings");
const marinaListings_1 = require("./data/marinaListings");
const crewListings_1 = require("./data/crewListings");
const sparePartListings_1 = require("./data/sparePartListings");
async function cleanupListings() {
    console.log('🗑️  Tüm ilanlar temizleniyor...');
    await db_1.db.delete(schema_1.listingImages);
    console.log('   ✓ İlan görselleri temizlendi');
    await db_1.db.delete(schema_1.crewListings);
    console.log('   ✓ Mürettebat ilanları temizlendi');
    await db_1.db.delete(schema_1.marinaListings);
    console.log('   ✓ Marina ilanları temizlendi');
    await db_1.db.delete(schema_1.partListings);
    console.log('   ✓ Yedek parça ilanları temizlendi');
    await db_1.db.delete(schema_1.yachtListings);
    console.log('   ✓ Yat ilanları temizlendi');
    await db_1.db.delete(schema_1.listings);
    console.log('   ✓ Ana ilan tablosu temizlendi');
    console.log('✅ Tüm ilanlar başarıyla temizlendi\n');
}
async function getOrCreateTestUser() {
    const existingUsers = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, 'test@yatsan.com')).limit(1);
    if (existingUsers.length > 0) {
        console.log('✓ Mevcut kullanıcı bulundu:', existingUsers[0].id);
        return existingUsers[0].id;
    }
    const [newUser] = await db_1.db.insert(schema_1.users).values({
        id: (0, schema_1.generateId)(),
        email: 'test@yatsan.com',
        phone: '+905551234567',
        firstName: 'Test',
        lastName: 'User',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        userType: 'individual',
        phoneVerified: true,
        kvkkApproved: true,
        status: 'ACTIVE',
    }).returning();
    console.log('✓ Yeni kullanıcı oluşturuldu:', newUser.id);
    return newUser.id;
}
async function seedListings() {
    try {
        // Cleanup
        await cleanupListings();
        // Clear category cache
        (0, categoryCache_1.clearCache)();
        // Get or create test user
        const userId = await getOrCreateTestUser();
        // Load categories
        console.log('\n📁 Kategoriler yükleniyor...');
        const allCategories = await db_1.db.select().from(schema_1.categories);
        console.log(`✓ ${allCategories.length} kategori yüklendi\n`);
        let totalListings = 0;
        // Seed each listing type
        totalListings += await (0, yachtListings_1.seedYachtListings)(userId);
        totalListings += await (0, equipmentListings_1.seedEquipmentListings)(userId);
        totalListings += await (0, serviceListings_1.seedServiceListings)(userId);
        totalListings += await (0, sparePartListings_1.seedSparePartListings)(userId);
        totalListings += await (0, marinaListings_1.seedMarinaListings)(userId);
        totalListings += await (0, crewListings_1.seedCrewListings)(userId);
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('✅ Mock ilanlar başarıyla oluşturuldu!');
        console.log('='.repeat(50));
        console.log(`📊 Toplam ${totalListings} ilan oluşturuldu`);
        console.log('='.repeat(50));
    }
    catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}
// Script çalıştır
seedListings()
    .then(() => {
    console.log('✅ İşlem tamamlandı');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Script başarısız:', error);
    process.exit(1);
});
