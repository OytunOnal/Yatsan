import { Suspense } from 'react';
import ListingCard from '../../components/listings/ListingCard';
import FiltersClient from './FiltersClient';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
}

async function getListings(searchParams: { [key: string]: string | string[] | undefined }) {
  const params = new URLSearchParams();
  if (searchParams.category) params.append('category', searchParams.category as string);
  if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice as string);
  if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice as string);
  if (searchParams.location) params.append('location', searchParams.location as string);

  try {
    const res = await fetch(`http://localhost:3001/api/listings?${params}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return [];
  }
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const listings = await getListings(searchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filtreler</h2>
            <Suspense fallback={<div>Yükleniyor...</div>}>
              <FiltersClient />
            </Suspense>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">İlanlar</h1>
            <p className="text-gray-600 mt-2">{listings.length} ilan bulundu</p>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Henüz ilan bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing: Listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location}
                  image={listing.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}