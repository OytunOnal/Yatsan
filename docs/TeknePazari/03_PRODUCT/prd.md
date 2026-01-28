# TeknePazari - Product Requirements Document (PRD)

## 📋 Genel Bakış

TeknePazari, Sahibinden.com benzeri ilan platformu modeli ile çalışan, deniz araçları ve hizmetlerine odaklanmış bir C2C/C2B pazaryeridir.

---

## 🎯 Ürün Vizyonu

**Misyon:** Deniz araçları pazarını şeffaf, güvenli ve teknoloji-odaklı hale getirmek.

**Vizyon:** Türkiye'deki en güvenilir ve kullanıcı-dostu tekne pazaryeri olması.

---

## 👥 Hedef Kullanıcılar

| Persona | Açıklama | İhtiyaç |
|---------|----------|--------|
| **Bireysel Alıcı** | Tekne almak isteyen kişi | Filtreleme, karşılaştırma, güvenli satın alma |
| **Bireysel Satıcı** | Tekne satmak isteyen kişi | Kolay ilan oluşturma, yüksek görünürlük |
| **Broker/Acentesi** | Profesyonel tekne acentesi | İlan yönetimi, lead tracking, raporlama |
| **Marina Operatörü** | Marina işletmecisi | Hizmet entegrasyonu, müşteri yönetimi |
| **Servis Sağlayıcı** | Tekne servisi yapan | Lead alma, hizmet tanıtma |
| **Yabancı Alıcı** | İthalatçı/kurumsal alıcı | Çoklu dil, ödeme seçenekleri |

---

## 📑 Kategori Yapısı

TeknePazari 10 ana kategori ile organize edilmiştir:

1. **Deniz Araçları** (Motoryat, Yelkenli, Katamaran, Bot, Jet Ski, vb.)
2. **Deniz Araçı Ekipmanları** (Motor, Elektronik, Güvenlik, vb.)
3. **Teknik Servisler** (Motor, Elektrik, Elektronik Servisleri)
4. **Yedek Parça** (Motor, Elektronik, Güverte Parçaları)
5. **Marina ve Limanlar** (Bölgesel Marinalar)
6. **Kara Park ve Kışlama** (Depolama Hizmetleri)
7. **Transfer ve Mürettebat** (Transfer, Personel Temini)
8. **Panayır** (İkinci El Ürünler)
9. **Sigorta** (Tekne, Kaptan, Yolcu Sigortası)
10. **Ekspertiz** (Tekne Değerlendirmesi ve Raporlama)

Detaylı kategori yapısı [`categories.md`](categories.md) dosyasında bulunur.

---

## 💎 Ana Özellikleri

### 1. İlan Yönetimi Sistemi

#### 1.1 İlan Oluşturma
- **Özellikleri:**
  - Form-based veya wizard-based oluşturma
  - Fotoğraf/video yükleme (mobilde kamera destekli)
  - HIN alanı (otomatik veri çekme opsiyonel)
  - Lokasyon tagging (GPS destekli)
  - Taslak kaydetme
  - Otomatik kategorilendirme
  - **Kullanıcı Tanımlı Alt Kategori Önerisi:** Aradığı kategori yoksa yeni kategori önerebilme (Sahibinden benzeri)

#### 1.2 İlan Yönetimi
- Aktif ilanlar listesi
- Düzenleme ve yenileme
- Silinmiş ilanlar
- İstatistikler (görüntülenme, tıklamalar)
- Favorilere eklenenler

#### 1.3 İlan Tipolojileri
- **Satış İlanları:** Deniz araçları
- **Kiralık İlanları:** Tur, charter
- **Hizmet İlanları:** Repair, maintenance
- **Yedek Parça:** Aksesuar, equipment

#### 1.4 İlan Durumları
- **Draft:** Taslak (yayınlanmamış)
- **Pending Review:** Moderasyon bekleniyor
- **Active:** Yayınlı ve görülüyor
- **Paused:** Geçici olarak gizlenmiş
- **Expired:** Süresi doldu
- **Deleted:** Silinmiş

---

### 2. Arama ve Keşif

#### 2.1 Gelişmiş Filtreleme
- Kategori (Deniz Araçları, Ekipman, Hizmet)
- Subcategory (Motoryat, Yelkenli, vb.)
- Fiyat aralığı (min-max)
- Lokasyon (şehir, bölge, harita)
- Yıl (min-max)
- Marka (checkbox list)
- Boyut (uzunluk, genişlik)
- Motor tipi ve gücü
- Özellikler (klimatize, jeneratör, vb.)

