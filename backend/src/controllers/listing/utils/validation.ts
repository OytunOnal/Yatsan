/**
 * Listing validation utilities
 * Contains validation logic for different listing types
 */

export interface StringValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates common listing string fields
 */
export const validateCommonStrings = (
  title?: string,
  description?: string,
  location?: string
): StringValidationResult => {
  if (title && title.length > 200) {
    return { valid: false, error: 'Başlık en fazla 200 karakter olabilir' };
  }
  if (description && description.length > 5000) {
    return { valid: false, error: 'Açıklama en fazla 5000 karakter olabilir' };
  }
  if (location && location.length > 200) {
    return { valid: false, error: 'Konum en fazla 200 karakter olabilir' };
  }
  return { valid: true };
};

/**
 * Validates yacht-specific string fields
 */
export const validateYachtStrings = (data: any): StringValidationResult => {
  if (data.engineBrand && data.engineBrand.length > 100) {
    return { valid: false, error: 'Motor markası en fazla 100 karakter olabilir' };
  }
  if (data.equipment && data.equipment.length > 2000) {
    return { valid: false, error: 'Ekipman listesi en fazla 2000 karakter olabilir' };
  }
  return { valid: true };
};

/**
 * Validates part-specific string fields
 */
export const validatePartStrings = (data: any): StringValidationResult => {
  if (data.brand && data.brand.length > 100) {
    return { valid: false, error: 'Marka en fazla 100 karakter olabilir' };
  }
  if (data.oemCode && data.oemCode.length > 50) {
    return { valid: false, error: 'OEM kodu en fazla 50 karakter olabilir' };
  }
  if (data.compatibility && data.compatibility.length > 2000) {
    return { valid: false, error: 'Uyumlu modeller en fazla 2000 karakter olabilir' };
  }
  return { valid: true };
};

/**
 * Validates marina-specific string fields
 */
export const validateMarinaStrings = (data: any): StringValidationResult => {
  if (data.services && data.services.length > 2000) {
    return { valid: false, error: 'Hizmetler en fazla 2000 karakter olabilir' };
  }
  if (data.availability && data.availability.length > 1000) {
    return { valid: false, error: 'Müsaitlik en fazla 1000 karakter olabilir' };
  }
  return { valid: true };
};

/**
 * Validates crew-specific string fields
 */
export const validateCrewStrings = (data: any): StringValidationResult => {
  if (data.certifications && data.certifications.length > 2000) {
    return { valid: false, error: 'Sertifikalar en fazla 2000 karakter olabilir' };
  }
  return { valid: true };
};

/**
 * Validates and converts price value
 */
export const validatePrice = (price: any): { valid: boolean; value?: number; error?: string } => {
  if (!price) {
    return { valid: true, value: 0 };
  }
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return { valid: false, error: 'Geçerli bir fiyat giriniz' };
  }
  // Database price field: decimal(12, 2) - max value is 10^10 = 10,000,000,000
  if (parsedPrice > 9999999999) {
    return { valid: false, error: "Fiyat 9.999.999.999'dan küçük olmalıdır" };
  }
  return { valid: true, value: parsedPrice };
};

/**
 * Validates yacht-specific numeric fields
 */
