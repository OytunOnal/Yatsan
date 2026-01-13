import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Yatsan - Türkiye\'nin Denizcilik Pazar Yeri',
  description: 'Sıfır ve ikinci el yatlar, yedek parçalar, marina ve mürettebat ilanları. Türkiye\'nin en kapsamlı denizcilik pazar yeri.',
  keywords: ['yat', 'yat ilanı', 'yat satış', 'yat kiralama', 'yedek parça', 'marina', 'denizcilik', 'gemi', 'tekn'],
  authors: [{ name: 'Yatsan' }],
  openGraph: {
    title: 'Yatsan - Türkiye\'nin Denizcilik Pazar Yeri',
    description: 'Sıfır ve ikinci el yatlar, yedek parçalar, marina ve mürettebat ilanları.',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yatsan - Türkiye\'nin Denizcilik Pazar Yeri',
    description: 'Sıfır ve ikinci el yatlar, yedek parçalar, marina ve mürettebat ilanları.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className={`${inter.className} bg-gray-50 font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#111827',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
