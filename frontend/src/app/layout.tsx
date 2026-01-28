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
  title: 'TeknePazarı - Türkiye\'nin En Kapsamlı Denizcilik Platformu',
  description: '10 ana kategori, 1000+ alt kategori ile tekneler, yatlar, yedek parça, marina, mürettebat, sigorta, ekspertiz, teknik servisler ve daha fazlası. Türkiye\'nin en kapsamlı denizcilik platformu.',
  keywords: ['tekne', 'tekne pazarı', 'yat', 'yat ilanı', 'yat satış', 'yat kiralama', 'yedek parça', 'marina', 'denizcilik', 'gemi', 'sigorta', 'ekspertiz', 'teknik servis', 'mürettebat', 'kaptan'],
  authors: [{ name: 'TeknePazarı' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'TeknePazarı - Türkiye\'nin En Kapsamlı Denizcilik Platformu',
    description: '10 ana kategori, 1000+ alt kategori. Tekneler, yatlar, yedek parça, marina, mürettebat, sigorta, ekspertiz ve daha fazlası.',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeknePazarı - Türkiye\'nin En Kapsamlı Denizcilik Platformu',
    description: '10 ana kategori, 1000+ alt kategori. Tekneler, yatlar, yedek parça, marina, mürettebat, sigorta, ekspertiz ve daha fazlası.',
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
