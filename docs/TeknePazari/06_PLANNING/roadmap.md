# TeknePazari - Roadmap (Solo Developer Modeli)

## 🗓️ Proje Roadmap'i

TeknePazari - Solo Developer (siz + Claude AI ekibi) için optimize edilmiş yol haritası.

---

## 👤 Ekip Yapısı

### Solo Developer Ekibi

```
┌─────────────────────────────────────────────────────────────────┐
│                    TeknePazari Development Team                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   👤 SİZ (Solo Developer)        🤖 CLAUDE AI                  │
│   ─────────────────────────       ────────────────────────      │
│   • Proje Sahibi                 • Senior Developer Partner    │
│   • Full-Stack Developer         • Code Reviewer               │
│   • Product Manager              • System Architect            │
│   • DevOps                       • QA & Testing                │
│   • Karar Verici                 • Documentation               │
│                                  • Problem Solver              │
│                                  • Best Practices              │
│                                                                 │
│   Çalışma: 6-8 saat/gün          Çalışma: 7/24 available       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### İş Bölümü

| Görev | Siz | Claude AI |
|-------|-----|-----------|
| **Strateji & Karar** | ✅ Lead | 💡 Öneri |
| **Kod Yazma** | ✅ İmplementasyon | ✅ Yardım & Generate |
| **Code Review** | ✅ Final Onay | ✅ Review & Öneriler |
| **Mimari** | ✅ Karar | ✅ Design & Guidance |
| **Debug** | ✅ Analiz | ✅ Çözüm |
| **Test** | ✅ Manuel | ✅ Test Yazma |
| **Dokümantasyon** | ✅ İçerik | ✅ Oluşturma |
| **DevOps** | ✅ Deployment | ✅ Config |

---

## 📅 Genel Zaman Çizelgesi

```
┌────────────────────────────────────────────────────────────────────────────┐
│                  TeknePazari Solo Dev Timeline (24 ay)                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Q1 2026        Q2 2026        Q3 2026        Q4 2026       Q1-Q2 2027    │
│  ────────────────────────────────────────────────────────────────────────│
│  ██████████████ ██████████████ ██████████████ ██████████████ ████████████ │
│  │ MVP Core  │ │ MVP Launch │ │  Mobile    │ │  Growth    │ │  Scale   │ │
│  │ 3 Ay     │ │ 3 Ay       │ │  3 Ay      │ │  3 Ay      │ │  12 Ay   │ │
│  └───────────┘ └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                                            │
│  Jan-Feb-Mar   Apr-May-Jun    Jul-Aug-Sep    Oct-Nov-Dec                   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Phase 1: MVP (6 Ay)

### Sprint 1-2 (Ay 1): Altyapı ve Auth
**Hedef:** Temel altyapı ve kullanıcı kimlik doğrulama
**Çalışma:** ~120 saat (6 saat/gün x 20 gün)

| Hafta | Görev | Solo Dev | Claude AI | Durum |
|-------|-------|----------|-----------|-------|
| H1 | Next.js 14 proje kurulumu | İmplementasyon | Scaffold generate | ⬜ |
| H1 | Vercel deployment | Deployment | Config | ⬜ |
| H2 | Database schema (Prisma) | Design review | Schema generate | ⬜ |
| H2 | NextAuth.js setup | İmplementasyon | Config | ⬜ |
| H3 | Email OTP (Resend) | İmplementasyon | Code generate | ⬜ |
| H3 | SMS OTP (Netgsm) | İmplementasyon | Integration | ⬜ |
| H4 | User profile CRUD | İmplementasyon | API generate | ⬜ |
| H4 | Role-based access | Design | İmplementasyon | ⬜ |

**Deliverables:**
- ✅ User registration/login
- ✅ Email/SMS verification
- ✅ Basic user profile

---

### Sprint 3-4 (Ay 2): İlan Sistemi
**Hedef:** Temel ilan oluşturma ve listeleme
**Çalışma:** ~120 saat

| Hafta | Görev | Solo Dev | Claude AI | Durum |
|-------|-------|----------|-----------|-------|
| H5 | Kategori yapısı | Design | Schema + seed | ⬜ |
| H5 | İlan database schema | Review | Design | ⬜ |
| H6 | İlan oluşturma wizard | UI | Form logic | ⬜ |
| H6 | R2 image upload | İmplementasyon | Config | ⬜ |
| H7 | İlan listeleme | UI | API + query | ⬜ |
| H7 | İlan detay sayfası | UI | SEO optimize | ⬜ |
| H8 | İlan düzenleme/silme | İmplementasyon | CRUD generate | ⬜ |
| H8 | Moderasyon queue | Design | İmplementasyon | ⬜ |