export const validateYachtNumbers = (data: any): { valid: boolean; processed: any; error?: string } => {
  const processed: any = {};

  if (data.year) {
    const year = parseInt(data.year);
    if (year < 1970 || year > new Date().getFullYear()) {
      return { valid: false, processed, error: 'Yıl 1970 ile ' + new Date().getFullYear() + ' arasında olmalıdır' };
    }
    processed.year = year;
  }
  
  if (data.length) {
    const len = parseFloat(data.length);
    if (len <= 0 || len > 9999.99) {
      return { valid: false, processed, error: 'Uzunluk 0 ile 9999.99 metre arasında olmalıdır' };
    }
    processed.length = len;
  }
  
  if (data.beam) {
    const bm = parseFloat(data.beam);
    if (bm <= 0 || bm > 9999.99) {
      return { valid: false, processed, error: 'Genişlik 0 ile 9999.99 metre arasında olmalıdır' };
    }
    processed.beam = bm;
  }
  
  if (data.draft) {
    const dr = parseFloat(data.draft);
    if (dr <= 0 || dr > 9999.99) {
      return { valid: false, processed, error: 'Sükunet derinliği 0 ile 9999.99 metre arasında olmalıdır' };
    }
    processed.draft = dr;
  }
  
  if (data.engineHours) {
    const hours = parseInt(data.engineHours);
    if (hours < 0 || hours > 999999) {
      return { valid: false, processed, error: 'Motor saati 0 ile 999999 arasında olmalıdır' };
    }
    processed.engineHours = hours;
  }
  
  if (data.engineHP) {
    const hp = parseInt(data.engineHP);
    if (hp < 0 || hp > 99999) {
      return { valid: false, processed, error: 'Motor gücü 0 ile 99999 HP arasında olmalıdır' };
    }
    processed.engineHP = hp;
  }
  
  if (data.cruisingSpeed) {
    const speed = parseInt(data.cruisingSpeed);
    if (speed < 0 || speed > 999) {
      return { valid: false, processed, error: 'Seyir hızı 0 ile 999 knot arasında olmalıdır' };
    }
    processed.cruisingSpeed = speed;
  }
  
  if (data.maxSpeed) {
    const speed = parseInt(data.maxSpeed);
    if (speed < 0 || speed > 999) {
      return { valid: false, processed, error: 'Maksimum hız 0 ile 999 knot arasında olmalıdır' };
    }
    processed.maxSpeed = speed;
  }
  
  if (data.cabinCount) {
    const count = parseInt(data.cabinCount);
    if (count < 0 || count > 99) {
      return { valid: false, processed, error: 'Kabin sayısı 0 ile 99 arasında olmalıdır' };
    }
    processed.cabinCount = count;
  }
  
  if (data.bedCount) {
    const count = parseInt(data.bedCount);
    if (count < 0 || count > 99) {
      return { valid: false, processed, error: 'Yatak sayısı 0 ile 99 arasında olmalıdır' };
    }
    processed.bedCount = count;
  }
  
  if (data.bathroomCount) {
    const count = parseInt(data.bathroomCount);
    if (count < 0 || count > 99) {
      return { valid: false, processed, error: 'Banyo sayısı 0 ile 99 arasında olmalıdır' };
    }
    processed.bathroomCount = count;
  }

  return { valid: true, processed };
};

/**
 * Validates marina-specific numeric fields
 */
export const validateMarinaNumbers = (data: any): { valid: boolean; processed: any; error?: string } => {
  const processed: any = {};

  if (data.maxLength) {
    const len = parseFloat(data.maxLength);
    if (len <= 0 || len > 9999.99) {
      return { valid: false, processed, error: 'Maksimum uzunluk 0 ile 9999.99 metre arasında olmalıdır' };
    }
    processed.maxLength = len;
  }
  
  if (data.maxBeam) {
    const bm = parseFloat(data.maxBeam);
    if (bm <= 0 || bm > 9999.99) {
      return { valid: false, processed, error: 'Maksimum genişlik 0 ile 9999.99 metre arasında olmalıdır' };
    }
    processed.maxBeam = bm;
  }
  
  if (data.maxDraft) {
    const dr = parseFloat(data.maxDraft);
    if (dr < 0 || dr > 9999.99) {
      return { valid: false, processed, error: 'Maksimum sükunet derinliği 0 ile 9999.99 metre arasında olmalıdır' };
    }
    processed.maxDraft = dr;
  }

  return { valid: true, processed };
};

/**
 * Validates crew-specific numeric fields
 */
export const validateCrewNumbers = (data: any): { valid: boolean; processed: any; error?: string } => {
  const processed: any = {};

  if (data.experience) {
    const exp = parseInt(data.experience);
    if (exp < 0 || exp > 99) {
      return { valid: false, processed, error: 'Deneyim 0 ile 99 yıl arasında olmalıdır' };
    }
    processed.experience = exp;
  }

  return { valid: true, processed };
};
