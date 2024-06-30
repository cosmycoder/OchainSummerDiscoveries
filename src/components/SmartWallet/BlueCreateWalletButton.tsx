import React, { useCallback, useEffect, useState } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { CoinbaseWalletLogo } from './CoinbaseWalletLogo';
import styles from './BlueCreateWalletButton.module.css'

interface BlueCreateWalletButtonProps {
  handleSuccess: (address: string) => void;
  handleError: (error: Error) => void;
}



export const BlueCreateWalletButton = ({ handleSuccess, handleError }: BlueCreateWalletButtonProps) => {
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sdk = new CoinbaseWalletSDK({
        appName: 'OCS-Discoveries',
        appLogoUrl: 'https://ocs-discoveries.universalbase.xyz/logo.png',
        appChainIds: [84532],
      });
      setProvider(sdk.makeWeb3Provider());
    }
  }, []);

  const createWallet = useCallback(async () => {
    if (!provider) {
      handleError(new Error('Provider not initialized'));
      return;
    }

    try {
      const addresses: string[] = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      const address = addresses[0];
      if (address) {
        handleSuccess(address);
      } else {
        throw new Error('No address returned');
      }
    } catch (error: any) {
      handleError(error instanceof Error ? error : new Error(error?.message || 'Unknown error'));
    }
  }, [provider, handleSuccess, handleError]);

  return (
    <button
      className={styles.coolButton}
      onClick={createWallet}
      disabled={!provider}
    ><CoinbaseWalletLogo />
      Create Wallet
    </button>
  );
}