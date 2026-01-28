# TeknePazari - Yapılacaklar Listesi

**Son Güncelleme:** 2026-01-23
**Proje Durumu:** Geliştirme Aşamasında
**Referans:** [`docs/TeknePazari/`](TeknePazari/INDEX.md)

---

## 📊 Mevcut Durum Özeti

### ✅ Tamamlanan Bölümler
| Bölüm | Durum | Açıklama |
|-------|-------|----------|
| Backend Altyapı | ✅ | Express.js + Drizzle ORM + PostgreSQL |
| Frontend Altyapı | ✅ | Next.js 14 + TypeScript + Tailwind CSS |
| Authentication | ✅ | Email/SMS OTP sistemi |
| Listing Sistemi | ✅ | 4 ilan türü (Yacht, Part, Marina, Crew) |
| Dashboard | ✅ | Kullanıcı paneli ve ilan yönetimi |
| Mesajlaşma | ✅ | Temel mesajlaşma sistemi |
| Image Upload | ✅ | Çoklu resim yükleme ve işleme |
| Profile | ✅ | Kullanıcı profil yönetimi |
| Kategori Sistemi | ✅ | 10 ana kategori, 81 alt kategori |
| Kategori Öneri Sistemi | ✅ | Sahibinden benzeri öneri sistemi |
| Broker Panel Backend | ✅ | Broker kayıt, CRM, API'ler |
| Broker Panel Frontend | ✅ | Dashboard, leads, profile, store page |
| Admin Panel Backend | ✅ | Stats, listings, users, reports, analytics |
| Admin Panel Frontend | ✅ | Dashboard, listings, users, reports, analytics |

---

## 🔥 Phase 1: Veritabanı ve Kategori Altyapısı ✅ TAMAMLANDI

### 1.1 Kategori Tabloları
| Görev | Durum | Dosya |
|-------|-------|-------|
| Category tablosu ekle | ✅ | `backend/src/db/schema.ts` |
| CategorySuggestion tablosu ekle | ✅ | `backend/src/db/schema.ts` |
| Favorites tablosu ekle | ✅ | `backend/src/db/schema.ts` |
| Notifications tablosu ekle | ✅ | `backend/src/db/schema.ts` |
| Migration oluştur | ✅ | `backend/drizzle/0001_goofy_hydra.sql` |

### 1.2 Seed Data
| Görev | Durum | Dosya |
|-------|-------|-------|
| 10 ana kategori seed | ✅ | `backend/src/scripts/seedCategories.ts` |
| 100+ alt kategori seed | ✅ | 81 alt kategori oluşturuldu |
| Marka listesi seed | ⏳ | `backend/src/scripts/seedBrands.ts` |

### 1.3 Kategori API Endpoint'leri
| Endpoint | Method | Durum | Açıklama |
|----------|--------|-------|----------|
| `/api/categories` | GET | ✅ | Tüm kategorileri listele |
| `/api/categories/root` | GET | ✅ | Ana kategorileri listele |
| `/api/categories/:parentId/children` | GET | ✅ | Alt kategorileri listele |
| `/api/categories/slug/:slug` | GET | ✅ | Kategori detay (slug ile) |
| `/api/categories/search` | GET | ✅ | Kategori ara |
| `/api/admin/categories` | POST | ✅ | Yeni kategori ekle (admin) |
| `/api/admin/categories/:id` | PUT | ✅ | Kategori güncelle (admin) |
| `/api/admin/categories/:id` | DELETE | ✅ | Kategori sil (admin) |

---

## 📝 Phase 2: Kullanıcı Tanımlı Kategori Öneri Sistemi ✅ TAMAMLANDI

### 2.1 Kullanıcı Tarafı API
| Endpoint | Method | Durum | Açıklama |
|----------|--------|-------|----------|
| `/api/categories/suggest` | POST | ✅ | Yeni kategori öner |
| `/api/categories/suggestions` | GET | ✅ | Kullanıcının önerileri |

