# Yatsan Veritabanı ve ORM Seçim Raporu

## 1. Yönetici Özeti

Bu rapor, Yatsan ilan platformu için en uygun veritabanı ve ORM seçimini belirlemek amacıyla hazırlanmıştır. Proje bir ilan sitesi olup, ölçeklenebilirlik ve performans birincil önceliklerdir.

### Önerilen Kararlar

| Kategori | Seçim | Neden |
|----------|-------|-------|
| **Veritabanı** | PostgreSQL | Ölçeklenebilirlik, ACID uyumluluğu, JSON desteği, geniş ekosistem |
| **ORM** | Drizzle ORM | Performans, tip güvenliği, minimal overhead, SQL kontrolü |
| **Tasarım** | Polimorfik İlişkiler (Type-Specific Tablolar) | Ölçeklenebilirlik, tip güvenliği, bakım kolaylığı |

---

## 2. Veritabanı Seçenekleri Analizi

### 2.1 PostgreSQL

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **ACID Uyumluluğu** | Tam transaction desteği, veri bütünlüğü garantisi |
| **JSON/JSONB Desteği** | Esnek şema gerektiren durumlar için native JSON desteği |
| **Gelişmiş İndeksleme** | B-tree, Hash, GiST, GIN, SP-GiST indeks türleri |
| **Full-Text Search** | Built-in full-text search arama yetenekleri |
| **Array Türleri** | Native array desteği |
| **Partitioning** | Büyük tablolar için horizontal partitioning |
| **Replication** | Master-slave ve streaming replication |
| **MVCC** | Multi-Version Concurrency Control ile yüksek concurrency |
| **Open Source** | Aktif community ve uzun vadeli destek |
| **Cloud Desteği** | AWS RDS, Azure Database, Google Cloud SQL, Supabase, Neon |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **Kurulum Karmaşıklığı** | SQLite'a göre daha komplekt kurulum |
| **Kaynak Tüketimi** | Daha fazla RAM ve disk alanı gerektirir |
| **Yedekleme** | Backup/restore süreçleri daha karmaşık |

#### Performans Karakteristikleri

```
Okuma İşlemleri:    ████████░░ 80/100
Yazma İşlemleri:    █████████░ 90/100
Concurrent Users:   ██████████ 95/100
JSON Sorguları:     █████████░ 88/100
Full-Text Search:   █████████░ 85/100
```

### 2.2 MySQL / MariaDB

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Popülerlik** | Geniş kullanım ve community desteği |
| **Performans** | Okuma ağırlıklı iş yüklerinde hızlı |
| **Replication** | Basit master-slave replication |
| **Cloud Desteği** | AWS RDS, Azure Database, Google Cloud SQL |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **JSON Sınırlamaları** | PostgreSQL kadar gelişmiş değil |
| **Transaction** | InnoDB'de iyi ama bazı sınırlamalar var |
| **Full-Text Search** | PostgreSQL kadar gelişmiş değil |
| **Window Functions** | PostgreSQL kadar kapsamlı değil |

#### Performans Karakteristikleri

```
Okuma İşlemleri:    █████████░ 85/100
Yazma İşlemleri:    ████████░░ 78/100
Concurrent Users:   ████████░░ 80/100
JSON Sorguları:     ███████░░░ 70/100
Full-Text Search:   ███████░░░ 72/100
```

### 2.3 MongoDB

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Esnek Şema** | Her ilan türü için farklı yapı |
| **Horizontal Scaling** | Sharding ile kolay ölçeklenme |
| **Document Model** | Nested veriler için ideal |
| **Aggregation** | Gelişmiş aggregation pipeline |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **ACID Sınırlamaları** | Multi-document transactions sınırlı |
| **Veri Bütünlüğü** | Relational DB kadar güçlü değil |
| **Learning Curve** | NoSQL paradigmaya geçiş zorlu |
| **Join İşlemleri** | $lookup operatörü yavaş |
| **Disk Kullanımı** | Daha fazla disk alanı gerektirir |

#### Performans Karakteristikleri

```
Okuma İşlemleri:    █████████░ 82/100
Yazma İşlemleri:    ████████░░ 75/100
Concurrent Users:   ████████░░ 78/100
JSON Sorguları:     ██████████ 95/100
Full-Text Search:   ███████░░░ 70/100
```

### 2.4 Karşılaştırma Tablosu

| Özellik | PostgreSQL | MySQL/MariaDB | MongoDB |
|---------|------------|---------------|---------|
| ACID | ✅ Tam | ✅ İyi | ⚠️ Sınırlı |
| JSON Desteği | ✅ JSONB | ⚠️ Sınırlı | ✅ Native |
| Full-Text Search | ✅ Built-in | ⚠️ Sınırlı | ⚠️ Ek modül |
| Partitioning | ✅ Native | ⚠️ Sınırlı | ✅ Sharding |
| Replication | ✅ Streaming | ✅ Binlog | ✅ Replica Set |
| Tip Güvenliği | ✅ Güçlü | ✅ Güçlü | ❌ Zayıf |
| Transaction | ✅ Multi-row | ✅ Multi-row | ⚠️ Sınırlı |
| Cloud Hosting | ✅ Geniş | ✅ Geniş | ✅ Atlas |
| Learning Curve | ⚠️ Orta | ✅ Düşük | ⚠️ Orta |
| Community | ✅ Aktif | ✅ Çok Aktif | ✅ Aktif |

