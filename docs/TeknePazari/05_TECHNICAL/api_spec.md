# TeknePazari - API Spesifikasyonu

## 🔌 API Genel Bakış

TeknePazari API'si, web ve mobil uygulamalar tarafından kullanılan RESTful API'dir.

---

## 📋 API Standartları

### HTTP Methods
- **GET:** Kaynak okuma
- **POST:** Yeni kaynak oluşturma
- **PUT:** Kaynak güncelleme (tam)
- **PATCH:** Kaynak güncelleme (kısmi)
- **DELETE:** Kaynak silme

### Response Format
```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

### Error Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": []
  },
  "meta": {}
}
```

---

## 🔐 Authentication

### POST /api/auth/send-otp
OTP gönderir.

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
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "expiresIn": 300
  }
}
```

### POST /api/auth/verify-otp
OTP doğrular.

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
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "phone": "+905551234567",
      "role": "user",
      "isVerified": true
    }
  }
}
```

### POST /api/auth/refresh
Token yeniler.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

## 📊 Listings API

### GET /api/listings
İlan listesini döner.

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
  "success": true,
  "data": {
    "listings": [
      {
        "id": "lst_123",
        "title": "Beneteau 50",
        "category": "motoryat",
        "subcategory": "flybridge",
        "price": 450000,
        "currency": "TRY",
        "year": 2020,
        "length": 15,
        "location": "Bodrum",
        "images": [
          {
            "url": "https://...",
            "thumbnail": "https://...",
            "order": 1
          }
        ],
        "isPremium": true,
        "isVerified": true,
        "views": 1250,
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
}
```

### GET /api/listings/:id
Tek bir ilan detayını döner.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
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
    "images": [...],
    "videos": [...],
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
}
```

### POST /api/listings
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
  "success": true,
  "data": {
    "id": "lst_123",
    "status": "pending_review",
    "message": "İlanınız incelendikten sonra yayınlanacaktır."
  }
}
```

### PUT /api/listings/:id
İlan günceller.

**Request:** (POST ile aynı)

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": "lst_123",
    "status": "active",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

### DELETE /api/listings/:id
İlan siler.

**Response:** 204 No Content

---

## 👤 Users API

### GET /api/users/me
Mevcut kullanıcı bilgilerini döner.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": "usr_123",
    "email": "user@example.com",
    "phone": "+905551234567",
    "name": "Ahmet Yılmaz",
    "avatar": "https://...",
    "role": "user",
    "isVerified": true,
    "isPhoneVerified": true,
    "isEmailVerified": true,
    "isVideoVerified": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/users/me
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
  "success": true,
  "data": {
    "id": "usr_123",
    "name": "Ahmet Yılmaz",
    "avatar": "https://...",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

### GET /api/users/me/listings
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
  "success": true,
  "data": {
    "listings": [...],
    "stats": {
      "total": 15,
      "active": 10,
      "pending": 2,
      "expired": 3
    }
  }
}
```

### GET /api/users/me/favorites
Kullanıcının favorilerini döner.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "listings": [...]
  }
}
```

### POST /api/users/me/favorites/:listingId
İlanı favorilere ekler.

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "message": "İlan favorilere eklendi"
  }
}
```

### DELETE /api/users/me/favorites/:listingId
İlanı favorilerden çıkarır.

**Response:** 204 No Content

---

## 💬 Messages API

### GET /api/conversations
Kullanıcının konuşmalarını döner.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
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
          "image": "https://...",
          "price": 450000
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
}
```

### GET /api/conversations/:id/messages
Konuşma mesajlarını döner.

**Query Parameters:**
```
?page=1
&limit=50
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123",
        "conversationId": "conv_123",
        "senderId": "usr_456",
        "content": "İlanla ilgileniyorum",
        "type": "text",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100
    }
  }
}
```

### POST /api/conversations/:id/messages
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
  "success": true,
  "data": {
    "id": "msg_123",
    "content": "İlanla ilgileniyorum",
    "type": "text",
    "senderId": "usr_123",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🔍 Search API

### GET /api/search
Gelişmiş arama yapar.

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
  "success": true,
  "data": {
    "hits": [...],
    "estimatedTotalHits": 150,
    "processingTimeMs": 12,
    "query": "beneteau"
  }
}
```