### 2.2 Admin Tarafı API
| Endpoint | Method | Durum | Açıklama |
|----------|--------|-------|----------|
| `/api/admin/categories/suggestions` | GET | ✅ | Bekleyen önerileri listele |
| `/api/admin/categories/suggestions/:id/approve` | PATCH | ✅ | Öneriyi onayla |
| `/api/admin/categories/suggestions/:id/reject` | PATCH | ✅ | Öneriyi reddet |
| `/api/admin/categories/suggestions/:id/merge` | PATCH | ✅ | Mevcut kategoriyle birleştir |

### 2.3 İş Kuralları
| Kural | Durum | Açıklama |
|-------|-------|----------|
| Rate limiting | ✅ | 3 öneri/gün |
| Spam filtresi | ⏳ | Yasaklı kelime kontrolü |
| Benzerlik kontrolü | ⏳ | Mevcut kategorilerle %80+ benzerlik |
| Otomatik onay bildirimi | ⏳ | 10+ ilan threshold |

---

## 🎨 Phase 3: Frontend Kategori Arayüzü ✅ TAMAMLANDI

### 3.1 Kategori Öneri Modal
| Görev | Durum | Dosya |
|-------|-------|-------|
| CategorySuggestionModal component | ✅ | `frontend/src/components/categories/CategorySuggestionModal.tsx` |
| Form validasyonu | ✅ | - |

### 3.2 Kullanıcı Önerileri Sayfası
| Görev | Durum | Dosya |
|-------|-------|-------|
| Önerilerim listesi | ✅ | `frontend/src/app/dashboard/categories/suggestions/page.tsx` |
| Öneri durumu gösterimi | ✅ | - |
| Filtreleme (beklemede/onaylı/reddedildi) | ✅ | - |

### 3.3 Admin Kategori Yönetim Paneli
| Görev | Durum | Dosya |
|-------|-------|-------|
| Kategori listesi | ✅ | `frontend/src/app/admin/categories/page.tsx` |
| Bekleyen öneriler listesi | ✅ | - |
| Onay/Red/Birleştir modal | ✅ | - |
| Kategori düzenleme modal | ✅ | - |

---

## 🏠 Phase 4: Eksik Sayfalar ✅ TAMAMLANDI

### 4.1 Ana Sayfa (/)
| Component | Durum | Açıklama |
|-----------|-------|----------|
| HeroSection | ✅ | Arama bar'ı, kategori carousel |
| CategoryGrid | ✅ | 10 ana kategori grid |
| TrendingListings | ✅ | Premium ilanlar slider |
| TrustSignals | ✅ | İstatistikler |
| MobileAppCTA | ⏳ | Mobil uygulama indirme |

### 4.2 Kategori Sayfası (/category/[slug])
| Component | Durum | Açıklama |
|-----------|-------|----------|
| CategoryHero | ✅ | Kategori başlığı, açıklama |
| SubcategoryList | ✅ | Alt kategoriler grid |
| ListingGrid | ✅ | İlan listesi |
| Sidebar Filters | ⏳ | Sahibinden tarzı filtre paneli |

### 4.3 Arama Sayfası (/search)
| Component | Durum | Açıklama |
|-----------|-------|----------|
| SearchBar | ✅ | Gelişmiş arama |
| FilterPanel | ✅ | Dinamik filtreler |
| ResultsList | ✅ | Sonuç listesi |
| NoResults | ✅ | Sonuç bulunamadı |

### 4.4 Ödeme Sayfası (/checkout)
| Component | Durum | Açıklama |
|-----------|-------|----------|
| PackageSelector | ⏳ | 3 paket (Temel ₺500, Standart ₺750, Premium ₺1.250) |
| PaymentForm | ⏳ | Kart bilgileri formu |
| SecurityBadge | ⏳ | PCI DSS uyumu |
| SuccessPage | ⏳ | Ödeme başarılı |

### 4.5 Statik Sayfalar
| Sayfa | Durum | Dosya |
|-------|-------|-------|
| SSS | ✅ | `/faq` |
| İletişim | ✅ | `/contact` |
| Hakkımızda | ✅ | `/about` |
| Gizlilik Politikası | ✅ | `/privacy` |
| Kullanım Şartları | ✅ | `/terms` |
| Blog Listesi | ⏳ | `/blog` |
| Blog Detay | ⏳ | `/blog/[slug]` |

---

## 🏪 Phase 5: Broker Panel ve CRM ✅ TAMAMLANDI

