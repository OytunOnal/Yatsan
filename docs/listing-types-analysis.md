# TeknePazarı - İlan Türleri Genişletilmiş Plan (v3)

**Tarih:** 2026-01-27
**Yaklaşım:** Mevcut ilan türlerini koruyarak genişletme

---

## 📊 Temel Prensip

> **Her ana kategori, kendi detaylı form alanlarına sahip bir ilan türüne karşılık gelmelidir.**

Mevcut 4 ilan türü (yacht, part, marina, crew) detaylı form alanları sunuyor. Bu yaklaşımı koruyarak, 10 ana kategoriye genişletmemiz gerekiyor.

---

## 🔄 ÖNEMLİ GÜNCELLEME: Yacht İlan Türü

**Soru:** Deniz Araçları hem satılık hem kiralık olabilir. Bu durumu nasıl karşılayacağız?

**Çözüm:** `yacht_listings` tablosuna `yachtListingType` alanı ekledik!

```sql
-- Yeni alanlar
yachtListingType TEXT NOT NULL,  -- 'sale' | 'rent'
priceType TEXT,                  -- 'daily' | 'weekly' | 'monthly' | 'yearly' | 'per_trip'
capacity INTEGER,                -- Kişi kapasitesi (kiralık için)
crewIncluded BOOLEAN,            -- Mürettebat dahil mi (kiralık için)
availability TEXT,              -- JSONB - müsaitlik takvimi (kiralık için)
```

**Kullanım:**
- Satılık tekne ilanı: `yachtListingType = 'sale'`
- Kiralık tekne ilanı: `yachtListingType = 'rent'` + kiralık alanları doldurulur

---

## ️ MEVCUT YAPI (4 İlan Türü)

| İlan Türü | Tablo | Detaylı Alanlar | Karşılık Gelen Kategori |
|-----------|-------|-----------------|------------------------|
| `yacht` | yacht_listings | yachtType, year, length, beam, draft, engineBrand, engineHours, engineHP, fuelType, cruisingSpeed, maxSpeed, cabinCount, bedCount, bathroomCount, equipment, condition | Deniz Araçları |
| `part` | part_listings | condition, brand, oemCode, compatibility, description | Yedek Parça |
| `marina` | marina_listings | priceType, maxLength, maxBeam, maxDraft, services, availability | Marina ve Limanlar |
| `crew` | crew_listings | position, experience, certifications, availability, availableFrom, availableTo, salary, salaryCurrency, salaryPeriod | Transfer ve Mürettebat |

---

## 🆕 ÖNERİLEN GENİŞLETİLMİŞ YAPI (10 İlan Türü)

### Ana Kategorilere Göre İlan Türleri

| # | İlan Türü | Tablo | Ana Kategori | Durum |
|---|-----------|-------|--------------|-------|
| 1 | `yacht` | yacht_listings | Deniz Araçları | ✅ MEVCUT |
| 2 | `part` | part_listings | Yedek Parça | ✅ MEVCUT |
| 3 | `marina` | marina_listings | Marina ve Limanlar | ✅ MEVCUT |
| 4 | `crew` | crew_listings | Transfer ve Mürettebat | ✅ MEVCUT |
| 5 | `equipment` | equipment_listings | Deniz Aracı Ekipmanları | 🆕 YENİ |
| 6 | `service` | service_listings | Teknik Servisler | 🆕 YENİ |
| 7 | `storage` | storage_listings | Kara Park ve Kışlama | 🆕 YENİ |
| 8 | `insurance` | insurance_listings | Sigorta | 🆕 YENİ |
| 9 | `expertise` | expertise_listings | Ekspertiz | 🆕 YENİ |
| 10 | `marketplace` | marketplace_listings | İkinci El Pazarı | 🆕 YENİ |

---

## 📋 DETAYLI TABLO VE ALAN TASARIMLARI

### 1. `yacht_listings` (MEVCUT - Değişiklik Yok)
```sql
-- Zaten mevcut, değişiklik gerekmez
-- Deniz Araçları kategorisi için kullanılır
-- Satılık ve Kiralık alt kategorileri için
```

### 2. `part_listings` (MEVCUT - Değişiklik Yok)
```sql
-- Zaten mevcut, değişiklik gerekmez
-- Yedek Parça kategorisi için kullanılır
```

### 3. `marina_listings` (MEVCUT - Değişiklik Yok)
```sql
-- Zaten mevcut, değişiklik gerekmez
-- Marina ve Limanlar kategorisi için kullanılır
```

