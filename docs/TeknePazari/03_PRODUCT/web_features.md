# TeknePazari - Web Platform Özellikleri

## 🌐 Web Platform Genel Bakış

TeknePazari web platformu, masaüstü ve mobil tarayıcılar için optimize edilmiş, responsive bir web uygulamasıdır.

---

## 📄 Sayfa Yapısı

### 1. Ana Sayfa (/)

#### Hero Section
- Arama bar'ı (merkez)
- Kategori carousel'i
- Öne çıkan ilanlar (premium doping)
- Güvenilirlik rozetleri
- Mobil uygulama indirme CTA

#### Kategori Grid
- 10 ana kategori
- İkon + isim
- İlan sayısı badge'i

#### Trending İlanlar
- Premium ilanlar
- Slider format
- Quick view modal

#### Trust Signals
- "10.000+ İlan"
- "5.000+ Kullanıcı"
- "Güvenli Ödeme"
- "7/24 Destek"

#### SEO Content
- H1: "Türkiye'nin En Büyük Tekne Pazaryeri"
- H2: "Deniz Araçları, Ekipmanlar ve Hizmetler"
- Kısa açıklama

---

### 2. İlan Listeleme Sayfası (/listings) - Sahibinden Tarzı

#### Breadcrumb Navigation
- Ana Sayfa > Deniz Araçları > Motoryat > Satılık (5.432 ilan)

#### Üst Bar
- Sıralama: [En yeni ▼]
- Görünüm: [Grid] [List]

#### Sol Sidebar - Klasör Mantığı (Sahibinden Tarzı)
- **DENİZ ARAÇLARI** (Expandable)
  - ☑ Motoryat (Expandable)
  - ☐ Yelkenli (Expandable)
  - ☐ Katamaran (Expandable)
  - ☐ Bot (Expandable)
  - ☐ Jet Ski (Expandable)
  - ☐ Gulet (Expandable)

- **FİYAT**
  - Min: [100K] TL
  - Max: [5M] TL
  - [Ara] butonu

- **YIL**
  - Min: [2010]
  - Max: [2024]
  - [Ara] butonu

- **MARKA** (Checkbox listesi)
  - ☑ Beneteau
  - ☐ Jeanneau
  - ☐ Bavaria
  - ☐ Lagoon
  - ☐ Sunseeker
  - ☐ Azimut

- **UZUNLUK**
  - Min: [10m]
  - Max: [30m]
  - [Ara] butonu

- **MOTOR**
  - ☐ Volvo Penta
  - ☐ Cummins
  - ☐ Caterpillar
  - ☐ MTU
  - ☐ Yanmar

- **LOKASYON** (Nested checkbox)
  - ☐ Muğla
    - ☑ Fethiye
    - ☑ Bodrum
    - ☑ Marmaris
  - ☐ İstanbul
  - ☐ İzmir

- [Filtreleri Temizle] butonu

#### Sağ İçerik Alanı - 3 Kolon Grid
- Grid layout: 3 kolon (desktop), 2 kolon (tablet), 1 kolon (mobile)

#### İlan Kartları (Zenginleştirilmiş)
- Fotoğraf (thumbnail)
- Marka + Model (örn: Beneteau 50)
- Fiyat (₺450K)
- Yıl (2020)
- Uzunluk (15m)
- Motor Markası (Volvo)
- Motor Saati (1.2K h)
- Lokasyon (Bodrum)
- Premium badge (⭐Prem)
- Favori butonu (❤️)

#### Pagination
- [Daha Fazla Yükle...] butonu
- Sayfa numaraları: [< 1 2 3 ... 10 >]

---

### 3. İlan Detay Sayfası (/listings/:id) - Zenginleştirilmiş

#### Üst Bölüm
- Breadcrumb navigation: Ana Sayfa > Deniz Araçları > Motoryat > Beneteau 50
- Başlık (H1): "Beneteau 50 - 2020 Model Motoryat - SATILIK"
- Fiyat (prominent): ₺450.000
- Premium badge: ⭐ Premium (varsa)
- Action butonları: ❤️ Favori | 📤 Paylaş | ⚙️ Şikayet Et
- Meta bilgiler: 📍 Bodrum, Muğla • 🕒 2 gün önce • 👁️ 1.250 görüntü