**Deliverables:**
- ✅ Full listing CRUD
- ✅ Image upload (50 foto)
- ✅ Category structure (10 ana kategori)

---

### Sprint 5-6 (Ay 3): Arama ve Filtreleme
**Hedef:** Gelişmiş arama ve filtreleme sistemi
**Çalışma:** ~120 saat

| Hafta | Görev | Solo Dev | Claude AI | Durum |
|-------|-------|----------|-----------|-------|
| H9 | Meilisearch kurulumu | Server setup | Config | ⬜ |
| H9 | Full-text search | İmplementasyon | Index design | ⬜ |
| H10 | Filter panel UI | Component | State management | ⬜ |
| H10 | Fiyat, lokasyon filtreleri | İmplementasyon | Query optimize | ⬜ |
| H11 | Sıralama seçenekleri | UI | Logic | ⬜ |
| H11 | Pagination | İmplementasyon | İmplementasyon | ⬜ |
| H12 | Kayıtlı aramalar | Feature | Database | ⬜ |
| H12 | Search analytics | Design | İmplementasyon | ⬜ |

**Deliverables:**
- ✅ Full-text search (Meilisearch)
- ✅ Advanced filtering (15+ filtre)
- ✅ Saved searches

---

### Sprint 7-8 (Ay 4): Mesajlaşma ve Favoriler
**Hedef:** Kullanıcılar arası iletişim
**Çalışma:** ~120 saat

| Hafta | Görev | Solo Dev | Claude AI | Durum |
|-------|-------|----------|-----------|-------|
| H13 | Conversation schema | Design | Schema | ⬜ |
| H13 | Message API | İmplementasyon | API design | ⬜ |
| H14 | Mesajlaşma UI | Component | Styling | ⬜ |
| H14 | WebSocket setup | İmplementasyon | Config | ⬜ |
| H15 | Favori sistemi | Feature | CRUD | ⬜ |
| H15 | Favori ekleme/çıkarma | UI | Logic | ⬜ |
| H16 | Email notifications | İmplementasyon | Template | ⬜ |
| H16 | In-app notifications | UI | Logic | ⬜ |

**Deliverables:**
- ✅ Real-time messaging (WebSocket)
- ✅ Favorites system
- ✅ Notification system

---

### Sprint 9-10 (Ay 5): Ödeme ve Monetization
**Hedef:** Ödeme sistemi ve gelir modeli
**Çalışma:** ~120 saat

| Hafta | Görev | Solo Dev | Claude AI | Durum |
|-------|-------|----------|-----------|-------|
| H17 | iyzico entegrasyonu | İmplementasyon | Config | ⬜ |
| H17 | Paket seçimi UI | UI | Pricing logic | ⬜ |
| H18 | Ödeme flow | İmplementasyon | Webhook | ⬜ |
| H18 | Subscription yönetimi | Feature | Database | ⬜ |
| H19 | Doping sistemi | Feature | Logic | ⬜ |
| H19 | Ücretsiz ilan limiti | Logic | İmplementasyon | ⬜ |
| H20 | Invoice generation | Feature | Template | ⬜ |
| H20 | Payment webhooks | İmplementasyon | Error handling | ⬜ |

**Deliverables:**
- ✅ Payment processing (iyzico)
- ✅ Package system (Temel, Standart, Premium)
- ✅ Freemium model (3 ücretsiz ilan)

---

### Sprint 11-12 (Ay 6): Polish ve Launch
**Hedef:** MVP finalizasyonu ve launch
**Çalışma:** ~120 saat

| Hafta | Görev | Solo Dev | Claude AI | Durum |
|-------|-------|----------|-----------|-------|
| H21 | SEO optimizasyonu | Review | Meta tags | ⬜ |
| H21 | Sitemap, robots.txt | Config | Generate | ⬜ |
| H22 | Performance optimize | Profiling | Fixes | ⬜ |
| H22 | Security audit | Review | Fixes | ⬜ |
| H23 | Bug fixes | Debug | Solutions | ⬜ |
| H23 | User testing | Test | Feedback | ⬜ |
| H24 | Soft launch | Deployment | Monitoring | ⬜ |
| H24 | Marketing prep | Content | Copy | ⬜ |