### 5.1 Broker Kayıt Sistemi
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Broker kayıt API | ✅ | Şirket bilgileri, belgeler |
| Broker doğrulama süreci | ✅ | Admin onay sistemi |
| Broker rol sistemi | ✅ | USER → BROKER yükseltme |
| Broker profil sayfası (Frontend) | ✅ | `/broker/profile` |

### 5.2 Mağaza Sayfası (/broker/[slug])
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Mağaza profili API | ✅ | Logo, kapak, açıklama |
| Mağaza ilanları API | ✅ | Broker'ın ilanları |
| İletişim bilgileri API | ✅ | Telefon, email, sosyal medya |
| Mağaza sayfası (Frontend) | ✅ | `/broker/[slug]` |

### 5.3 Broker Dashboard
| Görev | Durum | Açıklama |
|-------|-------|----------|
| İstatistik kartları API | ✅ | İlan, lead, görüntüleme, gelir |
| Performans grafikleri API | ✅ | 30 günlük trend |
| Son lead'ler listesi API | ✅ | - |
| Broker Dashboard (Frontend) | ✅ | `/broker/dashboard` |

### 5.4 CRM Sistemi
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Lead listesi API | ✅ | Tüm lead'ler |
| Lead detay API | ✅ | Notlar, geçmiş, follow-up |
| Lead aktiviteleri API | ✅ | Aktivite oluşturma, listeleme |
| CRM Lead Yönetim (Frontend) | ✅ | `/broker/leads` |

### 5.5 Broker Tools
| Görev | Durum | Açıklama |
|-------|-------|----------|
| PDF broşür oluşturucu | ⏳ | İlan bilgilerinden PDF |
| Email templates | ⏳ | Hazır email şablonları |
| API erişimi (Enterprise) | ⏳ | REST API documentation |

---

## 🔧 Phase 6: Gelişmiş Özellikler

### 6.1 Full-Text Search (Meilisearch)
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Meilisearch kurulumu | ⏳ | Docker container |
| İndeks oluşturma | ⏳ | listings indeksi |
| Sync sistemi | ⏳ | PostgreSQL → Meilisearch |
| Frontend entegrasyonu | ⏳ | instant-meilisearch |

### 6.2 Real-Time Messaging (WebSocket)
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Socket.IO kurulumu | ⏳ | Backend |
| Conversation rooms | ⏳ | - |
| Typing indicators | ⏳ | - |
| Read receipts | ⏳ | - |
| Online durumu | ⏳ | - |

### 6.3 Ödeme Sistemi (iyzico)
| Görev | Durum | Açıklama |
|-------|-------|----------|
| iyzico SDK entegrasyonu | ⏳ | - |
| Ödeme formu | ⏳ | 3D Secure |
| Webhook handler | ⏳ | Ödeme bildirimleri |
| Subscription yönetimi | ⏳ | Broker abonelikleri |
| Fatura oluşturma | ⏳ | - |

### 6.4 Push Notifications
| Görev | Durum | Açıklama |
|-------|-------|----------|
| FCM kurulumu | ⏳ | Firebase Cloud Messaging |
| Notification service | ⏳ | Backend |
| Web push | ⏳ | Service Worker |
| Mobil push | ⏳ | Expo notifications |

### 6.5 Video Doğrulama
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Daily.co entegrasyonu | ⏳ | WebRTC |
| Video call UI | ⏳ | - |
| Doğrulama rozeti | ⏳ | 🎥 Video Doğrulı |

### 6.6 HIN Doğrulama
| Görev | Durum | Açıklama |
|-------|-------|----------|
| HIN parser | ⏳ | Hull ID Number parse |
| HIN validation | ⏳ | Format kontrolü |
| Doğrulama rozeti | ⏳ | ✅ HIN Doğrulandı |

---

## 👑 Phase 7: Admin Panel ✅ TAMAMLANDI

### 7.1 Dashboard
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Platform istatistikleri API | ✅ | Kullanıcı, ilan, broker |
| Grafikler API | ✅ | Trend charts |
| Admin Dashboard (Frontend) | ✅ | `/admin` sayfası oluşturuldu |