#### Galeri
- Ana fotoğraf (800x600 large)
- Thumbnail strip (alt, 5 küçük resim)
- [◀] [▶] navigasyon okları
- Video varsa video player
- Fullscreen modal

#### Teknik Detaylar Tablosu (Sol Kolon)
**Temel Bilgiler**
- İlan No: 12345678
- Kategori: Motoryat
- Marka: Beneteau
- Model: 50
- Yıl: 2020
- Durum: İyi

**Boyutlar**
- Uzunluk: 15.50m
- Genişlik: 4.50m
- Draft: 1.80m
- Tonaj: 24 ton

**Motor & Yakıt**
- Motor: Volvo Penta D11-725
- Gücü: 725 HP
- Motor Saati: 1.200h
- Yakıt: Diesel
- Yakıt Kapasitesi: 1.000L
- Su Kapasitesi: 300L

**İç Mekan**
- Kabin Sayısı: 3
- WC: 2
- Duş: 1

**Yapısı**
- Gövde: GRP (Composite)
- İç: Teak

**Kontrolleri & Sistemler**
- Autopilot: Raymarine
- Fındra: ✅ Var
- Radar: ✅ Var
- GPS: ✅ Var
- VHF: ✅ Var

**HIN (Hull ID Number)**
- US-ABC12345D404 ✅ DOĞRULANDI

#### Satıcı Bilgisi (Sağ Kolon)
- Avatar + İsim: Ahmet Yılmaz
- Doğrulama rozetleri:
  - ✅ Telefon Doğrulandı
  - ✅ Email Doğrulandı
  - 🎥 Video Var
- Üyelik: 3 yıl
- İlan Sayısı: 15
- Satış Süresi: Ortalama 45 gün
- Mağaza: Bodrum Yachting
- Email: bodrum@yachting.com.tr
- Butonlar:
  - 📞 [Telefonu Göster]
  - 💬 [WhatsApp Mesaj At]
  - 🔐 [Güvenli İletişim]

**Güvenli Ticaret Uyarısı**
- ⚠️ GÜVENLİ TİCARET
  - • Ekspertiz raporu isteyin
  - • Noter işlemi yapın
  - • HIN doğrulaması yapın

**Benzer İlanlar**
- [Tıkla] butonu

#### İlan Açıklaması
- Rich text (markdown)
- "2020 model Beneteau 50, az kullanılmış (1.200 motor saati), bakımlı ve temiz bir motoryat. Teak iç, 3 kabin, tam donanımlı. Volvo Penta D11-725 motor. Bodrum'da görülebilir. Ekspertiz raporu hazırdır."

#### Konum
- Mapbox interaktif harita
- 📍 Bodrum Marina
- Koordinatlar: 37.0344, 27.4305

#### Benzer İlanlar
- 5 benzer ilan
- Grid format (5 kolon)
- Jeanneau 54, Bavaria 46, Lagoon 450, Sunseeker 75, Ferretti 780

#### SEO Meta Tags
- Title: "Beneteau 50 - 2020 Model Motoryat | TeknePazari"
- Description: "2020 model Beneteau 50 motoryat satılık. 15m uzunluk, Volvo Penta D11 motor..."
- Canonical URL
- Open Graph tags

---

### 4. İlan Oluşturma Sayfası (/listings/new) - 6 Adımlı Form

**Progress Bar:** ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (1/6 Adım)

#### Adım 1: Kategori Seçimi
- Kategori: [Motoryat ▼]
- Alt Kategori: [Flybridge ▼]
- Kategori Önizleme: "Motoryat > Flybridge"
- Butonlar: [← Geri] [İleri →]
- 💡 İpucu: Doğru kategori seçimi ilanınızın daha hızlı satılmasını sağlar.

