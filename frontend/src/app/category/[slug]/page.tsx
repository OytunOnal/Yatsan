import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getChildCategories, type Category } from '@/lib/api';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function getCategoryData(slug: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${API_URL}/categories/slug/${slug}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return null;
  }
}

async function getListingsByCategory(categoryId: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${API_URL}/listings?status=APPROVED&limit=12`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.listings || [];
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryData = await getCategoryData(params.slug);
  
  if (!categoryData || !categoryData.success) {
    notFound();
  }
  
  const category: Category = categoryData.data;
  const listings = await getListingsByCategory(category.id);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
          
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>{category.listingCount} ilan</span>
            {category.parent && (
              <>
                <span>•</span>
                <span>
                  Ana Kategori:{' '}
                  <Link href={`/category/${category.parent.slug}`} className="text-blue-600 hover:underline">
                    {category.parent.name}
                  </Link>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sub Categories */}
      {category.children && category.children.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alt Kategoriler</h2>
            <div className="flex flex-wrap gap-3">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {child.name}
                  <span className="ml-2 text-sm text-gray-500">({child.listingCount})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {category.name} İlanları
          </h2>
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Sıralama: En Yeni</option>
              <option>Fiyat: Düşükten Yükseğe</option>
              <option>Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">İlan bulunamadı</h3>
            <p className="mt-2 text-sm text-gray-500">
              Bu kategoride henüz ilan yok.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing: any) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                      <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19.5v-15A2.5 2.5 0 015.5 2h13A2.5 2.5 0 0121 4.5v15a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                      {listing.listingType === 'yacht' ? 'Yat' : 
                       listing.listingType === 'part' ? 'Parça' :
                       listing.listingType === 'marina' ? 'Marina' : 'Mürettebat'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {listing.title}
                  </h3>
                  {listing.location && (
                    <p className="text-sm text-gray-500 mb-2">{listing.location}</p>
                  )}
                  <p className="text-lg font-bold text-blue-600">
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: listing.currency || 'TRY',
                    }).format(Number(listing.price))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {listings.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tüm İlanları Gör
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categoryData = await getCategoryData(params.slug);
  
  if (!categoryData || !categoryData.success) {
    return {
      title: 'Kategori Bulunamadı',
    };
  }
  
  const category: Category = categoryData.data;
  
  return {
    title: `${category.name} - TeknePazari`,
    description: category.description || `${category.name} kategorisindeki tüm ilanlar.`,
  };
}
