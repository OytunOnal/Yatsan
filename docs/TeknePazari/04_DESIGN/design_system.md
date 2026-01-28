# TeknePazari - Design System

## 🎨 Design System Genel Bakış

TeknePazari design sistemi, web ve mobil platformlar arasında tutarlı bir görsel kimlik ve kullanıcı deneyimi sağlar.

---

## 📐 Temel İlkeler

1. **Tutarlılık:** Tüm platformlarda aynı tasarım dili
2. **Erişilebilirlik:** WCAG 2.1 AA uyumu
3. **Basitlik:** Minimal ve clean tasarım
4. **Güvenilirlik:** Profesyonel ve şeffaf görünüm
5. **Hızlılık:** Performans-odaklı tasarım

---

## 🎯 Renk Paleti

### Primary Colors (Birincil)

| Renk | Hex | RGB | Kullanım |
|------|-----|-----|----------|
| **Deniz Mavisi** | #0066CC | 0, 102, 204 | Butonlar, linkler, vurgulu öğeler |
| **Açık Mavi** | #00A3E0 | 0, 163, 224 | Hover states, secondary buttons |
| **Turuncu** | #FF6600 | 255, 102, 0 | CTA (Call-to-Action), attention |

### Secondary Colors (İkincil)

| Renk | Hex | RGB | Kullanım |
|------|-----|-----|----------|
| **Başarı Yeşil** | #1DB854 | 29, 184, 84 | Success states, accepted |
| **Hata Kırmızı** | #E94B3C | 233, 75, 60 | Errors, rejected |
| **Uyarı Sarısı** | #FFA500 | 255, 165, 0 | Warnings, pending |
| **Info Mavi** | #0066CC | 0, 102, 204 | Information, notifications |

### Neutral Colors (Nötr)

| Renk | Hex | RGB | Kullanım |
|------|-----|-----|----------|
| **Beyaz** | #FFFFFF | 255, 255, 255 | Background, text |
| **Açık Gri** | #F5F5F5 | 245, 245, 245 | Secondary background |
| **Orta Gri** | #E0E0E0 | 224, 224, 224 | Borders, dividers |
| **Koyu Gri** | #666666 | 102, 102, 102 | Secondary text |
| **Çok Koyu Gri** | #333333 | 51, 51, 51 | Primary text |

### Semantic Colors

| Durum | Renk | Hex |
|-------|------|-----|
| Success | Yeşil | #1DB854 |
| Error | Kırmızı | #E94B3C |
| Warning | Sarı | #FFA500 |
| Info | Mavi | #0066CC |

---

## 🔤 Tipografi

### Font Family

- **Heading:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Body:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Font Sizes

| Seviye | Size | Weight | Line Height | Kullanım |
|--------|------|--------|-------------|----------|
| **H1** | 32px | 700 | 1.4 | Sayfa başlığı |
| **H2** | 28px | 700 | 1.4 | Bölüm başlığı |
| **H3** | 24px | 700 | 1.4 | Alt bölüm başlığı |
| **H4** | 20px | 700 | 1.4 | Card başlığı |
| **Body Large** | 16px | 400 | 1.6 | Açıklamalar |
| **Body Regular** | 14px | 400 | 1.6 | Normal metin |
| **Body Small** | 12px | 400 | 1.5 | Yardımcı metin |
| **Label** | 12px | 600 | 1.4 | Form labels |
| **Caption** | 11px | 400 | 1.4 | Çok küçük metin |

### Font Weights

- **Light:** 300
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

---

## 📏 Spacing Scale

```
4px  - xs
8px  - sm
12px - md
16px - lg
24px - xl
32px - 2xl
48px - 3xl
64px - 4xl
```

### Kullanım Örnekleri
- **Padding:** 16px (lg)
- **Margin:** 16px-24px (lg-xl)
- **Gap:** 12px (md)
- **Border Radius:** 8px

---

## 🎭 Border Radius

| Tür | Value | Kullanım |
|-----|-------|----------|
| Small | 4px | Inputs, small buttons |
| Medium | 8px | Cards, moderate elements |
| Large | 12px | Large containers |
| Extra Large | 16px | Very large containers |
| Full | 9999px | Circular, pills |

---

## 🎨 Bileşenler

### Button Component

#### Variants
1. **Primary** - Mavi arka plan, beyaz metin
2. **Secondary** - Gri arka plan, koyu metin
3. **Outline** - Beyaz arka plan, mavi border, mavi metin
4. **Ghost** - Şeffaf, mavi metin

#### Sizes
- **Small:** 32px height, 12px padding
- **Medium:** 40px height, 16px padding
- **Large:** 48px height, 20px padding

#### States
- **Default** - Normal
- **Hover** - Arkaplana %10 koyu eklenir
- **Active** - Arkaplana %20 koyu eklenir
- **Disabled** - %50 opacity, no cursor

### Input Component

