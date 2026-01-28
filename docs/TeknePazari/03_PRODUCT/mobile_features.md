# TeknePazari - Mobile App Özellikleri

## 📱 Mobile App Genel Bakış

TeknePazari mobil uygulaması, iOS ve Android platformlarında React Native (Expo) ile geliştirilen native uygulama özelliklerini içerir.

---

## 📱 Ekran Yapısı

### 1. Splash Screen

#### Özellikler
- Logo animasyonu
- Loading indicator
- App version display
- Otomatik login kontrolü

---

### 2. Onboarding Screens

#### Ekranlar
1. **Hoşgeldiniz** - TeknePazari tanıtımı
2. **Arama** - Binlerce ilan arasından seçin
3. **Güvenlik** - Doğrulanmış satıcılar
4. **Başlayalım** - "Giriş Yap" veya "Kayıt Ol"

#### Özellikler
- Swipe gesture
- Skip butonu
- Progress dots

---

### 3. Ana Ekran (Home)

#### Hero Section
- Arama bar'ı (tıklanınca arama sayfasına git)
- Voice search icon (mikrofon)

#### Kategori Carousel
- Horizontal scroll
- 10 ana kategori
- İkon + isim

#### Yakınımdaki İlanlar
- GPS tabanlı
- Horizontal scroll
- Mesafe bilgisi

#### Öne Çıkan İlanlar
- Premium ilanlar
- Vertical list
- Quick view

#### Son Görüntülenenler
- LocalStorage'dan çekilen
- Horizontal scroll

---

### 4. Arama Ekranı (Search)

#### Arama Bar'ı
- Text input
- Clear butonu
- Voice search (mikrofon)

#### Son Aramalar
- Tıklanabilir chips
- Clear all butonu

#### Popüler Aramalar
- Trend keywords
- Tıklanabilir

#### Filtre Butonu
- Bottom sheet filter
- Kategori
- Fiyat aralığı
- Lokasyon
- Yıl
- Marka
- Özellikler

#### Sıralama
- Action sheet
- Tarih, Fiyat, Popülerlik

#### Sonuçlar
- Grid view (2 columns)
- List view (opsiyonel)
- Pull-to-refresh
- Infinite scroll

---

### 5. İlan Listeleme Ekranı (Listings)

#### Filter Bar
- Kategori chips
- "Filtrele" butonu

#### İlan Kartları
- Thumbnail
- Başlık
- Fiyat
- Lokasyon
- Premium badge
- Favori butonu

#### Empty State
- "İlan bulunamadı"
- "Filtreleri temizle" butonu

---

### 6. İlan Detay Ekranı (Listing Detail)

#### Navigation Bar
- Back butonu
- Share butonu
- Favorite butonu (heart)

#### Galeri
- Full-width carousel
- Pinch-to-zoom
- Tap for fullscreen
- Video player (varsa)

#### İlan Bilgileri
- Başlık
- Fiyat (bold)
- Lokasyon
- Yayın tarihi

#### Tekne Özellikleri
- Collapsible section
- Key-value pairs
- HIN bilgisi (doğrulanmış badge)

#### Satıcı Kartı
- Avatar
- İsim
- Doğrulama rozetleri
- "İletişime Geç" butonu
- "Telefonu Göster" butonu
- "WhatsApp" butonu

#### Konum Haritası
- Mapbox mini harita
- Tıklanınca navigasyon uygulamasına yönlendir

#### İlan Açıklaması
- Collapsible section
- Rich text

#### Benzer İlanlar
- Horizontal scroll
- 4-6 ilan

#### Bottom Action Bar
- "İletişime Geç" butonu (primary)
- Telefon icon butonu
- Favori icon butonu

---

### 7. İlan Oluşturma Ekranı (Create Listing)

#### Wizard Steps

**Adım 1: Kategori**
- Kategori listesi
- Subcategory listesi

**Adım 2: Fotoğraflar**
- Kamera butonu (camera permission)
- Galeri butonu
- Drag-to-reorder
- Remove butonu
- Max 50 fotoğraf

