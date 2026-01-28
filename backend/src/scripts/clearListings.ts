import { db } from '../lib/db';
import { listings, listingImages } from '../db/schema';

async function clearListings() {
  try {
    console.log('🗑️  Mevcut ilanlar temizleniyor...');

    // İlan resimlerini sil
    await db.delete(listingImages);
    console.log('✅ İlan resimleri silindi');

    // İlanları sil
    await db.delete(listings);
    console.log('✅ İlanlar silindi');

    console.log('✨ Temizleme tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

clearListings();
