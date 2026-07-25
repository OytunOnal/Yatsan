# Frontend Analiz Raporu - TeknePazari

Bu doküman frontend kodlarının detaylı analizi, yapılacaklar listesi, öneriler ve güvenlik iyileştirmelerini içerir.

---

## 📊 GENEL DURUM

### Teknoloji Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS 3
- **State Management**: React Hook Form, TanStack Query
- **HTTP Client**: Axios
- **Validation**: Zod
- **Icons**: Lucide React

### Proje Yapısı
```
frontend/
├── src/
│   ├── app/              # Next.js App Router sayfaları
│   ├── components/       # React bileşenleri
│   │   ├── dashboard/    # Dashboard bileşenleri
│   │   ├── forms/        # Form bileşenleri
│   │   └── listings/     # İlan bileşenleri
│   └── lib/
│       └── api.ts        # API client ve type definitions
```

---

## 🔴 KRİTİK GÜVENLİK SORUNLARI

### 1. Hardcoded API URL
**Dosya**: [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts:4)

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3001/api',  // ❌ HARDCODED
});
```

**Sorun**: API URL'i kod içine gömülmüş. Production'da çalışmaz.

**Çözüm**: Environment variable kullanın.
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});
```

### 2. XSS Açığı - dangerouslySetInnerHTML Kullanımı
**Dosya**: [`frontend/src/components/listings/ListingCard.tsx`](frontend/src/components/listings/ListingCard.tsx)

Eğer kullanıcı girdisi HTML olarak render ediliyorsa XSS açığı vardır.

**Çözüm**: Tüm kullanıcı girdilerini sanitize edin veya React'in varsayılan escaping'ini kullanın.

### 3. Token Storage - LocalStorage
**Dosya**: [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts:13)

```typescript
const token = localStorage.getItem('token');  // ❌ XSS saldırılarına açık
```

**Sorun**: LocalStorage XSS saldırılarına açıktır. Token çalınabilir.

**Çözüm**: 
- HttpOnly cookies kullanın (önerilen)
- Veya memory storage + session storage kombinasyonu

### 4. CSRF Koruması Yok
**Sorun**: CSRF token kontrolü yapılmıyor.

**Çözüm**: Backend'e CSRF protection ekleyin ve frontend'de her request'te gönderin.

### 5. Content Security Policy (CSP) Yok
**Dosya**: [`frontend/next.config.js`](frontend/next.config.js)

**Sorun**: CSP header'ları yapılandırılmamış.

**Çözüm**:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com;"
          }
        ]
      }
    ];
  }
};
```

---

## 🟡 ORTA ÖNCELİKLİ SORUNLAR

### 6. API Type Duplication
**Dosya**: [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts)

**Sorun**: Type definitions backend ile duplicate. Backend'de değişiklik yapınca frontend'de de güncellemek gerekiyor.

**Çözüm**: 
- OpenAPI/Swagger kullanın ve types otomatik generate edin
- Veya shared types package oluşturun

### 7. Error Handling Yetersiz
**Dosya**: [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts:29)

```typescript
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  // Redirect to login if needed  // ❌ Comment only, no actual redirect
}
```

**Sorun**: 401'de redirect yapılmıyor, kullanıcı bilgilendirilmiyor.

**Çözüm**: Global error handler ve toast notification ekleyin.

### 8. Loading States Tutarsız
**Sorun**: Her component kendi loading state'ini yönetiyor. Tekrarlı kod.

**Çözüm**: Global loading provider veya TanStack Query'nin loading state'ini kullanın.

### 9. Pagination Type Safety
**Dosya**: [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts:212)

```typescript
export interface PaginatedResponse<T> {
  data?: T[];
  listings?: T[];
  messages?: T[];
  conversations?: Conversation[];
  // ❌ Why multiple properties?
}
```

**Sorun**: Type safety eksik. Hangi response hangi property'i kullanıyor belirsiz.

**Çözüm**:
```typescript
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

### 10. Mobile Menu Implementasyonu Eksik
**Dosya**: [`frontend/src/components/Header.tsx`](frontend/src/components/Header.tsx:80)

```typescript
<button className="md:hidden text-gray-700">
  {/* ❌ Button var ama menu yok */}
</button>
```

**Sorun**: Hamburger menu butonu var ama açılır menu implementasyonu yok.

---

## 🟢 DÜŞÜK ÖNCELİKLİ İYİLEŞTİRMELER

### 11. Environment Variables Eksik
**Dosya**: [`frontend/`](frontend/)

**Sorun**: `.env.local` veya `.env.example` dosyası yok.

**Çözüm**: `.env.local` oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=TeknePazari
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 12. SEO Meta Tags Yetersiz
**Dosya**: [`frontend/src/app/layout.tsx`](frontend/src/app/layout.tsx:9)

```typescript
export const metadata: Metadata = {
  title: 'TeknePazari',
  description: 'TeknePazari application',  // ❌ Generic description
};
```

**Çözüm**: Her sayfa için proper meta tags ekleyin.

### 13. Image Optimization
**Sorun**: `next/image` kullanılmıyor, tüm img tag'leri normal HTML img.

