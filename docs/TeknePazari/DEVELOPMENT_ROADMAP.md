# TeknePazari - Development Roadmap

## 📋 Proje Özeti

**Proje Adı:** TeknePazari
**Proje Türü:** Multi-Platform Marketplace (Web + Mobile)
**Kalite Skoru:** 100/100 (A+)
**Konum:** [`02_PROJECT_SPECS/TeknePazari/`](.)
**Model:** Solo Developer + Claude AI

---

## 🎯 Geliştirme Modeli: Solo Developer + Claude AI

### Maliyet Yapısı

| Kategori | Maliyet |
|----------|---------|
| Maaş | YOKSUN |
| Ofis | YOKSUN |
| Ekipman | YOKSUN |
| Altyapı (18 ay) | ₺105K |
| Hizmetler (18 ay) | ₺50K |
| **TOPLAM** | **₺155K** |

### Gelir Potansiyeli

| Phase | Gelir |
|-------|-------|
| MVP (Ay 1-6) | ₺160K |
| Growth (Ay 7-12) | ₺420K |
| Scale (Ay 13-24) | ₺3M |
| **TOPLAM** | **₺3.58M** |

---

## 🚀 13 Adımda Production'a Hazırlık

### Phase 1: Foundation (Adım 1-4)

#### Adım 1: Repository Kurulumu ve İlk Commit
```bash
# Repository oluştur
git init
git branch -M main

# .gitignore oluştur
cat > .gitignore << 'EOF'
node_modules/
.next/
.env.local
.env*.local
dist/
build/
*.log
.DS_Store
EOF

# İlk commit
git add .
git commit -m "Initial commit: TeknePazari project structure"
```

**Süre:** 1 gün
**Çıktı:** Git repository hazır

---

#### Adım 2: Web Platformu Kurulumu (Next.js 14)
```bash
# Next.js projesi oluştur
npx create-next-app@latest teknepazari-web --typescript --tailwind --app --src-dir --import-alias "@/*"

# Bağımlılıkları yükle
cd teknepazari-web
npm install @prisma/client prisma
npm install next-auth @auth/prisma-adapter
npm install @meilisearch/instant-meilisearch react-instantsearch
npm install ioredis
npm install iyzico
npm install zod react-hook-form @hookform/resolvers
npm install @tanstack/react-query
npm install lucide-react
npm install -D prisma
```

**Süre:** 2 gün
**Çıktı:** Next.js projesi hazır

---

#### Adım 3: Mobile App Kurulumu (React Native + Expo)
```bash
# Expo projesi oluştur
npx create-expo-app@latest teknepazari-mobile --template blank-typescript

# Bağımlılıkları yükle
cd teknepazari-mobile
npm install @react-navigation/native @react-navigation/stack
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
npm install expo-image-picker
npm install expo-location
npm install @tanstack/react-query
npm install zustand
```

**Süre:** 2 gün
**Çıktı:** React Native projesi hazır

---

#### Adım 4: Database Schema ve Prisma Kurulumu
```bash
# Prisma init
npx prisma init

# Schema oluştur (architecture.md'deki schema kullan)
# Migration
npx prisma migrate dev --name init
```

**Süre:** 3 gün
**Çıktı:** Database schema hazır

---

### Phase 2: Core Features (Adım 5-8)

#### Adım 5: Authentication System
- Email/SMS ile kayıt
- JWT token yönetimi
- Role-based access control (USER, BROKER, ADMIN)
- OTP sistemi

**Süre:** 5 gün
**Dosyalar:** [`shared_api.md`](02_PLATFORMS/shared_api.md)

---

#### Adım 6: İlan Sistemi (Listing)
- İlan oluşturma (form validasyonu)
- Görsel yükleme (Cloudinary)
- Kategori seçimi (10 ana kategori)
- Filtreleme ve arama (Meilisearch)

**Süre:** 10 gün
**Dosyalar:** [`prd.md`](03_PRODUCT/prd.md), [`categories.md`](03_PRODUCT/categories.md)

---

#### Adım 7: Mesajlaşma Sistemi
- Real-time mesajlaşma (WebSocket)
- Konuşma listesi
- Okunma durumları
- Bildirimler

**Süre:** 7 gün
**Dosyalar:** [`api_spec.md`](05_TECHNICAL/api_spec.md)

---

#### Adım 8: Ödeme Sistemi (iyzico)
- Paket seçimi (Temel, Standart, Premium)
- Ödeme formu
- Başarı/hata sayfaları
- Transaction history

**Süre:** 5 gün
**Dosyalar:** [`web_features.md`](03_PRODUCT/web_features.md)

---

### Phase 3: Advanced Features (Adım 9-12)

#### Adım 9: Admin Panel
- Dashboard (analytics)
- Kullanıcı yönetimi
- İlan onaylama
- Raporlama

