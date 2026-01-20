import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/session-provider';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'whenRUfree - Prioritize human connection, not calendar management',
  description: 'A secure, fast and simple way to share availability',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  icons: {
    icon: '/brand_logo.png',
    shortcut: '/brand_logo.png',
  },
  openGraph: {
    title: 'whenRUfree - Prioritize human connection, not calendar management',
    description: 'A secure, fast and simple way to share availability',
    images: ['/brand_logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* apply Inter to the html element so it becomes the default font everywhere */
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}