'use client';
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultConfig
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';

import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
type Props = { children: ReactNode };

const PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
const queryClient = new QueryClient();

const wagmiConfig = getDefaultConfig({
  appName: 'onchainkit',
  projectId: PROJECT_ID ?? "NO_PROJECT_ID",
  chains: [base, mainnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

function OnchainProviders({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={API_KEY}
          chain={base}
        >
          <RainbowKitProvider modalSize="compact">
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;