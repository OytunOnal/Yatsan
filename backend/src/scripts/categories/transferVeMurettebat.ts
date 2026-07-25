import { CategoryNode } from './types';

export const transferVeMurettebat: CategoryNode = {
  name: 'Transfer ve Mürettebat',
  icon: '👥',
  description: 'Transfer ve mürettebat hizmetleri',
  subcategories: [
    {
      name: 'Transfer Hizmetleri',
      description: 'Transfer hizmetleri',
      subcategories: [
        { name: 'Yat Transferi', description: 'Yat transfer hizmetleri' },
        { name: 'Yerden Suya İndirme', description: 'Yerden suya indirme' },
        { name: 'Sudan Yere Çıkarma', description: 'Sudan yere çıkarma' },
        { name: 'Şehirlerarası Transfer', description: 'Şehirlerarası transfer' },
        { name: 'Uluslararası Transfer', description: 'Uluslararası transfer' },
        { name: 'Mürettebat Transferi', description: 'Mürettebat transferi' },
        { name: 'VIP Transfer', description: 'VIP transfer hizmetleri' },
      ]
    },
    {
      name: 'Mürettebat',
      description: 'Mürettebat hizmetleri',
      subcategories: [
        { name: 'Kaptan', description: 'Kaptan hizmetleri' },
        { name: '1. Subay', description: '1. subay hizmetleri' },
        { name: '2. Subay', description: '2. subay hizmetleri' },
        { name: 'Makinist', description: 'Makinist hizmetleri' },
        { name: 'Mutfak Personeli', description: 'Mutfak personeli' },
        { name: 'Yatçı', description: 'Yatçı hizmetleri' },
        { name: 'Aşçı', description: 'Aşçı hizmetleri' },
        { name: 'Hostes', description: 'Hostes hizmetleri' },
        { name: 'Stajyer/Gemiadamı', description: 'Stajyer/gemiadamı' },
        { name: 'Mekanik', description: 'Mekanik hizmetleri' },
      ]
    },
    {
      name: 'Kaptan Hizmetleri',
      description: 'Kaptan hizmetleri',
      subcategories: [
        { name: 'Günlük Kaptan', description: 'Günlük kaptan' },
        { name: 'Haftalık Kaptan', description: 'Haftalık kaptan' },
        { name: 'Sezonluk Kaptan', description: 'Sezonluk kaptan' },
        { name: 'Transfer Kaptanı', description: 'Transfer kaptanı' },
      ]
    },
  ]
};
