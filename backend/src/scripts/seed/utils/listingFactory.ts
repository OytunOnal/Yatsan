import { db } from '../../../lib/db';
import { listings, listingImages, generateId } from '../../../db/schema';
import { getCategoryId, getCategoryByPath } from './categoryCache';

interface BaseListingData {
  title: string;
  description: string;
  price: string;
  currency: string;
  location: string;
  categoryName: string;
  subcategoryPath: string; // Örn: "Deniz Araçları/Satılık/Motoryat"
  image: string;
}

export async function createBaseListing(
  userId: string,
  listingType: string,
  data: BaseListingData
) {
  // Ana kategori ID'si (örn: "Deniz Araçları")
  const categoryId = await getCategoryId(data.categoryName);
  
  // Alt kategori ID'si path ile (örn: "Deniz Araçları/Satılık/Motoryat")
  const subcategoryId = await getCategoryByPath(data.subcategoryPath);
  
  const listingId = generateId();
  await db.insert(listings).values({
    id: listingId,
    userId,
    title: data.title,
    description: data.description,
    price: data.price,
    currency: data.currency,
    listingType,
    status: 'APPROVED',
    location: data.location,
    categoryId,
    subcategoryId,
  });

  await db.insert(listingImages).values({
    id: generateId(),
    listing_id: listingId,
    url: data.image,
    orderIndex: 0,
  });

  return listingId;
}