#### 2.2 Arama Türleri
- **Keyword Search:** Metin tabanlı arama (Meilisearch)
- **Advanced Search:** Filtreleme
- **Saved Searches:** Kaydedilmiş aramalar (favorite filter)
- **Voice Search:** Ses ile arama (mobil)

#### 2.3 Sıralama Seçenekleri
- Tarih (en yeni)
- Fiyat (en düşük/yüksek)
- Popülerlik (en çok görüntülenen)
- Benzerlük (user preference)

#### 2.4 Keşif Özellikleri
- Anasayfa carousel'leri
- Kategori sayfaları
- Trending items
- Recommended for you
- Recently viewed
- Similar listings

---

### 3. Güvenlik ve Doğrulama

#### 3.1 Kullanıcı Doğrulaması
- **Email Doğrulama:** OTP (Resend)
- **Telefon Doğrulama:** SMS (Netgsm)
- **Video Doğrulama:** Canlı video (opsiyonel, Daily.co)
- **Biometric:** Face ID, Touch ID (mobil)

#### 3.2 Rozet Sistemi
- 🟢 **Email Doğrulı:** Yeşil rozet
- 🔵 **Telefon Doğrulı:** Mavi rozet
- 🎥 **Video Doğrulı:** Kamera rozeti
- ✅ **Broker Doğrulı:** Checkmark

#### 3.3 İlan Moderasyonu
- Otomatik kontrol (spam, kötü içerik)
- Manual review (kritik ilanlar)
- Moderation queue
- Appeal sistemi

#### 3.4 Dolandırıcılık Tespiti
- Şüpheli aktivite flagging
- IP blocking (opsiyonel)
- Rate limiting
- Şikayet sistemi

---

### 4. Mesajlaşma Sistemi

#### 4.1 In-App Messaging
- Real-time messaging (WebSocket)
- Conversation history
- Typing indicators
- Read receipts
- Blocking functionality

#### 4.2 Alternatif İletişim
- Doğrudan telefon gösterme (opsiyonel)
- WhatsApp button
- Call button (mobil)

#### 4.3 Moderasyon
- Şüpheli mesajları flag'leme
- Reklam/spam filtreleme
- Abusive content reporting

---

### 5. Ödeme ve Para Kazanma

#### 5.1 İlan Ücretlendirme
- **Ücretsiz İlanlar:** 3/ay
- **Premium Paketler:** Temel, Standart, Premium
- **Doping/Öne Çıkarma:** Günlük, haftalık, aylık
- **Broker Abonelikleri:** Starter, Professional, Enterprise

#### 5.2 Ödeme Yöntemleri
- Kredi kartı (iyzico)
- Banka havalesi
- Digital wallet (opsiyonel)

#### 5.3 Ödeme Güvenliği
- PCI DSS uyumu
- Şifreli işlemler
- 3D Secure
- Fraud detection

---

### 6. Broker Özellikleri

#### 6.1 Mağaza Sayfası
- Özel URL: teknepazari.com/broker/name
- Logo, kapak, açıklama
- İstatistikler
- Sosyal linkler

#### 6.2 CRM Tools
- Lead takibi
- Notlar ve reminders
- Email templates
- Follow-up scheduling

#### 6.3 Analitik
- İlan performans metrikleri
- Görüntülenme ve tıklamalar
- Conversion tracking
- Revenue reports

#### 6.4 Tools
- Toplu ilan yönetimi
- PDF broşür oluşturucu
- Email campaigns (opsiyonel)
- API erişimi (Enterprise)

---

### 7. Hizmet Entegrasyonları

#### 7.1 Marina Entegrasyonu
- Marina listeleme
- Rezervasyon linkage
- Bağlama fiyatları
- Facilities gösterme

#### 7.2 Servis Pazaryeri
- Tekne servisleri
- Repair, maintenance
- Lead alması

#### 7.3 Sigorta Entegrasyonu
- Sigorta karşılaştırma
- Lead generation
- Poliçe satış

#### 7.4 Finansman Entegrasyonu
- Kredilendirme opsiyon (opsiyonel)
- Partner banka bilgisi

---

### 8. SEO ve Content

#### 8.1 SEO Optimizasyonu
- Meta tags
- Sitemap
- Schema.org markup
- Blog içerikleri

#### 8.2 Blog
- Deniz araçları rehberleri
- Bakım ipuçları
- Pazara dair haberler
- Kategorili içerik

#### 8.3 FAQ
- Platform SSS
- İlan oluşturma kılavuzu
- Güvenlik ipuçları

---

### 9. Sosyal Özellikleri

#### 9.1 Profil Sistemi
- Public profile
- Satıcı değerlendirmesi
- Review/rating sistemi
- Bilgiler