### 2.5 Veritabanı Kararı: PostgreSQL

**Neden PostgreSQL?**

1. **İlan Sitesi Doğası**: İlan sitelerinde veri bütünlüğü kritiktir. Kullanıcıların ilanları, mesajları, ödemeleri tutarlı olmalıdır.

2. **Çoklu İlan Türü**: Farklı ilan türleri (Yat, Yedek Parça, Marina, Crew) için JSONB desteği idealdir.

3. **Arama Özellikleri**: Full-text search ve gelişmiş indeksleme, ilan aramaları için kritiktir.

4. **Ölçeklenebilirlik**: Partitioning ve replication ile büyüme potansiyeli vardır.

5. **Ekosistem**: Prisma, Drizzle, TypeORM gibi tüm modern ORM'ler birinci sınıf PostgreSQL desteği sunar.

6. **Cloud Seçenekleri**: Supabase (ücretsiz tier), Neon (serverless), Railway gibi modern seçenekler mevcuttur.

---

## 3. ORM Seçenekleri Analizi

### 3.1 Prisma

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Type Safety** | Oto-generated types ile tam tip güvenliği |
| **Schema-First** | Declarative schema tanımlama |
| **Migration** | Built-in migration sistemi |
| **Studio** | GUI ile veritabanı yönetimi |
| **Client API** | Fluent, chainable API |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **Runtime Overhead** | Query builder katmanı performans kaybı |
| **SQL Kontrolü** | Karmaşık sorgular için sınırlı kontrol |
| **Bundle Size** | ~2MB bundle boyutu |
| **Cold Start** | Serverless için yavaş başlangıç |
| **Polymorphism** | Native polymorphism desteği yok |

#### Kod Örneği

```typescript
// Prisma ile
const listings = await prisma.listing.findMany({
  where: {
    listingType: 'YACHT',
    price: { gte: 100000 }
  },
  include: { user: true }
});
```

### 3.2 Drizzle ORM

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Minimal Bundle** | ~50KB bundle boyutu |
| **SQL-like API** | SQL syntax'ine yakın API |
| **Performance** | Prisma'dan 2-3x daha hızlı |
| **Type Safety** | Tam tip güvenliği |
| **SQL Kontrolü** | Raw SQL ve query builder hybrid |
| **Serverless Friendly** | Hızlı cold start |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **Migration** | Drizzle Kit ile ayrı tool |
| **Studio** | Native GUI yok |
| **Learning Curve** | SQL bilgisi gerektirir |
| **Community** | Prisma kadar büyük değil |

#### Kod Örneği

```typescript
// Drizzle ile
const listings = await db
  .select()
  .from(listings)
  .where(
    and(
      eq(listings.listingType, 'YACHT'),
      gte(listings.price, 100000)
    )
  )
  .leftJoin(users, eq(listings.userId, users.id));
```

### 3.3 TypeORM

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Decorator Based** | Class decorators ile schema tanımlama |
| **Active Record** | Active Record pattern desteği |
| **Maturity** | Olgun ve stabil |
| **Flexibility** | Query Builder ve Repository pattern |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **TypeScript** | Tam TS desteği için ek konfigürasyon |
| **Performance** | Drizzle kadar hızlı değil |
| **Bundle Size** | Orta-boy bundle |
| **Maintenance** | Son zamanlarda daha yavaş güncelleme |

### 3.4 Sequelize

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Maturity** | En eski Node.js ORM'lerinden |
| **Community** | Büyük community |
| **Documentation** | Kapsamlı dokümantasyon |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **TypeScript** | Native TS desteği yok (@types/sequelize) |
| **Callback Hell** | Promise-based API sınırlı |
| **Performance** | Modern ORM'lere göre yavaş |
| **Complexity** | Karmaşık API |

### 3.5 MikroORM

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Data Mapper** | Data Mapper pattern |
| **Unit of Work** | Unit of Work pattern |
| **Identity Map** | Identity map ile caching |
| **TypeScript** | Native TS desteği |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **Community** | Küçük community |
| **Learning Curve** | Data mapper pattern öğrenme süreci |
| **Documentation** | Sınırlı dokümantasyon |

### 3.6 ORM Karşılaştırma Tablosu

