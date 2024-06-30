import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'OCS-Discoveries',
  description: 'Onchain Summer Discoveries',
  keywords: ['Onchain', 'Summer', 'Discoveries', 'Blockchain'],
  authors: [{ name: 'Hiroyuki Naito' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
}

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body>
      <main>{children}</main>
    </body>
  </html>
)

export default RootLayout;