---

## 📁 Categories API

### GET /api/categories
Tüm kategorileri döner.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_1",
        "name": "Deniz Araçları",
        "slug": "deniz-araclari",
        "icon": "https://...",
        "count": 5000,
        "subcategories": [
          {
            "id": "subcat_1",
            "name": "Motoryat",
            "slug": "motoryat",
            "count": 2000
          }
        ]
      }
    ]
  }
}
```

### POST /api/categories/suggest
Yeni alt kategori önerir (Kullanıcı Tanımlı Kategori).

**Request:**
```json
{
  "name": "Superyat Aksesuarları",
  "description": "40m+ tekneler için özel aksesuarlar",
  "parentCategoryId": "cat_2"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "suggestionId": "sug_123",
    "name": "Superyat Aksesuarları",
    "status": "PENDING",
    "message": "Öneriniz alındı. Admin onayından sonra aktif olacaktır.",
    "estimatedReviewTime": "24-48 saat"
  }
}
```

**Error Response:** 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Günlük kategori öneri limitine ulaştınız (3/gün)",
    "details": {
      "limit": 3,
      "resetAt": "2026-01-24T00:00:00Z"
    }
  }
}
```

### GET /api/categories/suggestions
Kullanıcının kategori önerilerini listeler.

**Query Parameters:**
```
?status=PENDING|APPROVED|REJECTED|MERGED
&page=1
&limit=20
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "sug_123",
        "name": "Superyat Aksesuarları",
        "description": "40m+ tekneler için özel aksesuarlar",
        "parentCategory": {
          "id": "cat_2",
          "name": "Deniz Aracı Ekipmanları"
        },
        "status": "PENDING",
        "listingCount": 5,
        "createdAt": "2026-01-23T10:00:00Z",
        "reviewedAt": null,
        "mergedWith": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3
    }
  }
}
```

### GET /api/admin/categories/suggestions
Admin - Bekleyen kategori önerilerini listeler.

**Query Parameters:**
```
?status=PENDING
&sortBy=listingCount:desc
&page=1
&limit=50
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "sug_123",
        "name": "Superyat Aksesuarları",
        "description": "40m+ tekneler için özel aksesuarlar",
        "parentCategory": {
          "id": "cat_2",
          "name": "Deniz Aracı Ekipmanları"
        },
        "suggestedBy": {
          "id": "usr_456",
          "name": "Ahmet Yılmaz",
          "email": "ahmet@example.com"
        },
        "status": "PENDING",
        "listingCount": 12,
        "similarCategories": [
          {
            "id": "cat_25",
            "name": "Yat Aksesuarları",
            "similarity": 0.85
          }
        ],
        "autoApprovalEligible": true,
        "createdAt": "2026-01-22T10:00:00Z"
      }
    ],
    "stats": {
      "pending": 15,
      "autoApprovalEligible": 3,
      "needsReview": 12
    }
  }
}
```