| Özellik | Prisma | Drizzle | TypeORM | Sequelize | MikroORM |
|---------|--------|---------|---------|-----------|----------|
| Type Safety | ✅ Tam | ✅ Tam | ⚠️ İyi | ❌ Zayıf | ✅ Tam |
| Performance | ⚠️ Orta | ✅ Hızlı | ⚠️ Orta | ❌ Yavaş | ⚠️ Orta |
| Bundle Size | ❌ Büyük | ✅ Küçük | ⚠️ Orta | ⚠️ Orta | ⚠️ Orta |
| SQL Kontrol | ⚠️ Sınırlı | ✅ Tam | ✅ İyi | ✅ İyi | ✅ İyi |
| Migration | ✅ Built-in | ✅ Drizzle Kit | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| Serverless | ❌ Yavaş | ✅ Hızlı | ⚠️ Orta | ❌ Yavaş | ⚠️ Orta |
| Learning Curve | ✅ Düşük | ⚠️ Orta | ⚠️ Orta | ⚠️ Orta | ❌ Yüksek |
| Community | ✅ Büyük | ⚠️ Orta | ✅ Büyük | ✅ Büyük | ❌ Küçük |
| TS Support | ✅ Native | ✅ Native | ✅ Decorator | ❌ Types | ✅ Native |

### 3.7 ORM Kararı: Drizzle ORM

**Neden Drizzle?**

1. **Performans**: İlan sitesi için hız kritiktir. Drizzle, Prisma'dan 2-3x daha hızlıdır.

2. **SQL Kontrolü**: Karmaşık arama sorguları için tam SQL kontrolü gerekir.

3. **Serverless Ready**: Gelecekte serverless deployment için hazırlıklı olmak önemlidir.

4. **Minimal Bundle**: Frontend bundle boyutini etkilemez.

5. **PostgreSQL Entegrasyonu**: PostgreSQL özelliklerini (JSONB, array, full-text) tam destekler.

6. **Type Safety**: TypeScript ile tam tip güvenliği.

---

## 4. Tasarım Stratejisi Analizi

### 4.1 Yaklaşım A: Tek Tablo + Discriminator

```prisma
model Listing {
  id          String   @id
  listingType String   // 'YACHT', 'PART', 'MARINA', 'CREW'
  title       String
  
  // Yat alanları
  yachtType   String?
  length      Float?
  
  // Parça alanları
  oemCode     String?
  
  // Marina alanları
  maxLength   Float?
  
  // Crew alanları
  position    String?
  experience  Int?
}
```

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Basitlik** | Tek tablo, basit sorgular |
| **Migration** | Kolay schema değişikliği |
| **Join Yok** | JOIN gerektirmez |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **NULL Fazlası** | Her satırda birçok NULL değer |
| **Validasyon** | Uygulama katmanında yapılmalı |
| **Büyüme** | Yeni tür eklendikçe tablo büyür |
| **İndeks Etkisi** | NULL değerler indeks performansını etkiler |

### 4.2 Yaklaşım B: Polimorfik İlişkiler (Type-Specific Tablolar)

```prisma
model Listing {
  id          String   @id
  listingType String
  title       String
  price       Float
  userId      String
  
  yacht       YachtListing?
  part        PartListing?
  marina      MarinaListing?
  crew        CrewListing?
}

model YachtListing {
  listingId   String   @id
  yachtType   String
  length      Float
  beam        Float
  
  listing     Listing  @relation(fields: [listingId], references: [id])
}

model CrewListing {
  listingId   String   @id
  position    String
  experience  Int
  certifications String // JSON
  
  listing     Listing  @relation(fields: [listingId], references: [id])
}
```

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Tip Güvenliği** | Her tür için kendi şeması |
| **Validasyon** | Veritabanı seviyesinde kısıtlamalar |
| **NULL Az** | Sadece ilgili alanlar var |
| **Ölçeklenebilir** | Yeni tür eklemek kolay |
| **Bakım** | Her tür bağımsız gelişebilir |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **Join Gerekli** | Detaylar için JOIN gerekli |
| **Migration** | Yeni tür için yeni tablo |
| **Query Karmaşıklığı** | Polimorfik sorgular daha karmaşık |

### 4.3 Yaklaşım C: NoSQL Embedded Documents

```javascript
// MongoDB örneği
{
  _id: ObjectId,
  listingType: "YACHT",
  title: "Luxury Yacht",
  price: 500000,
  yacht: {
    type: "motor_yacht",
    length: 20,
    beam: 5,
    equipment: ["radar", "gps"]
  }
}
```

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Esneklik** | Her tür için farklı yapı |
| **Single Read** | Tek sorguda tüm veri |
| **Schema Evolution** | Kolay schema değişikliği |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **Veri Bütünlüğü** | ACID sınırlamaları |
| **Join Zor** | İlişkili veriler için $lookup |
| **Disk Kullanımı** | Redundant veri depolama |

### 4.4 Yaklaşım D: Hybrid (JSONB + Relational)

```prisma
model Listing {
  id          String   @id
  listingType String
  title       String
  price       Float
  userId      String
  
  // Ortak alanlar
  location    String
  status      String
  
  // Tür spesifik veri (JSONB)
  metadata    Json
  
  // Tür spesifik ilişkiler
  yacht       YachtListing?
  crew        CrewListing?
}
```

