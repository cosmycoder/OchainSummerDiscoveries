import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import type { Viewport } from 'next'
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width', 
  initialScale: 1, 
  maximumScale: 1, 
  themeColor: '#000000'
}
 
export const metadata: Metadata = {
  title: 'OCS-Discoveries',
  description: 'Onchain Summer Discoveries',
  keywords: ['Onchain', 'Summer', 'Discoveries', 'Blockchain'],
  authors: [{ name: 'Hiroyuki Naito' }],
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json', // Add this line for PWA suppor
}

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <head>
      <link rel="apple-touch-icon" href="/logo.png" />
    </head>
    <body>
      <main>{children}</main>
    </body>
  </html>
)

export default RootLayout;