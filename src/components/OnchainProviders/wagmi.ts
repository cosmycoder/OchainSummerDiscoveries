import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia, mainnet } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  // Specify the chains you want to use
  chains: [baseSepolia, mainnet],
  
  // Specify the connectors you want to use
  connectors: [
    coinbaseWallet({
      appName: 'OCS-Discoveries',
    }),
  ],

  // Enable server-side rendering if needed
  ssr: true,

  // Define the transports for each chain
  transports: {
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