#### Avantajları

| Özellik | Açıklama |
|---------|----------|
| **Esneklik** | JSONB ile dinamik alanlar |
| **İlişkiler** | Kritik veriler için relational |
| **Performans** | JSONB indeksleme desteği |

#### Dezavantajları

| Özellik | Açıklama |
|---------|----------|
| **Karmaşıklık** | Hibrit yapı yönetimi zor |
| **Validasyon** | JSONB için uygulama katmanı |

### 4.5 Strateji Karşılaştırma

| Kriter | Tek Tablo | Polimorfik | NoSQL | Hybrid |
|--------|-----------|------------|-------|--------|
| Basitlik | ✅ En basit | ⚠️ Orta | ✅ Basit | ❌ Karmaşık |
| Performans | ✅ Hızlı | ⚠️ Orta | ✅ Hızlı | ⚠️ Orta |
| Ölçeklenebilirlik | ❌ Zor | ✅ İyi | ✅ İyi | ✅ İyi |
| Tip Güvenliği | ❌ Zayıf | ✅ Güçlü | ❌ Zayıf | ⚠️ Orta |
| Validasyon | ❌ Uygulama | ✅ DB | ❌ Uygulama | ⚠️ Karma |
| Bakım | ❌ Zorlaşır | ✅ Kolay | ✅ Kolay | ⚠️ Orta |

### 4.6 Tasarım Kararı: Polimorfik İlişkiler

**Neden Polimorfik İlişkiler?**

1. **Uzun Vadeli Ölçeklenebilirlik**: Yeni ilan türleri eklemek kolay (Crew, Charter, Service, vb.)

2. **Tip Güvenliği**: Her tür için kendi şeması, validasyon veritabanı seviyesinde

3. **Performans**: PostgreSQL'in JOIN performansı yeterince hızlı

4. **Veri Bütünlüğü**: Foreign key constraints ile referans bütünlüğü

5. **Arama Optimizasyonu**: Her tür için özel indeksler

---

## 5. Crew (Mürettebat) İlanı Veri Yapısı

### 5.1 CrewListing Tablosu

```prisma
model CrewListing {
  listingId       String   @id
  
  // Pozisyon Bilgileri
  position        String   // captain, chef, deckhand, engineer, stewardess, mate
  positionType    String   // permanent, seasonal, temporary
  
  // Deneyim
  experience      Int      // yıl
  totalSeaTime    Int?     // toplam deniz günü
  
  // Sertifikalar (JSONB)
  certifications  Json     @default("[]")
  // ["STCW", "Yachtmaster", "CEVNI", "GMDSS", "ENG1"]
  
  // Uygunluk
  availability    String   // immediate, specific_date, notice_period
  availableFrom   DateTime?
  noticePeriod    Int?     // gün
  
  // Maaş
  salary          Float?
  salaryCurrency  String?  @default("USD")
  salaryPeriod    String?  // monthly, yearly, per_trip
  
  // Kişisel Bilgiler
  nationality     String?
  languages       Json     @default("[]")
  // [{"code": "tr", "level": "native"}, {"code": "en", "level": "fluent"}]
  
  // Yaş ve Fiziksel
  dateOfBirth     DateTime?
  gender          String?  // male, female, other
  height          Int?     // cm
  weight          Int?     // kg
  
  // Sağlık
  medicalFit      Boolean  @default(false)
  medicalExpiry   DateTime?
  
  // Seyahat
  passport        String?
  passportExpiry  DateTime?
  visa            Json?    @default("{}")
  // {"usa": true, "schengen": true, "uk": true}
  
  // Tercihler
  preferredYachtType String? // motor, sailing, catamaran, all
  preferredSize     Json?    @default("{}")
  // {"min": 20, "max": 50}
  preferredLocation String?  // mediterranean, caribbean, worldwide
  
  // Beceriler (JSONB)
  skills          Json     @default("{}")
  // {
  //   "technical": ["engine_repair", "electrical"],
  //   "culinary": ["french", "italian", "vegan"],
  //   "service": ["wine_service", "table_manners"]
  // }
  
  // Referanslar
  hasReferences   Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  listing         Listing  @relation(fields: [listingId], references: [id])
  
  @@index([position])
  @@index([availability])
  @@index([nationality])
  @@index([salary, salaryPeriod])
}
```

### 5.2 JSONB Alan Yapıları

#### Certifications
```json
[
  {
    "name": "STCW Basic Training",
    "issuer": "IMO",
    "expiry": "2026-06-15"
  },
  {
    "name": "Yachtmaster Offshore",
    "issuer": "RYA",
    "expiry": "2025-12-01"
  }
]
```

