import { CategoryNode } from './types';

export const sigorta: CategoryNode = {
  name: 'Sigorta',
  icon: '🛡️',
  description: 'Tekne sigortası',
  subcategories: [
    {
      name: 'Tekne Sigortası',
      description: 'Tekne sigortası',
      subcategories: [
        { name: 'Kaza Sigortası', description: 'Kaza sigortası' },
        { name: 'Hırsızlık Sigortası', description: 'Hırsızlık sigortası' },
        { name: 'Yangın Sigortası', description: 'Yangın sigortası' },
        { name: 'Sorumluluk Sigortası', description: 'Sorumluluk sigortası' },
        { name: 'Tamamlayıcı Sigorta', description: 'Tamamlayıcı sigorta' },
      ]
    },
    {
      name: 'Kaptan Sigortası',
      description: 'Kaptan sigortası',
      subcategories: [
        { name: 'Kaza Sigortası', description: 'Kaptan kaza sigortası' },
        { name: 'Sağlık Sigortası', description: 'Kaptan sağlık sigortası' },
        { name: 'Maluliyet Sigortası', description: 'Kaptan maluliyet sigortası' },
        { name: 'Vefat Sigortası', description: 'Kaptan vefat sigortası' },
      ]
    },
    {
      name: 'Yük/Yolcu Sigortası',
      description: 'Yük ve yolcu sigortası',
      subcategories: [
        { name: 'Yük Sigortası', description: 'Yük sigortası' },
        { name: 'Yolcu Kazası Sigortası', description: 'Yolcu kazası sigortası' },
        { name: 'Sorumluluk Sigortası', description: 'Sorumluluk sigortası' },
      ]
    },
    {
      name: 'Sigorta Şirketleri',
      description: 'Sigorta şirketleri',
      subcategories: [
        { name: 'Allianz', description: 'Allianz sigorta' },
        { name: 'Axa', description: 'Axa sigorta' },
        { name: 'Sompo Japan', description: 'Sompo Japan sigorta' },
        { name: 'Anadolu Sigorta', description: 'Anadolu sigorta' },
        { name: 'Aksigorta', description: 'Aksigorta' },
        { name: 'Zurich', description: 'Zurich sigorta' },
        { name: 'Generali', description: 'Generali sigorta' },
        { name: 'Diğer', description: 'Diğer sigorta şirketleri' },
      ]
    },
  ]
};
