'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user data from API
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            name: `${data.user.firstName} ${data.user.lastName}`,
            email: data.user.email,
          });
        } else {
          // Fallback to mock data
          setUser({
            name: 'John Doe',
            email: 'john@example.com',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUser({
          name: 'John Doe',
          email: 'john@example.com',
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 lg:ml-0">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}