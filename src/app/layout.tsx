import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'OCS-Discoveries',
  description: 'Onchain Summer Discoveries',
  keywords: ['Onchain', 'Summer', 'Discoveries', 'Blockchain'],
  authors: [{ name: 'Hiroyuki Naito' }],
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json', // Add this line for PWA support
  themeColor: '#000000', // Optional: Set your theme color
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, themeColor=#000000'// Optional: Recommended for mobile devices
}

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <head>
      <link rel="apple-touch-icon" href="/logo.png" /> {/* Optional: For iOS devices */}
    </head>
    <body>
      <main>{children}</main>
    </body>
  </html>
)

export default RootLayout;