#### Languages
```json
[
  {
    "code": "tr",
    "name": "Türkçe",
    "level": "native"
  },
  {
    "code": "en",
    "name": "English",
    "level": "fluent"
  },
  {
    "code": "de",
    "name": "Deutsch",
    "level": "intermediate"
  }
]
```

#### Skills
```json
{
  "technical": [
    "diesel_mechanic",
    "electrical_systems",
    "plumbing",
    "fiberglass_repair"
  ],
  "culinary": [
    "french_cuisine",
    "italian_cuisine",
    "sushi",
    "vegan_cooking",
    "food_presentation"
  ],
  "service": [
    "wine_service",
    "cocktail_making",
    "table_service",
    "housekeeping"
  ],
  "navigation": [
    "coastal_navigation",
    "celestial_navigation",
    "radar_operation",
    "chart_work"
  ]
}
```

#### Visa
```json
{
  "usa": {
    "has": true,
    "type": "B1/B2",
    "expiry": "2027-05-20"
  },
  "schengen": {
    "has": true,
    "type": "C",
    "expiry": "2026-08-15"
  },
  "uk": {
    "has": true,
    "type": "Standard Visitor",
    "expiry": "2028-01-10"
  }
}
```

### 5.3 Position Enum Tanımları

```typescript
enum CrewPosition {
  CAPTAIN = "captain",
  FIRST_MATE = "first_mate",
  CHEF = "chef",
  SOUS_CHEF = "sous_chef",
  CHIEF_STEW = "chief_stew",
  STEWARDESS = "stewardess",
  DECKHAND = "deckhand",
  BOSUN = "bosun",
  ENGINEER = "engineer",
  CHIEF_ENGINEER = "chief_engineer"
}

enum PositionType {
  PERMANENT = "permanent",
  SEASONAL = "seasonal",
  TEMPORARY = "temporary",
  DAY_WORK = "day_work"
}

enum Availability {
  IMMEDIATE = "immediate",
  SPECIFIC_DATE = "specific_date",
  NOTICE_PERIOD = "notice_period"
}

enum SalaryPeriod {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  PER_TRIP = "per_trip",
  PER_DAY = "per_day"
}
```

---

## 6. Önerilen Veritabanı Tasarımı

### 6.1 Core Tablolar

```prisma
// User Tablosu (Mevcut yapının korunması)
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  phone             String    @unique
  firstName         String
  lastName          String
  phoneVerified     Boolean   @default(false)
  password          String
  userType          String    // INDIVIDUAL, CORPORATE
  kvkkApproved      Boolean   @default(false)
  status            String    @default("INACTIVE")
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  resetPasswordToken String?  @unique
  resetPasswordExpires DateTime?
  lastPasswordReset  DateTime?
  emailVerificationExpires DateTime?

  listings          Listing[]
  sentMessages      Message[] @relation("SentMessages")
  receivedMessages  Message[] @relation("ReceivedMessages")
  
  @@index([email])
  @@index([phone])
  @@index([status])
}

// Listing Base Tablosu
model Listing {
  id              String   @id @default(cuid())
  listingType     String   // YACHT, PART, MARINA, CREW
  
  // Ortak Alanlar
  title           String
  description     String?
  price           Float
  currency        String   @default("TRY")
  status          String   @default("PENDING")
  rejectionReason String?
  userId          String
  locationCity    String?
  locationDistrict String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // İlişkiler
  user            User           @relation(fields: [userId], references: [id])
  images          ListingImage[]
  messages        Message[]
  
  // Type-specific ilişkiler (opsiyonel)
  yacht           YachtListing?
  part            PartListing?
  marina          MarinaListing?
  crew            CrewListing?
  
  @@index([listingType])
  @@index([status])
  @@index([userId])
  @@index([locationCity])
  @@index([price, listingType])
  @@index([createdAt])
}

// ListingImage (Mevcut yapının korunması)
model ListingImage {
  id          String   @id @default(cuid())
  url         String
  orderIndex  Int
  listingId   String
  createdAt   DateTime @default(now())
  
  listing     Listing  @relation(fields: [listingId], references: [id])
  
  @@index([listingId])
}

// Message (Mevcut yapının korunması)
model Message {
  id          String   @id @default(cuid())
  content     String
  senderId    String
  receiverId  String
  listingId   String?
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  sender      User     @relation("SentMessages", fields: [senderId], references: [id])
  receiver    User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  listing     Listing? @relation(fields: [listingId], references: [id])
  
  @@index([senderId, receiverId])
  @@index([listingId])
  @@index([read])
}
```

### 6.2 Type-Specific Tablolar

