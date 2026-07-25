# TeknePazari - Web Tech Stack

## 🌐 Web Platform Teknoloji Yığını

TeknePazari web platformu için kullanılan teknolojiler ve araçlar.

---

## 🎯 Stack Özeti

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Framework | Next.js | 14.x |
| Runtime | Node.js | 20.x LTS |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | Latest |
| Database ORM | Prisma | 5.x |
| Database | PostgreSQL | 15.x |
| Search | Meilisearch | 1.x |
| Cache | Redis | 7.x |
| Auth | NextAuth.js | 5.x |
| Storage | Cloudflare R2 | - |
| Email | Resend | - |
| SMS | Netgsm | - |
| Payment | iyzico | - |
| Maps | Mapbox GL | 3.x |
| Hosting | Vercel | - |

---

## 📦 Paketler ve Bağımlılıklar

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

### Styling

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@radix-ui/react-*": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### Database & ORM

```json
{
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0"
  }
}
```

### Authentication

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.0",
    "@auth/prisma-adapter": "^1.0.0",
    "bcrypt": "^5.1.0",
    "jose": "^5.0.0"
  }
}
```

### Validation

```json
{
  "dependencies": {
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0"
  }
}
```

### Search & Cache

```json
{
  "dependencies": {
    "meilisearch": "^0.36.0",
    "ioredis": "^5.3.0"
  }
}
```

### File Upload & Storage

```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.450.0",
    "@aws-sdk/s3-request-presigner": "^3.450.0",
    "sharp": "^0.32.0"
  }
}
```

### Email & SMS

```json
{
  "dependencies": {
    "resend": "^2.0.0",
    "axios": "^1.6.0"
  }
}
```

### Payment

```json
{
  "dependencies": {
    "iyzipay": "^2.0.0"
  }
}
```

### Maps

```json
{
  "dependencies": {
    "mapbox-gl": "^3.0.0",
    "react-map-gl": "^7.1.0"
  }
}
```

### Real-time

```json
{
  "dependencies": {
    "socket.io": "^4.7.0",
    "socket.io-client": "^4.7.0"
  }
}
```

### Utilities

```json
{
  "dependencies": {
    "date-fns": "^2.30.0",
    "nanoid": "^5.0.0",
    "slugify": "^1.6.0"
  }
}
```

### Development

```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

---

## 📁 Proje Yapısı

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth routes group
│   │   ├── login/
│   │   ├── register/
│   │   └── verify/
│   ├── (main)/               # Main routes group
│   │   ├── page.tsx          # Homepage
│   │   ├── listings/
│   │   │   ├── page.tsx      # Listing list
│   │   │   ├── [id]/         # Listing detail
│   │   │   └── new/          # Create listing
│   │   ├── search/
│   │   ├── categories/
│   │   ├── messages/
│   │   └── dashboard/
│   ├── (broker)/             # Broker routes
│   │   └── broker/
│   ├── (admin)/              # Admin routes
│   │   └── admin/
│   ├── api/                  # API routes
│   │   ├── auth/
│   │   ├── listings/
│   │   ├── users/
│   │   ├── messages/
│   │   ├── payments/
│   │   └── search/
│   ├── layout.tsx
│   └── globals.css
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── forms/                # Form components
│   ├── listings/             # Listing components
│   ├── layout/               # Layout components
│   └── shared/               # Shared components
├── lib/                      # Utility functions
│   ├── prisma.ts             # Prisma client
│   ├── meilisearch.ts        # Meilisearch client
│   ├── redis.ts              # Redis client
│   ├── auth.ts               # Auth utilities
│   ├── storage.ts            # S3/R2 utilities
│   └── utils.ts              # General utilities
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types
├── styles/                   # Global styles
└── config/                   # Configuration files
```

---

## ⚙️ Konfigürasyon

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0066CC",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#00A3E0",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FF6600",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  phone         String?   @unique
  name          String?
  image         String?
  role          UserRole  @default(USER)
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  listings      Listing[]
  favorites     Favorite[]
  conversations Conversation[]
  messages      Message[]
}

enum UserRole {
  USER
  BROKER
  ADMIN
}

model Listing {
  id          String        @id @default(cuid())
  userId      String
  title       String
  description String
  category    String
  subcategory String?
  price       Int
  currency    String        @default("TRY")
  year        Int?
  location    String
  lat         Float?
  lng         Float?
  status      ListingStatus @default(PENDING)
  isPremium   Boolean       @default(false)
  views       Int           @default(0)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  expiresAt   DateTime?

  user        User          @relation(fields: [userId], references: [id])
  details     ListingDetail?
  images      Image[]
  favorites   Favorite[]
}

enum ListingStatus {
  DRAFT
  PENDING
  ACTIVE
  PAUSED
  EXPIRED
  DELETED
}
```

---

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/teknepazari"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"

# SMS (Netgsm)
NETGSM_USERCODE="xxxxx"
NETGSM_PASSWORD="xxxxx"
NETGSM_HEADER="TeknePazari"

# Search (Meilisearch)
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY="xxxxx"

# Cache (Redis)
REDIS_URL="redis://localhost:6379"

# Storage (Cloudflare R2)
CLOUDFLARE_ACCOUNT_ID="xxxxx"
CLOUDFLARE_R2_ACCESS_KEY="xxxxx"
CLOUDFLARE_R2_SECRET_KEY="xxxxx"
CLOUDFLARE_R2_BUCKET="teknepazari"

# Payment (iyzico)
IYZICO_API_KEY="xxxxx"
IYZICO_SECRET_KEY="xxxxx"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"

# Maps (Mapbox)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.xxxxx"

# Monitoring (Sentry)
SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
```

---

## 🚀 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Build & Deploy

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Deploy (Vercel)
vercel --prod
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 📊 Performance Optimizations

### Next.js Optimizations

1. **Image Optimization:** next/image
2. **Code Splitting:** Dynamic imports
3. **Incremental Static Regeneration:** ISR for listings
4. **Server Components:** Default RSC
5. **Streaming:** Suspense boundaries

### Database Optimizations

1. **Connection Pooling:** PgBouncer (production)
2. **Indexes:** Category, location, price, created_at
3. **Query Optimization:** Prisma select/include
4. **Caching:** Redis layer

### Frontend Optimizations

1. **Bundle Size:** Tree shaking, code splitting
2. **Lazy Loading:** Components, images
3. **Caching:** SWR / TanStack Query
4. **CDN:** Static assets via Cloudflare

---

## 🔐 Security Checklist

- [ ] HTTPS everywhere
- [ ] CSP headers
- [ ] Rate limiting
- [ ] Input validation (Zod)
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection (React)
- [ ] CSRF protection (NextAuth)
- [ ] Secure cookies
- [ ] API key rotation
- [ ] Secrets management

---

*Son Güncelleme: 2026-01-20*
*Versiyon: 1.1 (Web Wireframe Güncellemesi)*
