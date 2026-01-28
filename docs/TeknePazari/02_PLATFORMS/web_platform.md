# TeknePazari - Web Platform Spesifikasyonu

## 🌐 Platform Genel Bakış

TeknePazari web platformu, Next.js 14 ile geliştirilen, responsive ve SEO dostu bir web uygulamasıdır.

---

## 🎯 Temel Özellikler

### 1. Ana Sayfa
- Hero section: Arama filtresi ile ana kategoriler
- Öne çıkan ilanlar (premium doping)
- Kategori navigasyonu
- Güvenilirlik rozetleri
- Mobil uygulama indirme CTA

### 2. İlan Listeleme Sayfası
- Filtreleme: Kategori, fiyat, lokasyon, yıl, marka
- Sıralama: Fiyat, tarih, popülerlik
- Grid/List görünümü
- Sonsuz scroll (pagination)
- Harita görünümü (opsiyonel)

### 3. İlan Detay Sayfası
- Galeri (fotoğraf + video)
- Tekne özellikleri tablosu
- HIN Dekoder entegrasyonu
- Konum haritası
- İletişim formu
- Benzer ilanlar
- Paylaşım butonları
- Favorilere ekle

### 4. Kullanıcı Paneli
- İlan yönetimi (liste, düzenle, sil)
- Mesajlaşma
- Favorilerim
- Bildirimler
- Profil ayarları
- Abonelik yönetimi

### 5. Broker Paneli
- Mağaza sayfası yönetimi
- CRM (lead takibi)
- Performans analitikleri
- Toplu ilan yönetimi
- PDF broşür oluşturucu
- API erişimi (Enterprise)

---

## 🎨 UI/UX Özellikleri

### Responsive Tasarım
- Mobile-first yaklaşım
- Breakpoint'ler: 640px, 768px, 1024px, 1280px
- Touch-friendly butonlar (min 44px)

### Renk Paleti
- Primary: #0066CC (deniz mavisi)
- Secondary: #00A3E0 (açık mavi)
- Accent: #FF6B35 (turuncu - CTA)
- Neutral: #F5F5F5, #E0E0E0, #666666, #333333

### Tipografi
- Font: Inter (Google Fonts)
- Başlıklar: 600-700 weight
- Body: 400 weight
- Line height: 1.5-1.6

### Bileşenler
- Button (Primary, Secondary, Outline, Ghost)
- Input (Text, Email, Tel, Select, Checkbox, Radio)
- Card (İlan, Kategori, Broker)
- Modal (İletişim, Paylaşım)
- Dropdown (Menü, Filtre)
- Tabs (Kategori, Panel)
- Badge (Rozet, Durum)
- Toast (Bildirim)

---

## 🔍 SEO Optimizasyonu

### On-Page SEO
- Meta tags (title, description, keywords)
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URL
- Robots.txt
- Sitemap.xml

### Performans
- Next.js Image optimization
- Lazy loading
- Code splitting
- Minification
- Gzip compression
- CDN (Cloudflare)

### İçerik
- Blog (SEO içerikleri)
- Kategori sayfaları (rich snippets)
- İlan sayfaları (schema.org markup)
- FAQ sayfası (structured data)

---

## 🔐 Güvenlik

### Authentication
- NextAuth.js v5
- Provider: Email (Resend), SMS (Netgsm)
- Session: JWT (httpOnly cookie)
- 2FA (opsiyonel)

### Authorization
- Role-based access control (RBAC)
- Admin, Broker, User rolleri
- API route protection

### Veri Güvenliği
- HTTPS (SSL/TLS)
- Veri şifreleme (at rest, in transit)
- SQL injection koruması (Prisma ORM)
- XSS koruması (React escaping)
- CSRF koruması (Next.js built-in)

---

## 📊 Analitik ve Monitoring

### Analitik
- Google Analytics 4
- Google Tag Manager
- Custom events (page view, click, conversion)

### Monitoring
- Sentry (error tracking)
- Vercel Analytics (performance)
- LogRocket (session replay, ops)

### Uptime
- UptimeRobot (ping)
- Status page (ops)

---

## 🚀 Deployment

### Hosting
- Vercel (production)
- Hetzner (staging, self-hosted)

### CI/CD
- GitHub Actions
- Automated testing
- Automated deployment
- Rollback capability

### Environment Variables
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RESEND_API_KEY=
NETGSM_API_KEY=
MEILISEARCH_HOST=
MEILISEARCH_API_KEY=
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
```

---

## 📱 Progressive Web App (PWA)

### PWA Özellikleri
- Manifest.json
- Service Worker
- Offline support (limited)
- Install prompt
- Push notifications (ops)

### PWA Kısıtlamaları
- Offline ilan listeleme (cache)
- Offline favoriler (localStorage)
- Online required: İlan oluşturma, mesajlaşma

---

## 🌐 Çoklu Dil Desteği

### Diller
- Türkçe (primary)
- İngilizce (secondary)
- Almanca (tertiary)
- Rusça (quaternary)

### Implementasyon
- next-intl
- URL-based routing (/tr, /en, /de, /ru)
- Content translation (manual)
- UI translation (manual)

---

## ♿ Erişilebilirlik

### WCAG 2.1 AA Uyumu
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast (4.5:1)
- Focus indicators

---

## 🎯 Performans Hedefleri

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Page Speed
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Speed Index: < 3s

---

## 📦 Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL 15
- Meilisearch 1.0

### Infrastructure
- Vercel (hosting)
- Cloudflare R2 (storage)
- Netgsm (SMS)
- Resend (Email)

---

*Son Güncelleme: 2026-01-19*
*Versiyon: 1.0 (Project Specs)*