```prisma
// YachtListing
model YachtListing {
  listingId       String   @id
  
  // Temel Bilgiler
  yachtType       String   // motor_yat, yelkenli, katamaran, gulet, surat_teknesi
  year            Int
  length          Float    // metre
  beam            Float    // metre
  draft           Float?   // metre
  
  // Motor
  engineBrand     String?
  engineHours     Int?
  engineHP        Int?
  fuelType        String?  // dizel, benzin, elektrik, hibrit
  cruisingSpeed   Int?     // knot
  maxSpeed        Int?     // knot
  
  // Konaklama
  cabinCount      Int?
  bedCount        Int?
  bathroomCount   Int?
  
  // Ekipman (JSONB)
  equipment       Json     @default("{}")
  // {navigation: [], comfort: [], safety: [], entertainment: []}
  
  // Durum
  condition       String   // new, excellent, good, fair
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  listing         Listing  @relation(fields: [listingId], references: [id])
  
  @@index([yachtType])
  @@index([year])
  @@index([length])
  @@index([price])
}

// PartListing
model PartListing {
  listingId       String   @id
  
  // Ürün Bilgileri
  condition       String   // new, second_hand, refurbished
  brand           String
  oemCode         String?
  partNumber      String?
  
  // Kategori
  category        String   // engine, electrical, plumbing, navigation, safety
  
  // Uyumluluk (JSONB)
  compatibility   Json     @default("[]")
  // [{make: "Volvo Penta", model: "D4-300", years: "2010-2018"}]
  
  // Konum
  location        String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  listing         Listing  @relation(fields: [listingId], references: [id])
  
  @@index([brand])
  @@index([category])
  @@index([condition])
}

// MarinaListing
model MarinaListing {
  listingId       String   @id
  
  // Kapasite
  maxLength       Float    // metre
  maxBeam         Float    // metre
  maxDraft        Float?   // metre
  
  // Fiyatlandırma
  priceType       String   // daily, monthly, seasonal, yearly
  
  // Hizmetler (JSONB)
  services        Json     @default("[]")
  // ["electricity", "water", "wifi", "security", "shower", "restaurant"]
  
  // Uygunluk
  availabilityStart DateTime?
  availabilityEnd   DateTime?
  
  // Marina Referansı
  marinaId        String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  listing         Listing  @relation(fields: [listingId], references: [id])
  
  @@index([maxLength])
  @@index([priceType])
  @@index([availabilityStart])
}

// CrewListing (Bölüm 5'te detaylı açıklama)
model CrewListing {
  listingId       String   @id
  
  position        String
  positionType    String
  experience      Int
  totalSeaTime    Int?
  certifications  Json     @default("[]")
  availability    String
  availableFrom   DateTime?
  noticePeriod    Int?
  salary          Float?
  salaryCurrency  String?  @default("USD")
  salaryPeriod    String?
  nationality     String?
  languages       Json     @default("[]")
  dateOfBirth     DateTime?
  gender          String?
  medicalFit      Boolean  @default(false)
  medicalExpiry   DateTime?
  passport        String?
  passportExpiry  DateTime?
  visa            Json?    @default("{}")
  preferredYachtType String?
  preferredSize   Json?
  preferredLocation String?
  skills          Json     @default("{}")
  hasReferences   Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  listing         Listing  @relation(fields: [listingId], references: [id])
  
  @@index([position])
  @@index([availability])
  @@index([nationality])
}
```

### 6.3 Marina Tablosu (Referans)

```prisma
model Marina {
  id          String   @id @default(cuid())
  name        String
  city        String
  district    String
  address     String?
  phone       String?
  email       String?
  website     String?
  capacity    Int?
  services    Json     @default("[]")
  latitude    Float?
  longitude   Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  listings    MarinaListing[]
  
  @@index([city])
  @@index([district])
}
```

---

## 7. İlişki Diyagramı

```mermaid
erDiagram
    User ||--o{ Listing : creates
    User ||--o{ Message : sends
    User ||--o{ Message : receives
    
    Listing ||--o| YachtListing : has
    Listing ||--o| PartListing : has
    Listing ||--o| MarinaListing : has
    Listing ||--o| CrewListing : has
    Listing ||--o{ ListingImage : has
    Listing ||--o{ Message : related_to
    
    Marina ||--o{ MarinaListing : hosts
    
    User {
        string id PK
        string email UK
        string phone UK
        string userType
        string status
    }
    
    Listing {
        string id PK
        string listingType
        string title
        float price
        string status
        string userId FK
    }
    
    YachtListing {
        string listingId PK
        string yachtType
        int year
        float length
        float beam
    }
    
    PartListing {
        string listingId PK
        string condition
        string brand
        string category
    }
    
    MarinaListing {
        string listingId PK
        float maxLength
        float maxBeam
        string priceType
    }
    
    CrewListing {
        string listingId PK
        string position
        int experience
        json certifications
        string availability
    }
    
    ListingImage {
        string id PK
        string url
        int orderIndex
        string listingId FK
    }
    
    Message {
        string id PK
        string content
        string senderId FK
        string receiverId FK
        string listingId FK
    }
    
    Marina {
        string id PK
        string name
        string city
        string district
    }
```

---

## 8. Migration Planı

### 8.1 SQLite'dan PostgreSQL'e Geçiş

#### Adım 1: PostgreSQL Kurulumu