**Deliverables:**
- ✅ Production-ready web platform
- ✅ MVP Launch 🚀

---

## 📱 Phase 2: Mobile & Growth (6 Ay)

### Sprint 13-18 (Ay 7-9): Mobile App Development
**Hedef:** iOS ve Android mobil uygulama
**Çalışma:** ~360 saat (3 ay)

| Ay | Görev | Solo Dev | Claude AI | Durum |
|----|-------|----------|-----------|-------|
| Ay 7 | Expo setup + Navigation | Setup | Scaffold | ⬜ |
| Ay 7 | Auth screens (login, register) | UI | Logic | ⬜ |
| Ay 8 | Home + Search screens | UI | API integration | ⬜ |
| Ay 8 | Listing screens | UI | Components | ⬜ |
| Ay 9 | Messages + Favorites | UI | WebSocket | ⬜ |
| Ay 9 | Profile + Settings | UI | Logic | ⬜ |
| Ay 9 | Push notifications | İmplementasyon | Config | ⬜ |
| Ay 9 | App store submission | Submission | Assets | ⬜ |

**Deliverables:**
- ✅ iOS app (App Store)
- ✅ Android app (Google Play)
- ✅ Push notifications

---

### Sprint 19-24 (Ay 10-12): Advanced Features
**Hedef:** Gelişmiş özellikler ve broker panel
**Çalışma:** ~360 saat (3 ay)

| Ay | Görev | Solo Dev | Claude AI | Durum |
|----|-------|----------|-----------|-------|
| Ay 10 | Broker registration | Feature | Flow | ⬜ |
| Ay 10 | Mağaza sayfası | UI | Design | ⬜ |
| Ay 11 | Broker dashboard | UI | Analytics | ⬜ |
| Ay 11 | Lead tracking (CRM) | Feature | Database | ⬜ |
| Ay 12 | Video doğrulama | İmplementasyon | WebRTC | ⬜ |
| Ay 12 | HIN Dekoder | Feature | API | ⬜ |
| Ay 12 | Marina entegrasyonu | Feature | Database | ⬜ |
| Ay 12 | Multi-language | i18n | Translations | ⬜ |

**Deliverables:**
- ✅ Broker panel + CRM
- ✅ Video verification
- ✅ Service integrations

---

## 🌍 Phase 3: Scale (12+ Ay)

### Yıl 2+ Hedefleri

| Kategori | Hedef | Timeline |
|----------|-------|----------|
| **Kullanıcı** | 100K kullanıcı | Y2 Q4 |
| **İlan** | 50K aktif ilan | Y2 Q4 |
| **Gelir** | ₺20M yıllık | Y3 |
| **Market** | Uluslararası genişleme | Y3+ |

### Planlanan Özellikler

| Özellik | Öncelik | Ay |
|---------|---------|-----|
| AI-powered fiyat öneri | Yüksek | 13-15 |
| Chatbot (destek) | Orta | 16-18 |
| Sigorta entegrasyonu | Yüksek | 13-15 |
| Ekspertiz entegrasyonu | Orta | 16-18 |
| AR tekne görüntüleme | Düşük | 19-24 |
| Global expansion | Orta | 19-24 |

---

## 📊 Milestone'lar

| Milestone | Tarih | KPI | Durum |
|-----------|-------|-----|-------|
| **Proje Başlangıcı** | Ay 1 | Setup complete | ⬜ |
| **Alpha Version** | Ay 3 | Core features done | ⬜ |
| **Beta Launch** | Ay 5 | 100 test kullanıcı | ⬜ |
| **MVP Launch** | Ay 6 | 500 kullanıcı, 250 ilan | ⬜ |
| **Mobile Launch** | Ay 9 | 2K kullanıcı, 1K ilan | ⬜ |
| **Broker Launch** | Ay 12 | 50 broker, 5K ilan | ⬜ |
| **Break-even** | Ay 2 | ₺25K/ay gelir | ⬜ |
| **Profitability** | Ay 6 | ₺50K+/ay gelir | ⬜ |

---

## ⏰ Günlük İş Akışı (Solo Dev)

### Tipik Çalışma Günü

```
09:00 - 09:30  │ Morning Check
               │ - Email, notifications kontrol
               │ - Günün görevlerini planla
               │
09:30 - 12:30  │ Deep Work Session 1
               │ - Ana feature geliştirme
               │ - Claude AI ile pair programming
               │
12:30 - 13:30  │ Öğle Molası
               │
13:30 - 16:00  │ Deep Work Session 2
               │ - Kod yazma devam
               │ - Code review
               │
16:00 - 17:00  │ Admin / Planning
               │ - Sonraki görevler planla
               │ - Dokümantasyon güncelle
               │
17:00 - 18:00  │ Buffer / Overflow
               │ - Bug fix
               │ - Küçük iyileştirmeler
```