**Süre:** 7 gün
**Dosyalar:** [`web_wireframes.md`](04_DESIGN/web_wireframes.md)

---

#### Adım 10: Broker Panel
- İlan yönetimi
- İstatistikler
- Premium özellikler

**Süre:** 5 gün
**Dosyalar:** [`web_wireframes.md`](04_DESIGN/web_wireframes.md)

---

#### Adım 11: Mobile App Core Features
- İlan listesi ve detay
- Arama ve filtreleme
- Mesajlaşma
- Profil yönetimi

**Süre:** 15 gün
**Dosyalar:** [`mobile_features.md`](03_PRODUCT/mobile_features.md)

---

#### Adım 12: Testing ve QA
- Unit tests (Jest)
- E2E tests (Playwright)
- Performance testing
- Security audit

**Süre:** 10 gün
**Dosyalar:** [`architecture.md`](05_TECHNICAL/architecture.md)

---

### Phase 4: Deployment (Adım 13)

#### Adım 13: Production Deployment
- Vercel'e web deploy
- App Store ve Google Play submit
- Domain ve SSL kurulumu
- Monitoring kurulumu (Sentry, Analytics)

**Süre:** 5 gün
**Dosyalar:** [`web_stack.md`](05_TECHNICAL/web_stack.md), [`mobile_stack.md`](05_TECHNICAL/mobile_stack.md)

---

## 📊 Timeline Özeti

| Phase | Adımlar | Süre | Toplam |
|-------|---------|------|--------|
| Foundation | 1-4 | 8 gün | 8 gün |
| Core Features | 5-8 | 27 gün | 35 gün |
| Advanced Features | 9-12 | 37 gün | 72 gün |
| Deployment | 13 | 5 gün | 77 gün |

**Toplam Süre:** ~77 gün (~2.5 ay) - MVP için
**Tam Süre:** 18 ay (Scale dahil)

---

## 🎯 Başarı Kriterleri

### MVP Go-Live Kriterleri

| Kriter | Hedef | Durum |
|--------|-------|-------|
| Kullanıcı kaydı | 100+ | ⏳ |
| İlan sayısı | 50+ | ⏳ |
| Kategori覆盖率 | 10/10 | ⏳ |
| Mobile app | App Store + Play Store | ⏳ |
| Payment | iyzico entegrasyonu | ⏳ |

### Phase 1 Kriterleri (Ay 1-6)

| Metrik | Hedef |
|--------|-------|
| Aktif kullanıcı | 1.000+ |
| İlan sayısı | 500+ |
| Broker sayısı | 20+ |
| Revenue | ₺160K |

---

## 📚 İlgili Dosyalar

### Strategy
- [`vision.md`](01_STRATEGY/vision.md) - Vizyon ve hedefler
- [`business_model.md`](01_STRATEGY/business_model.md) - İş modeli
- [`risks.md`](01_STRATEGY/risks.md) - Risk analizi

### Product
- [`prd.md`](03_PRODUCT/prd.md) - Product Requirements Document
- [`categories.md`](03_PRODUCT/categories.md) - Kategori yapısı
- [`user_stories.md`](03_PRODUCT/user_stories.md) - User stories
- [`web_features.md`](03_PRODUCT/web_features.md) - Web özellikleri
- [`mobile_features.md`](03_PRODUCT/mobile_features.md) - Mobil özellikleri

### Design
- [`design_system.md`](04_DESIGN/design_system.md) - Tasarım sistemi
- [`web_wireframes.md`](04_DESIGN/web_wireframes.md) - Web wireframe'leri
- [`mobile_wireframes.md`](04_DESIGN/mobile_wireframes.md) - Mobil wireframe'leri

### Technical
- [`architecture.md`](05_TECHNICAL/architecture.md) - Sistem mimarisi
- [`web_stack.md`](05_TECHNICAL/web_stack.md) - Web teknoloji yığını
- [`mobile_stack.md`](05_TECHNICAL/mobile_stack.md) - Mobil teknoloji yığını
- [`api_spec.md`](05_TECHNICAL/api_spec.md) - API spesifikasyonu

### Planning
- [`roadmap.md`](06_PLANNING/roadmap.md) - Geliştirme yol haritası
- [`metrics.md`](06_PLANNING/metrics.md) - Metrikler ve KPI'lar
- [`budget.md`](06_PLANNING/budget.md) - Bütçe ve finansal plan

---

## 🚀 Başla

Proje geliştirmeye başlamak için:

1. **Repository oluştur:** Adım 1'i takip et
2. **Web platformu kur:** Adım 2'yi takip et
3. **Database kur:** Adım 4'ü takip et
4. **İlk feature:** Authentication (Adım 5)

**İyi şanslar!** 🎉

---

*Son Güncelleme: 2026-01-20*
*Versiyon: 1.0*
