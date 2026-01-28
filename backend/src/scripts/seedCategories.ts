import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { categories, generateId } from '../db/schema';
import { ALL_CATEGORIES, createSlug } from './categories';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/yatsan';

// Kategori yapısı tipi
interface CategoryNode {
  name: string;
  description: string;
  icon?: string;
  subcategories?: CategoryNode[];
}

// Recursive kategori ekleme fonksiyonu
async function addCategoriesRecursively(
  db: any,
  categoryData: CategoryNode,
  parentId: string | null = null,
  parentPath: string[] = []
): Promise<void> {
  const slug = createSlug(categoryData.name, parentPath);
  const categoryId = generateId();
  
  const category = {
    id: categoryId,
    name: categoryData.name,
    slug,
    description: categoryData.description,
    icon: categoryData.icon || null,
    parentId,
    listingCount: 0,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await db.insert(categories).values(category);
  console.log(`✓ Kategori eklendi: ${categoryData.name} (${slug})`);
  
  if (categoryData.subcategories && categoryData.subcategories.length > 0) {
    for (const subcategory of categoryData.subcategories) {
      await addCategoriesRecursively(db, subcategory, categoryId, [...parentPath, categoryData.name]);
    }
  }
}

// Ana seed fonksiyonu
async function seedCategories() {
  console.log('🌱 Kategoriler seed ediliyor...\n');
  
  const client = postgres(DATABASE_URL);
  const db = drizzle(client);
  
  // Önce mevcut kategorileri temizle
  console.log('🗑️ Mevcut kategoriler temizleniyor...');
  await db.delete(categories);
  console.log('✓ Kategoriler temizlendi\n');
  
  // Kategorileri ekle
  for (const category of ALL_CATEGORIES) {
    await addCategoriesRecursively(db, category);
  }
  
  console.log('\n✅ Kategori seed işlemi tamamlandı!');
  
  await client.end();
}

// Script'i çalıştır
seedCategories().catch(console.error);
