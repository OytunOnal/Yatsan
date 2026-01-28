import { db } from '../../../lib/db';
import { crewListings, generateId } from '../../../db/schema';
import { createBaseListing } from '../utils/listingFactory';

export const crewListingsData = [
  {
    title: 'Deneyimli Kaptan Aranıyor',
    description: 'Gulet için deneyimli kaptan aranıyor. Sezon için.',
    price: '3500',
    currency: 'EUR',
    location: 'Bodrum, Türkiye',
    categoryName: 'Transfer ve Mürettebat',
    subcategoryPath: 'Transfer ve Mürettebat/Mürettebat/Kaptan',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop',
  },
];

export async function seedCrewListings(userId: string) {
  console.log('👨‍✈️ Mürettebat ilanları oluşturuluyor...');
  
  for (const crew of crewListingsData) {
    const listingId = await createBaseListing(userId, 'crew', crew);
    await db.insert(crewListings).values({
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
  
  console.log(`✓ ${crewListingsData.length} mürettebat ilanı oluşturuldu`);
  return crewListingsData.length;
}