#### Adım 2: Temel Bilgiler
- Başlık: [İlan başlığını girin]
- Açıklama: [Detaylı açıklama yazın]
- Fiyat: [450000] TRY ▼
- Para Birimi: [TRY, EUR, USD]
- Yıl: [2020]
- Lokasyon: [Bodrum, Muğla] + [🌍 GPS Konumu]
- Koordinatlar: 37.0344, 27.4305 (otomatik)

#### Adım 3: Tekne Detayları
- Marka: [Beneteau ▼]
- Model: [50]
- **Boyutlar**
  - Uzunluk: [15.50] m
  - Genişlik: [4.50] m
  - Draft: [1.80] m
  - Tonaj: [24] ton
- **Motor & Yakıt**
  - Motor: [Volvo Penta D11-725]
  - Motor Saati: [1200] h
  - Yakıt Tipi: [Diesel ▼]
  - Yakıt Kapasitesi: [1000] L
  - Su Kapasitesi: [300] L
- **İç Mekan**
  - Kabin Sayısı: [3]
  - WC: [2]
  - Duş: [1]

#### Adım 4: Özellikler (Checkboxes)
- ☐ Klimatize
- ☐ Jeneratör
- ☐ GPS
- ☐ Radar
- ☐ Autopilot
- ☐ Fındra
- ☐ VHF
- ☐ Duş
- ☐ Teak İç Döşeme
- ☐ Composite Gövde
- [Tüm Özellikleri Göster]

#### Adım 5: Medya Yükleme
- **Fotoğraflar**
  - [Sürükle & Bırak] veya [Dosya Seç]
  - Maksimum: 50 fotoğraf
  - Yüklenen: 0/50
  - Desteklenen: JPG, PNG, WebP (max 10MB)

- **Videolar**
  - [Sürükle & Bırak] veya [Dosya Seç]
  - Maksimum: 3 video
  - Yüklenen: 0/3
  - Desteklenen: MP4, MOV (max 100MB)

- **YouTube/Vimeo Link**
  - [Video URL] (opsiyonel)

#### Adım 6: Önizleme & Yayınla
- **İlan Önizleme:**
  - İlan kartı preview
  - Başlık, fiyat, lokasyon, özellikler
- **Butonlar:**
  - [← Düzenle] (önceki adıma dön)
  - [Taslak Kaydet] (geri dönüp düzenleme)
  - [Yayınla] (canlı yap)
- **Ödeme:**
  - Paket seçimi (Temel/Standart/Premium)
  - Fiyat: ₺500-₺1.250

---

### 5. Kullanıcı Paneli (/dashboard)

#### Üst Karşılama Bölümü
- "Hoşgeldin, Ahmet!"
- Avatar + İsim: Ahmet Yılmaz ✅ 📱
- Butonlar: [Profil Düzenle] [Çıkış Yap]

#### İstatistik Kartları
- 15 İlan
- 3 Bekleyen
- 1.250 Görünüm
- ₺2.5K Bu Ay

#### Navigasyon Tab'leri
- İlanlarım | Favorilerim | Mesajlarım | Profil Ayarları

#### İlanlarım Tab
- **Aktif İlanlar (12)**
  - İlan kartları grid format
  - Her ilan: Fotoğraf, Başlık, Fiyat, Görünüm sayısı
  - Butonlar: [Düzenle] [Yenile]
- [Tüm İlanları Gör]

#### Favorilerim Tab
- Favori ilanlar listesi
- Her ilan için: Detay, Favoriden Çıkar butonları

#### Mesajlar Tab
- Konuşmalar listesi
- Son mesaj preview
- Okunmamış badge
- Konuşma detayına tıkla

#### Profil Ayarları Tab
- İsim (input)
- Email (readonly)
- Telefon (readonly)
- Avatar yükle
- Şifre değiştir

#### Abonelik Yönetimi Tab
- Mevcut paket
- Yenileme tarihi
- "Paket Yükselt" butonu

---

### 6. Broker Paneli (/broker) - CRM & Analytics

