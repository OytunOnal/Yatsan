// ============================================================================
// FORMDATA BUILDER UTILITY
// ============================================================================

export const buildListingFormData = (
  listingType: string,
  data: Record<string, any>,
  images?: File[]
): FormData => {
  const formData = new FormData();
  formData.append('listingType', listingType);

  // Tüm data alanlarını FormData'ya ekle
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Boolean değerleri string'e çevir
      if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      }
      // Number değerleri string'e çevir
      else if (typeof value === 'number') {
        formData.append(key, value.toString());
      }
      // String değerleri direkt ekle
      else if (typeof value === 'string') {
        formData.append(key, value);
      }
    }
  });

  // Resimleri ekle
  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('images', file);
    });
  }

  return formData;
};
