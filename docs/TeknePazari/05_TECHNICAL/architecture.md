# TeknePazari - Sistem Mimarisi

## 🏗️ Mimari Genel Bakış

TeknePazari, modern, ölçeklenebilir ve güvenli bir sistem mimarisine sahiptir.

---

## 📐 Mimari Yaklaşım

### Mimari Türü
- **Monolithic + Microservices Hibrit**
- Next.js App Router (monolithic frontend + API)
- Microservices (opsiyonel: messaging, search, notifications)

### Mimari İlkeleri
1. **Separation of Concerns:** Her katman bağımsız
2. **Scalability:** Yatay ve dikey ölçeklenebilir
3. **Security:** Defense in depth
4. **Performance:** Cache-first yaklaşım
5. **Reliability:** High availability

---

## 🏛️ Sistem Katmanları

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │   Web (Next.js)     │  │  Mobile (RN/Expo)   │              │
│  │  - React 18         │  │  - React Native     │              │
│  │  - Tailwind CSS     │  │  - NativeWind       │              │
│  │  - shadcn/ui        │  │  - Expo SDK         │              │
│  └─────────────────────┘  └─────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Next.js API Routes (App Router)                        │   │
│  │  - REST API                                             │   │
│  │  - GraphQL (opsiyonel)                                  │   │
│  │  - WebSocket (real-time messaging)                      │   │
│  │  - Rate Limiting                                        │   │
│  │  - CORS                                                 │   │
│  │  - Request Validation (Zod)                             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Auth       │  │   Listing    │  │   Message    │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   User       │  │   Payment    │  │   Search     │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Broker     │  │   Admin      │  │   Notify     │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │  Meilisearch │  │   Redis      │         │
│  │  (Primary)   │  │  (Search)    │  │   (Cache)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Cloudflare  │  │   S3/R2      │  │   CDN        │         │
│  │    R2        │  │  (Backup)    │  │  (Images)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Netgsm     │  │   Resend     │  │   iyzico     │         │
│  │   (SMS)      │  │   (Email)    │  │  (Payment)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Mapbox     │  │   Daily.co   │  │   Sentry     │         │
│  │   (Maps)     │  │  (WebRTC)    │  │  (Logging)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Servis Mimarisi

### Core Services

#### 1. Auth Service
- JWT token yönetimi
- OTP doğrulama (Email/SMS)
- Session yönetimi
- Biometric auth (mobil)
- Role-based access control (RBAC)

#### 2. Listing Service
- İlan CRUD işlemleri
- İlan moderasyonu
- İlan arama ve filtreleme
- İlan istatistikleri
- HIN doğrulama

#### 3. Message Service
- Real-time messaging (WebSocket)
- Conversation yönetimi
- Message persistence
- Typing indicators
- Read receipts

#### 4. User Service
- Kullanıcı profili
- Kullanıcı doğrulama
- Favori yönetimi
- Bildirim tercihleri

#### 5. Payment Service
- Ödeme işleme (iyzico)
- Abonelik yönetimi
- Fatura oluşturma
- Refund işleme

#### 6. Search Service
- Full-text search (Meilisearch)
- Filtreleme
- Sıralama
- Faceted search

#### 7. Broker Service
- Mağaza yönetimi
- CRM (lead tracking)
- Performans analitikleri
- PDF broşür oluşturma

#### 8. Admin Service
- İlan moderasyonu
- Kullanıcı yönetimi
- Platform istatistikleri
- Report yönetimi

#### 9. Notification Service
- Push notifications (FCM/APNs)
- Email notifications
- SMS notifications
- In-app notifications

---

## 💾 Veritabanı Mimarisi

### PostgreSQL Schema

```sql
-- Users
users (id, email, phone, name, role, is_verified, created_at)

-- Listings
listings (id, user_id, title, description, category, price, year, location, status, created_at)

-- Listing Details
listing_details (id, listing_id, make, model, length, beam, draft, engine, fuel_type)

-- Images
images (id, listing_id, url, order, created_at)

-- Messages
conversations (id, listing_id, buyer_id, seller_id, created_at)
messages (id, conversation_id, sender_id, content, created_at)

-- Favorites
favorites (id, user_id, listing_id, created_at)

-- Payments
payments (id, user_id, listing_id, amount, status, created_at)

-- Subscriptions
subscriptions (id, user_id, plan_id, status, expires_at)

-- Notifications
notifications (id, user_id, type, content, read_at, created_at)
```

### Meilisearch Indexes

```json
{
  "listings": {
    "primaryKey": "id",
    "searchableAttributes": ["title", "description", "make", "model"],
    "filterableAttributes": ["category", "price", "year", "location"],
    "sortableAttributes": ["price", "year", "created_at"]
  }
}
```

### Redis Cache Structure

```
# Session
session:{user_id} -> {session_data}

# Cache
listing:{listing_id} -> {listing_data}
user:{user_id} -> {user_data}
search:{query_hash} -> {search_results}

# Rate Limiting
rate_limit:{user_id}:{endpoint} -> {count}

# Locks
lock:listing:{listing_id} -> {timestamp}
```

---

## 🔄 Data Flow