#### Variants
- **Text** - Single-line text
- **Email** - Single-line email
- **Tel** - Telephone number
- **Number** - Numeric input
- **Textarea** - Multi-line text

#### States
- **Default** - Border: #E0E0E0
- **Focus** - Border: #0066CC, shadow
- **Error** - Border: #E94B3C
- **Disabled** - Background: #F5F5F5, cursor: not-allowed

### Card Component

#### Styling
- Background: #FFFFFF
- Border: 1px solid #E0E0E0
- Border Radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

#### Variants
- Listing Card
- Broker Card
- Category Card
- Blog Card

### Badge Component

#### Variants
- **Primary** - Mavi background
- **Success** - Yeşil background
- **Error** - Kırmızı background
- **Warning** - Sarı background

### Modal Component

#### Features
- Overlay (koyu yarı-şeffaf)
- Modal window (center)
- Close button (sağ üst)

### Tabs Component

#### Styling
- Inactive: Gray text
- Active: Blue text + underline
- Smooth transition

### Dropdown/Select

#### Styling
- Border: 1px solid #E0E0E0
- Arrow: Sağ taraf
- Hover: Background gri

---

## 🖼️ İkonlar

### İkon Seti
- Feather Icons (primary)
- Font Awesome (fallback)

### İkon Boyutları
- **xs:** 16px
- **sm:** 20px
- **md:** 24px
- **lg:** 32px
- **xl:** 48px

### İkon Renkleri
- **Primary:** #0066CC
- **Secondary:** #666666
- **Error:** #E94B3C
- **Success:** #1DB854

---

## 📐 Breakpoints (Responsive)

| Cihaz | Width | Sidebar | Grid | Layout |
|------|-------|---------|------|--------|
| Desktop (1200px+) | > 1200px | 250px | 3 kolon | Flex |
| Tablet (768-1199px) | 768-1199px | 200px | 2 kolon | Flex |
| Mobile (0-767px) | < 768px | Off-canvas | 1 kolon | Stack |

### Tailwind Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🎬 Animasyonlar

### Transition Values
- **Fast:** 150ms (hover states)
- **Normal:** 300ms (standard animations)
- **Slow:** 500ms (important transitions)

### Easing
```
ease-in-out (default)
ease-in (appearing)
ease-out (disappearing)
```

### Animasyon Örnekleri
- **Fade:** opacity transition
- **Slide:** translateY transition
- **Scale:** transform: scale
- **Bounce:** cubic-bezier effect

---

## 🌙 Dark Mode (Opsiyonel)

### Dark Paleti
| Eleman | Light | Dark |
|--------|-------|------|
| Background | #FFFFFF | #1A1A1A |
| Text | #333333 | #FFFFFF |
| Border | #E0E0E0 | #404040 |
| Card | #FFFFFF | #2A2A2A |

---

## ♿ Erişilebilirlik

### Kontrast Oranları
- **Normal Text:** Minimum 4.5:1
- **Large Text:** Minimum 3:1
- **UI Components:** Minimum 3:1

### Fokus Indicators
- **Color:** #0066CC
- **Width:** 2px
- **Style:** Outline

### Motion
- **Reduced Motion:** Tüm animasyonlar devre dışı bırakılabilir
- **PrefersColorScheme:** Dark mode desteği

---

## 📱 Mobile Optimizasyonu

### Touch Targets
- **Minimum Size:** 44x44px
- **Minimum Spacing:** 8px

### Responsive Typography
- **Headings:** Scale dinamik
- **Body:** 14px-16px range

### Density
- **Compact:** Mobilde padding azalır
- **Comfortable:** Standart spacing

---

## 🎨 Component Usage Examples

### Button
```
<Button variant="primary" size="md">
  İlan Oluştur
</Button>

<Button variant="outline" size="sm">
  Favorilere Ekle
</Button>
```

### Input
```
<Input
  type="text"
  placeholder="İlan adı girin"
  state="default"
/>

<Input
  type="email"
  placeholder="Email"
  state="focus"
/>
```

### Card
```
<Card variant="listing">
  <Image src="..." />
  <Title>Beneteau 50</Title>
  <Price>₺450.000</Price>
</Card>
```

### Badge
```
<Badge variant="success">Doğrulı</Badge>
<Badge variant="warning">Beklemede</Badge>
```

---

## 📦 Tasarım Dosyaları

### Figma File
- URL: figma.com/file/teknepazari
- Components: Organized by category
- Variants: Light/Dark, sizes, states

### Asset Files
- Icons: `/public/icons/`
- Logos: `/public/logos/`
- Images: `/public/images/`

---

## 🔄 Versiyon Geçmişi

| Versiyon | Tarih | Değişiklikler |
|----------|-------|---------------|
| 1.0 | 2026-01-19 | İlk versiyon |
| 1.1 | 2026-01-20 | Web wireframe güncellemesi - Renk kodu (#FF6600), Breakpoints |

---

*Son Güncelleme: 2026-01-20*
*Versiyon: 1.1 (Web Wireframe Güncellemesi)*