### 4. `crew_listings` (MEVCUT - Değişiklik Yok)
```sql
-- Zaten mevcut, değişiklik gerekmez
-- Transfer ve Mürettebat kategorisi için kullanılır
```

---

### 5. `equipment_listings` (YENİ) - Deniz Aracı Ekipmanları

**Amaç:** Boya, Demirleme, Elektronik, Güvenlik, Kabin, Motor Aksamı, Yelken Donanımı vb.

```sql
CREATE TABLE equipment_listings (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Temel Bilgiler
  equipment_type TEXT NOT NULL,           -- 'navigation' | 'safety' | 'deck' | 'cabin' | 'engine' | 'electrical' | 'sail' | 'other'
  brand TEXT,                              -- Marka
  model TEXT,                              -- Model
  condition TEXT NOT NULL,                 -- 'new' | 'excellent' | 'good' | 'fair' | 'used'
  
  -- Teknik Detaylar
  year_of_manufacture INTEGER,             -- Üretim yılı
  warranty_months INTEGER,                 -- Garanti süresi (ay)
  power_consumption DECIMAL(10,2),         -- Güç tüketimi (Watt)
  voltage TEXT,                            -- '12V' | '24V' | '220V' | 'other'
  dimensions TEXT,                         -- JSONB - boyutlar {length, width, height}
  weight DECIMAL(10,2),                    -- Ağırlık (kg)
  
  -- Uyumluluk
  compatible_boat_types TEXT,              -- JSONB - uyumlu tekne türleri
  compatible_boat_lengths TEXT,            -- JSONB - uyumlu tekne boy aralığı {min, max}
  
  -- Ek Bilgiler
  installation_required BOOLEAN DEFAULT false,  -- Montaj gerekli mi
  manual_included BOOLEAN DEFAULT true,         -- Kullanım kılavuzu dahil mi
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Form Alanları:**
- Ekipman Türü (dropdown)
- Marka (text)
- Model (text)
- Durum (dropdown)
- Üretim Yılı (number)
- Garanti Süresi (number)
- Güç Tüketimi (number)
- Voltaj (dropdown)
- Boyutlar (length, width, height)
- Ağırlık (number)
- Uyumlu Tekne Türleri (multi-select)
- Uyumlu Boy Aralığı (min-max)
- Montaj Gerekli mi (checkbox)
- Kullanım Kılavuzu (checkbox)

---

### 6. `service_listings` (YENİ) - Teknik Servisler

**Amaç:** Motor Servisi, Elektrik, Elektronik, Fiberglass, Boya, Yelken Tamiri, Temizlik vb.

```sql
CREATE TABLE service_listings (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Servis Bilgileri
  service_type TEXT NOT NULL,              -- 'motor' | 'electrical' | 'electronics' | 'fiberglass' | 'paint' | 'sail' | 'cleaning' | 'hvac' | 'other'
  business_name TEXT,                      -- İşletme adı
  years_in_business INTEGER,               -- Deneyim yılı
  
  -- Sertifikasyon
  certifications TEXT,                     -- JSONB - sertifikalar listesi
  authorized_brands TEXT,                  -- JSONB - yetkili olduğu markalar
  
  -- Hizmet Detayları
  service_area TEXT,                       -- JSONB - hizmet verilen bölgeler
  mobile_service BOOLEAN DEFAULT false,    -- Mobil servis var mı
  emergency_service BOOLEAN DEFAULT false, -- Acil servis var mı
  emergency_phone TEXT,                    -- Acil durum telefonu
  
  -- Fiyatlandırma
  price_type TEXT,                         -- 'hourly' | 'fixed' | 'estimate' | 'negotiable'
  hourly_rate DECIMAL(10,2),               -- Saatlik ücret
  min_service_fee DECIMAL(10,2),           -- Minimum servis ücreti
  
  -- Çalışma Saatleri
  working_hours TEXT,                      -- JSONB - çalışma saatleri
  
  -- İletişim
  website TEXT,
  whatsapp TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Form Alanları:**
- Servis Türü (dropdown)
- İşletme Adı (text)
- Deneyim Yılı (number)
- Sertifikalar (multi-input)
- Yetkili Markalar (multi-select)
- Hizmet Bölgeleri (multi-select - iller)
- Mobil Servis (checkbox)
- Acil Servis (checkbox)
- Acil Durum Telefonu (tel)
- Fiyatlandırma Türü (dropdown)
- Saatlik Ücret (number)
- Minimum Servis Ücreti (number)
- Çalışma Saatleri (time picker)
- Website (url)
- WhatsApp (tel)

---

### 7. `storage_listings` (YENİ) - Kara Park ve Kışlama

**Amaç:** Kışlama Alanları, Kara Park, Kapalı/Açık Depolama

```sql
CREATE TABLE storage_listings (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Tesis Bilgileri
  storage_type TEXT NOT NULL,              -- 'covered' | 'open' | 'indoor' | 'rack'
  facility_name TEXT,                      -- Tesis adı
  
  -- Kapasite
  max_boat_length DECIMAL(6,2),            -- Maksimum tekne boyu (m)
  max_boat_beam DECIMAL(6,2),              -- Maksimum tekne genişliği (m)
  max_boat_height DECIMAL(6,2),            -- Maksimum tekne yüksekliği (m)
  max_boat_weight DECIMAL(10,2),           -- Maksimum ağırlık (kg)
  
  -- Fiyatlandırma
  price_type TEXT NOT NULL,                -- 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'yearly'
  price_per_meter DECIMAL(10,2),           -- Metre başına fiyat
  
  -- Olanaklar
  security_features TEXT,                  -- JSONB - güvenlik özellikleri
  has_electricity BOOLEAN DEFAULT false,
  has_water BOOLEAN DEFAULT false,
  has_camera BOOLEAN DEFAULT false,
  has_guard BOOLEAN DEFAULT false,
  has_lift BOOLEAN DEFAULT false,          -- Lift/vinç var mı
  lift_capacity DECIMAL(10,2),             -- Lift kapasitesi (ton)
  
  -- Erişim
  access_hours TEXT,                       -- JSONB - erişim saatleri
  gate_access BOOLEAN DEFAULT false,       -- Kapı kartı erişimi
  
  -- Ek Hizmetler
  winterization_service BOOLEAN DEFAULT false,  -- Kışlama hizmeti
  maintenance_service BOOLEAN DEFAULT false,    -- Bakım hizmeti
  launch_service BOOLEAN DEFAULT false,         -- Denize indirme hizmeti
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Form Alanları:**
- Depolama Türü (dropdown)
- Tesis Adı (text)
- Max Tekne Boyu (number)
- Max Tekne Genişliği (number)
- Max Tekne Yüksekliği (number)
- Max Ağırlık (number)
- Fiyatlandırma Türü (dropdown)
- Metre Başı Fiyat (number)
- Güvenlik Özellikleri (multi-select)
- Elektrik (checkbox)
- Su (checkbox)
- Kamera (checkbox)
- Güvenlik (checkbox)
- Lift/Vinç (checkbox)
- Lift Kapasitesi (number)
- Erişim Saatleri (time picker)
- Kart Erişimi (checkbox)
- Kışlama Hizmeti (checkbox)
- Bakım Hizmeti (checkbox)
- Denize İndirme (checkbox)

---

### 8. `insurance_listings` (YENİ) - Sigorta

**Amaç:** Tekne Sigortası, Kaptan Sigortası, Yük/Yolcu Sigortası

```sql
CREATE TABLE insurance_listings (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Şirket Bilgileri
  company_name TEXT NOT NULL,              -- Sigorta şirketi
  agency_name TEXT,                        -- Acente adı (varsa)
  license_number TEXT,                     -- Acente lisans no
  
  -- Sigorta Türü
  insurance_type TEXT NOT NULL,            -- 'hull' | 'liability' | 'crew' | 'cargo' | 'passenger' | 'comprehensive'
  coverage_types TEXT,                     -- JSONB - teminat türleri
  
  -- Kapsam
  min_boat_length DECIMAL(6,2),            -- Min tekne boyu
  max_boat_length DECIMAL(6,2),            -- Max tekne boyu
  min_boat_value DECIMAL(12,2),            -- Min tekne değeri
  max_boat_value DECIMAL(12,2),            -- Max tekne değeri
  boat_age_limit INTEGER,                  -- Tekne yaş limiti
  coverage_area TEXT,                      -- JSONB - kapsama alanı (bölgeler)
  
  -- Fiyatlandırma
  premium_calculation TEXT,                -- 'percentage' | 'fixed' | 'quote'
  min_premium DECIMAL(10,2),               -- Min prim
  premium_percentage DECIMAL(5,2),         -- Prim yüzdesi
  
  -- Teminatlar
  hull_coverage BOOLEAN DEFAULT false,
  liability_coverage BOOLEAN DEFAULT false,
  salvage_coverage BOOLEAN DEFAULT false,
  personal_accident BOOLEAN DEFAULT false,
  legal_protection BOOLEAN DEFAULT false,
  
  -- İletişim
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Form Alanları:**
- Sigorta Şirketi (dropdown - predefined list)
- Acente Adı (text)
- Lisans No (text)
- Sigorta Türü (dropdown)
- Teminat Türleri (multi-select)
- Min Tekne Boyu (number)
- Max Tekne Boyu (number)
- Min Tekne Değeri (number)
- Max Tekne Değeri (number)
- Tekne Yaş Limiti (number)
- Kapsama Alanı (multi-select - bölgeler)
- Prim Hesaplama (dropdown)
- Min Prim (number)
- Prim Yüzdesi (number)
- Tekne Hasarı Teminatı (checkbox)
- Sorumluluk Teminatı (checkbox)
- Kurtarma Teminatı (checkbox)
- Kişisel Kaza Teminatı (checkbox)
- Hukuki Koruma (checkbox)
- İletişim Bilgileri (contact fields)

---

### 9. `expertise_listings` (YENİ) - Ekspertiz

**Amaç:** Tekne Ekspertizi, Değerleme, Raporlama

```sql
CREATE TABLE expertise_listings (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Eksper/Firma Bilgileri
  company_name TEXT,                       -- Firma adı
  expert_name TEXT,                        -- Eksper adı
  license_number TEXT,                     -- Lisans no
  years_experience INTEGER,                -- Deneyim yılı
  
  -- Uzmanlık Alanları
  expertise_type TEXT NOT NULL,            -- 'general' | 'motor' | 'hull' | 'electronics' | 'valuation'
  boat_types TEXT,                         -- JSONB - uzman olduğu tekne türleri
  
  -- Hizmet Detayları
  min_boat_length DECIMAL(6,2),
  max_boat_length DECIMAL(6,2),
  service_area TEXT,                       -- JSONB - hizmet bölgeleri
  mobile_service BOOLEAN DEFAULT false,    -- Mobil ekspertiz
  
  -- Rapor Türleri
  report_types TEXT,                       -- JSONB - rapor türleri
  report_languages TEXT,                   -- JSONB - rapor dilleri
  turnaround_time TEXT,                    -- '24h' | '48h' | '1week' | 'negotiable'
  
  -- Fiyatlandırma
  base_price DECIMAL(10,2),                -- Baz fiyat
  price_per_meter DECIMAL(10,2),           -- Metre başı ek ücret
  travel_fee DECIMAL(10,2),                -- Yol masrafı
  
  -- Sertifikalar
  certifications TEXT,                     -- JSONB - sertifikalar
  memberships TEXT,                        -- JSONB - üyelikler (dernekler vb.)
  
  -- İletişim
  phone TEXT,
  email TEXT,
  website TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Form Alanları:**
- Firma Adı (text)
- Eksper Adı (text)
- Lisans No (text)
- Deneyim Yılı (number)
- Ekspertiz Türü (dropdown)
- Tekne Türleri (multi-select)
- Min Tekne Boyu (number)
- Max Tekne Boyu (number)
- Hizmet Bölgeleri (multi-select)
- Mobil Ekspertiz (checkbox)
- Rapor Türleri (multi-select)
- Rapor Dilleri (multi-select)
- Teslim Süresi (dropdown)
- Baz Fiyat (number)
- Metre Başı Ücret (number)
- Yol Masrafı (number)
- Sertifikalar (multi-input)
- Üyelikler (multi-input)
- İletişim Bilgileri (contact fields)

---

### 10. `marketplace_listings` (YENİ) - İkinci El Pazarı

**Amaç:** Su Sporları, Balıkçılık, Mutfak, Eğlence, Güverte, Kabin vb.

```sql
CREATE TABLE marketplace_listings (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Ürün Bilgileri
  item_type TEXT NOT NULL,                 -- 'water_sports' | 'fishing' | 'kitchen' | 'entertainment' | 'deck' | 'cabin' | 'electronics' | 'clothing' | 'other'
  brand TEXT,
  model TEXT,
  condition TEXT NOT NULL,                 -- 'new' | 'like_new' | 'good' | 'fair' | 'for_parts'
  
  -- Ürün Detayları
  year_purchased INTEGER,                  -- Satın alma yılı
  usage_frequency TEXT,                    -- 'never_used' | 'rarely' | 'occasionally' | 'frequently'
  original_price DECIMAL(10,2),            -- Orijinal fiyat
  reason_for_selling TEXT,                 -- Satış nedeni
  
  -- Fiziksel Özellikler
  dimensions TEXT,                         -- JSONB - boyutlar
  weight DECIMAL(10,2),
  color TEXT,
  material TEXT,
  
  -- Dahil Olanlar
  includes_original_box BOOLEAN DEFAULT false,
  includes_manual BOOLEAN DEFAULT false,
  includes_accessories BOOLEAN DEFAULT false,
  accessories_description TEXT,
  
  -- Satış Tercihleri
  negotiable BOOLEAN DEFAULT true,
  accept_trade BOOLEAN DEFAULT false,      -- Takas kabul
  trade_interests TEXT,                    -- Takas ilgi alanları
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Form Alanları:**
- Ürün Türü (dropdown)
- Marka (text)
- Model (text)
- Durum (dropdown)
- Satın Alma Yılı (number)
- Kullanım Sıklığı (dropdown)
- Orijinal Fiyat (number)
- Satış Nedeni (textarea)
- Boyutlar (dimensions fields)
- Ağırlık (number)
- Renk (text)
- Malzeme (text)
- Orijinal Kutu (checkbox)
- Kullanım Kılavuzu (checkbox)
- Aksesuarlar (checkbox + textarea)
- Pazarlık Yapılır (checkbox)
- Takas Kabul (checkbox)
- Takas İlgi Alanları (textarea)

---

## 🔄 İMPLEMENTASYON PLANI

### Faz 1: Veritabanı (1 hafta)
- [ ] 6 yeni tablo oluşturma (equipment, service, storage, insurance, expertise, marketplace)
- [ ] Drizzle migration dosyaları
- [ ] Schema.ts güncelleme
- [ ] İlişkiler (relations) tanımlama

### Faz 2: Backend (2 hafta)
- [ ] 6 yeni Handler sınıfı
  - EquipmentListingHandler
  - ServiceListingHandler
  - StorageListingHandler
  - InsuranceListingHandler
  - ExpertiseListingHandler
  - MarketplaceListingHandler
- [ ] ListingHandlerRegistry güncelleme
- [ ] Validation schema'ları
- [ ] Controller güncellemeleri

### Faz 3: Frontend Forms (2 hafta)
- [ ] EquipmentListingForm.tsx
- [ ] ServiceListingForm.tsx
- [ ] StorageListingForm.tsx
- [ ] InsuranceListingForm.tsx
- [ ] ExpertiseListingForm.tsx
- [ ] MarketplaceListingForm.tsx

### Faz 4: Frontend Listing Detay (1 hafta)
- [ ] Her ilan türü için detay görünümü
- [ ] Filtreleme ve arama güncellemeleri

### Faz 5: Test ve Refinement (1 hafta)
- [ ] Integration testing
- [ ] UI/UX iyileştirmeleri
- [ ] Bug fixes

**Toplam Süre:** 7 hafta

---

## 📊 KATEGORİ - İLAN TÜRÜ EŞLEŞMESİ

| Ana Kategori | İlan Türü | Tablo |
|--------------|-----------|-------|
| Deniz Araçları | `yacht` | yacht_listings |
| Deniz Aracı Ekipmanları | `equipment` | equipment_listings |
| Teknik Servisler | `service` | service_listings |
| Yedek Parça | `part` | part_listings |
| Marina ve Limanlar | `marina` | marina_listings |
| Kara Park ve Kışlama | `storage` | storage_listings |
| Transfer ve Mürettebat | `crew` | crew_listings |
| İkinci El Pazarı | `marketplace` | marketplace_listings |
| Sigorta | `insurance` | insurance_listings |
| Ekspertiz | `expertise` | expertise_listings |

---

## ✅ AVANTAJLAR

1. **Detaylı Form Alanları:** Her kategori kendi özel alanlarına sahip
2. **SEO Dostu:** Her ilan türü için özel meta bilgiler
3. **Filtreleme:** Kategori bazlı gelişmiş filtreler
4. **Scalability:** Yeni özellikler kolayca eklenebilir
5. **Data Quality:** Zorunlu alanlar ile kaliteli veri
6. **Geriye Uyumluluk:** Mevcut 4 ilan türü korunuyor

---

*Güncelleme: 2026-01-27*
*Versiyon: 2.0*
