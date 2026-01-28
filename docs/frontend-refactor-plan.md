# Frontend Refactoring Planı

## Tespit Edilen Büyük Dosyalar (500+ satır)

### Form Bileşenleri
1. **YachtListingForm.tsx** - 881 satır
2. **InsuranceListingForm.tsx** - 876 satır  
3. **MarketplaceListingForm.tsx** - 845 satır
4. **ExpertiseListingForm.tsx** - 836 satır
5. **StorageListingForm.tsx** - 756 satır
6. **ServiceListingForm.tsx** - 744 satır

## Problemler

### 1. Tekrarlanan Kod (Code Duplication)
- Her form bileşeni benzer validasyon mantığı içeriyor
- Form state yönetimi her formda tekrar ediliyor
- Input handling fonksiyonları (handleChange, handleFieldChange, handleFieldBlur) her formda aynı
- Numeric input validasyonları tekrar tekrar yazılmış
- maxLength ve paste handling her formda duplike

### 2. Bağımlılık (Tight Coupling)
- Validasyon, form state ve UI mantığı iç içe geçmiş
- Her form kendi Zod şemasını tanımlıyor
- API çağrıları doğrudan form içinde

### 3. Test Edilebilirlik
- Büyük monolitik bileşenler test etmek zor
- Validasyon mantığını izole test etmek mümkün değil

## Refactoring Stratejisi

### A. Ortak Hooks Oluşturulması

#### 1. `useFormState` Hook
```typescript
frontend/src/hooks/forms/useFormState.ts
```
- Form state yönetimi
- Generic form data handling
- Field-level error tracking

#### 2. `useFormValidation` Hook
```typescript
frontend/src/hooks/forms/useFormValidation.ts
```
- Zod schema validasyonu
- Field-level validation
- Form-level validation

#### 3. `useFormHandlers` Hook
```typescript
frontend/src/hooks/forms/useFormHandlers.ts
```
- handleChange
- handleFieldChange  
- handleFieldBlur
- handlePaste
- handleNumericKeyDown

#### 4. `useImageUpload` Hook
```typescript
frontend/src/hooks/forms/useImageUpload.ts
```
- Image selection
- Preview generation
- File validation

### B. Shared Components

#### 1. Form Input Components
```typescript
frontend/src/components/forms/shared/FormInput.tsx
frontend/src/components/forms/shared/FormTextArea.tsx
frontend/src/components/forms/shared/FormSelect.tsx
frontend/src/components/forms/shared/FormNumericInput.tsx
frontend/src/components/forms/shared/FormImageUpload.tsx
```

#### 2. Form Section Components
```typescript
frontend/src/components/forms/shared/FormSection.tsx
frontend/src/components/forms/shared/FormErrorDisplay.tsx
frontend/src/components/forms/shared/FormActions.tsx
```

### C. Validation Schema Modülü
```typescript
frontend/src/lib/validation/schemas/
  - yacht.schema.ts
  - insurance.schema.ts
  - marketplace.schema.ts
  - expertise.schema.ts
  - storage.schema.ts
  - service.schema.ts
  - common.schema.ts (shared validators)
```

### D. Form Utilities
```typescript
frontend/src/lib/forms/
  - constants.ts (MAX_LENGTHS, field configs)
  - validators.ts (common validation functions)
  - formatters.ts (data formatting helpers)
```

## Hedef Yapı

### Yeni Form Yapısı (Örnek: YachtListingForm)
```typescript
// frontend/src/components/forms/YachtListingForm.tsx (~150-200 satır)

'use client';

import { useFormState } from '@/hooks/forms/useFormState';
import { useFormValidation } from '@/hooks/forms/useFormValidation';
import { useFormHandlers } from '@/hooks/forms/useFormHandlers';
import { useImageUpload } from '@/hooks/forms/useImageUpload';
import { yachtListingSchema } from '@/lib/validation/schemas/yacht.schema';
import { FormSection, FormInput, FormTextArea, FormSelect } from './shared';

export default function YachtListingForm({ onSuccess }: Props) {
  const { formData, setFormData, fieldErrors, setFieldErrors } = useFormState(initialData);
  const { validate, validateField } = useFormValidation(yachtListingSchema);
  const { handleChange, handleFieldChange, handleFieldBlur, handleNumericKeyDown } = useFormHandlers();
  const { images, handleImageChange } = useImageUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = validate(formData);
    if (!validationResult.success) {
      // Handle errors
      return;
    }
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormErrorDisplay errors={fieldErrors} />
      
      <FormSection title="Temel Bilgiler">
        <FormInput
          label="Başlık"
          name="title"
          value={formData.title}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={fieldErrors.title}
          required
        />
        {/* Diğer alanlar */}
      </FormSection>

      {/* Diğer sections */}
    </form>
  );
}
```

## Faydalar

1. **Kod Tekrarı Azaltılması**: 6 form × ~800 satır = ~4800 satır → ~1500 satır (hooks + shared components) + 6 × ~150 satır = ~2400 satır (%50 azalma)

2. **Bakım Kolaylığı**: Ortak mantık tek bir yerde, değişiklikler tüm formlara yansır

3. **Test Edilebilirlik**: Hook'lar ve utility fonksiyonlar izole test edilebilir

4. **Tutarlılık**: Tüm formlar aynı UX ve validation davranışını gösterir

5. **Yeniden Kullanılabilirlik**: Yeni form tipleri kolayca eklenebilir

## İmplementasyon Adımları

### Faz 1: Altyapı (2-3 gün)
- [x] Ortak hook'ları oluştur
- [ ] Shared component'leri oluştur
- [ ] Validation schema'larını ayır
- [ ] Utility fonksiyonlarını modülerleştir

### Faz 2: Refactoring (3-4 gün)
- [ ] YachtListingForm.tsx refactor
- [ ] InsuranceListingForm.tsx refactor
- [ ] MarketplaceListingForm.tsx refactor
- [ ] ExpertiseListingForm.tsx refactor
- [ ] StorageListingForm.tsx refactor
- [ ] ServiceListingForm.tsx refactor

### Faz 3: Test & Doğrulama (1-2 gün)
- [ ] Unit testler yaz
- [ ] Integration testler yaz
- [ ] Manuel test
- [ ] Performance ölçümü

## Dikkat Edilmesi Gerekenler

1. **Backward Compatibility**: Mevcut form submission'lar çalışmaya devam etmeli
2. **Type Safety**: TypeScript strict mode uyumluluğu
3. **Performance**: Gereksiz re-render'ları önle
4. **Accessibility**: ARIA attribute'ları koru
5. **Mobile Responsive**: Mevcut responsive davranışı koru

## Ek Öneriler

### 1. Form Builder Pattern
İleride düşünülebilecek: JSON schema'dan form generate etme

### 2. Field Configuration System
```typescript
// Form alanlarını config ile tanımla
const yachtFormConfig = {
  sections: [
    {
      title: 'Temel Bilgiler',
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 200 },
        { name: 'description', type: 'textarea', required: true, maxLength: 5000 },
        // ...
      ]
    }
  ]
};
```

### 3. Progressive Enhancement
- Form validation client-side + server-side
- Offline form draft kaydetme
- Auto-save functionality

## Beklenen Sonuçlar

- ✅ Kod miktarında %50 azalma
- ✅ Bakım süresinde %40 azalma
- ✅ Test coverage %80+
- ✅ Bundle size optimizasyonu
- ✅ Developer experience iyileştirmesi