#### 9.2 Sharing
- Social media sharing (Twitter, Facebook)
- Copyable link
- QR code (opsiyonel)

#### 9.3 Community Features
- İlan yorumları (opsiyonel)
- Rating sistemi
- Favorite satıcılar

---

### 10. Admin ve Moderation

#### 10.1 Admin Panel
- İlan yönetimi (approve, reject, remove)
- Kullanıcı yönetimi
- Report yönetimi
- Statistics dashboard
- **Kategori Yönetimi:** Kullanıcı önerilerini onaylama, reddetme, birleştirme

#### 10.2 Kategori Öneri Sistemi
- **Kullanıcı Tarafı:**
  - İlan oluştururken aradığı kategori yoksa "Yeni Kategori Öner" seçeneği
  - Kategori adı ve açıklama girme
  - Öneri durumu takibi (Beklemede, Onaylandı, Reddedildi)
- **Admin Tarafı:**
  - Bekleyen kategori önerileri listesi
  - Benzer kategori kontrolü (otomatik öneri)
  - Onay, Reddet veya Birleştir aksiyonları
  - İlan sayısı threshold bildirimi (10+ ilan = otomatik onay önerisi)

#### 10.2 Reporting System
- İlan şikayet sistemi
- Kullanıcı şikayet sistemi
- Mesaj şikayet sistemi
- Automation workflows

#### 10.3 Analytics
- Platform metrics
- User growth
- Revenue tracking
- Churn analysis

---

## 🔄 User Flows

### Flow 1: İlan Oluşturma (Seller)
```
1. Login/Register
2. "İlan Oluştur" butonuna tıkla
3. Kategori seç
4. Temel bilgiler gir (başlık, açıklama, fiyat)
5. Tekne detayları gir (yıl, marka, model, engine)
6. Fotoğraf/video yükle
7. Lokasyon tagging
8. Taslak kaydet veya yayınla
9. Moderasyon review
10. İlan yayınlandı - Bildirim al
```

### Flow 2: İlan Arama (Buyer)
```
1. Ana sayfa → Arama bar'ı
2. Kategori filtresi seç (Motoryat)
3. Fiyat aralığı filtrele
4. Lokasyon filtrele
5. Sonuçları gözat
6. İlana tıkla → Detay sayfası
7. Fotoğraf galeri
8. Satıcı bilgisi
9. "Satıcıyla İletişim" butonuna tıkla
10. In-app mesajlaşma
```

### Flow 3: Ödeme (Premium Paket)
```
1. Dashboard → "İlan Yenile"
2. Premium paket seç
3. Ödeme yöntemi seç
4. Ödeme işlemi
5. İlan güncellendi - Notification
```

---

## 📊 Metrikleri ve KPI'lar

### Engagement Metrics
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- Session length
- Session frequency

### Marketplace Metrics
- Total listings
- Active listings
- Listings per user
- Listing completion rate
- Listing conversion rate

### Financial Metrics
- Revenue (monthly, annual)
- Average revenue per user
- Customer acquisition cost (CAC)
- Lifetime value (LTV)

### Retention Metrics
- Monthly retention rate
- Churn rate
- Repeat seller rate

---

## 🚀 MVP Scope

### Phase 1 (3 ay)
- ✅ User authentication (email/SMS)
- ✅ İlan oluşturma/yönetimi
- ✅ Arama ve filtreleme
- ✅ Mesajlaşma
- ✅ Basic payment
- ✅ Web platform

### Phase 2 (3 ay)
- Mobile app (iOS + Android)
- Advanced moderasyon
- Broker panel
- Analytics dashboard

### Phase 3 (3 ay)
- Hizmet entegrasyonları
- Video doğrulama
- API
- Global expansion

---

## 🔐 Güvenlik Gereksinimleri

- KVKK uyumu
- HTTPS/SSL encryption
- SQL injection koruması
- XSS koruması
- CSRF koruması
- Rate limiting
- DDoS protection

---

## ♿ Erişilebilirlik

- WCAG 2.1 AA uyumu
- Keyboard navigation
- Screen reader support
- Color contrast minimum 4.5:1
- Responsive design (mobile-first)

---

## 📱 Platform Desteği

| Platform | Destekle | Minimum |
|----------|----------|---------|
| Web | ✅ Chrome, Firefox, Safari, Edge | Son 2 versiyon |
| iOS | ✅ (Phase 2) | iOS 14+ |
| Android | ✅ (Phase 2) | Android 8+ |

---

*Son Güncelleme: 2026-01-20*
*Versiyon: 1.1 (Kategori Yapısı Eklendi)*
