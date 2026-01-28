import { CategoryNode } from './types';

export const karaParkVeKislama: CategoryNode = {
  name: 'Kara Park ve Kışlama',
  icon: '🏠',
  description: 'Kara park ve kışlama alanları',
  subcategories: [
    {
      name: 'Kışlama Alanları',
      description: 'Tekne kışlama alanları',
      subcategories: [
        { name: 'Kapalı Kışlama', description: 'Kapalı kışlama alanları' },
        { name: 'Açık Kışlama', description: 'Açık kışlama alanları' },
        { name: 'Güverte Üstü Kışlama', description: 'Güverte üstü kışlama' },
        { name: 'Karavan Tipi Kışlama', description: 'Karavan tipi kışlama' },
        { name: 'Kışlama Paketleri', description: 'Kışlama paketleri' },
      ]
    },
    {
      name: 'Kara Park',
      description: 'Kara park alanları',
      subcategories: [
        { name: 'Günlük Park', description: 'Günlük kara park' },
        { name: 'Aylık Park', description: 'Aylık kara park' },
        { name: 'Yıllık Park', description: 'Yıllık kara park' },
      ]
    },
  ]
};