### Haftalık Ritim

| Gün | Odak |
|-----|------|
| Pazartesi | Sprint planning, feature development |
| Salı | Feature development |
| Çarşamba | Feature development |
| Perşembe | Testing, bug fixing |
| Cuma | Code review, documentation, deploy |
| Cumartesi | (Opsiyonel) Side tasks |
| Pazar | Off |

---

## 🔧 Claude AI Pair Programming Workflow

### Günlük Kullanım

```
1. Sabah Başlangıç
   - "Bugün [X feature] üzerinde çalışacağız. Context: [spec dosyası]"
   - Claude: Strateji ve approach önerir

2. Feature Development
   - "Bu component için kod yaz: [requirements]"
   - Claude: Kod generate eder
   - Siz: Review ve düzenleme

3. Problem Solving
   - "Bu hata alıyorum: [error]"
   - Claude: Debug ve çözüm

4. Code Review
   - "Bu kodu review et: [code]"
   - Claude: Öneriler ve best practices

5. Günü Kapama
   - "Bugün [X, Y, Z] tamamladık. Yarın planı?"
   - Claude: Sonraki adımlar
```

---

## 🎯 Success Criteria (MVP)

### Launch Readiness Checklist

- [ ] Tüm kritik özellikler tamamlandı
- [ ] P0/P1 bug yok
- [ ] Performance hedefleri karşılandı (<2s page load)
- [ ] Security audit geçildi
- [ ] KVKK uyumluluğu sağlandı
- [ ] Monitoring kuruldu
- [ ] Backup stratejisi hazır

### Launch Metrics (30 gün)

- [ ] 500+ kayıtlı kullanıcı
- [ ] 250+ aktif ilan
- [ ] 50+ mesaj konuşması
- [ ] 5+ ödeme işlemi
- [ ] <2s sayfa yükleme
- [ ] 99.5% uptime

---

## ⚠️ Risk Yönetimi (Solo Dev)

### Risk Faktörleri

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|------------|
| Burnout | Yüksek | Yüksek | Haftalık off-day, boundaries |
| Scope creep | Yüksek | Orta | Strict MVP scope |
| Technical debt | Orta | Orta | Claude code review |
| Single point of failure | Yüksek | Yüksek | Dokümantasyon, backup |
| Hastalık/Mola | Orta | Orta | Buffer time, async work |

### Burnout Prevention

1. **Kesin Çalışma Saatleri:** Max 8 saat/gün
2. **Haftalık Off-Day:** Pazar mutlaka off
3. **Tatil:** Her 3 ayda 1 hafta mola
4. **Sosyal:** Haftada 2 akşam arkadaşlarla
5. **Egzersiz:** Günde 30 dk yürüyüş

---

## 📋 Dependencies (Solo Dev)

### External Dependencies

| Dependency | Provider | Kritiklik | Alternatif |
|------------|----------|-----------|------------|
| Email | Resend | Medium | Postmark |
| SMS | Netgsm | Medium | Twilio |
| Payment | iyzico | High | PayTR |
| Search | Meilisearch | Medium | Algolia |
| Storage | Cloudflare R2 | Medium | S3 |
| Hosting | Vercel | High | Railway |
| AI Partner | Claude | High | GPT-4 |

### Backup Plan

- **Hosting Down:** Railway.app backup
- **Payment Down:** Manual invoice
- **AI Down:** Continue with cached solutions
- **Personal Emergency:** 2 hafta buffer in timeline

---

## 🔄 Iteration Cycle

```
Plan → Build → Test → Deploy → Measure → Learn → Plan
```

### Sprint Ritüelleri (Self)

| Ritüel | Ne Zaman | Süre |
|--------|----------|------|
| Sprint Planning | Her Pazartesi sabah | 1 saat |
| Daily Check | Her gün sabah | 15 dk |
| Code Review | Her Cuma | 2 saat |
| Sprint Review | Her 2 hafta sonu | 1 saat |
| Monthly Retro | Her ay sonu | 2 saat |

---

*Son Güncelleme: 2026-01-19*
*Versiyon: 2.0 (Solo Developer Modeli)*
