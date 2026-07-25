import { db } from '../../../lib/db';
import { partListings, generateId } from '../../../db/schema';
import { createBaseListing } from '../utils/listingFactory';

export const sparePartListingsData = [
  {
    title: 'Yanmar Motor Yedek Parça',
    description: 'Yanmar motor için orijinal yedek parçalar.',
    price: '500',
    currency: 'EUR',
    location: 'İstanbul, Türkiye',
    categoryName: 'Yedek Parça',
    subcategoryPath: 'Yedek Parça/Motor Yedek Parçaları/İçten Motor Yedek Parça',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
  },
];

export async function seedSparePartListings(userId: string) {
  console.log('🔩 Yedek parça ilanları oluşturuluyor...');
  
  for (const part of sparePartListingsData) {
    const listingId = await createBaseListing(userId, 'part', part);
    await db.insert(partListings).values({
      listing_id: listingId,
      condition: 'new',
      brand: 'Yanmar',
      oemCode: 'YAN-123',
      compatibility: JSON.stringify({ models: ['Yanmar 4JH'] }),
      description: part.description,
    });
  }
  
  console.log(`✓ ${sparePartListingsData.length} yedek parça ilanı oluşturuldu`);
  return sparePartListingsData.length;
}