**Adım 3: Video (Opsiyonel)**
- Video çek butonu
- Video seç butonu
- Max 3 video (60sn/video)

**Adım 4: Temel Bilgiler**
- Başlık (input)
- Fiyat (numeric input)
- Para birimi (picker)
- Açıklama (textarea)

**Adım 5: Tekne Detayları**
- Marka (picker)
- Model (input)
- Yıl (picker)
- Uzunluk, genişlik, draft (inputs)
- Motor bilgileri (inputs)

**Adım 6: Lokasyon**
- GPS butonu (auto-fill)
- Şehir picker
- Adres input
- Harita (pin drop)

**Adım 7: Özellikler**
- Checkbox listesi
- Klimatize, Jeneratör, GPS, Radar...

**Adım 8: Önizleme**
- Full preview
- "Düzenle" butonu
- "Yayınla" butonu
- "Taslak Kaydet" butonu

#### Progress Bar
- Step indicator
- Back/Next butonları

---

### 8. Mesajlar Ekranı (Messages)

#### Konuşmalar Listesi
- Avatar
- İsim
- Son mesaj preview
- Zaman damgası
- Unread badge
- İlan thumbnail

#### Konuşma Detay
- Navigation bar (geri, ilan'a git)
- Mesaj bubbles
- Typing indicator
- Input field
- Send butonu
- Attachment butonu (opsiyonel)

#### Empty State
- "Henüz mesajınız yok"
- "İlanlara göz atın"

---

### 9. Favoriler Ekranı (Favorites)

#### Favori İlanlar
- Grid view
- İlan kartları
- "Favoriden Çıkar" swipe action

#### Empty State
- "Henüz favoriniz yok"
- "İlanlara göz atın"

---

### 10. Profil Ekranı (Profile)

#### Profil Header
- Avatar (tıklanınca değiştir)
- İsim
- Email
- Doğrulama rozetleri

#### Menü Listesi
- İlanlarım
- Favorilerim
- Mesajlarım
- Bildirim Ayarları
- Gizlilik Ayarları
- Yardım & Destek
- Hakkımızda
- Çıkış Yap

#### İlanlarım
- Aktif ilanlar
- Bekleyen ilanlar
- Süresi dolmuş ilanlar
- Taslaklar

#### Bildirim Ayarları
- Push notifications toggle
- Email notifications toggle
- SMS notifications toggle

---

### 11. Broker Paneli (Broker Panel)

#### Dashboard
- İstatistik kartları
- İlan sayısı
- Görüntülenme
- Lead sayısı

#### Mağaza Ayarları
- Logo yükle
- Kapak yükle
- Açıklama
- Sosyal linkler

#### İlan Yönetimi
- Tüm ilanlar
- Toplu işlemler
- Quick actions

#### CRM
- Lead listesi
- Lead detayları
- Notlar

---

### 12. Bildirimler Ekranı (Notifications)

#### Bildirim Listesi
- Icon
- Başlık
- Açıklama
- Zaman damgası
- Okunmamış indicator

#### Bildirim Türleri
- Yeni mesaj
- İlan onaylandı
- Fiyat düştü (favori)
- Yeni ilan (kayıtlı arama)
- Promosyon

---

### 13. Login/Register Ekranları

#### Login
- Email/Telefon input
- "OTP Gönder" butonu
- OTP input
- "Giriş Yap" butonu
- "Kayıt Ol" link

#### Register
- İsim input
- Email input
- Telefon input
- "OTP Gönder" butonu
- OTP input
- "Kayıt Ol" butonu
- "Giriş Yap" link

#### Biometric
- Face ID prompt (iOS)
- Touch ID prompt (iOS)
- Fingerprint prompt (Android)

---

## 📲 Native Özellikler

### 1. Kamera

#### Fotoğraf Çekimi
- expo-camera
- HDR desteği
- Flash kontrolü
- Grid overlay
- Çoklu çekim

#### Video Çekimi
- Max 60 saniye
- Resolution: 720p
- Compression

### 2. Galeri

#### Fotoğraf Seçimi
- expo-image-picker
- Multi-select
- Recent photos
- Albums

#### Video Seçimi
- Max 3 video
- Duration check
- Size check

### 3. GPS/Konum

#### Konum Alma
- expo-location
- Foreground only
- Accuracy: high

#### Konum Gösterme
- Mapbox GL
- Pin markers
- Cluster markers

### 4. Push Notifications

#### Setup
- expo-notifications
- FCM (Android)
- APNs (iOS)

#### Notification Types
- Foreground
- Background
- Tap action

### 5. Biometric Auth

#### Face ID / Touch ID (iOS)
- expo-local-authentication
- Fallback to PIN

#### Fingerprint (Android)
- expo-local-authentication
- Fallback to PIN

### 6. Deep Linking

#### Universal Links (iOS)
- teknepazari.com/listings/:id

#### App Links (Android)
- teknepazari.com/listings/:id

### 7. Share

#### Native Share
- expo-sharing
- Share listing URL
- Share listing image

### 8. Haptic Feedback

#### Feedback Types
- Light
- Medium
- Heavy
- Success
- Error

---

## 🔔 Push Notification Türleri

| Tür | Başlık | Açıklama | Action |
|-----|--------|----------|--------|
| Yeni Mesaj | "Yeni mesajınız var" | "Ahmet size mesaj gönderdi" | Mesaja git |
| İlan Onaylandı | "İlanınız yayında" | "Beneteau 50 ilanınız onaylandı" | İlana git |
| Fiyat Düştü | "Fiyat düştü!" | "Favori ilanınızın fiyatı düştü" | İlana git |
| Yeni İlan | "Yeni ilan" | "Kayıtlı aramanızla eşleşen ilan" | Arama sonuçlarına git |
| İlan Süresi | "İlanınız sona eriyor" | "3 gün içinde sona erecek" | Yenileme sayfasına git |
| Promosyon | "Özel teklif" | "%50 indirim fırsatı" | Kampanya sayfasına git |

---

## 💾 Offline Desteği

### Cached Data
- Son görüntülenen ilanlar
- Favoriler
- Kategori listesi
- Kullanıcı profili

### Local Storage
- Taslak ilanlar
- Mesaj taslakları
- Arama geçmişi
- Oturum bilgisi

### Sync
- Network durumu kontrolü
- Auto-sync when online
- Conflict resolution

---

## 📊 Analitik Events

### Screen Views
- Home screen
- Search screen
- Listing detail
- Create listing
- Messages
- Profile

### User Actions
- Search query
- Filter applied
- Listing viewed
- Listing favorited
- Contact clicked
- Listing created
- Message sent
- Photo taken
- Video recorded

### Conversion Events
- Registration
- First listing
- First message
- Payment success

---

## ⚡ Performance Optimizasyonları

### Image Optimization
- Lazy loading
- Progressive loading
- Caching
- Thumbnail generation

### List Optimization
- FlatList (not ScrollView)
- Item memoization
- Virtualization
- Infinite scroll

### Navigation
- Lazy loading screens
- Preloading critical screens
- Stack optimization

### Memory
- Image memory management
- Cache clearing
- Background cleanup

---

## ♿ Erişilebilirlik

### VoiceOver/TalkBack
- accessibilityLabel
- accessibilityHint
- accessibilityRole

### Dynamic Type
- Font scaling support
- Minimum touch target (44x44)

### Motion
- Reduced motion support
- Animation toggle

### Contrast
- Minimum 4.5:1
- High contrast mode support

---

## 🔐 Güvenlik

### Secure Storage
- Keychain (iOS)
- Keystore (Android)
- JWT token storage

### Network Security
- HTTPS only
- Certificate pinning (opsiyonel)

### App Security
- Jailbreak/Root detection (opsiyonel)
- Screenshot prevention (opsiyonel)
- Biometric auth

---

*Son Güncelleme: 2026-01-19*
*Versiyon: 1.0 (Project Specs)*