### 7.2 İlan Yönetimi
| Görev | Durum | Açıklama |
|-------|-------|----------|
| İlan listesi API | ✅ | Filtreleme, arama |
| İlan detay API | ✅ | Görüntüleme, düzenleme |
| Moderasyon kuyruk API | ✅ | Bekleyen ilanlar |
| Onay/Red sistemi API | ✅ | Sebep belirtme |
| İlan moderasyon (Frontend) | ✅ | `/admin/listings` sayfası oluşturuldu |

### 7.3 Kullanıcı Yönetimi
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Kullanıcı listesi API | ✅ | - |
| Kullanıcı detay API | ✅ | Profil, ilanlar, mesajlar |
| Hesap askıya alma API | ✅ | Ban sistemi |
| Rol yönetimi API | ✅ | USER, BROKER, ADMIN |
| Kullanıcı yönetimi (Frontend) | ✅ | `/admin/users` sayfası oluşturuldu |

### 7.4 Kategori Yönetimi
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Kategori CRUD API | ✅ | - |
| Öneri yönetimi API | ✅ | Onay/Red/Birleştir |
| Kategori sıralaması | ⏳ | Drag & drop |
| Kategori yönetimi (Frontend) | ✅ | `/admin/categories` sayfası oluşturuldu |

### 7.5 Report Yönetimi
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Report listesi API | ✅ | - |
| Report detay API | ✅ | - |
| Report yönetimi (Frontend) | ✅ | `/admin/reports` sayfası oluşturuldu |

### 7.6 Analitik
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Analitik API | ✅ | Daily listings, users, by type, by status |
| Analitik (Frontend) | ✅ | `/admin/analytics` sayfası oluşturuldu |

---

## 🔍 Phase 8: SEO ve Performans

### 8.1 SEO Optimizasyonu
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Meta tags | ⏳ | Title, description, keywords |
| Open Graph | ⏳ | Sosyal medya paylaşım |
| Twitter Cards | ⏳ | - |
| Canonical URLs | ⏳ | - |
| Sitemap.xml | ⏳ | - |
| Robots.txt | ⏳ | - |

### 8.2 Structured Data
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Product schema | ⏳ | İlan bilgileri |
| LocalBusiness schema | ⏳ | Broker bilgileri |
| FAQ schema | ⏳ | SSS sayfası |
| BreadcrumbList schema | ⏳ | - |

### 8.3 Performans
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Image optimization | ⏳ | next/image |
| Lazy loading | ⏳ | Component lazy loading |
| Code splitting | ⏳ | Dynamic imports |
| CDN | ⏳ | Cloudflare |
| Gzip compression | ⏳ | - |

---

## 📱 Phase 9: Mobil Uygulama (React Native + Expo)

### 9.1 Proje Kurulumu
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Expo projesi oluştur | ⏳ | TypeScript template |
| Navigation kurulumu | ⏳ | React Navigation |
| State management | ⏳ | Zustand |
| API entegrasyonu | ⏳ | Shared API client |

### 9.2 Authentication
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Login screen | ⏳ | - |
| Register screen | ⏳ | - |
| OTP verification | ⏳ | - |
| Biometric auth | ⏳ | Face ID, Touch ID |

### 9.3 Core Screens
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Home screen | ⏳ | Kategoriler, trending |
| Search screen | ⏳ | Filtreleme |
| Listing detail | ⏳ | - |
| Listing create | ⏳ | Kamera entegrasyonu |

### 9.4 Messaging
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Conversations list | ⏳ | - |
| Chat screen | ⏳ | Real-time |
| Push notifications | ⏳ | - |

### 9.5 Profile
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Profile screen | ⏳ | - |
| My listings | ⏳ | - |
| Favorites | ⏳ | - |
| Settings | ⏳ | - |

### 9.6 Store Submit
| Görev | Durum | Açıklama |
|-------|-------|----------|
| App icons | ⏳ | iOS, Android |
| Splash screen | ⏳ | - |
| App Store submit | ⏳ | iOS |
| Google Play submit | ⏳ | Android |

---

## 🧪 Phase 10: Test ve Deployment

