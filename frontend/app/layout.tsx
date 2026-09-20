import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#06B6D4',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://velum-protocol.vercel.app'),
  title: 'Velum | Confidential Payments & Settlements on Midnight Preprod',
  description:
    'Institutional-grade, privacy-first confidential payment protocol built natively on Midnight Network. Transact digital assets with zero-knowledge cryptographic shielding.',
  keywords: ['Midnight', 'Zero-Knowledge', 'zkSNARKs', 'Privacy', 'Confidential Payments', 'Compact', '1AM Wallet', 'Velum Protocol'],
  authors: [{ name: 'Velum Protocol' }, { name: 'Velum Protocol' }],
  icons: {
    icon:      '/velum-logo.svg',
    shortcut:  '/velum-logo.svg',
    apple:     '/velum-logo.svg',
  },
  openGraph: {
    title: 'Velum | Confidential Payments on Midnight',
    description:
      'Privacy-first confidential payment application built on Midnight Network with Compact 0.31.1 smart contracts.',
    images: [{ url: '/velum-x-banner.svg', width: 1500, height: 500, alt: 'Velum Midnight Payments' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velum | Confidential Payments on Midnight',
    description:
      'Zero-knowledge payments, private invoices, and selective compliance disclosure on Midnight Network.',
    images: ['/velum-x-banner.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('velum_theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#06080F] text-zinc-950 dark:text-zinc-50 antialiased selection:bg-cyan-500 selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