```bash
# Docker ile PostgreSQL (önerilen)
docker run --name yatsan-postgres \
  -e POSTGRES_USER=yatsan \
  -e POSTGRES_PASSWORD=yatsan_pass \
  -e POSTGRES_DB=yatsan_db \
  -p 5432:5432 \
  -v yatsan_pgdata:/var/lib/postgresql/data \
  postgres:16-alpine

# Veya Supabase/Neon kullanın (cloud)
```

#### Adım 2: Drizzle ORM Kurulumu

```bash
# Backend dizininde
cd backend
npm uninstall @prisma/client prisma
npm install drizzle-orm postgres
npm install -D drizzle-kit

# package.json scripts güncelleme
"scripts": {
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

#### Adım 3: Drizzle Schema Oluşturma

```typescript
// backend/src/db/schema.ts
import { pgTable, text, integer, float, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => cuid()),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  // ... diğer alanlar
});

export const listings = pgTable('listings', {
  id: text('id').primaryKey().$defaultFn(() => cuid()),
  listingType: text('listing_type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  price: float('price').notNull(),
  currency: text('currency').default('TRY'),
  status: text('status').default('PENDING'),
  userId: text('user_id').notNull().references(() => users.id),
  // ... diğer alanlar
});

export const yachtListings = pgTable('yacht_listings', {
  listingId: text('listing_id').primaryKey().references(() => listings.id),
  yachtType: text('yacht_type').notNull(),
  year: integer('year').notNull(),
  length: float('length').notNull(),
  beam: float('beam').notNull(),
  equipment: jsonb('equipment').$type<{navigation: string[], comfort: string[], safety: string[]}>(),
  // ... diğer alanlar
});

export const crewListings = pgTable('crew_listings', {
  listingId: text('listing_id').primaryKey().references(() => listings.id),
  position: text('position').notNull(),
  positionType: text('position_type').notNull(),
  experience: integer('experience').notNull(),
  certifications: jsonb('certifications').$type<Array<{name: string, issuer: string, expiry: string}>>(),
  availability: text('availability').notNull(),
  salary: float('salary'),
  salaryCurrency: text('salary_currency').default('USD'),
  salaryPeriod: text('salary_period'),
  // ... diğer alanlar
});
```

#### Adım 4: Veri Taşıma Scripti

```typescript
// backend/src/scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const prisma = new PrismaClient();
const client = postgres('postgres://yatsan:yatsan_pass@localhost:5432/yatsan_db');
const db = drizzle(client);

async function migrate() {
  // Kullanıcıları taşı
  const users = await prisma.user.findMany();
  for (const user of users) {
    await db.insert(usersTable).values({
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      // ... diğer alanlar
    });
  }

  // İlanları taşı
  const listings = await prisma.listing.findMany();
  for (const listing of listings) {
    // Base listing oluştur
    await db.insert(listingsTable).values({
      id: listing.id,
      listingType: listing.category, // category -> listingType
      title: listing.title,
      price: listing.price,
      // ... diğer alanlar
    });

    // Type-specific tabloya ekle
    if (listing.category === 'YACHT') {
      await db.insert(yachtListingsTable).values({
        listingId: listing.id,
        yachtType: listing.yachtType || 'motor_yat',
        year: listing.year || new Date().getFullYear(),
        length: listing.length || 0,
        beam: listing.beam || 0,
        // ... diğer alanlar
      });
    }
  }

  console.log('Migration completed!');
}

migrate().catch(console.error);
```

### 8.2 Sıralı Geçiş Adımları

| Adım | İşlem | Süre | Risk |
|------|-------|------|------|
| 1 | PostgreSQL kurulumu | 15 dk | Düşük |
| 2 | Drizzle kurulumu | 10 dk | Düşük |
| 3 | Schema oluşturma | 30 dk | Orta |
| 4 | Veri taşıma scripti | 1 saat | Orta |
| 5 | Test ve doğrulama | 2 saat | Orta |
| 6 | Backend güncellemesi | 2 saat | Yüksek |
| 7 | Frontend güncellemesi | 1 saat | Orta |
| 8 | Production deploy | 30 dk | Yüksek |

### 8.3 Rollback Planı

```bash
# Eğer sorun olursa
# 1. PostgreSQL'i durdur
docker stop yatsan-postgres

# 2. SQLite'a geri dön
# .env dosyasında DATABASE_URL değiştir
DATABASE_URL="file:./dev.db"

# 3. Prisma'yı tekrar kullan
npm install @prisma/client prisma
```

---

## 9. Performans Optimizasyonu

### 9.1 İndeks Stratejisi

```sql
-- Composite indeksler (sık kullanılan sorgular için)
CREATE INDEX idx_listings_type_status ON listings(listing_type, status);
CREATE INDEX idx_listings_type_price ON listings(listing_type, price);
CREATE INDEX idx_listings_location_type ON listings(location_city, listing_type);

-- JSONB indeksler (GIN)
CREATE INDEX idx_yacht_equipment ON yacht_listings USING GIN (equipment);
CREATE INDEX idx_crew_certifications ON crew_listings USING GIN (certifications);
CREATE INDEX idx_crew_skills ON crew_listings USING GIN (skills);

-- Full-text search
CREATE INDEX idx_listings_fts ON listings USING GIN (to_tsvector('turkish', title || ' ' || coalesce(description, '')));
```

### 9.2 Query Optimizasyonu

```typescript
// Drizzle ile optimize edilmiş sorgu
const getListings = async (filters: ListingFilters) => {
  return db
    .select({
      listing: listings,
      user: users,
      yacht: yachtListings,
    })
    .from(listings)
    .where(
      and(
        eq(listings.listingType, filters.type),
        eq(listings.status, 'APPROVED'),
        filters.minPrice ? gte(listings.price, filters.minPrice) : undefined,
        filters.maxPrice ? lte(listings.price, filters.maxPrice) : undefined,
        filters.location ? ilike(listings.locationCity, `%${filters.location}%`) : undefined
      )
    )
    .leftJoin(users, eq(listings.userId, users.id))
    .leftJoin(yachtListings, eq(listings.id, yachtListings.listingId))
    .orderBy(desc(listings.createdAt))
    .limit(filters.limit || 20);
};
```

### 9.3 Connection Pooling

```typescript
// backend/src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!, {
  max: 10, // Maksimum bağlantı sayısı
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client);
```

---

## 10. Gelecek Ölçeklenebilirlik

### 10.1 Yeni İlan Türleri Eklemek

```typescript
// Örnek: CharterListing ekleme
export const charterListings = pgTable('charter_listings', {
  listingId: text('listing_id').primaryKey().references(() => listings.id),
  charterType: text('charter_type').notNull(), // bareboat, crewed, skippered
  includes: jsonb('includes').$type<string[]>(),
  minDays: integer('min_days').default(1),
  maxDays: integer('max_days'),
  // ... diğer alanlar
});
```

### 10.2 Partitioning (Büyük Veri)

```sql
-- Listing tablosunu yıla göre partition
CREATE TABLE listings_2024 PARTITION OF listings
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE listings_2025 PARTITION OF listings
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 10.3 Read Replicas