### PATCH /api/admin/categories/suggestions/:id/approve
Admin - Kategori önerisini onaylar.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "newCategoryId": "cat_125",
    "name": "Superyat Aksesuarları",
    "status": "APPROVED",
    "affectedListings": 12,
    "message": "Kategori oluşturuldu ve 12 ilan bu kategoriye taşındı"
  }
}
```

### PATCH /api/admin/categories/suggestions/:id/reject
Admin - Kategori önerisini reddeder.

**Request:**
```json
{
  "reason": "Mevcut 'Yat Aksesuarları' kategorisi kullanılabilir"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "status": "REJECTED",
    "reason": "Mevcut 'Yat Aksesuarları' kategorisi kullanılabilir",
    "notificationSent": true
  }
}
```

### PATCH /api/admin/categories/suggestions/:id/merge
Admin - Kategori önerisini mevcut kategoriyle birleştirir.

**Request:**
```json
{
  "targetCategoryId": "cat_25"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "status": "MERGED",
    "targetCategory": {
      "id": "cat_25",
      "name": "Yat Aksesuarları"
    },
    "affectedListings": 12,
    "message": "12 ilan 'Yat Aksesuarları' kategorisine taşındı"
  }
}
```

---

## 💳 Payments API

### POST /api/payments/create-intent
Ödeme intent'i oluşturur.

**Request:**
```json
{
  "packageId": "pkg_premium",
  "amount": 750,
  "currency": "TRY",
  "listingId": "lst_123"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123",
    "paymentUrl": "https://iyzico.com/...",
    "amount": 750,
    "currency": "TRY"
  }
}
```

### POST /api/payments/webhook
Ödeme webhook'u alır.

**Request:** (iyzico format)

**Response:** 200 OK

---

## 🔔 Notifications API

### GET /api/notifications
Kullanıcının bildirimlerini döner.

**Query Parameters:**
```
?page=1
&limit=20
&unread=true
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123",
        "type": "new_message",
        "title": "Yeni mesajınız var",
        "body": "Mehmet size mesaj gönderdi",
        "data": {
          "conversationId": "conv_123"
        },
        "readAt": null,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

### PUT /api/notifications/:id/read
Bildirimi okundu olarak işaretler.

**Response:** 200 OK

---

## 🛡️ Admin API

### GET /api/admin/listings
Tüm ilanları döner.

**Query Parameters:**
```
?status=pending
&page=1
&limit=50
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "listings": [...],
    "stats": {
      "total": 2500,
      "active": 2000,
      "pending": 50,
      "expired": 450
    }
  }
}
```

### PUT /api/admin/listings/:id/status
İlan durumunu günceller.

**Request:**
```json
{
  "status": "active|rejected|expired",
  "reason": "İlan uygun"
}
```

**Response:** 200 OK

### GET /api/admin/stats
Platform istatistiklerini döner.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 5000,
      "newThisMonth": 500,
      "active": 3500
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
}
```

---

## 📊 WebSocket API

### Connection
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

## 🚨 Error Codes

| Code | HTTP | Açıklama |
|------|------|----------|
| VALIDATION_ERROR | 422 | Geçersiz giriş verisi |
| AUTH_INVALID_TOKEN | 401 | Geçersiz JWT token |
| AUTH_TOKEN_EXPIRED | 401 | JWT token süresi doldu |
| AUTH_INVALID_OTP | 401 | Geçersiz OTP |
| LISTING_NOT_FOUND | 404 | İlan bulunamadı |
| LISTING_EXPIRED | 400 | İlan süresi doldu |
| LISTING_LIMIT_REACHED | 400 | İlan limitine ulaşıldı |
| USER_NOT_FOUND | 404 | Kullanıcı bulunamadı |
| USER_UNAUTHORIZED | 403 | Yetkisiz işlem |
| PAYMENT_FAILED | 400 | Ödeme başarısız |
| RATE_LIMIT_EXCEEDED | 429 | İstek limiti aşıldı |
| INTERNAL_ERROR | 500 | Sunucu hatası |

---

## 📝 Rate Limiting

| Endpoint | Limit | Pencere |
|----------|-------|---------|
| /api/auth/send-otp | 3 | 1 saat |
| /api/auth/verify-otp | 10 | 1 saat |
| /api/listings (GET) | 100 | 1 dakika |
| /api/listings (POST) | 5 | 1 saat |
| /api/conversations/*/messages | 20 | 1 dakika |
| /api/categories/suggest | 3 | 1 gün |
| /api/categories/suggestions | 50 | 1 saat |

---

*Son Güncelleme: 2026-01-23*
*Versiyon: 1.1 (Kullanıcı Tanımlı Alt Kategori Özelliği Eklendi)*

---

*Eski:
Son Güncelleme: 2026-01-19*
*Versiyon: 1.0 (Project Specs)*
