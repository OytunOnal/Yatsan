// Kategori yapısı tipi
export interface CategoryNode {
  name: string;
  description: string;
  icon?: string;
  subcategories?: CategoryNode[];
}

// Slug oluşturma fonksiyonu - tam parent path kullanarak unique slug oluşturur
export function createSlug(text: string, parentPath: string[] = []): string {
  const baseSlug = text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Tüm parent path'i birleştirerek unique slug oluştur
  if (parentPath.length > 0) {
    const parentSlug = parentPath
      .join('-')
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${parentSlug}-${baseSlug}`;
  }
  
  return baseSlug;
}
