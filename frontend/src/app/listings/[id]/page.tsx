import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ImageGallery from '../../../components/listings/ImageGallery';
import ContactButtons from '../../../components/listings/ContactButtons';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  category: string;
  seller: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
}

async function getListing(id: string): Promise<Listing | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/listings/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await getListing(params.id);

  if (!listing) {
    return {
      title: 'İlan Bulunamadı',
    };
  }

  return {
    title: `${listing.title} - Yatsan`,
    description: listing.description,
  };
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={listing.images} title={listing.title} />

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <p className="text-2xl font-bold text-primary mb-4">₺{listing.price.toLocaleString()}</p>
            <p className="text-gray-600 mb-4">{listing.location}</p>
            <p className="text-gray-700">{listing.description}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">İlan Detayları</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Kategori:</span> {listing.category}
              </div>
              <div>
                <span className="font-medium">Yayın Tarihi:</span> {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Satıcı Bilgileri</h3>
            <div className="space-y-2">
              <p className="font-medium">{listing.seller.name}</p>
              <p className="text-sm text-gray-600">{listing.seller.email}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <ContactButtons phone={listing.seller.phone} sellerId={listing.seller.id} />
          </div>
        </div>
      </div>
    </div>
  );
}