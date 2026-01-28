import { db } from '../../../lib/db';
import { categories } from '../../../db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';

// Tüm kategorileri cache'lemek için
let allCategoriesCache: Array<{ id: string; name: string; parentId: string | null }> = [];

// Cache'i yükle
async function loadCategories() {
  if (allCategoriesCache.length === 0) {
    const cats = await db.select({
      id: categories.id,
      name: categories.name,
      parentId: categories.parentId,
    }).from(categories);
    allCategoriesCache = cats;
  }
  return allCategoriesCache;
}

// Ana kategori ID'sini bul (parentId null olanlar)
export async function getCategoryId(categoryName: string): Promise<string> {
  const cats = await loadCategories();
  const cat = cats.find(c => c.name === categoryName && c.parentId === null);
  if (!cat) {
    throw new Error(`Ana kategori bulunamadı: ${categoryName}`);
  }
  return cat.id;
}

// Alt kategori ID'sini path ile bul (örn: "Deniz Araçları/Satılık/Motoryat/Princess")
export async function getCategoryByPath(path: string): Promise<string> {
  const cats = await loadCategories();
  const parts = path.split('/');
  
  let parentId: string | null = null;
  let currentCatId: string | null = null;
  
  for (const part of parts) {
    const cat = cats.find(c => c.name === part && c.parentId === parentId);
    if (!cat) {
      throw new Error(`Kategori bulunamadı: ${part} (path: ${path})`);
    }
    parentId = cat.id;
    currentCatId = cat.id;
  }
  
  if (!currentCatId) {
    throw new Error(`Kategori path geçersiz: ${path}`);
  }
  
  return currentCatId;
}

// Doğrudan alt kategoriyi bul (sadece tek seviye arama)
export async function getSubcategoryId(parentName: string, subName: string): Promise<string> {
  const cats = await loadCategories();
  
  // Önce parent'ı bul
  const parent = cats.find(c => c.name === parentName);
  if (!parent) {
    throw new Error(`Üst kategori bulunamadı: ${parentName}`);
  }
  
  // Alt kategoriyi bul
  const sub = cats.find(c => c.name === subName && c.parentId === parent.id);
  if (!sub) {
    throw new Error(`Alt kategori bulunamadı: ${subName} (üst: ${parentName})`);
  }
  
  return sub.id;
}

// İsme göre herhangi bir kategoriyi bul (deep search)
export async function findCategoryByName(name: string): Promise<string | null> {
  const cats = await loadCategories();
  const cat = cats.find(c => c.name === name);
  return cat?.id || null;
}

// Bir kategorinin tüm alt kategorilerini bul (recursive)
export async function getDescendantCategories(categoryId: string): Promise<string[]> {
  const cats = await loadCategories();
  const result: string[] = [];
  
  function findChildren(parentId: string) {
    const children = cats.filter(c => c.parentId === parentId);
    for (const child of children) {
      result.push(child.id);
      findChildren(child.id);
    }
  }
  
  findChildren(categoryId);
  return result;
}

export function clearCache() {
  allCategoriesCache = [];
}
