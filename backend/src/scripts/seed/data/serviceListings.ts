import { db } from '../../../lib/db';
import { serviceListings, generateId } from '../../../db/schema';
import { createBaseListing } from '../utils/listingFactory';

export const serviceListingsData = [
  {
    title: 'Volvo Penta Yetkili Servis - Bodrum',
    description: 'Profesyonel Volvo Penta motor servisi. Deneyimli teknisyenler ve orijinal yedek parça.',
    price: '150',
    currency: 'EUR',
    location: 'Bodrum, Türkiye',
    categoryName: 'Teknik Servisler',
    subcategoryPath: 'Teknik Servisler/Marka Yetkili Servisleri/Volvo Penta Servisi',
    serviceType: 'maintenance',
    provider: 'Volvo Penta Bodrum',
    experience: 15,
    certifications: JSON.stringify(['Volvo Penta Certified', 'Marine Engineer']),
    availability: 'immediate',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
  },
  {
    title: 'Fiberglass Tamir Hizmeti',
    description: 'Profesyonel fiberglass tamir ve restorasyon hizmeti. Osmoz tedavisi ve boyama.',
    price: '75',
    currency: 'EUR',
    location: 'Marmaris, Türkiye',
    categoryName: 'Teknik Servisler',
    subcategoryPath: 'Teknik Servisler/Özel Servisler/Fiberglass Tamiri/Gövde Tamiri',
    serviceType: 'repair',
    provider: 'Marmaris Fiber Teknik',
    experience: 10,
    certifications: JSON.stringify(['Fiberglass Specialist', 'Gelcoat Expert']),
    availability: 'flexible',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
  },
  {
    title: 'Yamaha Motor Servisi',
    description: 'Yamaha outboard motor servisi ve bakımı. Yetkili servis kalitesi.',
    price: '100',
    currency: 'EUR',
    location: 'İstanbul, Türkiye',
    categoryName: 'Teknik Servisler',
    subcategoryPath: 'Teknik Servisler/Marka Yetkili Servisleri/Yamaha Servisi',
    serviceType: 'maintenance',
    provider: 'Yamaha Marine İstanbul',
    experience: 12,
    certifications: JSON.stringify(['Yamaha Certified Technician']),
    availability: 'immediate',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
  },
];

export async function seedServiceListings(userId: string) {
  console.log('🔧 Teknik Servis ilanları oluşturuluyor...');
  
  for (const service of serviceListingsData) {
    const listingId = await createBaseListing(userId, 'service', service);

    await db.insert(serviceListings).values({
      listing_id: listingId,
      serviceType: service.serviceType,
      businessName: service.provider,
      yearsInBusiness: service.experience,
      certifications: service.certifications,
      serviceArea: 'nationwide',
      mobileService: true,
      emergencyService: false,
      priceType: 'hourly',
      hourlyRate: service.price,
    });
  }
  
  console.log(`✓ ${serviceListingsData.length} teknik servis ilanı oluşturuldu`);
  return serviceListingsData.length;
}
