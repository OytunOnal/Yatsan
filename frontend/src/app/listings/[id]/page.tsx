import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ImageGallery from '@/components/listings/ImageGallery';
import ContactButtons from '@/components/listings/ContactButtons';
import { Listing, ListingType, getImageUrl } from '@/lib/api';

interface ListingResponse {
  listing: Listing;
}

async function getListing(id: string): Promise<Listing | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/listings/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data: ListingResponse = await res.json();
    return data.listing;
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await getListing(params.id);

  if (!listing) {
    return {
      title: 'İlan Bulunamadı - Yatsan',
    };
  }

  return {
    title: `${listing.title} - Yatsan`,
    description: listing.description || 'Yatsan denizcilik pazar yerinde ilan detayları',
  };
}

// İlan tipi için Türkçe etiketler
const getListingTypeLabel = (type: ListingType): string => {
  const labels: Record<ListingType, string> = {
    yacht: 'Yat İlanı',
    part: 'Yedek Parça İlanı',
    marina: 'Marina İlanı',
    crew: 'Mürettebat İlanı',
  };
  return labels[type] || type;
};

// Para birimi formatlama
const formatPrice = (price: number, currency: string): string => {
  const symbols: Record<string, string> = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
  };
  const symbol = symbols[currency] || currency;
  return `${symbol}${price.toLocaleString()}`;
};

// Equipment Türkçe etiketleri
const equipmentLabels: Record<string, string> = {
  airConditioning: 'Klima',
  gps: 'GPS',
  radar: 'Radar',
  autopilot: 'Otopilot',
  vhf: 'VHF Radyo',
  soundSystem: 'Ses Sistemi',
  tv: 'TV',
  kitchen: 'Mutfaka',
  refrigerator: 'Buzdolabı',
  freezer: 'Derin Dondurucu',
  microwave: 'Mikrodalga',
  coffeeMaker: 'Kahve Makinesi',
  dishwasher: 'Bulaşık Makinesi',
  washingMachine: 'Çamaşır Makinesi',
  waterMaker: 'Su Üreticisi',
  bowThruster: 'Baş Pervane',
  sternThruster: 'Kıç Pervane',
  anchor: 'Çıkrı',
  windlass: 'Çıkrı Motoru',
  swimPlatform: 'Yüzme Platformu',
  shower: 'Duş',
  bbq: 'BBQ',
};

