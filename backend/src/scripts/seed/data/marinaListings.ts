import { db } from '../../../lib/db';
import { marinaListings, generateId } from '../../../db/schema';
import { createBaseListing } from '../utils/listingFactory';

export const marinaListingsData = [
  {
    title: 'Marina İskelesi - 15m',
    description: 'Bodrum D-Marin\'de 15 metrelik iskele yeri. Yıllık kiralık.',
    price: '12000',
    currency: 'EUR',
    location: 'Bodrum, Türkiye',
    categoryName: 'Marina ve Limanlar',
    subcategoryPath: 'Marina ve Limanlar/Marinalar/Ege Bölgesi/Muğla',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
  },
];

export async function seedMarinaListings(userId: string) {
  console.log('⚓ Marina ilanları oluşturuluyor...');
  
  for (const marina of marinaListingsData) {
    const listingId = await createBaseListing(userId, 'marina', marina);
    await db.insert(marinaListings).values({
      listing_id: listingId,
      priceType: 'yearly',
      maxLength: '15.00',
      maxBeam: '5.00',
      maxDraft: '2.50',
      services: JSON.stringify(['electricity', 'water', 'wifi', 'security']),
    });
  }
  
  console.log(`✓ ${marinaListingsData.length} marina ilanı oluşturuldu`);
  return marinaListingsData.length;
}