```typescript
// Okuma işlemleri için replica
const readClient = postgres(process.env.DATABASE_READ_URL!);
const readDb = drizzle(readClient);

// Yazma işlemleri için primary
const writeClient = postgres(process.env.DATABASE_URL!);
const writeDb = drizzle(writeClient);
```

---

## 11. Özet ve Sonraki Adımlar

### 11.1 Karar Özeti

| Kategori | Karar | Neden |
|----------|-------|-------|
| Veritabanı | PostgreSQL | ACID, JSONB, Full-Text, Ölçeklenebilirlik |
| ORM | Drizzle ORM | Performans, SQL Kontrolü, Serverless Ready |
| Tasarım | Polimorfik İlişkiler | Ölçeklenebilirlik, Tip Güvenliği |

### 11.2 Implementasyon Sırası

```
1. PostgreSQL kurulumu
2. Drizzle ORM entegrasyonu
3. Schema tanımları
4. Migration scripti
5. Backend controller güncellemeleri
6. Frontend API güncellemeleri
7. Test ve doğrulama
8. Production deploy
```

### 11.3 Etkilenecek Dosyalar

```
backend/
├── package.json (güncellenecek)
├── prisma/
│   └── schema.prisma (kaldırılacak/değiştirilecek)
├── src/
│   ├── db/ (yeni klasör)
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── lib/
│   │   └── prisma.ts (kaldırılacak/değiştirilecek)
│   └── controllers/
│       └── listing.controller.ts (güncellenecek)

frontend/
└── src/
    └── lib/
        └── api.ts (küçük değişiklikler)
```

### 11.4 Riskler ve Azaltma

| Risk | Olasılık | Etki | Azaltma |
|------|----------|------|---------|
| Veri kaybı | Düşük | Yüksek | Yedekleme, test migration |
| Performans düşüşü | Orta | Orta | İndeks optimizasyonu |
| Learning curve | Orta | Düşük | Dokümantasyon, eğitim |
| Deploy sorunu | Düşük | Orta | Staging testi |

---

## 12. Alternatif: Prisma + PostgreSQL

Eğer Drizzle yerine Prisma ile devam etmek istenirse:

### Avantajları

- Mevcut Prisma deneyimi
- Prisma Studio ile kolay yönetim
- Daha büyük community

### Dezavantajları

- Daha yavaş performans
- Daha büyük bundle size
- Polimorfik ilişkiler için workaround gerekli

### Prisma Schema (PostgreSQL)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ... aynı modeller, PostgreSQL özellikleri ile
```

---

## Dokümantasyon Sürümü

- **Sürüm**: 2.0
- **Tarih**: 2025-01-11
- **Yazar**: Yatsan Tech Team
- **Durum**: Onay Bekliyor
