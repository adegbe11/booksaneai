import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({ src: '../public/fonts/sans.woff2', variable: '--font-inter', display: 'swap' });
const playfair = localFont({ src: '../public/fonts/serif.woff2', variable: '--font-playfair', display: 'swap' });
const garamond = localFont({ src: '../public/fonts/serif.woff2', variable: '--font-garamond', display: 'swap' });

export const metadata: Metadata = {
  title: 'Booksane Studio — A book worth keeping',
  description:
    'A thoughtful publishing studio. Write, organize, design, and export your manuscript as a PDF interior or EPUB.',
  keywords: [
    'book formatter',
    'manuscript formatting',
    'epub generator',
    'pdf book',
    'book design',
    'self publishing',
    'KDP formatting',
    'book template',
  ],
  authors: [{ name: 'Booksane' }],
  openGraph: {
    title: 'Booksane Studio — A book worth keeping',
    description: 'A focused publishing studio for writing, designing, and exporting your book.',
    url: 'https://booksane.com',
    siteName: 'Booksane',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Booksane Studio — A book worth keeping',
    description: 'A focused publishing studio for writing, designing, and exporting your book.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${garamond.variable}`} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
