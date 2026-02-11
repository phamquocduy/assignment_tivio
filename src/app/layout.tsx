import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ErrorBoundaryProvider } from '@/components';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Movie Discovery App',
  description: 'Discover and explore movies from TMDB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundaryProvider>{children}</ErrorBoundaryProvider>
      </body>
    </html>
  );
}