### İlan Oluşturma Flow

```
1. Client → API Gateway: POST /api/listings
2. API Gateway → Listing Service: Create listing
3. Listing Service → PostgreSQL: Insert listing
4. Listing Service → Cloudflare R2: Upload images
5. Listing Service → Meilisearch: Index listing
6. Listing Service → Notification Service: Notify admin
7. API Gateway → Client: Return listing ID
```

### İlan Arama Flow

```
1. Client → API Gateway: GET /api/search?q=beneteau
2. API Gateway → Redis: Check cache
3. Cache miss → Meilisearch: Search
4. Meilisearch → API Gateway: Return results
5. API Gateway → Redis: Cache results
6. API Gateway → Client: Return results
```

### Mesajlaşma Flow

```
1. Client → API Gateway: WebSocket connect
2. API Gateway → Message Service: Authenticate
3. Client → Message Service: Send message
4. Message Service → PostgreSQL: Store message
5. Message Service → Notification Service: Push notification
6. Message Service → Client: Broadcast message
```

---

## 🔐 Güvenlik Mimarisi

### Security Layers

1. **Network Security**
   - HTTPS/TLS 1.3
   - Cloudflare DDoS protection
   - WAF rules

2. **Application Security**
   - Input validation (Zod)
   - SQL injection prevention (Prisma ORM)
   - XSS protection (React escaping)
   - CSRF protection (Next.js built-in)

3. **Authentication Security**
   - JWT with short expiry
   - Refresh token rotation
   - Rate limiting on auth endpoints
   - IP-based blocking

4. **Data Security**
   - Encryption at rest (PostgreSQL)
   - Encryption in transit (TLS)
   - PII data masking
   - Secure key management

---

## 🚀 Deployment Mimarisi

### Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN (Cloudflare)                        │
│  - Static assets                                               │
│  - DDoS protection                                            │
│  - Edge caching                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Load Balancer (Vercel)                       │
│  - Traffic distribution                                        │
│  - Health checks                                               │
│  - SSL termination                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Servers                          │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │  Server 1 (Vercel)  │  │  Server 2 (Vercel)  │              │
│  │  - Next.js App      │  │  - Next.js App      │              │
│  │  - API Routes       │  │  - API Routes       │              │
│  └─────────────────────┘  └─────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database Cluster                             │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │  Primary (Master)   │  │  Replica (Slave)    │              │
│  │  - PostgreSQL       │  │  - PostgreSQL       │              │
│  │  - Read/Write       │  │  - Read only        │              │
│  └─────────────────────┘  └─────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Staging Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hetzner Cloud (Self-hosted)                   │
│  - Single server                                               │
│  - Docker containers                                           │
│  - PostgreSQL (local)                                          │
│  - Meilisearch (local)                                         │
│  - Redis (local)                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Monitoring ve Logging

### Monitoring Stack

| Tool | Kullanım |
|------|----------|
| **Sentry** | Error tracking, performance monitoring |
| **Vercel Analytics** | Web vitals, traffic |
| **DataDog** (ops) | Infrastructure monitoring |
| **LogRocket** (ops) | Session replay |

### Logging Strategy

```
Application Logs → Sentry → Alerts
                    ↓
                  Dashboard

Error Logs → Sentry → PagerDuty → On-call
```

---

## 🔄 Backup ve Disaster Recovery

### Backup Strategy

| Veri | Backup Türü | Sıklık | Retention |
|-----|-------------|--------|-----------|
| PostgreSQL | Full dump | Daily | 30 gün |
| PostgreSQL | WAL | Continuous | 7 gün |
| Cloudflare R2 | Cross-region | Daily | 90 gün |
| Redis | RDB | Hourly | 7 gün |

### Disaster Recovery

- **RTO (Recovery Time Objective):** < 4 saat
- **RPO (Recovery Point Objective):** < 1 saat
- **Multi-region:** Opsiyonel (Phase 3)

---

## 🚀 Scalability Planı

### Horizontal Scaling

| Bileşen | Scaling Stratejisi |
|---------|-------------------|
| Web Servers | Vercel auto-scaling |
| API Servers | Vercel auto-scaling |
| PostgreSQL | Read replicas |
| Meilisearch | Cluster mode |
| Redis | Cluster mode |

### Vertical Scaling

| Bileşen | Minimum | Recommended |
|---------|---------|-------------|
| Web Server | 1 vCPU, 512MB | 4 vCPU, 8GB |
| Database | 2 vCPU, 4GB | 8 vCPU, 32GB |
| Search | 1 vCPU, 2GB | 4 vCPU, 16GB |
| Cache | 1 vCPU, 1GB | 2 vCPU, 4GB |

---

## 🌐 Network Topology

```
Internet
    │
    ▼
Cloudflare CDN
    │
    ▼
Vercel Edge Network
    │
    ├─► US East
    ├─► US West
    ├─► Europe West
    └─► Turkey (Istanbul)
         │
         ▼
    Hetzner (Germany)
         │
         ├─► PostgreSQL
         ├─► Meilisearch
         └─► Redis
```

---

*Son Güncelleme: 2026-01-19*
*Versiyon: 1.0 (Project Specs)*
