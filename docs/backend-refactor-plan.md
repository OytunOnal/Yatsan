# Backend Refactor Planı

## Proje Genel Bakış

**Proje:** TeknePazari - Denizcilik İlan Platformu  
**Backend:** Node.js + Express + Drizzle ORM + PostgreSQL  
**Durum:** MVP tamamlandı, refactor ve optimizasyon gerekli

---

## 🔴 Kritik Sorunlar (Acil Düzeltme Gerekli)

### 1. auth.routes.ts Duplication

**Dosya:** [`backend/src/routes/auth.routes.ts`](backend/src/routes/auth.routes.ts)

**Sorun:**
- Satır 8: `JWT_SECRET = 'your-secret-key'` hardcoded
- Satır 18-31: Duplicate `authMiddleware` tanımlanmış
- Satır 10-16: Duplicate `declare global`

**Çözüm:**
```typescript
// Şu anki durum:
const JWT_SECRET = 'your-secret-key'; // ❌
const authMiddleware = ... // ❌ Duplicate

// Olması gereken:
import { authMiddleware } from '../middleware/auth'; // ✅
```

**Etki:** Güvenlik açığı, kod tekrarı

---

### 2. Kullanılmayan Error Class'lar

**Dosya:** [`backend/src/errors/auth.errors.ts`](backend/src/errors/auth.errors.ts)

**Sorun:**
- `InvalidResetTokenError`, `ResetTokenExpiredError`, `TooManyResetRequestsError` tanımlanmış
- Hiçbir yerde kullanılmıyor

**Çözüm:**
- Ya kullan
- Ya da sil

**Öneri:** Merkezi error handling sistemi kur, bu class'ları kullan

---

## 🟡 Orta Öncelikli Sorunlar

### 3. N+1 Query Problemi

**Dosyalar:**
- [`backend/src/controllers/admin.controller.ts`](backend/src/controllers/admin.controller.ts:34-42)
- [`backend/src/controllers/dashboard.controller.ts`](backend/src/controllers/dashboard.controller.ts:76-85)

**Sorun:**
```typescript
// Şu anki durum (N+1 query):
const listings = await db.select().from(listings).limit(20);
const listingsWithImages = await Promise.all(
  listings.map(async (listing) => {
    const images = await db.select().from(listingImages)
      .where(eq(listingImages.listing_id, listing.id)); // ❌ N sorgu
    return { ...listing, images };
  })
);
```

**Çözüm:**
```typescript
// JOIN ile tek sorgu:
const listings = await db.select({
  listing: listings,
  user: { id: users.id, email: users.email },
  images: listingImages, // LEFT JOIN ile
})
.from(listings)
.leftJoin(users, eq(listings.userId, users.id))
.leftJoin(listingImages, eq(listings.id, listingImages.listing_id));
```

**Etki:** Performans artışı, az veritabanı yükü

---

### 4. Response Format Tutarsızlığı

**Sorun:**
```typescript
// Farklı formatlar:
{ success: true, message: '...' }  // auth.controller.ts
{ listings: [...], total: 10 }      // listing.controller.ts
{ message: '...' }                  // admin.controller.ts
{ user: {...} }                     // profile.controller.ts
```

**Çözüm:** Standart API Response format

```typescript
// backend/src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Kullanım:
res.json<ApiResponse>({
  success: true,
  data: { listings },
  meta: { page: 1, limit: 20, total: 100 }
});
```

---

### 5. Kullanılmayan Validation Dosyası

**Dosya:** [`backend/src/validations/listing.validation.ts`](backend/src/validations/listing.validation.ts)

**Sorun:**
- Artık handler'lar içinde validation var
- Bu dosya kullanılmıyor

**Çözüm:** Dosyayı sil veya frontend ile paylaşmak için kullan

---

### 6. Merkezi Error Handler Eksik

**Sorun:**
- Her controller'da try-catch blokları
- Error handling tutarsız

**Çözüm:** Express error handling middleware

```typescript
// backend/src/middleware/errorHandler.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.errors
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

// server.ts
app.use(errorHandler);
```

---

## 🟢 İyileştirme Önerileri

### 7. Service Layer Oluşturma

**Mevcut Durum:** Business logic controller'larda

**Önerilen Yapı:**
```
backend/src/
├── services/
│   ├── auth.service.ts
│   ├── listing.service.ts
│   ├── message.service.ts
│   ├── user.service.ts
│   └── email.service.ts (mevcut)
├── controllers/
│   ├── auth.controller.ts (sadece HTTP handling)
│   ├── listing.controller.ts
│   └── ...
```

**Avantajları:**
- Business logic separation
- Test edilebilirlik
- Kod yeniden kullanılabilirliği

---

### 8. Type Safety İyileştirmeleri

**Sorun:**
```typescript
req.user?: any  // ❌ any type
req.db?: typeof db  // ✅ daha iyi ama yeterli değil
```

**Çözüm:**
```typescript
// backend/src/types/express.ts
import type { JwtPayload } from 'jsonwebtoken';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from '../db/schema';

export interface AuthUser extends JwtPayload {
  id: string;
  email: string;
  userType: 'ADMIN' | 'individual' | 'corporate';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      db: PostgresJsDatabase<typeof schema>;
    }
  }
}
```

---

### 9. Environment Variables Dokümante Et

**Oluşturulacak:** `backend/.env.example`

```bash
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/teknepazari

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Upload
MAX_FILE_SIZE=10485760
MAX_FILES=15
UPLOAD_DIR=uploads
```

---

### 10. Controller İsimlendirmesi

**Mevcut:** `admin.controller.ts`  
**Öneri:** `listing-approval.controller.ts`

Daha açıklayıcı isimlendirme.

---

## 📋 Refactor Checklist

### Faz 1: Kritik Sorunlar (Acil)
- [ ] `auth.routes.ts` duplication'ı düzelt
- [ ] `errors/auth.errors.ts` kullan veya sil
- [ ] Environment variables dokümante et

### Faz 2: Performans (Orta)
- [ ] N+1 query sorunlarını çöz
- [ ] Response format standardizasyonu
- [ ] Merkezi error handler ekle

### Faz 3: Mimari İyileştirme (Uzun Vadeli)
- [ ] Service layer oluştur
- [ ] Type safety iyileştir
- [ ] Kullanılmayan dosyaları temizle
- [ ] Unit testler ekle

---

## 🎯 Öncelik Sırası

1. **auth.routes.ts** - Güvenlik açığı, acil!
2. **N+1 Query** - Performans sorunu
3. **Error Handler** - Kod kalitesi
4. **Service Layer** - Uzun vadeli sürdürülebilirlik
5. **Type Safety** - Geliştirici deneyimi

---

## 📊 Mevcut Yapı Analizi

```
backend/src/
├── controllers/     (7 dosya, ~1200 satır)
├── db/             (1 dosya, schema)
├── errors/         (1 dosya, kullanılmıyor)
├── handlers/       (6 dosya, yeni eklendi ✅)
├── lib/            (1 dosya, db connection)
├── middleware/     (5 dosya)
├── routes/         (6 dosya)
├── services/       (1 dosya, email)
├── types/          (1 dosya, yeni eklendi ✅)
└── validations/    (2 dosya, 1'i kullanılmıyor)
```

**Toplam:** ~30 dosya, ~3000+ satır kod

---

## 🔗 İlişkili Dokümanlar

- [Database Design](./database-design.md)
- [API Documentation](./api-documentation.md) - oluşturulmalı
- [Deployment Guide](./deployment.md) - oluşturulmalı
