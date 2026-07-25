# TeknePazari - Shared API Spesifikasyonu

## 🔌 API Genel Bakış

TeknePazari API'si, web ve mobil uygulamalar tarafından kullanılan RESTful/GraphQL API'dir. Next.js API Routes ile implement edilir.

---

## 🏗️ API Mimarisi

### API Türleri
| API Türü | Kullanım Alanı | Protokol |
|----------|----------------|----------|
| REST API | Genel CRUD işlemleri | HTTP/JSON |
| GraphQL API | Kompleks sorgular (opsiyonel) | HTTP/POST |
| WebSocket | Real-time messaging | WS/WSS |

### API Gateway
- Next.js API Routes (built-in)
- Rate limiting (Vercel edge)
- CORS configuration
- Request validation (Zod)

---

## 🔐 Authentication & Authorization

### Authentication Flow
```
1. Kullanıcı email/telefon girer
2. API OTP gönderir (Resend/Netgsm)
3. Kullanıcı OTP girer
4. API JWT token döner
5. Client token'ı saklar (cookie/localStorage)
6. Sonraki request'lerde token header'da gönderilir
```

### JWT Token Structure
```json
{
  "sub": "user_id",
  "role": "user|broker|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Authorization Headers
```
Authorization: Bearer <jwt_token>
```

### Role-Based Access Control (RBAC)
| Rol | Yetkiler |
|-----|----------|
| **User** | İlan oluştur, düzenle, sil (kendi), mesaj gönder |
| **Broker** | User + Mağaza yönetimi, CRM, API erişimi |
| **Admin** | Broker + Tüm ilanları yönet, kullanıcı yönet, raporlar |

---

## 📊 REST API Endpoints

### Auth Endpoints

#### POST /api/auth/send-otp
Email veya SMS ile OTP gönderir.

**Request:**
```json
{
  "type": "email|phone",
  "identifier": "user@example.com|+905551234567"
}
```

**Response:** 202 Accepted
```json
{
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

#### POST /api/auth/verify-otp
OTP doğrular ve JWT token döner.

**Request:**
```json
{
  "type": "email|phone",
  "identifier": "user@example.com|+905551234567",
  "code": "123456"
}
```

**Response:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "phone": "+905551234567",
    "role": "user",
    "isVerified": true
  }
}
```

#### POST /api/auth/refresh
JWT token yeniler.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:** 200 OK
```json
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

---

### İlan Endpoints

#### GET /api/listings
İlan listesini döner (filtreleme ve sıralama destekler).

**Query Parameters:**
```
?page=1
&limit=20
&category=motoryat
&minPrice=100000
&maxPrice=500000
&year=2020
&location=bodrum
&sort=price_asc
&search=beneteau
```