// Yat ilanı detayları
function YachtListingDetails({ yacht }: { yacht: any }) {
  const details = [
    { label: 'Yat Tipi', value: yacht.yachtType === 'motor_yacht' ? 'Motor Yat' : yacht.yachtType === 'sailing_yacht' ? 'Yelkenli Yat' : yacht.yachtType === 'catamaran' ? 'Katamaran' : 'Gulet' },
    { label: 'Yıl', value: yacht.year },
    { label: 'Uzunluk', value: `${yacht.length}m` },
    { label: 'Genişlik', value: `${yacht.beam}m` },
    { label: 'Sükunet Derinliği', value: `${yacht.draft}m` },
    { label: 'Durum', value: yacht.condition === 'new' ? 'Yeni' : yacht.condition === 'excellent' ? 'Mükemmel' : yacht.condition === 'good' ? 'İyi' : 'Orta' },
  ];

  if (yacht.engineBrand) details.push({ label: 'Motor Markası', value: yacht.engineBrand });
  if (yacht.engineHours) details.push({ label: 'Motor Saati', value: yacht.engineHours });
  if (yacht.engineHP) details.push({ label: 'Motor Gücü', value: `${yacht.engineHP} HP` });
  if (yacht.fuelType) details.push({ label: 'Yakıt Tipi', value: yacht.fuelType === 'diesel' ? 'Dizel' : yacht.fuelType === 'petrol' ? 'Benzin' : yacht.fuelType === 'electric' ? 'Elektrik' : 'Hibrit' });
  if (yacht.cruisingSpeed) details.push({ label: 'Seyir Hızı', value: `${yacht.cruisingSpeed} knot` });
  if (yacht.maxSpeed) details.push({ label: 'Maks. Hız', value: `${yacht.maxSpeed} knot` });
  if (yacht.cabinCount) details.push({ label: 'Kabin Sayısı', value: yacht.cabinCount });
  if (yacht.bedCount) details.push({ label: 'Yatak Sayısı', value: yacht.bedCount });
  if (yacht.bathroomCount) details.push({ label: 'Banyo Sayısı', value: yacht.bathroomCount });

  // Equipment JSON string olarak geliyor, parse edip gösterelim
  let equipmentItems: string[] = [];
  if (yacht.equipment) {
    try {
      const equipment = JSON.parse(yacht.equipment);
      if (typeof equipment === 'object' && equipment !== null) {
        equipmentItems = Object.keys(equipment).filter(key => equipment[key] === true);
      }
    } catch {
      // JSON parse hatası varsa, equipmentItems boş kalır
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {details.map((detail, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
            <p className="font-semibold text-gray-900">{detail.value}</p>
          </div>
        ))}
      </div>

      {equipmentItems.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ekipmanlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {equipmentItems.map((item) => (
              <div key={item} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{equipmentLabels[item] || item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Parça ilanı detayları
function PartListingDetails({ part }: { part: any }) {
  const details = [
    { label: 'Marka', value: part.brand },
    { label: 'Durum', value: part.condition === 'new' ? 'Yeni' : part.condition === 'used' ? 'Kullanılmış' : 'Yenilenmiş' },
  ];

  if (part.oemCode) details.push({ label: 'OEM Kodu', value: part.oemCode });

  // Compatibility JSON string veya metin olarak gelebilir
  let compatibilityInfo: { yachtLength?: { min: number; max: number; unit: string }; yachtDisplacement?: { min: number; max: number; unit: string } } = {};
  let compatibilityText: string | null = null;
  
  if (part.compatibility) {
    try {
      compatibilityInfo = JSON.parse(part.compatibility);
    } catch {
      // JSON parse hatası varsa, metin olarak kabul et
      compatibilityText = part.compatibility;
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {details.map((detail, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
            <p className="font-semibold text-gray-900">{detail.value}</p>
          </div>
        ))}
      </div>

      {(compatibilityInfo.yachtLength || compatibilityInfo.yachtDisplacement || compatibilityText) && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Uyumluluk</h2>
          
          {compatibilityText ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">{compatibilityText}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {compatibilityInfo.yachtLength && (
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Yat Uzunluğu</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {compatibilityInfo.yachtLength.min} - {compatibilityInfo.yachtLength.max} {compatibilityInfo.yachtLength.unit}
                  </p>
                </div>
              )}
              {compatibilityInfo.yachtDisplacement && (
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Yat Deplasmanı</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {compatibilityInfo.yachtDisplacement.min} - {compatibilityInfo.yachtDisplacement.max} {compatibilityInfo.yachtDisplacement.unit}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Marina hizmetleri Türkçe etiketleri
const marinaServiceLabels: Record<string, string> = {
  electricity: 'Elektrik',
  water: 'Su',
  wifi: 'Wi-Fi',
  fuelStation: 'Yakıt İstasyonu',
  pumpOut: 'Atık Boşaltma',
  laundry: 'Çamaşırhane',
  showers: 'Duş',
  toilets: 'Tuvalet',
  restaurant: 'Restoran',
  bar: 'Bar',
  cafe: 'Kafe',
  supermarket: 'Süpermarket',
  pharmacy: 'Eczane',
  security: 'Güvenlik',
  parking: 'Otopark',
  swimmingPool: 'Havuz',
  fitnessCenter: 'Fitness Merkezi',
  spa: 'SPA',
};

// Marina ilanı detayları
function MarinaListingDetails({ marina }: { marina: any }) {
  const details = [
    { label: 'Fiyat Tipi', value: marina.priceType === 'daily' ? 'Günlük' : marina.priceType === 'weekly' ? 'Haftalık' : marina.priceType === 'monthly' ? 'Aylık' : 'Yıllık' },
    { label: 'Maks. Uzunluk', value: `${marina.maxLength}m` },
    { label: 'Maks. Genişlik', value: `${marina.maxBeam}m` },
  ];

  if (marina.maxDraft) details.push({ label: 'Maks. Sükunet Derinliği', value: `${marina.maxDraft}m` });

  // Services JSON string olarak geliyor, parse edip gösterelim
  let serviceItems: Array<{ key: string; value: string | boolean }> = [];
  if (marina.services) {
    try {
      const services = JSON.parse(marina.services);
      if (typeof services === 'object' && services !== null) {
        serviceItems = Object.entries(services).map(([key, value]) => ({ key, value: value as string | boolean }));
      }
    } catch {
      // JSON parse hatası varsa, serviceItems boş kalır
    }
  }

  // Availability JSON string olarak geliyor, parse edip gösterelim
  let availabilityInfo: { available?: boolean; availableFrom?: string; availableTo?: string } = {};
  if (marina.availability) {
    try {
      availabilityInfo = JSON.parse(marina.availability);
    } catch {
      // JSON parse hatası varsa, availabilityInfo boş kalır
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {details.map((detail, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
            <p className="font-semibold text-gray-900">{detail.value}</p>
          </div>
        ))}
      </div>

      {serviceItems.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hizmetler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {serviceItems.map(({ key, value }) => {
              // Değer true ise göster, false ise gösterme
              if (value === false) return null;
              const label = marinaServiceLabels[key] || key;
              const displayValue = value === true ? '' : ` (${value})`;
              return (
                <div key={key} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">{label}{displayValue}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(availabilityInfo.availableFrom || availabilityInfo.availableTo) && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Müsaitlik</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availabilityInfo.availableFrom && (
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Başlangıç</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(availabilityInfo.availableFrom).toLocaleDateString('tr-TR')}</p>
              </div>
            )}
            {availabilityInfo.availableTo && (
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Bitiş</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(availabilityInfo.availableTo).toLocaleDateString('tr-TR')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Mürettebat ilanı detayları
function CrewListingDetails({ crew }: { crew: any }) {
  const details = [
    { label: 'Pozisyon', value: crew.position === 'captain' ? 'Kaptan' : crew.position === 'chef' ? 'Şef' : crew.position === 'deckhand' ? 'Gemi Personeli' : crew.position === 'engineer' ? 'Mühendis' : 'Hostes' },
    { label: 'Deneyim', value: `${crew.experience} yıl` },
    { label: 'Müsaitlik', value: crew.availability === 'immediate' ? 'Hemen' : crew.availability === 'flexible' ? 'Esnek' : 'Belirli Tarihler' },
  ];

  if (crew.availableFrom) {
    details.push({ label: 'Müsait Başlangıç', value: new Date(crew.availableFrom).toLocaleDateString('tr-TR') });
  }
  if (crew.availableTo) {
    details.push({ label: 'Müsait Bitiş', value: new Date(crew.availableTo).toLocaleDateString('tr-TR') });
  }

  if (crew.salary) {
    details.push({
      label: 'Maaş Beklentisi',
      value: `${crew.salary} ${crew.salaryCurrency || ''} / ${crew.salaryPeriod === 'monthly' ? 'Aylık' : crew.salaryPeriod === 'weekly' ? 'Haftalık' : crew.salaryPeriod === 'daily' ? 'Günlük' : 'Seyir Başına'}`
    });
  }

  // Certifications JSON string olarak geliyor, parse edip gösterelim
  if (crew.certifications) {
    try {
      const certifications = JSON.parse(crew.certifications);
      if (Array.isArray(certifications) && certifications.length > 0) {
        details.push({ label: 'Sertifikalar', value: certifications.join(', ') });
      }
    } catch {
      // JSON parse hatası varsa, raw string'i gösterme
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {details.map((detail, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
          <p className="font-semibold text-gray-900">{detail.value}</p>
        </div>
      ))}
    </div>
  );
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);

  if (!listing) {
    notFound();
  }

  const images = listing.images?.map(img => getImageUrl(img.url) || '') || [];

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-gray-900 transition-colors">Ana Sayfa</a>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <a href="/listings" className="hover:text-gray-900 transition-colors">İlanlar</a>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate max-w-xs">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="card overflow-hidden">
            <ImageGallery images={images} title={listing.title} />
          </div>

          {/* Title & Price */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-md mb-3">
                  {getListingTypeLabel(listing.listingType)}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {listing.title}
                </h1>
                {listing.location && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.location}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-bold text-primary-600">
                  {formatPrice(Number(listing.price), listing.currency)}
                </p>
              </div>
            </div>

            {listing.description && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>
            )}
          </div>

          {/* İlan Tipine Göre Detaylar */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">İlan Detayları</h2>
            {listing.listingType === 'yacht' && listing.yachtListing && (
              <YachtListingDetails yacht={listing.yachtListing} />
            )}
            {listing.listingType === 'part' && listing.partListing && (
              <PartListingDetails part={listing.partListing} />
            )}
            {listing.listingType === 'marina' && listing.marinaListing && (
              <MarinaListingDetails marina={listing.marinaListing} />
            )}
            {listing.listingType === 'crew' && listing.crewListing && (
              <CrewListingDetails crew={listing.crewListing} />
            )}
          </div>

          {/* Ek Bilgiler */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İlan Bilgileri</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">İlan No:</span>{' '}
                <span className="font-medium text-gray-900">{listing.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Yayın Tarihi:</span>{' '}
                <span className="font-medium text-gray-900">{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Card */}
          {listing.user && (
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-semibold">
                  {listing.user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Satıcı</h3>
                  <p className="text-sm text-gray-500">{listing.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-success-50 rounded-lg">
                <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-success-700">Doğrulanmış Satıcı</span>
              </div>
            </div>
          )}

          {/* Contact Card */}
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim</h3>
            <ContactButtons
              sellerId={listing.userId}
              phone="+90 555 000 0000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
