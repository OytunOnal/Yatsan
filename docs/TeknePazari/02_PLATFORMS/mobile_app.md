# TeknePazari - Mobile App Spesifikasyonu

## 📱 Platform Genel Bakış

TeknePazari mobil uygulaması, React Native (Expo) ile geliştirilen, iOS ve Android için tek codebase kullanan bir uygulamadır.

---

## 🎯 Platform Hedefleri

| Platform | Minimum Versiyon | Hedef Kitle |
|----------|------------------|-------------|
| iOS | 14.0+ | iPhone 8 ve sonrası |
| Android | 8.0 (API 26)+ | Çoğu Android cihaz |

---

## 📱 Mobil Özellikleri

### 1. Ana Ekran
- Arama bar'ı (voice search destekli)
- Kategori carousel'i
- Öne çıkan ilanlar
- Yakınımdaki ilanlar (GPS ile)
- Son görüntülenen
- Push notification banner

### 2. Arama ve Listeleme
- Gelişmiş filtreler (kategori, fiyat, yıl, lokasyon)
- Grid/List görünümü
- Harita görünümü (Mapbox)
- Sonsuz scroll
- Kaydetme ve paylaşma

### 3. İlan Detay
- Fullscreen galeri (swipe)
- Pinch-to-zoom
- Video oynatıcı
- Tekne özellikleri
- Konum haritası
- Doğrudan arama butonu
- WhatsApp butonu
- Mesaj gönderme
- Favorilere ekle
- Paylaş

### 4. İlan Oluşturma
- Kamera ile fotoğraf çekimi
- Galeriden fotoğraf seçimi
- Video çekimi
- Form wizard (adım adım)
- GPS ile konum belirleme
- Taslak kaydetme
- Preview

### 5. Kullanıcı Paneli
- İlanlarım (liste, düzenle, yenile, sil)
- Favorilerim
- Mesajlar (in-app messaging)
- Bildirimler
- Profil ayarları
- Abonelik yönetimi

### 6. Broker Paneli
- Mağaza yönetimi
- İlan listesi
- Lead takibi
- Performans özeti
- Hızlı ilan oluşturma

---

## 🔔 Push Notifications

### Notification Türleri
| Tür | Tetikleyici | Aksiyon |
|-----|-------------|---------|
| Yeni mesaj | Kullanıcı mesaj aldığında | Mesaja git |
| İlan onaylandı | İlan moderasyonu geçtiğinde | İlana git |
| Favoride fiyat düştü | Fiyat güncellemesi | İlana git |
| Yeni ilan (kayıtlı arama) | Eşleşen ilan | Arama sonuçlarına git |
| Promosyon | Kampanya duyurusu | Kampanya sayfasına git |
| İlan süresi dolmak üzere | 3 gün kala | Yenileme sayfasına git |

### Push Notification Provider
- **iOS:** Apple Push Notification Service (APNs)
- **Android:** Firebase Cloud Messaging (FCM)
- **Cross-platform:** OneSignal veya Expo Notifications

---

## 📷 Kamera ve Medya

### Kamera Özellikleri
- Fotoğraf çekimi (max 50 fotoğraf)
- Video çekimi (max 3 video, 60 sn/video)
- HDR desteği
- Flash kontrolü
- Grid overlay

### Medya İşleme
- Fotoğraf optimizasyonu (max 2048px, WebP)
- Video sıkıştırma (H.264, max 720p)
- Yükleme progress bar'ı
- Background upload (opsiyonel)

### Galeriden Seçim
- Multi-select
- Drag-to-reorder
- Preview
- Remove

---

## 🗺️ Harita ve Konum

### Harita Özellikleri
- İlan konumu gösterme
- Yakınımdaki ilanlar
- Marina konumları
- Cluster markers (çok ilan)
- Rota gösterme (navigation)

### Konum Servisleri
- GPS ile konum belirleme
- Konum paylaşımı izni (opsiyonel)
- Background location (OFF)
- Pil optimizasyonu

### Harita Provider
- **Mapbox GL** (primary)
- React Native Maps alternatif

---

## 📹 Video Doğrulama (WebRTC)

