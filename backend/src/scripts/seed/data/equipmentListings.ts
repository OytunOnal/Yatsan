import { db } from '../../../lib/db';
import { equipmentListings, generateId } from '../../../db/schema';
import { createBaseListing } from '../utils/listingFactory';

export const equipmentListingsData = [
  {
    title: 'Volvo Penta D12-715 Marine Engine',
    description: 'Brand new Volvo Penta D12-715 marine diesel engine. Still in crate with full warranty.',
    price: '85000',
    currency: 'USD',
    location: 'İstanbul, Türkiye',
    categoryName: 'Deniz Aracı Ekipmanları',
    subcategoryPath: 'Deniz Aracı Ekipmanları/Deniz Motorları/İçten Motor',
    condition: 'new',
    brand: 'Volvo Penta',
    oemCode: 'D12-715',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
  },
  {
    title: 'Furuno Radar 1937CXT 4kW Open Array',
    description: 'High-performance 4kW color radar with 6.5ft open array antenna.',
    price: '4500',
    currency: 'USD',
    location: 'Antalya, Türkiye',
    categoryName: 'Deniz Aracı Ekipmanları',
    subcategoryPath: 'Deniz Aracı Ekipmanları/Elektronik/Radar',
    condition: 'used',
    brand: 'Furuno',
    oemCode: '1937CXT',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
  },
  {
    title: 'International Antifouling Paint - Black',
    description: 'Premium antifouling paint for all boat types. 5L container.',
    price: '350',
    currency: 'EUR',
    location: 'İzmir, Türkiye',
    categoryName: 'Deniz Aracı Ekipmanları',
    subcategoryPath: 'Deniz Aracı Ekipmanları/Boya ve Bakım/Antifouling',
    condition: 'new',
    brand: 'International',
    oemCode: 'INT-ABL',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
  },
  {
    title: 'Seakeeper 9 Gyro Stabilizer',
    description: 'Brand new Seakeeper 9 gyro stabilizer. Reduces boat roll up to 95%.',
    price: '28000',
    currency: 'USD',
    location: 'Bodrum, Türkiye',
    categoryName: 'Deniz Aracı Ekipmanları',
    subcategoryPath: 'Deniz Aracı Ekipmanları/Dümen ve Kumanda/Otomatik Pilot',
    condition: 'new',
    brand: 'Seakeeper',
    oemCode: 'SK-9',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
  },
  {
    title: 'Mustang Survival Life Jacket',
    description: 'Premium inflatable life jacket with automatic activation. USCG approved.',
    price: '250',
    currency: 'USD',
    location: 'İstanbul, Türkiye',
    categoryName: 'Deniz Aracı Ekipmanları',
    subcategoryPath: 'Deniz Aracı Ekipmanları/Güvenlik/Can Yeleği',
    condition: 'new',
    brand: 'Mustang',
    oemCode: 'MSD-1000',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
  },
];

export async function seedEquipmentListings(userId: string) {
  console.log('⚙️  Deniz Aracı Ekipmanları ilanları oluşturuluyor...');
  
  for (const equipment of equipmentListingsData) {
    const listingId = await createBaseListing(userId, 'equipment', equipment);

    await db.insert(equipmentListings).values({
      id: generateId(),
      listing_id: listingId,
      equipmentType: 'electronics',
      condition: equipment.condition,
      brand: equipment.brand,
      model: equipment.oemCode,
      warranty: equipment.condition === 'new' ? 12 : 0,
      specifications: JSON.stringify({}),
    });
  }
  
  console.log(`✓ ${equipmentListingsData.length} ekipman ilanı oluşturuldu`);
  return equipmentListingsData.length;
}
