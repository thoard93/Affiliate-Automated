import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Affiliate Automated | TikTok Shop Commission Maximizer',
  description: 'Maximize your TikTok Shop commissions with Affiliate Automated. Access exclusive boosted commission rates on 213+ products.',
  keywords: ['TikTok Shop', 'affiliate marketing', 'commission', 'MCN', 'Affiliate Automated'],
  authors: [{ name: 'Market Mix Media LLC' }],
  openGraph: {
    title: 'Affiliate Automated | TikTok Shop Commission Maximizer',
    description: 'Maximize your TikTok Shop commissions with exclusive boosted rates.',
    type: 'website',
    siteName: 'Affiliate Automated',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-aa-dark text-white antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2d2d2d',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#00C853',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
