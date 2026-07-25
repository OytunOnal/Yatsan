import { Request, Response } from 'express';
import { categories, listings } from '../db/schema';
import { eq, isNull, sql, and, or, inArray } from 'drizzle-orm';

// Tüm kategorileri getir (public endpoint)
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { withCounts } = req.query;

    // Ana kategorileri getir
    const mainCategories = await req.db.select().from(categories)
      .where(isNull(categories.parentId))
      .orderBy(categories.order);

    if (withCounts === 'true') {
      // Alt kategori ID'lerini recursive olarak topla
      const getAllSubcategoryIds = (subcategories: any[]): string[] => {
        const ids: string[] = [];
        subcategories.forEach(sub => {
          ids.push(sub.id);
          if (sub.subcategories && sub.subcategories.length > 0) {
            ids.push(...getAllSubcategoryIds(sub.subcategories));
          }
        });
        return ids;
      };

      // Hiyerarşik kategori yapısı oluştur (recursive)
      const buildCategoryTree = async (parentId: string | null = null, isRootLevel: boolean = true): Promise<any[]> => {
        const cats = await req.db.select().from(categories)
          .where(parentId ? eq(categories.parentId, parentId) : isNull(categories.parentId))
          .orderBy(categories.order);

        return await Promise.all(cats.map(async (cat) => {
          // Alt kategorileri recursive olarak getir
          const subcategories = await buildCategoryTree(cat.id, false);

          // İlan sayısını hesapla
          // Bu kategori ve tüm alt kategorilerindeki ilanları topla
          const allSubcategoryIds = getAllSubcategoryIds(subcategories);
          const allIds = [cat.id, ...allSubcategoryIds];
          
          let countResult;
          if (isRootLevel) {
            // Ana (kök) kategori - categoryId ile eşleşen ilanları say
            countResult = await req.db.select({ count: sql<number>`count(*)` })
              .from(listings)
              .where(
                and(
                  eq(listings.categoryId, cat.id),
                  eq(listings.status, 'APPROVED')
                )
              );
          } else {
            // Alt kategori - subcategoryId bu kategori veya alt kategorilerinden biri olan ilanları say
            countResult = await req.db.select({ count: sql<number>`count(*)` })
              .from(listings)
              .where(
                and(
                  allIds.length > 0 ? inArray(listings.subcategoryId, allIds) : eq(listings.subcategoryId, cat.id),
                  eq(listings.status, 'APPROVED')
                )
              );
          }
          
          const listingCount = Number(countResult[0]?.count || 0);

          return {
            ...cat,
            listingCount,
            subcategories,
          };
        }));
      };

      const categoriesWithCounts = await buildCategoryTree();

      return res.json({
        success: true,
        data: categoriesWithCounts,
      });
    }

    // Alt kategorileri de dahil et
    const allCategories = await req.db.select().from(categories)
      .orderBy(categories.order);

    // Hiyerarşik yapı oluştur
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // Önce tüm kategorileri map'e ekle
    allCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, subcategories: [] });
    });

    // Ardından hiyerarşiyi oluştur
    allCategories.forEach(cat => {
      const categoryWithSubs = categoryMap.get(cat.id);
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.subcategories.push(categoryWithSubs);
        }
      } else {
        rootCategories.push(categoryWithSubs);
      }
    });

    res.json({
      success: true,
      data: rootCategories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Tek bir kategoriyi getir
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const categoryResult = await req.db.select().from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (categoryResult.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const category = categoryResult[0];

    // Alt kategorileri getir
    const subcategories = await req.db.select().from(categories)
      .where(eq(categories.parentId, category.id))
      .orderBy(categories.order);

    res.json({
      success: true,
      data: {
        ...category,
        subcategories,
      },
    });
  } catch (error) {
    console.error('Get category by id error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Slug ile kategori getir
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const categoryResult = await req.db.select().from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (categoryResult.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const category = categoryResult[0];

    // Alt kategorileri getir
    const subcategories = await req.db.select().from(categories)
      .where(eq(categories.parentId, category.id))
      .orderBy(categories.order);

    res.json({
      success: true,
      data: {
        ...category,
        subcategories,
      },
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
