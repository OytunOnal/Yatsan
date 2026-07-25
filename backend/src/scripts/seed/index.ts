import { db } from '../../lib/db';
import { users, listings, yachtListings, partListings, marinaListings, crewListings, listingImages, categories, generateId } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { clearCache } from './utils/categoryCache';
import { seedYachtListings } from './data/yachtListings';
import { seedEquipmentListings } from './data/equipmentListings';
import { seedServiceListings } from './data/serviceListings';
import { seedMarinaListings } from './data/marinaListings';
import { seedCrewListings } from './data/crewListings';
import { seedSparePartListings } from './data/sparePartListings';

async function cleanupListings() {
  console.log('🗑️  Tüm ilanlar temizleniyor...');
  
  await db.delete(listingImages);
  console.log('   ✓ İlan görselleri temizlendi');
  
  await db.delete(crewListings);
  console.log('   ✓ Mürettebat ilanları temizlendi');
  
  await db.delete(marinaListings);
  console.log('   ✓ Marina ilanları temizlendi');
  
  await db.delete(partListings);
  console.log('   ✓ Yedek parça ilanları temizlendi');
  
  await db.delete(yachtListings);
  console.log('   ✓ Yat ilanları temizlendi');
  
  await db.delete(listings);
  console.log('   ✓ Ana ilan tablosu temizlendi');
  
  console.log('✅ Tüm ilanlar başarıyla temizlendi\n');
}

async function getOrCreateTestUser(): Promise<string> {
  const existingUsers = await db.select().from(users).where(eq(users.email, 'test@teknepazari.com')).limit(1);
  
  if (existingUsers.length > 0) {
    console.log('✓ Mevcut kullanıcı bulundu:', existingUsers[0].id);
    return existingUsers[0].id;
  }
  
  const [newUser] = await db.insert(users).values({
    id: generateId(),
    email: 'test@teknepazari.com',
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
    clearCache();
    
    // Get or create test user
    const userId = await getOrCreateTestUser();
    
    // Load categories
    console.log('\n📁 Kategoriler yükleniyor...');
    const allCategories = await db.select().from(categories);
    console.log(`✓ ${allCategories.length} kategori yüklendi\n`);
    
    let totalListings = 0;
    
    // Seed each listing type
    totalListings += await seedYachtListings(userId);
    totalListings += await seedEquipmentListings(userId);
    totalListings += await seedServiceListings(userId);
    totalListings += await seedSparePartListings(userId);
    totalListings += await seedMarinaListings(userId);
    totalListings += await seedCrewListings(userId);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Mock ilanlar başarıyla oluşturuldu!');
    console.log('='.repeat(50));
    console.log(`📊 Toplam ${totalListings} ilan oluşturuldu`);
    console.log('='.repeat(50));
    
  } catch (error) {
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