#### Navigasyon Tab'leri
- Dashboard | Mağaza | İlanlar | CRM | Analitik

#### Dashboard
- **İstatistik Kartları**
  - 50 İlan
  - 125 Lead
  - 15.2K Görünüm
  - ₺45K Bu Ay

- **Performans Grafiği**
  - Son 30 gün grafik
  - Görüntülenme trendi

- **Son Lead'ler**
  - Mehmet Demir | Beneteau 50 | İlanla ilgileniyor
  - Ayşe Kaya | Jeanneau 53 | Fiyat sordu
  - Ali Veli | Bavaria 46 | Tekne görmek istiyor
  - [Tüm Lead'leri Gör]

#### Mağaza Tab
- Mağaza adı: [Bodrum Yachting]
- Logo yükle: [Dosya Seç]
- Kapak fotoğrafı yükle: [Dosya Seç]
- Açıklama: [Rich text editor]
- Sosyal medya linkleri:
  - Instagram: [URL]
  - Facebook: [URL]
  - Website: [URL]

#### İlanlar Tab
- İlan listesi (50 ilan)
- Toplu işlemler: [Toplu Seç] [Sil] [Yenile]
- Filtreler: Aktif, Pasif, Süresi Dolmuş
- Her ilan: Başlık, Durum, Görünüm, Eylem (Düzenle/Sil)

#### CRM Tab
- **Lead Listesi**
  - Lead adı, İlan, Tarih, Durum
  - Satır tıkla → Lead detay açılır

- **Lead Detayı**
  - Ad, Email, Telefon
  - İlgilendikleri ilanlar
  - Geçmiş konuşmalar
  - Notlar: [Not ekle]
  - Follow-up tarihi: [Tarih seç]

#### Analitik Tab
- **İlan Performansı**
  - İlan adı, Görünüm, Tıklama, Conversion rate
  - Grafikler (line chart)

- **En Çok Görüntülenen**
  - Beneteau 50: 5.2K
  - Jeanneau 54: 4.1K
  - Bavaria 46: 3.8K

#### Tools
- PDF broşür oluşturucu
- Email templates
- API documentation (Enterprise)

---

### 7. Mesajlaşma Sayfası (/messages) - 2 Kolon Layout

#### Sol Kolon - Konuşmalar Listesi
- Arama bar'ı: [________________] 🔍
- Konuşma item'leri:
  - Avatar + İsim + Son mesaj preview + Zaman + Okunmamış badge (●)
  - Örnek: Mehmet Demir | "İlanla ilgileniyorum..." | 10:30 | ● (2)
  - Örnek: Ayşe Kaya | "Fiyat hakkında" | 09:15
  - Örnek: Ali Veli | "Tekne durumu nasıl?" | Dün

#### Sağ Kolon - Mesaj Görünümü
- **Üst Bölüm - İlan Bilgisi**
  - İlan: Beneteau 50

- **Mesaj History**
  - Sağ taraf (gelen): "Merhaba, ilanınızla ilgileniyorum." (10:25)
  - Sol taraf (giden): "İlanla ilgileniyorum..." (10:30)

- **Alt Bölüm - Input**
  - [________________] (mesaj yazma alanı)
  - [Gönder] butonu

---

### 8. Kategori Sayfası (/category/:slug)

#### Hero Section
- Kategori adı (H1)
- Kategori açıklaması
- İlan sayısı

#### Subcategory Listesi
- Subcategory grid
- İlan sayısı badge'i

#### Öne Çıkan İlanlar
- Premium ilanlar
- Slider format

#### Tüm İlanlar
- İlan listesi
- Filtreleme
- Sıralama

---

### 9. Arama Sonuçları Sayfası (/search)

#### Arama Bar'ı
- Keyword input
- Filtre butonu
- Sıralama dropdown

#### Sonuçlar
- İlan listesi
- "X sonuç bulundu"
- Filtreleme
- Sıralama

#### No Results
- "Sonuç bulunamadı"
- "Filtreleri temizle"
- "Diğer kategorilere göz at"

---

### 10. Ödeme Sayfası (/checkout)

#### Paket Seçimi - 3 Kart Layout
- **Temel**
  - ₺500
  - 30 gün yayın
  - 10 fotoğraf
  - [Seç]

- **Standart**
  - ₺750
  - 60 gün yayın
  - 25 fotoğraf
  - 1 video
  - 7 gün öne çıkarma
  - [Seç]

- **Premium**
  - ₺1.250
  - 90 gün yayın
  - 50 fotoğraf
  - 3 video
  - 30 gün öne çıkarma
  - [Seç]

#### Ödeme Bilgileri Formu
- Kart Numarası: [________________________]
- Son Kullanma: [__ / __]
- CVV: [___]
- Kart Sahibi: [________________________]

#### Güvenlik Badge
- 🔒 Güvenli Ödeme - PCI DSS Uyumlu

#### Ödeme Butonu
- [₺750 Öde]

#### Success Page
- "Ödeme başarılı"
- İlan ID
- "İlanı görüntüle" butonu

---

### 11. Blog (/blog)

#### Blog Listesi
- Blog post kartları
- Thumbnail
- Başlık
- Özet
- Yayın tarihi
- Kategoriler

#### Blog Detay
- Başlık (H1)
- Yazar
- Yayın tarihi
- İçerik (rich text)
- Related posts

---

### 12. SSS (/faq)

#### Kategoriler
- Genel
- İlan Oluşturma
- Ödeme
- Güvenlik
- Broker

#### Sorular
- Accordion format
- Soru (tıklanabilir)
- Cevap (expand)

---

### 13. İletişim (/contact)

#### Form
- İsim (input)
- Email (input)
- Konu (dropdown)
- Mesaj (textarea)
- "Gönder" butonu

#### İletişim Bilgileri
- Email
- Telefon
- Adres

---

### 14. Hakkımızda (/about)

#### İçerik
- Hikayemiz
- Misyon
- Vizyon
- Ekip
- Değerler

---

### 15. Gizlilik Politikası (/privacy)

#### İçerik
- KVKK uyumu
- Veri toplama
- Veri kullanımı
- Çerez politikası
- Kullanıcı hakları

---

### 16. Kullanım Şartları (/terms)

#### İçerik
- Platform kullanım şartları
- İlan kuralları
- Sorumluluklar
- Fesih hakkı

---

## 🎨 UI Bileşenleri

### Button
- Primary (mavi)
- Secondary (gri)
- Outline (border)
- Ghost (transparent)
- Sizes: sm, md, lg

### Input
- Text
- Email
- Tel
- Number
- Textarea
- Select
- Checkbox
- Radio
- File upload

### Card
- İlan kartı
- Kategori kartı
- Broker kartı
- Blog kartı

### Modal
- İletişim formu
- Paylaşım
- Video oynatıcı
- Onay dialog

### Dropdown
- Menü
- Filtre
- Sıralama

### Tabs
- Kategori
- Panel sekmeleri

### Badge
- Rozet (doğrulama)
- Durum (aktif, beklemede)
- İlan sayısı

### Toast
- Success
- Error
- Warning
- Info

---

## 🔍 SEO Özellikleri

### On-Page SEO
- Meta tags (title, description, keywords)
- Open Graph tags
- Twitter Card tags
- Canonical URL
- Robots.txt
- Sitemap.xml

### Structured Data
- Schema.org markup
- Product schema
- LocalBusiness schema
- FAQ schema

### Performance
- Next.js Image optimization
- Lazy loading
- Code splitting
- Minification
- Gzip compression
- CDN (Cloudflare)

---

## 📊 Analitik

### Events
- Page view
- İlan view
- İlan create
- İlan edit
- İlan delete
- Search query
- Filter apply
- Contact click
- Payment success
- Payment fail

### Custom Dimensions
- User type (guest, user, broker)
- Category
- Listing type
- Device type

---

*Son Güncelleme: 2026-01-20*
*Versiyon: 1.1 (Web Wireframe Güncellemesi)*