### 10.1 Unit Tests
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Jest kurulumu | ⏳ | - |
| Backend controller tests | ⏳ | - |
| Frontend component tests | ⏳ | React Testing Library |
| API endpoint tests | ⏳ | Supertest |

### 10.2 E2E Tests
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Playwright kurulumu | ⏳ | - |
| Auth flow tests | ⏳ | Login, register |
| Listing flow tests | ⏳ | Create, edit, delete |
| Payment flow tests | ⏳ | - |

### 10.3 Security
| Görev | Durum | Açıklama |
|-------|-------|----------|
| SQL injection testi | ⏳ | - |
| XSS testi | ⏳ | - |
| CSRF testi | ⏳ | - |
| Rate limiting testi | ⏳ | - |
| Auth bypass testi | ⏳ | - |

### 10.4 Performance
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Lighthouse audit | ⏳ | - |
| Load testing | ⏳ | k6 veya Artillery |
| Database query optimization | ⏳ | - |

### 10.5 Deployment
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Vercel kurulumu | ⏳ | Frontend |
| Hetzner kurulumu | ⏳ | Backend, PostgreSQL |
| Domain ve SSL | ⏳ | teknepazari.com |
| CI/CD pipeline | ⏳ | GitHub Actions |

### 10.6 Monitoring
| Görev | Durum | Açıklama |
|-------|-------|----------|
| Sentry kurulumu | ⏳ | Error tracking |
| Vercel Analytics | ⏳ | Web vitals |
| Database monitoring | ⏳ | - |
| Uptime monitoring | ⏳ | - |

---

## 📈 İlerleme Takibi

### ✅ Sprint 1 (Hafta 1-2): Kategori Sistemi - TAMAMLANDI
- ✅ Phase 1.1: Kategori tabloları
- ✅ Phase 1.2: Seed data
- ✅ Phase 1.3: Kategori API

### ✅ Sprint 2 (Hafta 3-4): Kategori Öneri Sistemi - TAMAMLANDI
- ✅ Phase 2.1: Kullanıcı API
- ✅ Phase 2.2: Admin API
- ✅ Phase 3: Frontend arayüzü

### ✅ Sprint 3 (Hafta 5-6): Ana Sayfa ve Kategori Sayfası - TAMAMLANDI
- ✅ Phase 4.1: Ana sayfa
- ✅ Phase 4.2: Kategori sayfası
- ✅ Phase 4.5: Statik sayfalar

### ✅ Sprint 4 (Hafta 7-8): Broker Panel - TAMAMLANDI
- ✅ Phase 5: Broker panel ve CRM (Backend)
- ✅ Phase 5: Broker panel ve CRM (Frontend)

### ✅ Sprint 5 (Hafta 9-10): Admin Panel - TAMAMLANDI
- ✅ Phase 7: Admin panel (Backend)
- ✅ Phase 7: Admin panel (Frontend)

### ⏳ Sprint 6 (Hafta 11-12): Gelişmiş Özellikler - BEKLEMEDE
- ⏳ Phase 6.1: Meilisearch
- ⏳ Phase 6.2: WebSocket
- ⏳ Phase 6.3: iyzico entegrasyonu

### ⏳ Sprint 7 (Hafta 13-14): SEO ve Performans - BEKLEMEDE
- ⏳ Phase 8: SEO ve performans

### ⏳ Sprint 8-11 (Hafta 15-24): Mobil Uygulama - BEKLEMEDE
- ⏳ Phase 9: React Native + Expo

### ⏳ Sprint 12 (Hafta 25-26): Test ve Deployment - BEKLEMEDE
- ⏳ Phase 10: Test ve deployment

---

## 📚 Referanslar

- **Proje Dokümantasyonu:** [`docs/TeknePazari/`](TeknePazari/INDEX.md)
- **API Spesifikasyonu:** [`docs/TeknePazari/05_TECHNICAL/api_spec.md`](TeknePazari/05_TECHNICAL/api_spec.md)
- **Veritabanı Tasarımı:** [`docs/database-design.md`](database-design.md)
- **Roadmap:** [`docs/TeknePazari/DEVELOPMENT_ROADMAP.md`](TeknePazari/DEVELOPMENT_ROADMAP.md)

---

*Son Güncelleme: 2026-01-23*
*Versiyon: 2.0*
