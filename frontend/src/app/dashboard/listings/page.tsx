'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ListingTable from '../../../components/dashboard/ListingTable';
import EditListingModal from '../../../components/dashboard/EditListingModal';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'pending' | 'sold';
  createdAt: string;
}

export default function DashboardListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'sold'>('all');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      // TODO: Fetch from API
      // Mock data
      const mockListings: Listing[] = [
        {
          id: '1',
          title: 'Yat İlanı 1',
          description: 'Güzel bir yat',
          price: 500000,
          category: 'Yat',
          status: 'active',
          createdAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Parça İlanı 1',
          description: 'Yat parçası',
          price: 1000,
          category: 'Parça',
          status: 'pending',
          createdAt: '2023-01-02T00:00:00Z',
        },
      ];
      setListings(mockListings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    if (activeTab === 'all') return true;
    return listing.status === activeTab;
  });

  const handleEdit = (id: string) => {
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      setEditingListing(listing);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      try {
        // TODO: Delete from API
        setListings(listings.filter((l) => l.id !== id));
      } catch (error) {
        console.error('Failed to delete listing:', error);
      }
    }
  };

  const handlePreview = (id: string) => {
    router.push(`/listings/${id}`);
  };

  const handleSaveEdit = async (data: any) => {
    if (!editingListing) return;

    try {
      // TODO: Update API
      setListings(listings.map((l) =>
        l.id === editingListing.id ? { ...l, ...data } : l
      ));
    } catch (error) {
      console.error('Failed to update listing:', error);
    }
  };

  const tabs = [
    { key: 'all', label: 'Tümü' },
    { key: 'active', label: 'Aktif' },
    { key: 'pending', label: 'Bekleyen' },
    { key: 'sold', label: 'Satılan' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">İlanlarım</h1>
        <Link
          href="/listings/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Yeni İlan
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <ListingTable
        listings={filteredListings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      {/* Edit Modal */}
      <EditListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={editingListing}
        onSave={handleSaveEdit}
      />
    </div>
  );
}