**Çözüm**: Next.js Image component'i kullanın:
```tsx
import Image from 'next/image';
<Image src="/logo.png" alt="TeknePazari" width={200} height={50} />
```

### 14. Font Loading
**Dosya**: [`frontend/src/app/layout.tsx`](frontend/src/app/layout.tsx:7)

```typescript
const inter = Inter({ subsets: ['latin'] });  // ✅ Good, but could be optimized
```

**Öneri**: `display: 'swap'` ekleyin:
```typescript
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});
```

### 15. Console.log'lar Temizlenmeli
**Dosya**: [`frontend/src/app/dashboard/layout.tsx`](frontend/src/app/dashboard/layout.tsx:45)

```typescript
console.error('Failed to fetch user data:', error);  // ❌ Production'da olmamalı
```

**Çözüm**: Logging library kullanın (Sentry, LogRocket vb.)

---

## 📋 YAPILACAKLAR LİSTESİ

### Faz 1: Kritik Güvenlik (Acil)
- [ ] Environment variables ekle (`.env.local`)
- [ ] API URL'i environment variable'dan al
- [ ] HttpOnly cookie-based auth implement et
- [ ] CSP headers ekle
- [ ] CSRF protection ekle
- [ ] XSS vulnerability scan yap

### Faz 2: Kod Kalitesi
- [ ] Global error handler ekle
- [ ] Toast notification system ekle
- [ ] Loading states'i standardize et
- [ ] Type definitions'ı düzelt
- [ ] Console.log'ları temizle
- [ ] Mobile menu implement et

### Faz 3: UX/Performance
- [ ] SEO meta tags iyileştir
- [ ] Next.js Image component kullan
- [ ] Font loading optimize et
- [ ] Lazy loading ekle
- [ ] Skeleton loading ekle
- [ ] Error boundaries ekle

### Faz 4: Testing
- [ ] Unit tests ekle (Jest + React Testing Library)
- [ ] E2E tests ekle (Playwright/Cypress)
- [ ] Accessibility test yap

### Faz 5: Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Performance monitoring (Web Vitals)

---

## 🎯 ÖNERİLER

### Architecture
1. **Feature-based folder structure** düşünün:
   ```
   src/
   ├── features/
   │   ├── auth/
   │   ├── listings/
   │   ├── messages/
   │   └── profile/
   ├── shared/
   │   ├── ui/
   │   ├── hooks/
   │   └── utils/
   ```

2. **Custom Hooks** oluşturun:
   - `useAuth()` - Auth state management
   - `useListings()` - Listings CRUD
   - `useMessages()` - Messages CRUD

3. **Context API** veya **Zustand** kullanın:
   - Global state management
   - Auth state
   - Theme state

### Performance
1. **React.memo** kullanın gereksiz re-render'ları önlemek için
2. **useMemo** ve **useCallback** kullanın
3. **Code splitting** yapın:
   ```typescript
   const Dashboard = dynamic(() => import('./Dashboard'), {
     loading: () => <LoadingSpinner />
   });
   ```

### Accessibility
1. **ARIA labels** ekleyin
2. **Keyboard navigation** destekleyin
3. **Screen reader** testleri yapın
4. **Color contrast** kontrol edin

---

## 🔧 GÜVENLİK CHECKLIST

| Konu | Durum | Notlar |
|------|-------|--------|
| HTTPS | ⚠️ | Production'da zorunlu |
| HttpOnly Cookies | ❌ | LocalStorage kullanılıyor |
| CSRF Protection | ❌ | Yok |
| XSS Protection | ⚠️ | React varsayılan koruma sağlıyor |
| CSP Headers | ❌ | Yok |
| Rate Limiting | ⚠️ | Backend'de var, frontend'de yok |
| Input Validation | ✅ | Zod kullanılıyor |
| Output Encoding | ✅ | React otomatik yapıyor |
| Auth Token Storage | ❌ | LocalStorage (güvensiz) |
| API Key Protection | ⚠️ | Environment variable gerekli |

---

## 📦 ÖNERİLEN PAKETLER

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.12.0",  // ✅ Var
    "zustand": "^4.4.0",                 // 🆕 Global state
    "react-hot-toast": "^2.4.0",         // 🆕 Toast notifications
    "next-themes": "^0.2.0",             // 🆕 Dark mode
    "sharp": "^0.33.0"                   // 🆕 Image optimization
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",       // 🆕 E2E testing
    "@testing-library/react": "^14.1.0", // 🆕 Unit testing
    "eslint-plugin-jsx-a11y": "^6.8.0",  // 🆕 Accessibility linting
    "@sentry/nextjs": "^7.90.0"          // 🆕 Error tracking
  }
}
```

---

## 🚀 SONRAKİ ADIMLAR

1. **Acil**: Environment variables ve güvenlik düzeltmeleri
2. **Kısa vade**: Error handling ve loading states
3. **Orta vade**: Testing ve monitoring
4. **Uzun vade**: Performance optimization ve accessibility

---

## 📝 NOTLAR

- Backend refactor tamamlandı, frontend refactor planlanmalı
- API types backend ile senkronize edilmeli
- Authentication flow yeniden düşünülmeli (HttpOnly cookies)
- Mobile responsive test yapılmalı
- Accessibility audit yapılmalı
