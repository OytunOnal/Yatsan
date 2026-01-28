// CUID oluşturma fonksiyonu
export const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