**Response:** 200 OK
```json
{
  "listings": [
    {
      "id": "lst_123",
      "title": "Beneteau 50",
      "category": "motoryat",
      "price": 450000,
      "currency": "TRY",
      "year": 2020,
      "location": "Bodrum",
      "images": ["url1", "url2"],
      "isPremium": true,
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### GET /api/listings/:id
Tek bir ilan detayını döner.

**Response:** 200 OK
```json
{
  "id": "lst_123",
  "title": "Beneteau 50",
  "description": "Luxury motoryat...",
  "category": "motoryat",
  "subcategory": "flybridge",
  "price": 450000,
  "currency": "TRY",
  "year": 2020,
  "length": 15,
  "beam": 4.5,
  "draft": 1.8,
  "engine": "Volvo Penta D11",
  "engineHours": 1200,
  "fuelType": "diesel",
  "fuelCapacity": 1000,
  "waterCapacity": 300,
  "location": "Bodrum",
  "coordinates": {
    "lat": 37.0344,
    "lng": 27.4305
  },
  "images": [
    {
      "url": "https://...",
      "thumbnail": "https://...",
      "order": 1
    }
  ],
  "videos": [
    {
      "url": "https://...",
      "thumbnail": "https://..."
    }
  ],
  "seller": {
    "id": "usr_456",
    "name": "Ahmet Yılmaz",
    "phone": "+905551234567",
    "isVerified": true,
    "isBroker": true,
    "brokerage": "Bodrum Yachting"
  },
  "features": {
    "airConditioning": true,
    "generator": true,
    "gps": true,
    "radar": true
  },
  "hin": "US-ABC12345D404",
  "hinVerified": true,
  "isPremium": true,
  "views": 1250,
  "favorites": 45,
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-02-01T00:00:00Z"
}
```

#### POST /api/listings
Yeni ilan oluşturur.

**Request:**
```json
{
  "title": "Beneteau 50",
  "description": "Luxury motoryat...",
  "category": "motoryat",
  "subcategory": "flybridge",
  "price": 450000,
  "currency": "TRY",
  "year": 2020,
  "length": 15,
  "beam": 4.5,
  "draft": 1.8,
  "engine": "Volvo Penta D11",
  "engineHours": 1200,
  "fuelType": "diesel",
  "fuelCapacity": 1000,
  "waterCapacity": 300,
  "location": "Bodrum",
  "coordinates": {
    "lat": 37.0344,
    "lng": 27.4305
  },
  "images": ["base64_or_url"],
  "videos": ["base64_or_url"],
  "features": {
    "airConditioning": true,
    "generator": true
  },
  "hin": "US-ABC12345D404"
}
```

**Response:** 201 Created
```json
{
  "id": "lst_123",
  "status": "pending_review",
  "message": "İlanınız incelendikten sonra yayınlanacaktır."
}
```

#### PUT /api/listings/:id
İlan günceller (sadece sahibi).

**Request:** (POST ile aynı)

**Response:** 200 OK
```json
{
  "id": "lst_123",
  "status": "active",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

#### DELETE /api/listings/:id
İlan siler (sadece sahibi).

**Response:** 204 No Content

---

### Kullanıcı Endpoints

#### GET /api/users/me
Mevcut kullanıcı bilgilerini döner.

**Response:** 200 OK
```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "phone": "+905551234567",
  "name": "Ahmet Yılmaz",
  "role": "user",
  "isVerified": true,
  "isPhoneVerified": true,
  "isEmailVerified": true,
  "isVideoVerified": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/users/me
Kullanıcı bilgilerini günceller.

**Request:**
```json
{
  "name": "Ahmet Yılmaz",
  "avatar": "base64_or_url"
}
```

**Response:** 200 OK
```json
{
  "id": "usr_123",
  "name": "Ahmet Yılmaz",
  "avatar": "https://...",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

#### GET /api/users/me/listings
Kullanıcının ilanlarını döner.

**Query Parameters:**
```
?status=active|pending|expired
&page=1
&limit=20
```

**Response:** 200 OK
```json
{
  "listings": [...],
  "stats": {
    "total": 15,
    "active": 10,
    "pending": 2,
    "expired": 3
  }
}
```

#### GET /api/users/me/favorites
Kullanıcının favorilerini döner.

**Response:** 200 OK
```json
{
  "listings": [...]
}
```

---

### Mesajlaşma Endpoints

#### GET /api/conversations
Kullanıcının konuşmalarını döner.

**Response:** 200 OK
```json
{
  "conversations": [
    {
      "id": "conv_123",
      "participant": {
        "id": "usr_456",
        "name": "Mehmet Demir",
        "avatar": "https://..."
      },
      "listing": {
        "id": "lst_789",
        "title": "Beneteau 50",
        "image": "https://..."
      },
      "lastMessage": {
        "content": "İlanla ilgileniyorum",
        "senderId": "usr_456",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      "unreadCount": 2
    }
  ]
}
```

#### GET /api/conversations/:id/messages
Konuşma mesajlarını döner.

**Query Parameters:**
```
?page=1
&limit=50
```

**Response:** 200 OK
```json
{
  "messages": [
    {
      "id": "msg_123",
      "conversationId": "conv_123",
      "senderId": "usr_456",
      "content": "İlanla ilgileniyorum",
      "type": "text",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /api/conversations/:id/messages
Yeni mesaj gönderir.

**Request:**
```json
{
  "content": "İlanla ilgileniyorum",
  "type": "text"
}
```

**Response:** 201 Created
```json
{
  "id": "msg_123",
  "content": "İlanla ilgileniyorum",
  "type": "text",
  "senderId": "usr_123",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Arama Endpoints

#### GET /api/search
Gelişmiş arama yapar (Meilisearch).

**Query Parameters:**
```
?q=beneteau
&filters=category:motoryat,year:2020
&sort=price:asc
&limit=20
```

**Response:** 200 OK
```json
{
  "hits": [...],
  "estimatedTotalHits": 150,
  "processingTimeMs": 12,
  "query": "beneteau"
}
```

---

### Kategori Endpoints

#### GET /api/categories
Tüm kategorileri döner.

**Response:** 200 OK
```json
{
  "categories": [
    {
      "id": "cat_1",
      "name": "Deniz Araçları",
      "slug": "deniz-araclari",
      "icon": "https://...",
      "subcategories": [
        {
          "id": "subcat_1",
          "name": "Motoryat",
          "slug": "motoryat"
        }
      ]
    }
  ]
}
```

---

### Ödeme Endpoints

#### POST /api/payments/create-intent
Ödeme intent'i oluşturur (iyzico/PayTR).

**Request:**
```json
{
  "packageId": "pkg_premium",
  "amount": 750,
  "currency": "TRY"
}
```

**Response:** 200 OK
```json
{
  "paymentId": "pay_123",
  "paymentUrl": "https://iyzico.com/...",
  "amount": 750,
  "currency": "TRY"
}
```

#### POST /api/payments/webhook
Ödeme sağlayıcısından webhook alır.

**Request:** (iyzico/PayTR format)

**Response:** 200 OK

---

### Admin Endpoints

#### GET /api/admin/listings
Tüm ilanları döner (admin/broker).

**Query Parameters:**
```
?status=pending
&page=1
&limit=50
```

#### PUT /api/admin/listings/:id/status
İlan durumunu günceller.

**Request:**
```json
{
  "status": "active|rejected|expired"
}
```

#### GET /api/admin/stats
Platform istatistiklerini döner.

**Response:** 200 OK
```json
{
  "users": {
    "total": 5000,
    "newThisMonth": 500
  },
  "listings": {
    "total": 2500,
    "active": 2000,
    "pending": 50
  },
  "revenue": {
    "thisMonth": 125000,
    "thisYear": 1500000
  }
}
```

---

## 📡 WebSocket API (Real-time Messaging)

### Connection
```
wss://api.teknepazari.com/ws
```

### Authentication
Query parameter ile JWT token:
```
wss://api.teknepazari.com/ws?token=<jwt_token>
```

### Events

#### Client → Server
```json
{
  "event": "subscribe",
  "conversationId": "conv_123"
}
```

```json
{
  "event": "message",
  "conversationId": "conv_123",
  "content": "Merhaba",
  "type": "text"
}
```

#### Server → Client
```json
{
  "event": "message",
  "data": {
    "id": "msg_123",
    "conversationId": "conv_123",
    "senderId": "usr_456",
    "content": "Merhaba",
    "type": "text",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

```json
{
  "event": "typing",
  "conversationId": "conv_123",
  "userId": "usr_456"
}
```

---

## 🚨 Error Responses

### Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes
| Code | Açıklama |
|------|----------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Error Codes
| Code | Açıklama |
|------|----------|
| VALIDATION_ERROR | Geçersiz giriş verisi |
| AUTH_INVALID_TOKEN | Geçersiz JWT token |
| AUTH_TOKEN_EXPIRED | JWT token süresi doldu |
| AUTH_INVALID_OTP | Geçersiz OTP |
| LISTING_NOT_FOUND | İlan bulunamadı |
| LISTING_EXPIRED | İlan süresi doldu |
| LISTING_LIMIT_REACHED | İlan limitine ulaşıldı |
| USER_NOT_FOUND | Kullanıcı bulunamadı |
| USER_UNAUTHORIZED | Yetkisiz işlem |
| PAYMENT_FAILED | Ödeme başarısız |
| RATE_LIMIT_EXCEEDED | İstek limiti aşıldı |

---

## 🔄 Rate Limiting

### Rate Limit Kuralları
| Endpoint | Limit | Pencere |
|----------|-------|---------|
| /api/auth/send-otp | 3 | 1 saat |
| /api/auth/verify-otp | 10 | 1 saat |
| /api/listings (GET) | 100 | 1 dakika |
| /api/listings (POST) | 5 | 1 saat |
| /api/conversations/*/messages | 20 | 1 dakika |

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

---

## 📝 API Versioning

### Version Strategy
- URL-based versioning: `/api/v1/...`
- Header-based versioning: `Accept: application/vnd.teknepazari.v1+json`

### Deprecation Policy
- Minimum 6 ay önceden deprecation notice
- Sunset header: `Sunset: Sun, 01 Jan 2025 00:00:00 GMT`

---

*Son Güncelleme: 2026-01-19*
*Versiyon: 1.0 (Project Specs)*