### Video Call Özellikleri
- Canlı video görüşme
- Moderatör ile bağlantı
- Tekne doğrulama (canlı)
- Kayıt (opsiyonel)
- Ekran paylaşımı (ops)

### WebRTC Provider
- **Daily.co** veya **Twilio**
- Self-hosted (Janus, ops)

---

## 🔐 Güvenlik

### Authentication
- Email login (Resend)
- SMS login (Netgsm)
- Biometric (Face ID, Touch ID, Fingerprint)
- PIN kodu (opsiyonel)
- Session yönetimi

### Veri Güvenliği
- Secure storage (Keychain/Keystore)
- HTTPS only
- Certificate pinning (opsiyonel)
- Jailbreak/Root detection (opsiyonel)

### Kişisel Veri
- KVKK uyumu
- Veri minimizasyonu
- Kullanıcı rızası
- Veri silme hakkı

---

## 💾 Offline Desteği

### Offline Kullanım
- Son görüntülenen ilanlar (cache)
- Favoriler (cache)
- Taslak ilanlar (local storage)
- Mesaj taslakları (local storage)

### Sync Mekanizması
- Network durumu kontrolü
- Auto-sync (online olunca)
- Conflict resolution

### Storage
- AsyncStorage (key-value)
- MMKV (performans gerekli olanlar)
- SQLite (kompleks veri)

---

## 📊 Analitik

### Analitik Provider
- **Firebase Analytics** (primary)
- **Mixpanel** (opsiyonel)

### İzlenen Events
- Ekran görüntüleme
- Arama sorguları
- İlan görüntüleme
- İletişim tıklamaları
- İlan oluşturma adımları
- Satın alma

### Crash Reporting
- **Sentry** veya **Firebase Crashlytics**

---

## 🎨 UI/UX

### Design System
- Renk paleti (web ile tutarlı)
- Tipografi (Inter veya SF Pro)
- Spacing scale (4, 8, 12, 16, 24, 32)
- Border radius (8, 12, 16)

### Native Components
- Bottom Tab Navigation
- Stack Navigation
- Modal sheets
- Action sheets
- Haptic feedback
- Pull-to-refresh
- Swipe actions

### Accessibility
- VoiceOver/TalkBack desteği
- Dynamic type (font scaling)
- Reduced motion
- Color contrast

---

## 🚀 App Store Dağıtımı

### iOS (App Store)
- App Store Connect
- TestFlight (beta)
- App Store Review Guidelines uyumu
- In-App Purchase (abonelikler)

### Android (Google Play)
- Google Play Console
- Internal testing / Closed testing
- Google Play policies uyumu
- Google Play Billing (abonelikler)

### Release Süreci
1. Development build
2. QA testing
3. Beta release (TestFlight / Internal)
4. Production release
5. Staged rollout (Android)

---

## 📦 Tech Stack

### Framework
- React Native 0.73+
- Expo SDK 50+
- TypeScript 5

### Navigation
- React Navigation 6
- Bottom Tabs + Stack

### State Management
- Zustand (simple)
- TanStack Query (API state)

### UI Components
- NativeWind (Tailwind for RN)
- React Native Paper veya Tamagui

### Native Modules
- expo-camera
- expo-image-picker
- expo-location
- expo-notifications
- @react-native-mapbox-gl/maps
- expo-av (video)

### Backend Communication
- Axios veya fetch
- GraphQL (Apollo Client, ops)

---

## 📐 Performans Hedefleri

### Startup Time
- Cold start: < 2s
- Warm start: < 1s

### Frame Rate
- 60 FPS (smooth scrolling)
- Jank-free animations

### Memory
- Background memory: < 100MB
- Peak memory: < 300MB

### Bundle Size
- iOS: < 50MB
- Android: < 30MB (APK)

---

## 🔧 Development Workflow

### Local Development
```bash
# Expo start
npx expo start

# iOS simulator
npx expo run:ios

# Android emulator
npx expo run:android
```

### Build & Deploy
```bash
# Development build
eas build --profile development --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform all
```

### Environment Variables
```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_ONESIGNAL_APP_ID=
```

---

*Son Güncelleme: 2026-01-19*
*Versiyon: 1.0 (Project Specs)*
